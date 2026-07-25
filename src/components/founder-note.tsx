/**
 * Founder note — replaces the placeholder testimonial marquee until real quotes
 * exist. First-person, in Jonathan's voice. Doubles as proof-of-conviction and
 * authority: the operator says why this exists, in his own words. When real
 * testimonials come in, swap this section for <ProofMarquee/>.
 */
export function FounderNote() {
  return (
    <section className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-6 text-accent-ink">Why I built this</p>
        <blockquote className="display text-[clamp(1.5rem,3.4vw,2.15rem)] leading-[1.25] text-foreground">
          I run most of my marketing through Claude now. Every marketer I know does
          too. The problem showed up fast: the writing has a tell, the design has a
          tell, and buyers feel both in about half a second. It reads as low effort
          even when the work is good. So I wrote down the exact rules I use to kill
          it, turned them into skills, and put them here free.
        </blockquote>
        <div className="mt-8 flex items-center gap-3">
          <span className="h-10 w-px bg-accent" />
          <div>
            <p className="text-[14px] font-semibold text-foreground">Jonathan Martinez</p>
            <p className="text-[13px] text-muted">
              Founder, Claude Marketers · ex-growth at Uber, Coinbase, Postmates
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
