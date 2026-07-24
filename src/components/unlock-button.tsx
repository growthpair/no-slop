"use client";

import { ArrowRight } from "lucide-react";

/**
 * Routes to /login (not signIn directly) so the in-app-browser detection there
 * can catch LinkedIn/Instagram webviews that block Google OAuth. `callbackPath`
 * is where the user lands back after auth — the same skill, now unlocked.
 */
export function UnlockButton({
  callbackPath,
  label = "Unlock with Google",
  full = false,
}: {
  callbackPath: string;
  label?: string;
  full?: boolean;
}) {
  const href = `/login?callbackUrl=${encodeURIComponent(callbackPath)}&reason=skill`;
  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover ${
        full ? "w-full" : ""
      }`}
    >
      {label}
      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
