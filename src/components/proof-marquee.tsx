/**
 * Social-proof marquee. PLACEHOLDER copy — Jonathan swaps in real quotes and
 * names. Kept as plain text cards (no fake avatars/logos, per the design skill).
 * A second copy of the track makes the loop seamless.
 */
const QUOTES = [
  { quote: "Placeholder — drop a real testimonial here.", name: "Name", role: "Role, Company" },
  { quote: "Placeholder — a line about how the skill changed their output.", name: "Name", role: "Role, Company" },
  { quote: "Placeholder — a specific result or before/after moment.", name: "Name", role: "Role, Company" },
  { quote: "Placeholder — short, punchy, real.", name: "Name", role: "Role, Company" },
  { quote: "Placeholder — a quote about killing the AI tell.", name: "Name", role: "Role, Company" },
];

function Card({ quote, name, role }: (typeof QUOTES)[number]) {
  return (
    <figure className="flex w-[320px] shrink-0 flex-col justify-between rounded-xl border border-border bg-card p-5">
      <blockquote className="text-[14px] leading-relaxed text-foreground/90">
        “{quote}”
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-foreground">{name}</span>
        <span className="text-[12px] text-muted">· {role}</span>
      </figcaption>
    </figure>
  );
}

export function ProofMarquee() {
  const doubled = [...QUOTES, ...QUOTES];
  return (
    <section className="overflow-hidden border-t border-border py-20 sm:py-24">
      <div className="mx-auto mb-10 max-w-5xl px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            What people say
          </p>
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
            placeholders
          </span>
        </div>
      </div>
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
        <div className="marquee-track flex w-max gap-4">
          {doubled.map((q, i) => (
            <Card key={i} {...q} />
          ))}
        </div>
      </div>
    </section>
  );
}
