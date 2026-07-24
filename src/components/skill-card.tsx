import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { Skill } from "@/lib/skills";

/**
 * Compact skill card for the library grid. `unlocked` flips the footer label —
 * signed-in users see "Get the skill", logged-out see "Unlock it".
 */
export function SkillCard({ skill, unlocked }: { skill: Skill; unlocked: boolean }) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-border-strong"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-ink">
          {skill.category}
        </span>
        {!unlocked && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-2">
            <Lock size={11} className="text-accent-ink" /> Free
          </span>
        )}
      </div>
      <h3 className="mb-2 text-xl font-bold leading-snug tracking-tight text-foreground">
        {skill.name}
      </h3>
      <p className="mb-4 line-clamp-3 text-[13.5px] leading-relaxed text-muted">
        {skill.tagline}
      </p>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {skill.tools.map((t) => (
          <span
            key={t}
            className="rounded-md border border-border bg-foreground/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
          >
            {t}
          </span>
        ))}
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-accent-ink transition-all group-hover:gap-2.5">
        {unlocked ? "Get the skill" : "Unlock it"} <ArrowRight size={13} />
      </span>
    </Link>
  );
}
