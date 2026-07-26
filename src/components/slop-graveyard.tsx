import { HandStrike } from "./marks";

/**
 * A dense wall of real slop vocabulary, every word struck out by hand — the
 * maximalist "density" moment, built entirely from type + pen marks (no
 * generated art). The clean line cuts through at the end.
 */
const SLOP = [
  "delve",
  "leverage",
  "utilize",
  "synergize",
  "seamless",
  "robust",
  "cutting-edge",
  "game-changer",
  "supercharge",
  "holistic",
  "paradigm shift",
  "ever-evolving",
  "thought leader",
  "disruptive",
  "elevate",
  "empower",
  "tapestry",
  "unlock",
  "deep dive",
  "it's worth noting",
  "move the needle",
  "best-in-class",
  "frictionless",
  "bleeding-edge",
  "circle back",
  "low-hanging fruit",
];

export function SlopGraveyard() {
  return (
    <div className="paper relative overflow-hidden rounded-xl border border-border-strong px-6 py-8 sm:px-10 sm:py-10">
      <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-3.5 sm:gap-x-7">
        {SLOP.map((w) => (
          <HandStrike
            key={w}
            className="font-mono text-[15px] lowercase tracking-tight text-muted-2 sm:text-[18px]"
          >
            {w}
          </HandStrike>
        ))}
        <span className="ml-1 inline-flex items-center gap-2 font-mono text-[15px] uppercase tracking-widest text-accent-ink sm:text-[16px]">
          <span className="h-px w-6 bg-accent" />
          all deleted
        </span>
      </div>
    </div>
  );
}
