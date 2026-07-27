import { ArrowRight } from "lucide-react";

/** Fake browser chrome bar. */
function Chrome() {
  return (
    <div className="flex items-center gap-1.5 border-b border-black/10 bg-black/[0.03] px-3 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-current opacity-20" />
      <span className="h-2.5 w-2.5 rounded-full bg-current opacity-20" />
      <span className="h-2.5 w-2.5 rounded-full bg-current opacity-20" />
    </div>
  );
}

/** The slop mockup — every AI tell, on purpose. Fills its layer. */
function SlopMock() {
  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <Chrome />
      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-6 text-center">
        <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 px-6 py-7 backdrop-blur-sm">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            ✨ Introducing
          </p>
          <h3 className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-2xl font-bold leading-tight text-transparent">
            Supercharge your workflow
          </h3>
          <p className="mx-auto mt-2 max-w-[18rem] text-[12px] leading-relaxed text-white/70">
            Everything you need to move faster, all in one place.
          </p>
          <div className="mt-5 flex justify-center gap-2.5">
            <span className="rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-purple-700">
              Get started
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white">
              Learn more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The fixed mockup — the skill's output. Fills its layer. */
function FixedMock() {
  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <Chrome />
      <div className="flex flex-1 flex-col justify-center bg-background px-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent-ink">
          For growth teams
        </p>
        <h3 className="text-2xl font-bold leading-[1.15] tracking-tight text-foreground">
          Close 30% more deals from the same pipeline
        </h3>
        <p className="mt-2.5 max-w-[20rem] text-[13px] leading-relaxed text-muted">
          Every rep&apos;s number in one view, updated hourly.
        </p>
        <div className="mt-5 flex items-center gap-4">
          <span className="rounded-md bg-accent px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-contrast">
            Start free
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            See how it works →
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Bespoke before/after for the No Slop Design skill: the same landing-page
 * content shown side by side, once as AI slop (purple gradient, glass, emoji,
 * centered, twin buttons) and once fixed. Side-by-side (not a wipe slider) so
 * the contrast reads instantly — you see both complete designs at once. The
 * gradient + glass live ONLY inside the labelled slop card.
 */
export function NoSlopDesignShowcase({
  tells,
}: {
  tells: { bad: string; fix: string }[];
}) {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {/* Slop */}
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="inline-flex items-center rounded-md bg-slop px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">
              Slop
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-2">
              what AI hands you
            </span>
          </div>
          <div className="h-72 overflow-hidden rounded-xl border border-border-strong">
            <SlopMock />
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
            Purple gradient, centered, gradient headline, glass card, emoji
            eyebrow, twin buttons with no hierarchy.
          </p>
        </div>

        {/* Fixed */}
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="inline-flex items-center rounded-md bg-accent px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-accent-contrast">
              No slop
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-2">
              what the skill returns
            </span>
          </div>
          <div className="h-72 overflow-hidden rounded-xl border border-border-strong">
            <FixedMock />
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
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
                <p className="pen-strike inline-block text-[13px] leading-snug text-muted">
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
