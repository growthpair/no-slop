import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { HandStrike } from "./marks";

/**
 * Bespoke "editor's markup" — a slop paragraph hand-edited in red pen. The
 * strikes are irregular hand-drawn SVG strokes (not clean CSS lines) and the
 * replacements are written in above a caret in a hand font, so the whole thing
 * reads as marked up by a person, not generated. This is the signature craft
 * moment: editing IS the brand.
 */

/** Struck word with the fix written in above a caret, editor-style. */
function Fix({ to, children }: { to: string; children: ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="absolute -top-[0.95em] left-1/2 -translate-x-1/2 whitespace-nowrap font-hand text-[0.82em] font-semibold leading-none text-slop">
        {to}
        <span className="ml-0.5 text-[1.1em]">‸</span>
      </span>
      <HandStrike className="text-muted">{children}</HandStrike>
    </span>
  );
}

export function MarkedManuscript() {
  return (
    <div className="paper relative overflow-hidden rounded-xl border border-border-strong shadow-xl shadow-black/[0.06]">
      {/* Chrome */}
      <div className="relative z-10 flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
          launch-email — draft
        </span>
        <span className="font-hand text-[17px] leading-none text-slop">3rd pass ✗</span>
      </div>

      {/* Marked-up body */}
      <div className="relative z-10 px-6 py-9 sm:px-8">
        <p className="text-[17px] leading-[2.35] text-foreground sm:text-[18px]">
          <Fix to="Here&rsquo;s how">In today&rsquo;s fast-paced world,</Fix> we{" "}
          <Fix to="use">leverage</Fix>{" "}
          <HandStrike className="text-muted">cutting-edge</HandStrike> AI to{" "}
          <Fix to="help">seamlessly empower</Fix> teams and{" "}
          <Fix to="grow">supercharge</Fix> growth.{" "}
          <HandStrike className="text-muted">It&rsquo;s a game-changer.</HandStrike>
        </p>

        {/* Handwritten margin note */}
        <p className="mt-6 -rotate-2 font-hand text-[19px] leading-tight text-slop">
          ↑ every one of these is the tell. cut it.
        </p>

        {/* The clean result */}
        <div className="mt-7 flex items-center gap-3 border-t border-border pt-6">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent">
            <Check size={14} strokeWidth={3} className="text-accent-contrast" />
          </span>
          <p className="text-[16px] font-medium leading-snug text-foreground">
            We use AI to help teams grow.
          </p>
        </div>
      </div>
    </div>
  );
}
