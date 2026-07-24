import type { Skill } from "@/lib/skills";
import { NoSlopDesignShowcase } from "./no-slop-design-showcase";
import { NoSlopCopyShowcase } from "./no-slop-copy-showcase";

/**
 * Bespoke visual demo for a skill, keyed by slug. Both the landing section and
 * the detail page render this, so a skill's showcase lives in one place. Adding
 * a demo for a future skill is one `case` here — skills without one render
 * nothing, no layout gap.
 */
export function SkillShowcase({ skill }: { skill: Skill }) {
  switch (skill.slug) {
    case "no-slop-design":
      return skill.tells ? <NoSlopDesignShowcase tells={skill.tells} /> : null;
    case "no-slop":
      return <NoSlopCopyShowcase />;
    default:
      return null;
  }
}

/** Whether a skill has a bespoke showcase (so callers can skip the wrapper). */
export function hasShowcase(skill: Skill): boolean {
  return skill.slug === "no-slop-design" || skill.slug === "no-slop";
}
