"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Twitter } from "lucide-react";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://deleteslop.com";

/**
 * "Grade your design" — a self-audit checklist. Copy can be scanned client-side;
 * pixels can't (that needs a vision model / API). So this is honest: the marketer
 * checks the tells their design has, against the No Slop Design skill's list, and
 * gets a score + the fix for each. Same value shape as the copy checker.
 */
const TELLS: { tell: string; fix: string }[] = [
  { tell: "Purple / indigo / violet gradient anywhere", fix: "One brand palette, one accent" },
  { tell: "Gradient-filled headline text", fix: "Solid, high-contrast type" },
  { tell: "Glassmorphism / frosted-glass cards", fix: "Solid surfaces, real contrast" },
  { tell: "Everything centered", fix: "Left-align body; center only short hero lines" },
  { tell: "The same three-icon feature grid", fix: "Vary layout, earn each block" },
  { tell: "Every block a rounded card + shadow + icon square", fix: "Vary shape, weight, rhythm" },
  { tell: "Emoji as headings or bullets", fix: "Real typographic hierarchy" },
  { tell: "Gray-on-gray, low-contrast text", fix: "Hit WCAG AA; make the CTA the boldest thing" },
  { tell: "Stock “AI” art or blob-people illustrations", fix: "Real product shots, or nothing" },
  { tell: "Placeholder / lorem / invented logos", fix: "Real names and numbers, or cut it" },
];

export function DesignChecker() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const { score, label, headline } = useMemo(() => {
    const n = checked.size;
    let label: string;
    let headline: string;
    if (n === 0) {
      label = "Clean";
      headline = "No tells checked. Either it's clean, or look harder.";
    } else if (n <= 3) {
      label = "Mostly clean";
      headline = `${n} tell${n === 1 ? "" : "s"} — a quick pass fixes it.`;
    } else if (n <= 6) {
      label = "Reads like a template";
      headline = `${n} tells. It's starting to look generated.`;
    } else {
      label = "This looks AI-generated";
      headline = `${n} tells. This is the look buyers discount on sight.`;
    }
    return { score: n, label, headline };
  }, [checked]);

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `My landing page scored ${score}/10 on the design slop meter 😬 Grade yours 👇`
  )}&url=${encodeURIComponent(SITE)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Checklist */}
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
          Check every tell your design has
        </p>
        <ul className="flex flex-col gap-1.5">
          {TELLS.map((t, i) => {
            const on = checked.has(i);
            return (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  aria-pressed={on}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    on
                      ? "border-slop/40 bg-slop/[0.06]"
                      : "border-border bg-surface hover:border-border-strong"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      on ? "border-slop bg-slop text-white" : "border-border-strong"
                    }`}
                  >
                    {on && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span
                    className={`text-[13.5px] leading-snug ${
                      on ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {t.tell}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Result */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-5 sm:p-6">
        {/* Score */}
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
              Design slop score
            </p>
            <p className="mt-1 flex items-baseline gap-1">
              <span
                className={`text-4xl font-bold tracking-tight ${
                  score === 0 ? "text-accent-ink" : "text-foreground"
                }`}
              >
                {score}
              </span>
              <span className="text-lg text-muted-2">/10</span>
            </p>
          </div>
          <p className={`text-sm font-semibold ${score === 0 ? "text-accent-ink" : "text-slop"}`}>
            {label}
          </p>
        </div>

        {/* Meter */}
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              score === 0 ? "bg-accent" : "bg-slop"
            }`}
            style={{ width: `${Math.max(score * 10, score ? 8 : 0)}%` }}
          />
        </div>

        <p className="mb-5 text-[13px] leading-relaxed text-muted">{headline}</p>

        {/* Fixes for checked tells */}
        {checked.size > 0 && (
          <div className="mb-5">
            <p className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-2">
              What to fix
            </p>
            <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1">
              {[...checked].sort((a, b) => a - b).map((i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]">
                  <span className="pen-strike text-slop">{TELLS[i].tell}</span>
                  <ArrowRight size={11} className="mt-1 shrink-0 text-muted-2" />
                  <span className="text-foreground/80">{TELLS[i].fix}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {score > 0 && (
          <a
            href={tweetHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-flex items-center gap-1.5 self-start font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-foreground"
          >
            <Twitter size={12} /> Share your score
          </a>
        )}

        {/* Upsell */}
        <div className="mt-auto rounded-lg border border-accent/25 bg-accent/[0.06] p-4">
          <p className="text-[13.5px] font-semibold leading-snug text-foreground">
            Stop shipping the tells. Get the art director.
          </p>
          <p className="mt-1 mb-3.5 text-[12.5px] leading-relaxed text-muted">
            Install No Slop Design and Claude catches all of this as you build —
            landing pages, emails, ads, decks. Free with a Google account.
          </p>
          <a
            href="/login?callbackUrl=%2Fskills%2Fno-slop-design&reason=checker"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            Get No Slop Design <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
