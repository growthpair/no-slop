import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SKILLS_SORTED } from "@/lib/skills";
import { allReleases, formatReleaseDate } from "@/lib/changelog";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Changelog · DeleteSlop",
  description:
    "Every update to the DeleteSlop skills. Already installed one? Re-paste the latest block and Claude replaces your version with the new one.",
};

export default function ChangelogPage() {
  const releases = allReleases(SKILLS_SORTED.map((s) => ({ slug: s.slug, name: s.name })));

  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <header className="mx-auto max-w-3xl">
          <p className="eyebrow mb-5 text-accent-ink">Changelog</p>
          <h1 className="display text-[clamp(2.6rem,7vw,4.4rem)] text-foreground">
            What&rsquo;s changed.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base">
            Every time a skill gets sharper, it lands here.{" "}
            <strong className="font-semibold text-foreground">Already installed one?</strong>{" "}
            You don&rsquo;t reinstall from scratch — copy the latest block again and paste it
            into Claude, and it replaces your version with the new one. That&rsquo;s the whole
            update, no uninstall.
          </p>
        </header>

        <section className="mx-auto mt-14 max-w-3xl">
          <ol className="relative border-l border-border pl-6 sm:pl-8">
            {releases.map(({ slug, name, release }) => (
              <li key={`${slug}-${release.version}`} className="relative pb-12 last:pb-0">
                <span className="absolute top-1.5 h-2.5 w-2.5 rounded-full bg-accent -left-[calc(1.5rem+5px)] sm:-left-[calc(2rem+5px)]" />
                <div className="mb-3 flex flex-wrap items-center gap-2.5">
                  <Link
                    href={`/skills/${slug}`}
                    className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-ink transition-colors hover:border-accent/40"
                  >
                    {name}
                  </Link>
                  <span className="font-mono text-[12px] font-semibold text-foreground">
                    v{release.version}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-2">
                    {formatReleaseDate(release.date)}
                  </span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {release.changes.map((c, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-[14px] leading-relaxed text-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-2" />
                      {c}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-4 border-t border-border pt-8">
            <Link
              href="/skills"
              className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              Get the skills
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
