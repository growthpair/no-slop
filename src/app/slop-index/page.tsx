import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, ArrowUpRight, Plus } from "lucide-react";
import { SLOP_INDEX_SEED } from "@/lib/slop-index";
import { detectSlop, SLOP_SAMPLE } from "@/lib/slop-detector";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Slop Index · DeleteSlop",
  description:
    "Real brand marketing copy ranked by AI-tell density, scored live by the same detector the No Slop skills run. Add any brand.",
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://deleteslop.com";

function cardUrl(subject: string, score: number, tells: number, words: number, label: string, tips: string[]) {
  return (
    `${SITE}/api/score-card?subject=${encodeURIComponent(subject)}&score=${score}` +
    `&tells=${tells}&words=${words}&label=${encodeURIComponent(label)}` +
    `&tips=${encodeURIComponent(tips.join(","))}`
  );
}

type Row = { name: string; note: string; url: string; sample: string; submitted: boolean };

export default async function SlopIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; error?: string }>;
}) {
  const sp = await searchParams;

  // Curated seed (code) + user submissions (DB). DB is best-effort: if it's
  // unreachable the page still renders the curated board.
  let submitted: Row[] = [];
  try {
    const rows = await prisma.slopEntry.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
    submitted = rows.map((r) => ({
      name: r.name,
      note: r.note ?? "",
      url: r.sourceUrl ?? "",
      sample: r.copy,
      submitted: true,
    }));
  } catch {
    /* DB down — show curated only */
  }

  const combined: Row[] = [
    ...SLOP_INDEX_SEED.map((e) => ({ name: e.name, note: e.note, url: e.url, sample: e.sample, submitted: false })),
    ...submitted,
  ];

  const ranked = combined
    .map((row) => {
      const result = detectSlop(row.sample);
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
      return { ...row, result, topTells };
    })
    .sort((a, b) => b.result.score - a.result.score || b.result.hits.length - a.result.hits.length);

  const avg =
    ranked.length > 0
      ? Math.round((ranked.reduce((s, r) => s + r.result.score, 0) / ranked.length) * 10) / 10
      : 0;

  // Contrast: a typical AI-written draft on the same detector.
  const aiDraft = detectSlop(SLOP_SAMPLE);

  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <header className="mx-auto max-w-5xl">
          <p className="eyebrow mb-5 text-accent-ink">The Slop Index</p>
          <h1 className="display text-[clamp(2.6rem,7vw,4.6rem)] text-foreground">
            Do real brands write like AI?
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            We ran each brand&apos;s real marketing copy through the same detector
            the No Slop skills run. Mostly the answer is no &mdash; big brands hire
            copywriters, so they score near zero. That&apos;s the bar. A typical
            AI-written draft scores{" "}
            <span className="font-semibold text-slop">{aiDraft.score}/10</span> on
            the exact same test. The gap is the tell.
          </p>

          {/* The gap, at a glance */}
          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
                These brands, average
              </p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-accent-ink">{avg}</span>
                <span className="text-lg text-muted-2">/10</span>
              </p>
              <p className="mt-1 text-[12px] text-muted">Human copy. Clean.</p>
            </div>
            <div className="rounded-xl border border-slop/25 bg-slop/[0.06] p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
                A typical AI draft
              </p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-slop">{aiDraft.score}</span>
                <span className="text-lg text-muted-2">/10</span>
              </p>
              <p className="mt-1 text-[12px] text-muted">Straight from the model.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#add"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              Add a brand <Plus size={14} />
            </a>
            <Link
              href="/#slop-check"
              className="font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-foreground"
            >
              Grade your own copy →
            </Link>
          </div>

          {sp?.added && (
            <p className="mt-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-[13.5px] text-foreground">
              Added. It&apos;s on the board below.
            </p>
          )}
          {sp?.error && (
            <p className="mt-6 rounded-lg border border-slop/30 bg-slop/10 px-4 py-3 text-[13.5px] text-foreground">
              That didn&apos;t save. Add a brand name and at least a sentence or two of copy.
            </p>
          )}
        </header>

        {/* Leaderboard */}
        <section className="mx-auto mt-14 max-w-5xl">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Ranked by AI-tell density · {ranked.length} brands
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>

          <ol className="flex flex-col gap-3">
            {ranked.map((r, i) => (
              <li
                key={`${r.name}-${i}`}
                className="grid items-center gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr_auto]"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[13px] font-semibold text-muted-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className={`text-3xl font-bold tracking-tight ${
                        r.result.hits.length === 0 ? "text-accent-ink" : "text-slop"
                      }`}
                    >
                      {r.result.score}
                    </span>
                    <span className="text-sm text-muted-2">/10</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-[16px] font-bold tracking-tight text-foreground">{r.name}</h3>
                    {r.note && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">{r.note}</span>
                    )}
                    {r.submitted && (
                      <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-2">
                        Submitted
                      </span>
                    )}
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-2 transition-colors hover:text-foreground"
                      >
                        Source <ArrowUpRight size={11} />
                      </a>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {r.result.hits.length === 0 ? (
                      <span className="font-mono text-[11px] uppercase tracking-widest text-accent-ink">
                        Clean · no AI tells
                      </span>
                    ) : (
                      <>
                        {r.topTells.map((t) => (
                          <span key={t} className="pen-strike text-[13px] text-slop">
                            {t}
                          </span>
                        ))}
                        <span className="font-mono text-[11px] text-muted-2">
                          {r.result.hits.length} tells · {r.result.wordCount} words
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <a
                  href={cardUrl(r.name, r.result.score, r.result.hits.length, r.result.wordCount, r.result.label, r.topTells)}
                  download={`slop-index-${r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 justify-self-start rounded-md border border-border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted transition-colors hover:border-border-strong hover:text-foreground sm:justify-self-end"
                >
                  <Download size={13} /> Card
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* Add a brand */}
        <section id="add" className="mx-auto mt-16 max-w-3xl scroll-mt-24">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="display text-[clamp(1.6rem,4vw,2.4rem)] text-foreground">Add a brand to the board</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              Paste a brand&apos;s real public marketing copy (a hero section, an
              about blurb). It&apos;s scored on the spot and added to the board.
            </p>
            <form action="/api/slop-index/submit" method="post" className="mt-6 flex flex-col gap-4">
              {/* Honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">Brand *</span>
                  <input
                    name="name"
                    required
                    maxLength={80}
                    placeholder="e.g. Notion"
                    className="rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-muted-2 focus:border-accent focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">Category</span>
                  <input
                    name="note"
                    maxLength={40}
                    placeholder="e.g. B2B SaaS"
                    className="rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-muted-2 focus:border-accent focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">Source URL</span>
                <input
                  name="sourceUrl"
                  type="url"
                  maxLength={300}
                  placeholder="https://…"
                  className="rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-muted-2 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">Marketing copy *</span>
                <textarea
                  name="copy"
                  required
                  minLength={20}
                  maxLength={1200}
                  rows={5}
                  placeholder="Paste their real hero / marketing copy here…"
                  className="resize-y rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] leading-relaxed text-foreground placeholder:text-muted-2 focus:border-accent focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 self-start rounded-md bg-accent px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
              >
                Score it &amp; add <ArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-[12px] leading-relaxed text-muted-2">
            The score is an automated count of common AI-writing tells (specific
            words and phrases) in the copy shown. It is a measure of writing
            style, not a judgment of any brand, its products, or the quality of
            its work. Copy excerpts are quoted for commentary and criticism. All
            brand names and trademarks belong to their respective owners; no
            affiliation or endorsement is implied. Entries are submitted by users;
            to request a correction or removal, email jonathan@growthpair.com.
          </p>
        </section>

        {/* CTA */}
        <section className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="display text-[clamp(1.8rem,4.5vw,2.8rem)] text-foreground">Delete the tell for good.</h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            The grader is the skill running once. Install No Slop Copy and Claude
            scrubs these tells out of every draft, before you paste it anywhere.
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
