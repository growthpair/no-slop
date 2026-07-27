"use client";

import { useSession, signOut } from "next-auth/react";

/** Sign-in / account control in the navbar. Client-side session only. */
export function NavAuth() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/get"
          className="inline-flex items-center rounded-md bg-accent px-3.5 py-1.5 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
        >
          Your skills
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="inline-flex items-center rounded-md border border-border px-3 py-1.5 font-mono text-[12px] uppercase tracking-widest text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <a
      href="/login?callbackUrl=/get"
      className="inline-flex items-center rounded-md bg-accent px-3.5 py-1.5 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
    >
      Get the skills
    </a>
  );
}
