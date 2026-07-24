import Link from "next/link";

/**
 * Wordmark. "No" is struck through (the slop) and "Slop" is highlighted (the
 * fix) — the brand concept in three characters. Monospace keeps it precise.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-baseline gap-1.5 font-mono text-[15px] font-semibold tracking-tight text-foreground ${className}`}
    >
      <span className="relative text-muted">
        No
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slop" />
      </span>
      <span className="bg-accent px-1 text-accent-contrast">Slop</span>
    </Link>
  );
}
