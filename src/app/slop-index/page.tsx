import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SLOP_INDEX_SEED } from "@/lib/slop-index";
import { detectSlop, SLOP_SAMPLE, type SlopHit } from "@/lib/slop-detector";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Slop Index · DeleteSlop",
  description:
    "Real brand marketing copy ranked by AI-tell density, scored live by the same detector the No Slop skills run. Add any brand.",
};

type Row = { name: string; note: string; url: string; sample: string; submitted: boolean };

/** Render copy with each detected tell struck, server-side (the receipts). */
function HighlightedCopy({ text, hits }: { text: string; hits: SlopHit[] }) {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  hits.forEach((h, i) => {
    if (h.start > cursor) nodes.push(<span key={`t${i}`}>{text.slice(cursor, h.start)}</span>);
    nodes.push(
      <span key={`h${i}`} className="pen-strike text-slop">
        {text.slice(h.start, h.end)}
      </span>
    );
    cursor = h.end;
  });
  if (cursor < text.length) nodes.push(<span key="end">{text.slice(cursor)}</span>);
  return <>{nodes}</>;
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export default async function SlopIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const session = await getServerSession(authOptions);

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
      const uniqueTells = result.hits.filter((h) => {
        const k = h.text.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      return { ...row, result, uniqueTells };
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
            the No Slop skills run. Mostly the answer is no. Big brands hire
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
              {sp.error === "scrape"
                ? "Couldn't read that page (it may block bots or load its copy with JavaScript). Paste the copy in the box below instead."
                : "That didn't save. Add a brand name and a URL we can read (or paste the copy)."}
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
                className="grid items-start gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr]"
              >
                <div className="flex items-center gap-4 sm:pt-0.5">
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
                  {r.result.hits.length === 0 ? (
                    <p className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-accent-ink">
                      Clean · no AI tells
                    </p>
                  ) : (
                    <div className="mt-2">
                      <p className="mb-2 font-mono text-[11px] text-muted-2">
                        {plural(r.result.hits.length, "tell")} · {r.result.wordCount} words
                      </p>
                      <ul className="flex flex-col gap-1">
                        {r.uniqueTells.slice(0, 6).map((h) => (
                          <li key={h.text} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px]">
                            <span className="pen-strike text-slop">{h.text}</span>
                            <span className="text-muted-2">→</span>
                            <span className="text-foreground/70">{h.fix}</span>
                          </li>
                        ))}
                        {r.uniqueTells.length > 6 && (
                          <li className="font-mono text-[11px] text-muted-2">
                            +{r.uniqueTells.length - 6} more
                          </li>
                        )}
                      </ul>
                      <details className="group mt-2">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-2 transition-colors hover:text-foreground">
                          Show the copy
                        </summary>
                        <p className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 text-[12.5px] leading-relaxed text-foreground/80">
                          <HighlightedCopy text={r.sample} hits={r.result.hits} />
                        </p>
                      </details>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Add a brand */}
        <section id="add" className="mx-auto mt-16 max-w-3xl scroll-mt-24">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="display text-[clamp(1.6rem,4vw,2.4rem)] text-foreground">Add a brand to the board</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              Drop a URL. We pull the brand name and its copy, score it, and add it to
              the board. Some sites block bots or render in JavaScript, so you can paste
              the copy yourself as a fallback.
            </p>
            {session ? (
            <form action="/api/slop-index/submit" method="post" className="mt-6 flex flex-col gap-4">
              {/* Honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">Page URL *</span>
                <input
                  name="sourceUrl"
                  type="url"
                  required
                  maxLength={300}
                  placeholder="https://brand.com"
                  className="rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-muted-2 focus:border-accent focus:outline-none"
                />
                <span className="text-[11px] text-muted-2">
                  That&apos;s it. We pull the brand name and its copy from the page.
                </span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
                  Paste the copy (only if the scrape fails)
                </span>
                <textarea
                  name="copy"
                  maxLength={1200}
                  rows={4}
                  placeholder="Optional. Leave blank and we'll read the page ourselves."
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
            ) : (
              <div className="mt-6 flex flex-col items-start gap-3">
                <p className="text-[13.5px] leading-relaxed text-muted">
                  Sign in to add a brand. Free, one Google click, and it keeps the
                  board clean of spam.
                </p>
                <a
                  href="/login?callbackUrl=/slop-index"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
                >
                  Sign in to add <ArrowRight size={14} />
                </a>
              </div>
            )}
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
