import Link from "next/link";

/**
 * Wordmark. "Delete" is highlighted (the action) and "Slop" is struck through
 * (the target) — the brand concept in one glance: delete the slop. Monospace
 * keeps it precise.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-baseline gap-1.5 font-mono text-[15px] font-semibold tracking-tight text-foreground ${className}`}
    >
      <span className="bg-accent px-1 text-accent-contrast">Delete</span>
      <span className="relative text-muted">
        Slop
        <svg
          aria-hidden
          viewBox="0 0 120 8"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-[-2px] top-1/2 h-[0.5em] w-[calc(100%+4px)] -translate-y-1/2 overflow-visible"
        >
          <path
            d="M2,5 C34,3.6 66,5.8 98,4.2 C110,3.7 115,4.6 118,4.3"
            fill="none"
            stroke="var(--slop)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </Link>
  );
}
