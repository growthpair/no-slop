import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MarkedManuscript } from "@/components/marked-manuscript";
import { SlopGraveyard } from "@/components/slop-graveyard";
import { HandStrike } from "@/components/marks";
import { Grade } from "@/components/grade";
import { FounderBar } from "@/components/founder-bar";
import { HowItWorks } from "@/components/how-it-works";
import { FounderNote } from "@/components/founder-note";
import { SkillSection } from "@/components/skill-section";
import { UnlockButton } from "@/components/unlock-button";
import { SKILLS_SORTED } from "@/lib/skills";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
          <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Copy */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    Free Claude skills · for marketers
                  </span>
                </div>

                <h1
                  className="display text-[clamp(2.9rem,7vw,5.2rem)] text-foreground"
                  style={{ lineHeight: 1.12 }}
                >
                  AI writing and design
                  <br />
                  have a{" "}
                  <HandStrike className="whitespace-nowrap text-muted">tell</HandStrike>.
                  <br />
                  These skills{" "}
                  <span className="bg-accent px-2 text-accent-contrast">kill it</span>.
                </h1>

                <p className="mt-7 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
                  Delve. Leverage. Purple gradients. The centered hero everyone
                  ships. Buyers clock AI output in half a second and trust drops.
                  One paste installs a sharp editor and art director inside Claude
                  that catch it before you ship.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <UnlockButton callbackPath="/#skills" label="Get the skills free" />
                  <Link
                    href="#slop-check"
                    className="group inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-widest text-muted transition-colors hover:text-foreground"
                  >
                    Grade your work
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-2">
                  Free forever · Claude Code + Cowork · no config
                </p>
              </div>

              {/* Bespoke editor's-markup centerpiece */}
              <div className="lg:pl-4">
                <MarkedManuscript />
              </div>
            </div>

            {/* Founder credibility */}
            <div className="mt-14">
              <FounderBar />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ Slop checker */}
        <section id="slop-check" className="border-t border-border px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow mb-4 text-accent-ink">Try it on your own work</p>
              <h2 className="display text-[clamp(1.9rem,4.5vw,3rem)] text-foreground">
                Grade your copy and design.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base">
                The skills running once, right here. Paste copy and it scans for the
                tells; audit a design against the checklist. Nothing gets sent
                anywhere. The skills do this to everything you make, automatically.
              </p>
            </div>
            <Grade />
          </div>
        </section>

        {/* ------------------------------------------------------------ The tell */}
        <section id="the-tell" className="border-t border-border px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 max-w-2xl">
              <p className="eyebrow mb-4 text-accent-ink">The tell</p>
              <h2 className="display text-[clamp(1.9rem,4.5vw,3rem)] text-foreground">
                Slop is a signal. It says: nobody looked at this.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base">
                AI has defaults. In copy it&apos;s a vocabulary and a rhythm. In
                design it&apos;s a palette and a layout. Your reader can&apos;t
                name it, but they feel it, and it reads as low effort. The fix
                isn&apos;t writing every prompt by hand. It&apos;s giving Claude a
                standing rule so the defaults never make it out.
              </p>
            </div>

            {/* Slop graveyard — the whole vocabulary, struck out by hand */}
            <div className="mb-5 -rotate-1">
              <span className="font-hand text-[22px] leading-none text-slop">
                the whole tired vocabulary&hellip;
              </span>
            </div>
            <SlopGraveyard />

            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              {[
                {
                  k: "In the words",
                  v: "delve, leverage, seamless, it's worth noting, the em-dash rhythm, the fake-profound kicker.",
                },
                {
                  k: "In the pixels",
                  v: "purple gradients, glass cards, everything centered, the same three-icon grid, emoji headings.",
                },
                {
                  k: "In the result",
                  v: "buyers discount it on sight. The work is fine. It just looks generated, so it converts worse.",
                },
              ].map((c) => (
                <div key={c.k} className="bg-card p-6">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-accent-ink">
                    {c.k}
                  </p>
                  <p className="text-[14px] leading-relaxed text-muted">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- How it works */}
        <HowItWorks />

        {/* -------------------------------------------------------------- Skills */}
        <div id="skills">
          <div className="border-t border-border px-5 pt-16 sm:px-8">
            <div className="mx-auto flex max-w-5xl items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {SKILLS_SORTED.length} skills · more on the way
              </p>
              <span className="h-px flex-1 bg-border" />
            </div>
          </div>
          {SKILLS_SORTED.map((skill, i) => (
            <SkillSection key={skill.slug} skill={skill} index={i} />
          ))}
        </div>

        {/* --------------------------------------------------------- Founder note */}
        <FounderNote />

        {/* ----------------------------------------------------------- Final CTA */}
        <section className="border-t border-border px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-5 text-accent-ink">Free with a Google account</p>
            <h2 className="display text-[clamp(2.2rem,5.5vw,3.8rem)] text-foreground">
              Ship work that doesn&apos;t look generated.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              Sign in once. Copy the skills. Every new one lands in your account
              free, and you get the newsletter that ships with it.
            </p>
            <div className="mt-9 flex justify-center">
              <UnlockButton callbackPath="/#skills" label="Get the skills free" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
