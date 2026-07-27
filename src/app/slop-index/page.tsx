import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { SLOP_INDEX } from "@/lib/slop-index";
import { detectSlop } from "@/lib/slop-detector";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "The Slop Index · DeleteSlop",
  description:
    "Marketing's most AI-sounding genres, ranked by AI-tell density and graded live by the same detector the No Slop skills run.",
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://deleteslop.com";

function cardUrl(score: number, tells: number, words: number, label: string, tips: string[]) {
  return (
    `${SITE}/api/score-card?score=${score}&tells=${tells}&words=${words}` +
    `&label=${encodeURIComponent(label)}&tips=${encodeURIComponent(tips.join(","))}`
  );
}

export default function SlopIndexPage() {
  // Score every entry live, then rank sloppiest-first.
  const ranked = SLOP_INDEX.map((entry) => {
    const result = detectSlop(entry.sample);
    const seen = new Set<string>();
    const topTells = result.hits
      .filter((h) => {
        const k = h.text.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, 4)
      .map((h) => h.text);
    return { ...entry, result, topTells };
  }).sort((a, b) => b.result.score - a.result.score || b.result.hits.length - a.result.hits.length);

  const avg = Math.round(
    (ranked.reduce((s, r) => s + r.result.score, 0) / ranked.length) * 10
  ) / 10;

  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <header className="mx-auto max-w-5xl">
          <p className="eyebrow mb-5 text-accent-ink">The Slop Index</p>
          <h1 className="display text-[clamp(2.6rem,7vw,4.6rem)] text-foreground">
            Marketing&apos;s most AI-sounding genres.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            Every genre below is a representative hero, scored live by the same
            detector the No Slop skills run. Higher score, more AI tells per word.
            The average across the board is{" "}
            <span className="font-semibold text-foreground">{avg}/10</span>. Think
            your copy beats it?
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/#slop-check"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              Grade your copy free <ArrowRight size={14} />
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-2">
              Runs in your browser · nothing sent anywhere
            </span>
          </div>
        </header>

        {/* Leaderboard */}
        <section className="mx-auto mt-14 max-w-5xl">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Ranked sloppiest first
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>

          <ol className="flex flex-col gap-3">
            {ranked.map((r, i) => (
              <li
                key={r.name}
                className="grid items-center gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr_auto]"
              >
                {/* Rank + score */}
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[13px] font-semibold text-muted-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold tracking-tight text-slop">
                      {r.result.score}
                    </span>
                    <span className="text-sm text-muted-2">/10</span>
                  </div>
                </div>

                {/* Name + tells */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-[16px] font-bold tracking-tight text-foreground">
                      {r.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
                      {r.note}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    {r.topTells.map((t) => (
                      <span key={t} className="pen-strike text-[13px] text-slop">
                        {t}
                      </span>
                    ))}
                    <span className="font-mono text-[11px] text-muted-2">
                      {r.result.hits.length} tells · {r.result.wordCount} words
                    </span>
                  </div>
                </div>

                {/* Share card */}
                <a
                  href={cardUrl(
                    r.result.score,
                    r.result.hits.length,
                    r.result.wordCount,
                    r.name,
                    r.topTells
                  )}
                  download={`slop-index-${i + 1}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 justify-self-start rounded-md border border-border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted transition-colors hover:border-border-strong hover:text-foreground sm:justify-self-end"
                >
                  <Download size={13} /> Card
                </a>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-[13px] leading-relaxed text-muted-2">
            Genres are archetypes, not quotes from any named company. Scores are the
            detector&apos;s AI-tell density, not a judgment of quality.
          </p>
        </section>

        {/* CTA */}
        <section className="mx-auto mt-20 max-w-3xl rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="display text-[clamp(1.8rem,4.5vw,2.8rem)] text-foreground">
            Delete the tell for good.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            The grader is the skill running once. Install No Slop Copy and Claude
            scrubs these tells out of every draft, before you ever paste it anywhere.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href="/skills/no-slop"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              Get the skills free <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
