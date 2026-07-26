import type { ReactNode } from "react";

/**
 * A slightly wavy red-pen stroke drawn through the children — a hand mark, not a
 * clean CSS line. The stroke scales with the text, so it reads as a thin pen on
 * body copy and a bold marker on a headline. Shared across the site so the
 * editorial "marked-up" language stays consistent.
 */
export function HandStrike({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 120 14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-[-3px] top-1/2 h-[0.58em] w-[calc(100%+6px)] -translate-y-1/2 overflow-visible"
      >
        <path
          d="M2,8 C32,6.8 64,8.2 96,7.1 C108,6.7 114,7.5 118,7.2"
          fill="none"
          stroke="var(--slop)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
