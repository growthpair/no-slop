import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Skill } from "@/lib/skills";
import { SkillShowcase, hasShowcase } from "./skill-showcase";
import { UnlockButton } from "./unlock-button";

/**
 * One skill, rendered as a full landing section. Data-driven: adding a third
 * skill to lib/skills.ts renders here automatically. The design skill also gets
 * its bespoke before/after showcase.
 */
export function SkillSection({ skill, index }: { skill: Skill; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <section
      id={`skill-${skill.slug}`}
      className="border-t border-border px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header row */}
        <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-accent-ink">
                {n} — {skill.category}
              </span>
              <span className="h-px w-10 bg-border-strong" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-2">
                {skill.tools.join(" · ")}
              </span>
            </div>
            <h2 className="display text-[clamp(2.2rem,5vw,3.4rem)] text-foreground">
              {skill.name}
            </h2>
          </div>
          <Link
            href={`/skills/${skill.slug}`}
            className="group inline-flex items-center gap-1.5 self-start font-mono text-[12px] uppercase tracking-widest text-muted transition-colors hover:text-foreground md:self-end"
          >
            Full skill page
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Summary + what you get */}
        <div className="mb-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <p className="max-w-prose text-[15px] leading-relaxed text-muted sm:text-base">
            {skill.summary}
          </p>
          <ul className="flex flex-col gap-3">
            {skill.whatYouGet.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-accent/15">
                  <Check size={11} className="text-accent-ink" strokeWidth={3} />
                </span>
                <span className="text-[13.5px] leading-snug text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bespoke before/after showcase, per skill */}
        {hasShowcase(skill) && (
          <div className="mb-12">
            <SkillShowcase skill={skill} />
          </div>
        )}

        {/* Preview + gate */}
        <div className="grid gap-6 rounded-xl border border-border bg-card p-5 sm:p-7 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-2">
              Free preview
            </p>
            <pre className="max-h-44 overflow-hidden whitespace-pre-wrap break-words rounded-lg border border-border bg-surface p-4 font-mono text-[11.5px] leading-relaxed text-muted [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
              {skill.preview}
            </pre>
          </div>
          <div className="md:pl-4">
            <p className="text-[15px] font-semibold leading-snug text-foreground">
              Read the pitch free. Sign in to copy the full skill.
            </p>
            <p className="mt-1.5 mb-5 text-[13px] leading-relaxed text-muted">
              One Google click unlocks the paste-ready block and the .md download,
              and puts you on the newsletter. Free, no card.
            </p>
            <UnlockButton
              callbackPath={`/skills/${skill.slug}`}
              label="Unlock this skill"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
