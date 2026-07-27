"use client";

import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

/**
 * Session-aware unlock CTA.
 *
 * - Signed OUT: routes to /login (not signIn directly) so the in-app-browser
 *   detection there can catch LinkedIn/Instagram webviews that block Google
 *   OAuth. After auth the user lands back on `callbackPath`, now unlocked.
 * - Signed IN: skips /login entirely and goes straight to `callbackPath` — the
 *   page (force-dynamic, server-gated) renders the unlocked skill. This is what
 *   stops a logged-in user from being bounced back to the login screen.
 */
export function UnlockButton({
  callbackPath,
  label = "Unlock with Google",
  unlockedLabel,
  full = false,
}: {
  callbackPath: string;
  label?: string;
  /** Label shown once signed in. Defaults to `label` if omitted. */
  unlockedLabel?: string;
  full?: boolean;
}) {
  const { status } = useSession();
  const authed = status === "authenticated";

  const href = authed
    ? callbackPath
    : `/login?callbackUrl=${encodeURIComponent(callbackPath)}&reason=skill`;
  const text = authed ? unlockedLabel ?? label : label;

  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover ${
        full ? "w-full" : ""
      }`}
    >
      {text}
      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
