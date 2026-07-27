"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles, Twitter, RotateCcw } from "lucide-react";
import { detectSlop, SLOP_SAMPLE, type SlopHit } from "@/lib/slop-detector";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://deleteslop.com";

/** Render the pasted text with each detected tell wrapped in a struck mark. */
function Highlighted({ text, hits }: { text: string; hits: SlopHit[] }) {
  if (!text) return null;
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  hits.forEach((h, i) => {
    if (h.start > cursor) nodes.push(<span key={`t${i}`}>{text.slice(cursor, h.start)}</span>);
    nodes.push(
      <mark
        key={`h${i}`}
        title={h.fix}
        className="rounded bg-slop/15 px-0.5 text-slop line-through decoration-wavy decoration-slop/60"
      >
        {text.slice(h.start, h.end)}
      </mark>
    );
    cursor = h.end;
  });
  if (cursor < text.length) nodes.push(<span key="end">{text.slice(cursor)}</span>);
  return <p className="whitespace-pre-wrap text-[14px] leading-[1.9] text-foreground/90">{nodes}</p>;
}

export function SlopChecker() {
  const [text, setText] = useState("");
  const result = useMemo(() => detectSlop(text), [text]);
  const hasText = text.trim().length > 0;

  // Unique tells (by matched text, case-insensitive) for the fix list.
  const uniqueTells = useMemo(() => {
    const seen = new Set<string>();
    return result.hits.filter((h) => {
      const k = h.text.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [result.hits]);

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `My marketing copy scored ${result.score}/10 on the slop meter 😬 Check yours 👇`
  )}&url=${encodeURIComponent(SITE)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input */}
      <div className="flex flex-col">
        <div className="mb-3 flex items-center justify-between">
          <label htmlFor="slop-input" className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Paste your copy
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setText(SLOP_SAMPLE)}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-accent-ink transition-opacity hover:opacity-80"
            >
              <Sparkles size={12} /> Try an example
            </button>
            {hasText && (
              <button
                onClick={() => setText("")}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-foreground"
              >
                <RotateCcw size={12} /> Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          id="slop-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an email, a landing page section, a LinkedIn post — anything you wrote with AI. It's graded right here in your browser. Nothing is sent anywhere."
          rows={10}
          className="min-h-[240px] flex-1 resize-y rounded-xl border border-border-strong bg-surface p-4 text-[14px] leading-relaxed text-foreground placeholder:text-muted-2 focus:border-accent focus:outline-none"
        />
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-2">
          {result.wordCount} words · runs 100% in your browser
        </p>
      </div>

      {/* Result */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-5 sm:p-6">
        {!hasText ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Sparkles size={22} className="text-accent-ink" />
            </div>
            <p className="text-[15px] font-semibold text-foreground">Your slop score shows up here</p>
            <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted">
              Paste anything, or hit <span className="text-accent-ink">Try an example</span> to see it
              catch the tells live.
            </p>
          </div>
        ) : (
          <>
            {/* Score */}
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-2">Slop score</p>
                <p className="mt-1 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      result.hits.length === 0 ? "text-accent-ink" : "text-foreground"
                    }`}
                  >
                    {result.score}
                  </span>
                  <span className="text-lg text-muted-2">/10</span>
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    result.hits.length === 0 ? "text-accent-ink" : "text-slop"
                  }`}
                >
                  {result.label}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-2">
                  {result.hits.length} tell{result.hits.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {/* Meter */}
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.hits.length === 0 ? "bg-accent" : "bg-slop"
                }`}
                style={{ width: `${Math.max(result.score * 10, result.hits.length ? 8 : 0)}%` }}
              />
            </div>

            <p className="mb-5 text-[13px] leading-relaxed text-muted">{result.headline}</p>

            {/* Highlighted text */}
            <div className="mb-5 max-h-40 overflow-y-auto rounded-lg border border-border bg-surface p-3.5">
              <Highlighted text={text} hits={result.hits} />
            </div>

            {/* Tell list with fixes */}
            {uniqueTells.length > 0 && (
              <div className="mb-5">
                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-2">
                  What to cut
                </p>
                <ul className="flex max-h-40 flex-col gap-1.5 overflow-y-auto pr-1">
                  {uniqueTells.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-[13px]">
                      <span className="text-slop line-through decoration-wavy decoration-slop/60">{h.text}</span>
                      <ArrowRight size={11} className="shrink-0 text-muted-2" />
                      <span className="text-foreground/80">{h.fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Share */}
            {result.hits.length > 0 && (
              <a
                href={tweetHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 inline-flex items-center gap-1.5 self-start font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-foreground"
              >
                <Twitter size={12} /> Share your score
              </a>
            )}
          </>
        )}

        {/* Upsell — the checker is free; the skill is the permanent fix */}
        <div className="mt-auto rounded-lg border border-accent/25 bg-accent/[0.06] p-4">
          <p className="text-[13.5px] font-semibold leading-snug text-foreground">
            This is the skill running once. Get it to run on everything.
          </p>
          <p className="mt-1 mb-3.5 text-[12.5px] leading-relaxed text-muted">
            Install No Slop Copy and Claude scrubs this out of every draft, before you ever paste
            it here. Free with a Google account.
          </p>
          <a
            href="/login?callbackUrl=%2Fskills%2Fno-slop&reason=checker"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            Get No Slop Copy <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
