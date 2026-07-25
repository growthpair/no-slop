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
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slop" />
      </span>
    </Link>
  );
}
