import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Plus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { SKILLS_SORTED } from "@/lib/skills";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SkillCard } from "@/components/skill-card";
import { UnlockButton } from "@/components/unlock-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The library · DeleteSlop",
  description:
    "Every DeleteSlop skill in one place. Copy-paste anti-slop skills for Claude. Free with a Google account.",
};

export default async function SkillsIndex() {
  const session = await getServerSession(authOptions);
  const count = SKILLS_SORTED.length;

  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <header className="mx-auto max-w-5xl">
          <p className="eyebrow mb-5 text-accent-ink">The library</p>
          <h1 className="display text-[clamp(2.6rem,7vw,4.6rem)] text-foreground">
            Every skill that deletes the tell.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
            One paste each, into Claude Code or Cowork. Read the pitch and a
            preview free. Sign in with Google to copy the full skill and join the
            newsletter. Every new one lands in your account the day it drops.
          </p>
          {!session && (
            <div className="mt-8">
              <UnlockButton callbackPath="/get" label="Unlock the library free" />
            </div>
          )}
        </header>

        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
              {count} skill{count === 1 ? "" : "s"} in the library
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS_SORTED.map((s) => (
              <SkillCard key={s.slug} skill={s} unlocked={!!session} />
            ))}

            {/* Growth teaser */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-card/40 p-6 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Plus size={18} className="text-accent-ink" />
              </div>
              <p className="mb-1 text-sm font-semibold tracking-tight text-foreground">
                More skills on the way
              </p>
              <p className="text-[13px] leading-relaxed text-muted">
                New anti-slop skills drop here regularly. Sign in once and each
                one is yours, free, the day it lands.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
