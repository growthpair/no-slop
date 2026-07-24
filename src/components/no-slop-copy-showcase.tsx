import { ArrowRight } from "lucide-react";

/**
 * Bespoke before/after for the No Slop (copy) skill. A marked-up manuscript:
 * the same marketing paragraph, once as a slop-riddled draft (tells struck in
 * red, like a red pen) and once cleaned. Deliberately a document feel — no
 * browser chrome — so it reads different from the design skill's showcase.
 */

// The draft: plain strings interleaved with struck-through slop phrases.
const DRAFT: (string | { cut: string })[] = [
  { cut: "In today's world," },
  " we ",
  { cut: "leverage cutting-edge" },
  " AI to ",
  { cut: "seamlessly empower" },
  " marketing teams. ",
  { cut: "It's worth noting that" },
  " our ",
  { cut: "robust, holistic" },
  " platform ",
  { cut: "doesn't just save time — it fundamentally transforms" },
  " how you work. Ready to ",
  { cut: "supercharge your workflow" },
  "? ",
  { cut: "Let's dive in." },
];

// The rewrite: clean prose with the load-bearing phrases marked.
const CLEAN: (string | { mark: string })[] = [
  "We use AI to help marketing teams ",
  { mark: "ship campaigns 2x faster" },
  ". The platform saves time and changes how you work. ",
  "Want to see it on your next launch?",
];

const CUTS = [
  { bad: "leverage / utilize", fix: "use" },
  { bad: "it's worth noting that", fix: "cut it, state the point" },
  { bad: "not X — it's Y", fix: "just say Y" },
  { bad: "in today's world", fix: "cut the throat-clearing" },
  { bad: "the em-dash rhythm", fix: "vary the sentence" },
  { bad: "fake-profound kicker", fix: "end on the concrete line" },
];

function DocChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
        {label}
      </span>
      <span className="font-mono text-[10px] text-muted-2">.md</span>
    </div>
  );
}

export function NoSlopCopyShowcase() {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {/* Draft */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slop/30 bg-slop/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-slop">
              Draft
            </span>
            <span className="font-mono text-[11px] text-muted-2">what the AI hands you</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <DocChrome label="launch-email — draft" />
            <p className="px-5 py-5 text-[14px] leading-[1.9] text-muted">
              {DRAFT.map((seg, i) =>
                typeof seg === "string" ? (
                  <span key={i}>{seg}</span>
                ) : (
                  <span
                    key={i}
                    className="text-slop line-through decoration-slop/60 decoration-2"
                  >
                    {seg.cut}
                  </span>
                )
              )}
            </p>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            Nine tells in three sentences: banned words, throat-clearing, the
            em-dash swing, the &ldquo;let&apos;s dive in&rdquo; sign-off.
          </p>
        </div>

        {/* Clean */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-ink">
              No slop
            </span>
            <span className="font-mono text-[11px] text-muted-2">what the skill returns</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border-strong bg-card">
            <DocChrome label="launch-email — clean" />
            <p className="px-5 py-5 text-[15px] leading-[1.9] text-foreground">
              {CLEAN.map((seg, i) =>
                typeof seg === "string" ? (
                  <span key={i}>{seg}</span>
                ) : (
                  <span key={i} className="bg-accent px-1 text-accent-contrast">
                    {seg.mark}
                  </span>
                )
              )}
            </p>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            Same message, half the words, one concrete number, and it sounds like
            a person wrote it.
          </p>
        </div>
      </div>

      {/* Cuts grid */}
      <div className="mt-14">
        <div className="mb-6 flex items-center gap-3">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">
            A few of the tells it cuts
          </h3>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CUTS.map((c) => (
            <div key={c.bad} className="rounded-xl border border-border bg-card p-4">
              <p className="text-[13px] leading-snug text-muted line-through decoration-slop/50">
                {c.bad}
              </p>
              <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium leading-snug text-foreground">
                <ArrowRight size={13} className="mt-0.5 shrink-0 text-accent-ink" />
                {c.fix}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
