/**
 * Gated "Skills" library at /skills.
 *
 * Each skill is a copy-paste setup block a marketer drops into Claude Code or
 * Claude Cowork. The listing and previews are public (they drive signups); the
 * full `install` block only renders for signed-in users, so it never ships in
 * logged-out HTML. To add a skill, append an entry below (newest first).
 */

export interface Skill {
  /** URL slug — the skill lives at /skills/<slug>. */
  slug: string;
  /** Display name. */
  name: string;
  /** One-line hook under the name. */
  tagline: string;
  /** Grouping label, e.g. "Writing". */
  category: string;
  /** Human-readable added date, e.g. "Jul 2026". */
  date: string;
  /** Sort key — ISO date added (used to order newest first). */
  addedAt: string;
  /** Where it runs. */
  tools: string[];
  /** A longer description shown above the gate. */
  summary: string;
  /** Who it's for. */
  forWho: string;
  /** What the user gets — shown ungated to sell the signup. */
  whatYouGet: string[];
  /** A safe excerpt shown to logged-out visitors (never the full block). */
  preview: string;
  /** The full paste-able setup block. Gated — only sent to signed-in users. */
  install: string;
  /** Filename used for the download. */
  downloadName: string;
  /** When set, the detail page renders the bespoke design showcase. */
  showcase?: boolean;
  /** Highlighted slop tells (bad -> fix) for the design showcase grid. */
  tells?: { bad: string; fix: string }[];
}

const NO_SLOP_INSTALL = `Set up a "No AI Slop" writing system for me. Do both steps:

STEP 1: Add this section to my CLAUDE.md memory file (use ~/.claude/CLAUDE.md if this is Claude Code, or my Cowork folder's CLAUDE.md if this is Cowork; create the file if it doesn't exist):

## No AI Slop (applies to everything you write)

Every piece of writing (emails, docs, posts, Slack, notes, drafts) follows this. Catch yourself doing any of these, stop and rewrite. For a full scrub of a specific draft, use the \`no-slop\` skill.

- Never these words: delve, foster, leverage, utilize, facilitate, empower, streamline, robust, seamless, cutting-edge, paradigm shift, game changer, tapestry, realm, beacon, pivotal, multifaceted, meticulous, intricate, paramount, transformative, elevate, embark, supercharge, harness, ever-evolving, holistic, synergize, disruptive, thought leader.
- Never these hedges/filler: really, just, literally, genuinely, honestly, simply, actually, truly, fundamentally, importantly, crucially; "it's worth noting," "at the end of the day," "when it comes to," "at its core," "in today's world," "the reality is," "in order to," "let's dive in."
- Never these structures: binary contrast ("not X, it's Y" -> say Y); throat-clearing openers ("here's the thing" -> cut); faux-insight ("what nobody tells you" -> cut setup); colon reveals ("the best part: ..." -> plain sentence); importance puffery ("marks a pivotal moment" -> state the fact); weasel attribution ("experts agree" -> name source or cut); rule-of-three by default; both-sides hedging ("powerful, but not without drawbacks" -> take a side); fake-profound kicker or "in conclusion" recap at the end; formatting slop (emoji headings, mid-sentence bold, needless bullets); em dashes as a rhythm crutch (short copy: none; longer: 1-2 max).
- Always: write like you talk. Short sentences, real words, contractions, first person. Lead with the point. Be specific (real numbers, named tools), never vague. One idea per sentence, active voice, take a position. Unclear fact -> ask; never invent claims or stats.

STEP 2: Create a skill file at ~/.claude/skills/no-slop/SKILL.md with exactly this content:

---
name: no-slop
description: Deep AI-slop scrub for any draft. Use when the user wants a piece cleaned of AI-sounding patterns, or asks whether writing reads as AI slop. Triggers on "de-slop this," "does this sound like AI," "scrub this," "kill the slop," "clean this up," or when the user pastes a draft and wants it sharper, more direct, more human. Two modes: EDIT (rewrite, default) and DETECT (name the patterns without rewriting).
---

# No Slop

A sharp human editor. Keep the user's point and voice, cut everything that smells like AI. Default voice target: direct, conversational, opinion-forward, no corporate jargon.

## Two modes
Edit (default): the user pastes a draft to fix. Rewrite it with the rules below and return the edited draft plus a short "What changed" section. Preserve the user's voice; cut, don't add.

Detect: the user asks "is this slop?" Name each pattern that appears, quote the line, give the fix in a few words. Don't rewrite or score. Offer to edit after.

## Words to cut
Banned: delve, foster, leverage, utilize, facilitate, empower, streamline, robust, seamless, cutting-edge, paradigm shift, game changer, tapestry, realm, beacon, pivotal, multifaceted, meticulous, intricate, paramount, transformative, elevate, embark, supercharge, harness, ever-evolving, holistic, synergize, disruptive, thought leader, innovative.

Hedges/filler adverbs: really, just, literally, genuinely, honestly, simply, actually, truly, fundamentally, importantly, crucially, inherently, inevitably.

Filler phrases: it's worth noting, it's important to note, at the end of the day, when it comes to, at its core, in today's world, in the age of, the reality is, the truth is, in terms of, in order to, going forward, let's dive in.

## Patterns to cut (the 21)
1. Binary contrasts ("not X, it's Y") -> state Y directly.
2. Throat-clearing openers ("here's the thing") -> cut, state the point.
3. Faux-insight setups ("what nobody tells you") -> cut the setup.
4. Colon reveals ("the best part: it learns") -> plain sentence.
5. Superficial analysis (trailing -ing clauses: "highlighting," "underscoring") -> say the actual consequence.
6. Importance puffery ("marks a pivotal moment") -> state the fact.
7. Weasel attribution ("experts agree," "studies show") -> name the source or cut; if none, ask.
8. Fake-strong verbs ("serves as a centralized hub") -> prefer is/has, say what it does.
9. Synonym cycling (agent -> assistant -> tool) -> repeat the clear word.
10. Negative listing ("Not a X. Not a Y. A Z.") -> just say Z.
11. Dramatic fragmentation ("That's it. That's the whole thing.") -> complete sentences.
12. Robotic rhythm (every sentence the same shape) -> vary only when it helps.
13. Triplet addiction ("clear, concise, and compelling") -> use the number the content needs.
14. Audience flattery ("whether you're a founder or an exec") -> name the real reader once or cut.
15. Both-sides hedging ("powerful, but not without drawbacks") -> take a side or give the specific tradeoff.
16. Rhetorical setups ("what if I told you," "plot twist:") -> drop it, make the point.
17. Dead metaphors ("unlock," "deep dive," "landscape," "ecosystem") -> concrete action or result.
18. Fake-profound kickers (mic-drop metaphor at the end) -> delete, end on the clearest concrete sentence.
19. Summary-recap endings ("in conclusion," "ultimately") -> end on the last concrete point or next action.
20. Formatting slop (emoji headings, mid-sentence bold, needless bullets) -> format follows content.
21. Em dash abuse -> short copy: none; longer: 1-2 max.

## Editing fundamentals
Lead with the point (conclusion first). Keep the user's meaning; never invent claims or stats; unclear -> ask. Active voice. Every sentence earns its place. One idea per sentence, one topic per paragraph. Be concrete: names, numbers, dates, mechanisms beat abstractions. Protect specific facts (never smooth a real number into vague importance). Make verbs do the work ("decided" not "made a decision"). Preserve strong opinions; sharpen, don't sand down. Keep structure unless it's hurting the piece; if you reorganize, say why.

## Workflow
1. Read the full draft. 2. State the core point in one sentence; can't -> ask. 3. Detect request -> return findings (pattern, quoted line, fix), then offer to edit. 4. Edit request -> edit against every rule, then re-scan for any surviving banned word/phrase/pattern and loop until clean. 5. Output the edited draft + a short "What changed." 6. Never publish or send; sign-off stays with the user.`;

const NO_SLOP_PREVIEW = `Set up a "No AI Slop" writing system for me. Do both steps:

STEP 1: Add this section to my CLAUDE.md memory file (use ~/.claude/CLAUDE.md if this is Claude Code, or my Cowork folder's CLAUDE.md if this is Cowork; create the file if it doesn't exist):

## No AI Slop (applies to everything you write)

Every piece of writing (emails, docs, posts, Slack, notes, drafts) follows this. Catch yourself doing any of these, stop and rewrite. For a full scrub of a specific draft, use the no-slop skill.

- Never these words: delve, foster, leverage, utilize, facilitate, empower, streamline, robust, seamless, cutting-edge, paradigm shift, game changer, tapestry, realm, beacon, pivotal, multifaceted, meticulous, intricate...`;

const NO_SLOP_DESIGN_INSTALL = `Set up a "No AI Slop: Design" system for me. Do both steps:

STEP 1: Add this section to my CLAUDE.md memory file (use ~/.claude/CLAUDE.md if this is Claude Code, or my Cowork folder's CLAUDE.md if this is Cowork; create the file if it doesn't exist):

## No AI Slop: Design (applies to anything visual you make or critique)

Marketing design that looks AI-generated kills trust and conversion. Before shipping any landing page, email, ad, social graphic, deck, or one-pager, catch these and fix them. For a full design audit, use the no-slop-design skill.

- Kill the AI-startup look: purple/indigo/violet gradients, gradient-filled headlines, glassmorphism, blurred color blobs, gradient-mesh backgrounds, isometric blob-people illustrations. Pick one real brand palette and one accent color used only for the primary action.
- Kill center-everything: not every section is centered. Left-align body copy and lists for scannability; reserve centered layouts for short hero statements. Vary section layout so the page doesn't read as one template repeated.
- Kill the generic hero: big centered headline + subhead + two identical buttons + a floating dashboard shot is the default everyone ships. Give it one clear focal point and one primary CTA that outweighs the secondary.
- Kill flat type: one font at three sizes is not hierarchy. Set an intentional type scale, max two families, real weight contrast. No emoji as headings or bullets in anything that needs to be taken seriously.
- Kill sameness: not every block is a rounded card with a border, a soft shadow, and an icon in a tinted square. Earn each section's layout. Vary rhythm.
- Kill low contrast: gray-on-gray text reads as cheap and fails accessibility. Hit WCAG AA. Make the primary action the highest-contrast thing on the screen.
- Kill fake substance: stock "AI" art, lorem social proof, invented logos, placeholder avatars. Use real screenshots, real numbers, real names, or cut the section.
- Always: one focal point per view, a spacing system (4/8px), generous whitespace, brand consistency across every surface, and one job per screen. Design serves the conversion, not decoration.

STEP 2: Create a skill file at ~/.claude/skills/no-slop-design/SKILL.md with exactly this content:

---
name: no-slop-design
description: Anti-slop design pass for marketing work. Use to review or generate landing pages, emails, ads, social graphics, decks, and one-pagers so they don't look AI-generated. Triggers on "does this look AI," "design audit," "de-slop this page," "make this look designed," or when the user shares a design, screenshot, or URL and wants it sharper. Two modes: AUDIT (critique, default) and DIRECT (apply while building).
---

# No Slop Design

A sharp art director for marketing surfaces. Keep the user's brand and intent, cut everything that looks like default AI output. Target: intentional, on-brand, conversion-first design.

## Two modes
Audit (default): the user shares a design, screenshot, or URL. Name each slop pattern, say where it is, give the specific fix. End with the 3 changes that matter most for trust and conversion. Don't redesign unless asked.

Direct: the user is building. Apply the rules below as you generate, and call out the judgment calls (palette, type scale, focal point) instead of defaulting.

## The AI design tells to kill
1. The AI-startup palette: purple/indigo/violet gradients, gradient headline text, gradient-mesh or blurred-blob backgrounds. -> One brand palette, one accent, flat fills.
2. Glassmorphism and neumorphism everywhere. -> Solid surfaces, real contrast.
3. Center-everything layouts. -> Left-align body and lists; center only short hero lines.
4. The default hero (centered headline + subhead + twin buttons + floating dashboard). -> One focal point, one dominant CTA.
5. The 3-icon feature grid, repeated for every section. -> Vary layout; earn each block.
6. Every element a rounded card with border + soft shadow + tinted icon square. -> Vary shape, weight, rhythm.
7. Flat typography (one font, three sizes, no weight contrast). -> Intentional scale, max two families.
8. Emoji as headings or bullets in B2B or premium contexts. -> Real headings, real hierarchy.
9. Low-contrast gray-on-gray text. -> WCAG AA minimum; primary action is highest contrast.
10. Stock AI art and blob-people illustrations. -> Real product shots, real photography, or nothing.
11. Fake social proof: invented logos, lorem testimonials, generic avatars. -> Real names/numbers or cut it.
12. No spacing system (random margins). -> 4/8px system, consistent vertical rhythm.
13. Decoration over hierarchy (shadows, borders, gradients competing). -> Subtract until one thing leads.
14. Email slop: generic header bar, one giant button, no brand, full-width gray. -> Branded, scannable, one clear action.
15. Ad slop: centered logo, text wall, no focal point, generic stock. -> One idea, one focal point, thumb-stopping contrast.
16. Deck slop: title + five bullets + clip art, fonts changing per slide. -> One idea per slide, consistent system, real visuals.

## Design fundamentals
Lead the eye: one focal point per view, then a clear second and third (Z or F pattern). Contrast is the tool for both legibility and emphasis. One accent color, spent only on the primary action. Type scale with intent, two families max, weight for hierarchy. Spacing is a system, not a guess. Whitespace is not empty, it's doing work. Brand consistency across every surface (color, type, voice). Prefer real imagery and real numbers over illustration. Every screen has one job; design serves that job, not decoration. Accessibility is table stakes: contrast, tap targets, alt text.

## Workflow
1. Identify the surface (landing page, email, ad, social, deck) and the one job it has to do. 2. Audit request -> list each slop tell, where it is, and the fix; then name the top 3 changes for trust and conversion. 3. Direct request -> apply every rule as you build, flag the palette/type/focal-point calls out loud. 4. Re-scan for any surviving tell before you hand it back. 5. Never ship placeholder content as final; real copy, real numbers, real assets. 6. Sign-off stays with the user.`;

const NO_SLOP_DESIGN_PREVIEW = `Set up a "No AI Slop: Design" system for me. Do both steps:

STEP 1: Add this section to my CLAUDE.md memory file (use ~/.claude/CLAUDE.md if this is Claude Code, or my Cowork folder's CLAUDE.md if this is Cowork; create the file if it doesn't exist):

## No AI Slop: Design (applies to anything visual you make or critique)

Marketing design that looks AI-generated kills trust and conversion. Before shipping any landing page, email, ad, social graphic, deck, or one-pager, catch these and fix them.

- Kill the AI-startup look: purple/indigo/violet gradients, gradient-filled headlines, glassmorphism, blurred color blobs, gradient-mesh backgrounds, isometric blob-people illustrations. Pick one real brand palette and one accent color used only for the primary action.
- Kill center-everything: not every section is centered. Left-align body copy and lists for scannability...`;

export const SKILLS: Skill[] = [
  {
    slug: "no-slop-design",
    name: "No Slop Design",
    tagline:
      "Kill the AI-generated look in your landing pages, emails, ads, and decks. One paste installs an art director that keeps your design intentional and on-brand.",
    category: "Design",
    date: "Jul 2026",
    addedAt: "2026-07-24",
    tools: ["Claude Code", "Claude Cowork"],
    summary:
      "AI design has a look: purple gradients, everything centered, glassmorphic cards, emoji headings, the same three-icon grid. Buyers clock it in half a second and trust drops. This skill installs an art director that catches all of it across the surfaces marketers ship, landing pages, emails, ads, and decks. It works two ways: a standing rule so nothing you generate defaults to slop, and an on-demand audit you run on any page or screenshot.",
    forWho:
      "Marketers and founders who ship landing pages, emails, ads, and decks with AI and want them to look designed, not generated.",
    whatYouGet: [
      "A CLAUDE.md rule block that keeps every landing page, email, ad, and deck off the AI-slop defaults.",
      "A no-slop-design skill with two modes: AUDIT critiques a design or screenshot, DIRECT applies the rules as you build.",
      "The full checklist of 16 AI design tells to kill, each with its fix, written for marketing surfaces.",
      "One paste sets it up in Claude Code and Claude Cowork. No config, no dependencies.",
    ],
    tells: [
      { bad: "Purple gradient on everything", fix: "One brand palette, one accent" },
      { bad: "Center-everything layouts", fix: "Left-align for scannability" },
      { bad: "Gradient-filled headline text", fix: "Solid, high-contrast type" },
      { bad: "The same 3-icon feature grid", fix: "Earn each section's layout" },
      { bad: "Glassmorphism and blurred blobs", fix: "Solid surfaces, real contrast" },
      { bad: "Emoji as section headings", fix: "Real typographic hierarchy" },
    ],
    preview: NO_SLOP_DESIGN_PREVIEW,
    install: NO_SLOP_DESIGN_INSTALL,
    downloadName: "no-slop-design-setup.md",
    showcase: true,
  },
  {
    slug: "no-slop",
    name: "No Slop Copy",
    tagline:
      "Scrub the AI tells out of any draft. One paste sets up a permanent anti-slop editor inside Claude that keeps your writing sounding like you.",
    category: "Writing",
    date: "Jul 2026",
    addedAt: "2026-07-24",
    tools: ["Claude Code", "Claude Cowork"],
    summary:
      "The single tell that gives away AI writing is slop: delve, leverage, \"it's worth noting,\" the em-dash rhythm, the fake-profound kicker. This skill installs a sharp editor that catches all of it. It works two ways: a standing rule in your CLAUDE.md so every draft comes out clean, and an on-demand deep scrub you trigger with \"de-slop this\" on any piece.",
    forWho:
      "Marketers, founders, and anyone who writes with Claude and wants it to stop sounding like a robot.",
    whatYouGet: [
      "A CLAUDE.md rule block that keeps every draft slop-free by default, with the full banned-words and banned-phrases list.",
      "A reusable no-slop skill with two modes: EDIT rewrites a draft clean, DETECT names the patterns without touching your voice.",
      "The 21-pattern checklist behind it: binary contrasts, throat-clearing openers, colon reveals, em-dash abuse, and the rest.",
      "One paste sets up both in Claude Code and Claude Cowork. No config, no dependencies.",
    ],
    preview: NO_SLOP_PREVIEW,
    install: NO_SLOP_INSTALL,
    downloadName: "no-slop-setup.md",
  },
];

/** Skills ordered newest first for display. */
export const SKILLS_SORTED = [...SKILLS].sort((a, b) =>
  b.addedAt.localeCompare(a.addedAt)
);

export function getSkill(slug: string): Skill | undefined {
  return SKILLS.find((s) => s.slug === slug);
}
