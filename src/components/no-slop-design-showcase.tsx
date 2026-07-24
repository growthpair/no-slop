import { ArrowRight } from "lucide-react";

/** Three dots of fake browser chrome. */
function WindowChrome() {
  return (
    <div className="flex items-center gap-1.5 border-b border-border bg-foreground/[0.03] px-3 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
      <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
      <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
    </div>
  );
}

/**
 * Bespoke before/after for the No Slop Design skill. The page dogfoods the
 * skill: the same landing-page content, once as AI slop and once fixed. The
 * gradient + glass live ONLY inside the labelled "slop" frame — everywhere else
 * on this site obeys the skill.
 */
export function NoSlopDesignShowcase({
  tells,
}: {
  tells: { bad: string; fix: string }[];
}) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Slop */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slop/30 bg-slop/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-slop">
              Slop
            </span>
            <span className="font-mono text-[11px] text-muted-2">what everyone ships</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <WindowChrome />
            <div className="flex h-60 flex-col items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-5 text-center">
              <div className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-5 backdrop-blur-sm">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                  ✨ Introducing
                </p>
                <h3 className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-lg font-bold leading-tight text-transparent">
                  Supercharge your workflow
                </h3>
                <p className="mx-auto mt-1.5 max-w-[16rem] text-[11px] leading-relaxed text-white/70">
                  Everything you need to move faster, all in one place.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-purple-700">
                    Get started
                  </span>
                  <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
                    Learn more
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            Purple gradient, centered, gradient headline, glass card, emoji
            eyebrow, twin buttons with no hierarchy.
          </p>
        </div>

        {/* Fixed */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-ink">
              No slop
            </span>
            <span className="font-mono text-[11px] text-muted-2">what the skill ships</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border-strong bg-card">
            <WindowChrome />
            <div className="flex h-60 flex-col justify-center bg-background px-6">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent-ink">
                For growth teams
              </p>
              <h3 className="text-xl font-bold leading-[1.15] tracking-tight text-foreground">
                Close 30% more deals from the same pipeline
              </h3>
              <p className="mt-2 max-w-[18rem] text-[12px] leading-relaxed text-muted">
                Every rep&apos;s number in one view, updated hourly.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <span className="rounded-md bg-accent px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-contrast">
                  Start free
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  See how it works →
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            One accent, left-aligned, real type hierarchy, a single primary CTA,
            concrete numbers.
          </p>
        </div>
      </div>

      {/* Tells grid */}
      {tells.length > 0 && (
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">
              A few of the tells it catches
            </h3>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tells.map((t) => (
              <div key={t.bad} className="rounded-xl border border-border bg-card p-4">
                <p className="text-[13px] leading-snug text-muted line-through decoration-slop/50">
                  {t.bad}
                </p>
                <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium leading-snug text-foreground">
                  <ArrowRight size={13} className="mt-0.5 shrink-0 text-accent-ink" />
                  {t.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
