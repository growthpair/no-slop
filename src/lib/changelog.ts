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
      version: "1.0",
      date: "2026-07-24",
      changes: [
        "First release: the anti-slop editor skill, the CLAUDE.md standing rule, and the full 21-pattern checklist.",
      ],
    },
  ],
  "no-slop-design": [
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
