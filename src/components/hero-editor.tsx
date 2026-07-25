"use client";

import { useEffect, useState } from "react";

/**
 * The hero's live demo: a rotating set of real slop→fixed rewrites. The "before"
 * line is struck red (the slop), the "after" is clean with a single lime mark
 * (the fix) and a blinking caret. Crossfades between examples; on reduced-motion
 * it holds the first example static.
 */
type Pair = {
  before: string;
  strike: string[]; // substrings in `before` to strike through
  after: (string | { mark: string })[]; // plain strings + one highlighted mark
};

const PAIRS: Pair[] = [
  {
    before: "We leverage cutting-edge AI to seamlessly empower your team.",
    strike: ["leverage", "cutting-edge", "seamlessly", "empower"],
    after: ["Our AI helps your team ", { mark: "ship 2x faster" }, "."],
  },
  {
    before: "It's worth noting that this is a truly game-changing solution.",
    strike: ["It's worth noting that", "truly game-changing"],
    after: ["It ", { mark: "cut our CAC 34%" }, " in one quarter."],
  },
  {
    before: "In today's fast-paced world, we foster robust, holistic growth.",
    strike: ["In today's fast-paced world", "foster", "robust, holistic"],
    after: ["We ", { mark: "added $70K MRR" }, " in 90 days."],
  },
];

function renderBefore(p: Pair) {
  // Split `before` around each strike phrase, wrapping matches in a struck span.
  const parts: { text: string; strike: boolean }[] = [];
  let rest = p.before;
  while (rest.length) {
    const next = p.strike
      .map((s) => ({ s, i: rest.indexOf(s) }))
      .filter((x) => x.i >= 0)
      .sort((a, b) => a.i - b.i)[0];
    if (!next) {
      parts.push({ text: rest, strike: false });
      break;
    }
    if (next.i > 0) parts.push({ text: rest.slice(0, next.i), strike: false });
    parts.push({ text: next.s, strike: true });
    rest = rest.slice(next.i + next.s.length);
  }
  return parts.map((part, i) =>
    part.strike ? (
      <span key={i} className="text-slop line-through decoration-slop/70 decoration-2">
        {part.text}
      </span>
    ) : (
      <span key={i}>{part.text}</span>
    )
  );
}

export function HeroEditor() {
  const [i, setI] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Fade the current example out, swap at the midpoint, fade the next one in.
    const cycle = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setI((v) => (v + 1) % PAIRS.length);
        setFading(false);
      }, 280);
    }, 4200);
    return () => clearInterval(cycle);
  }, []);

  const p = PAIRS[i];

  return (
    <div className="overflow-hidden rounded-xl border border-border-strong bg-surface shadow-2xl shadow-black/20">
      {/* Editor chrome */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
          draft.md — deleteslop
        </span>
      </div>

      <div className="px-6 py-7 sm:px-8 sm:py-9">
        {/* Before */}
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-2">
          Before
        </p>
        <p
          className="text-[15px] leading-relaxed text-muted transition-opacity duration-300 ease-out sm:text-base"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {renderBefore(p)}
        </p>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent-ink">
            deleteslop
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* After */}
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-2">
          After
        </p>
        <p
          className="border-l-2 border-accent pl-3.5 text-[17px] font-medium leading-relaxed text-foreground transition-opacity duration-300 ease-out sm:text-lg"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {p.after.map((seg, j) =>
            typeof seg === "string" ? (
              <span key={j}>{seg}</span>
            ) : (
              <span key={j} className="bg-accent px-1 text-accent-contrast">
                {seg.mark}
              </span>
            )
          )}
          <span className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-accent" />
        </p>
      </div>
    </div>
  );
}
