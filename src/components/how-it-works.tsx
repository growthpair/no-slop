/**
 * Three-step strip. Kills the "what am I actually signing up to do" friction
 * before the gate — a marketer who doesn't live in a terminal needs to see that
 * this is paste-simple.
 */
const STEPS = [
  {
    n: "01",
    title: "Sign in with Google",
    body: "One click. Free forever, no card. It also puts you on the newsletter.",
  },
  {
    n: "02",
    title: "Copy the skill",
    body: "One block of text, or a .md download. Works in Claude Code and Claude Cowork.",
  },
  {
    n: "03",
    title: "Paste into Claude",
    body: "Claude sets it up itself. From then on it scrubs the slop from everything you write.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-4 text-accent-ink">How it works</p>
          <h2 className="display text-[clamp(1.9rem,4.5vw,3rem)] text-foreground">
            Paste-simple. You don&apos;t need to be technical.
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-card p-6">
              <p className="mb-4 font-mono text-[13px] font-semibold text-accent-ink">{s.n}</p>
              <h3 className="mb-2 text-[15px] font-bold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
