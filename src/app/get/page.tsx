import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowRight, Check } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { SKILLS_SORTED } from "@/lib/skills";
import { currentVersion } from "@/lib/changelog";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SkillContent } from "@/components/skill-content";

// Reads the session to render the unlocked payloads, so never static-cache it.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Install your skills · DeleteSlop",
  description: "Copy both DeleteSlop skills into Claude — you're signed in.",
  robots: { index: false },
};

/**
 * The post-signup landing: everything you unlocked, ready to paste, on one page.
 * Signing in with Google routes here (login default callbackUrl = /get), so a
 * new user lands somewhere they can install both skills immediately instead of
 * bouncing back to the marketing homepage.
 */
export default async function GetPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/get");

  const firstName = session.user?.name?.split(" ")[0];

  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
            <Check size={13} className="text-accent-ink" strokeWidth={3} />
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent-ink">
              You&apos;re in
            </span>
          </div>
          <h1 className="display text-[clamp(2.4rem,6vw,3.8rem)] text-foreground">
            {firstName ? `You're set, ${firstName}.` : "You're set."}
          </h1>
          <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-muted sm:text-base">
            Both skills are below, ready to paste. Copy one, drop it into Claude
            Code or Cowork, and it installs itself — no config. New skills land in
            your account free the day they drop, and you&apos;re on the newsletter.
          </p>

          {/* How to install — three quick steps */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { n: "1", t: "Copy a block", d: "Hit copy on either skill below." },
              { n: "2", t: "Paste into Claude", d: "Claude Code or Cowork, any chat." },
              { n: "3", t: "It installs itself", d: "Claude writes the skill file." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-4">
                <span className="font-mono text-[11px] font-semibold text-accent-ink">
                  {s.n}
                </span>
                <p className="mt-1 text-[14px] font-semibold text-foreground">{s.t}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Both skills, unlocked */}
        <div className="mx-auto mt-14 max-w-3xl space-y-14">
          {SKILLS_SORTED.map((skill) => (
            <section key={skill.slug} id={skill.slug}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-accent-ink">
                    {skill.category} · v{currentVersion(skill.slug)}
                  </p>
                  <h2 className="display text-[clamp(1.7rem,4vw,2.4rem)] text-foreground">
                    {skill.name}
                  </h2>
                </div>
                <Link
                  href={`/skills/${skill.slug}`}
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-foreground"
                >
                  Details &amp; changelog
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <SkillContent content={skill.install} downloadName={skill.downloadName} />
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
