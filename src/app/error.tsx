"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";

/** Root error boundary. Minimal, on-brand, no stack traces in the user's face. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center px-5 sm:px-8">
      <div className="mx-auto max-w-lg">
        <p className="eyebrow mb-5 text-slop">Something broke</p>
        <h1 className="display text-[clamp(2.2rem,6vw,3.4rem)] text-foreground">
          That wasn&apos;t supposed to happen.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          A rare error on our end. Try again, and if it sticks, it&apos;s on us.
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
        >
          <RotateCw size={14} /> Try again
        </button>
      </div>
    </main>
  );
}
