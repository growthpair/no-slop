/**
 * Per-skill release history — DeleteSlop-specific, kept OUT of skills.ts (which
 * stays in sync with the ClaudeMarketers source). When you improve a skill:
 *   1. Update its `install` text in skills.ts.
 *   2. Prepend a new release below (newest first) with a bumped version.
 * The /changelog page and each skill page surface it so users know to re-paste
 * and update. Because installing is a paste, "updating" = paste the new block
 * again and Claude replaces the old SKILL.md — no uninstall needed.
 */

export interface SkillRelease {
  /** e.g. "1.1" */
  version: string;
  /** ISO date "YYYY-MM-DD" — used for display and sort. */
  date: string;
  /** Human-readable bullet list of what changed. */
  changes: string[];
}

/** Keyed by skill slug. Newest release first. */
export const SKILL_CHANGELOG: Record<string, SkillRelease[]> = {
  "no-slop": [
    {
      version: "1.3",
      date: "2026-07-29",
      changes: [
        "Ran an exhaustive research pass against the peer-reviewed excess-vocabulary study, Wikipedia's signs-of-AI-writing, and the major overused-word lists.",
        "Added chatbot residue (the clearest paste-from-AI evidence): 'as an AI language model,' 'I hope this helps,' 'let me know if you need anything else,' 'based on the information provided.'",
        "Added peer-study words (comprehensive, crucial, enhance) and AI flourishes (vibrant, captivating, interplay, kaleidoscope, symphony, treasure trove), plus 'sheds light on,' 'navigating the complexities of,' 'gone are the days.'",
        "New patterns: chatbot residue, Title Case headings, bold lead-in list items, 'not only X but also Y.' The checklist is now 28 patterns.",
      ],
    },
    {
      version: "1.2",
      date: "2026-07-29",
      changes: [
        "Caught the newest tell: unsolicited reassurance ('You're not alone,' 'You're not imagining it,' 'You're not broken'), the therapy-speak the model injects.",
        "Added the 2026 vogue word 'quiet' (as in 'a quiet confidence') as a pattern, plus documented AI words: showcase, unveil, nuanced, garner, and the phrase 'aligns with.'",
        "Two new patterns (unsolicited reassurance, vogue intensifiers). The checklist is now 24 patterns.",
      ],
    },
    {
      version: "1.1",
      date: "2026-07-27",
      changes: [
        "Added AI-overused words documented in the excess-vocabulary research: boast, testament, underscore, myriad, plethora, nestled, reimagine.",
        "Added AI connective tissue (moreover, furthermore, additionally, notably) and filler phrases (a testament to, in today's digital age, it's no secret that).",
        "One new pattern: AI connective tissue. The checklist is now 22 patterns.",
      ],
    },
    {
      version: "1.0",
      date: "2026-07-24",
      changes: [
        "First release: the anti-slop editor skill, the CLAUDE.md standing rule, and the full 21-pattern checklist.",
      ],
    },
  ],
  "no-slop-design": [
    {
      version: "1.2",
      date: "2026-07-29",
      changes: [
        "5 new tells from the current 'AI slop web design' guides: default fonts (Inter everywhere), uniform component metrics (same radius, padding, and card heights), vague aspirational hero copy, lifeless motion (dead hover states, snap buttons, one fade-in on everything), and garbled text inside AI images. Now 23 tells.",
      ],
    },
    {
      version: "1.1",
      date: "2026-07-27",
      changes: [
        "Two new design tells: AI stock imagery (uncanny faces, warped hands, generic 3D blobs) and over-rounded everything (giant radius on every element). Now 18 tells.",
      ],
    },
    {
      version: "1.0",
      date: "2026-07-24",
      changes: [
        "First release: the anti-slop art director skill, the CLAUDE.md standing rule, and all 16 design tells.",
      ],
    },
  ],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Format an ISO date without timezone drift. "2026-07-24" -> "Jul 24, 2026". */
export function formatReleaseDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function getReleases(slug: string): SkillRelease[] {
  return SKILL_CHANGELOG[slug] ?? [];
}

export function currentVersion(slug: string): string {
  return getReleases(slug)[0]?.version ?? "1.0";
}

export function lastUpdatedISO(slug: string): string {
  return getReleases(slug)[0]?.date ?? "";
}

/** Every release across all skills, newest first, for the changelog page. */
export function allReleases(
  skills: { slug: string; name: string }[]
): { slug: string; name: string; release: SkillRelease }[] {
  return skills
    .flatMap((s) => getReleases(s.slug).map((release) => ({ slug: s.slug, name: s.name, release })))
    .sort((a, b) => b.release.date.localeCompare(a.release.date));
}
