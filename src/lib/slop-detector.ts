/**
 * Client-side slop detector. Scans text against the same banned words, hedges,
 * and filler phrases the No Slop skill installs — so the checker on the site is
 * literally a preview of the skill running. No API, no network, instant.
 *
 * Detection is intentionally conservative (whole-word for single words,
 * exact phrases, straight/curly apostrophes) so it flags real tells, not
 * false positives. The skill itself is the deeper pass.
 */

export type SlopCategory = "word" | "hedge" | "phrase" | "emdash";

export interface SlopHit {
  text: string;
  start: number;
  end: number;
  category: SlopCategory;
  fix: string;
}

export interface SlopResult {
  hits: SlopHit[];
  wordCount: number;
  score: number; // 0-10, higher = more slop
  label: string;
  headline: string;
}

// [pattern, fix]. Single words are matched on word boundaries; phrases as-is.
const WORDS: [string, string][] = [
  ["delve", "just say “look at”"],
  ["leverage", "use"],
  ["utilize", "use"],
  ["facilitate", "help"],
  ["foster", "build / create"],
  ["empower", "let / help"],
  ["streamline", "simplify"],
  ["robust", "cut it — say what it does"],
  ["seamless", "cut it"],
  ["seamlessly", "cut it"],
  ["cutting-edge", "cut it"],
  ["paradigm shift", "cut it"],
  ["game changer", "cut it"],
  ["game-changing", "cut it"],
  ["tapestry", "cut it"],
  ["realm", "cut it"],
  ["beacon", "cut it"],
  ["pivotal", "important, or cut"],
  ["multifaceted", "cut it"],
  ["meticulous", "careful"],
  ["intricate", "detailed / complex"],
  ["paramount", "matters most"],
  ["transformative", "cut it — show the result"],
  ["elevate", "improve / raise"],
  ["embark", "start"],
  ["supercharge", "speed up"],
  ["harness", "use"],
  ["ever-evolving", "cut it"],
  ["holistic", "cut it"],
  ["synergize", "cut it"],
  ["synergy", "cut it"],
  ["disruptive", "cut it"],
  ["thought leader", "cut it"],
  ["innovative", "cut it — name the thing"],
  // v1.1 additions — AI-overused words (excess-vocabulary research + AI lists)
  ["boast", "cut it — say the number"],
  ["boasts", "cut it — say the number"],
  ["testament", "cut it"],
  ["underscore", "cut it — state the point"],
  ["underscores", "cut it — state the point"],
  ["myriad", "many"],
  ["plethora", "plenty"],
  ["nestled", "cut it"],
  ["reimagine", "cut it — say what changed"],
  ["reimagined", "cut it — say what changed"],
];

const HEDGES: [string, string][] = [
  ["really", "cut it"],
  ["just", "cut it"],
  ["literally", "cut it"],
  ["genuinely", "cut it"],
  ["honestly", "cut it"],
  ["simply", "cut it"],
  ["actually", "cut it"],
  ["truly", "cut it"],
  ["fundamentally", "cut it"],
  ["importantly", "cut it"],
  ["crucially", "cut it"],
  ["basically", "cut it"],
  // v1.1 additions — AI connective tissue
  ["moreover", "cut it"],
  ["furthermore", "cut it"],
  ["additionally", "cut it"],
  ["notably", "cut it"],
];

const PHRASES: [string, string][] = [
  ["it's worth noting", "cut it, state the point"],
  ["it's important to note", "cut it, state the point"],
  ["at the end of the day", "cut it"],
  ["when it comes to", "cut it"],
  ["at its core", "cut it"],
  ["in today's world", "cut the throat-clearing"],
  ["in today's fast-paced world", "cut the throat-clearing"],
  ["in the age of", "cut it"],
  ["the reality is", "cut it"],
  ["the truth is", "cut it"],
  ["in order to", "“to”"],
  ["going forward", "cut it"],
  ["let's dive in", "cut it"],
  ["that being said", "“but”"],
  ["needless to say", "cut it — then don't say it"],
  ["a game changer", "cut it"],
  ["last but not least", "“finally”"],
  // v1.1 additions
  ["a testament to", "cut it"],
  ["it's no secret that", "cut it, state the point"],
  ["in today's digital age", "cut the throat-clearing"],
  ["ever-changing landscape", "cut it"],
];

// Build one case-insensitive regex per entry, apostrophe-agnostic, word-bounded.
type Rule = { re: RegExp; category: SlopCategory; fix: string };

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/['’]/g, "['’]");
}

function buildRules(): Rule[] {
  const rules: Rule[] = [];
  for (const [w, fix] of WORDS) {
    rules.push({ re: new RegExp(`\\b${esc(w)}\\b`, "gi"), category: "word", fix });
  }
  for (const [w, fix] of HEDGES) {
    rules.push({ re: new RegExp(`\\b${esc(w)}\\b`, "gi"), category: "hedge", fix });
  }
  for (const [p, fix] of PHRASES) {
    rules.push({ re: new RegExp(esc(p), "gi"), category: "phrase", fix });
  }
  return rules;
}

const RULES = buildRules();

export function detectSlop(text: string): SlopResult {
  const wordCount = (text.trim().match(/\S+/g) || []).length;
  const raw: SlopHit[] = [];

  for (const rule of RULES) {
    for (const m of text.matchAll(rule.re)) {
      if (m.index === undefined) continue;
      raw.push({
        text: m[0],
        start: m.index,
        end: m.index + m[0].length,
        category: rule.category,
        fix: rule.fix,
      });
    }
  }

  // Em dashes used as a rhythm crutch: flag each one past the first.
  const emDashes = [...text.matchAll(/—/g)];
  emDashes.slice(1).forEach((m) => {
    if (m.index === undefined) return;
    raw.push({
      text: "—",
      start: m.index,
      end: m.index + 1,
      category: "emdash",
      fix: "em-dash crutch — recast the sentence",
    });
  });

  // Sort, then drop overlaps (keep the earliest; prefer the longer phrase when
  // two start together) so inline highlighting stays clean.
  raw.sort((a, b) => a.start - b.start || b.end - a.end);
  const hits: SlopHit[] = [];
  let lastEnd = -1;
  for (const h of raw) {
    if (h.start >= lastEnd) {
      hits.push(h);
      lastEnd = h.end;
    }
  }

  // Score: tells per word, scaled. Empty text is 0.
  const density = wordCount ? hits.length / wordCount : 0;
  const score = Math.min(10, Math.round(density * 100));

  let label: string;
  let headline: string;
  if (wordCount === 0) {
    label = "Waiting";
    headline = "Paste some copy to grade it.";
  } else if (hits.length === 0) {
    label = "Clean";
    headline = "No tells found. This reads like a person wrote it.";
  } else if (score <= 3) {
    label = "Mostly clean";
    headline = `${hits.length} tell${hits.length === 1 ? "" : "s"}. A quick pass fixes it.`;
  } else if (score <= 6) {
    label = "Reads a bit like AI";
    headline = `${hits.length} tells. A buyer would start to feel it.`;
  } else {
    label = "This reads like AI";
    headline = `${hits.length} tells. This is the AI voice buyers discount on sight.`;
  }

  return { hits, wordCount, score, label, headline };
}

/** A slop-riddled sample so the checker demonstrates itself on one click. */
export const SLOP_SAMPLE =
  "In today's fast-paced world, we leverage cutting-edge AI to seamlessly empower marketing teams and streamline their workflows. It's worth noting that our robust, holistic platform is truly transformative — it doesn't just save time, it fundamentally elevates how you work. Ready to embark on a game-changing journey and supercharge your growth? Let's dive in.";
