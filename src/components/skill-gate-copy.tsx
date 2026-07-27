"use client";

import { useSession } from "next-auth/react";

/**
 * Session-aware pitch text for the homepage skill gate. The homepage is static,
 * so it can't read the session server-side — this small client piece swaps the
 * "sign in to copy" copy for a "you're in" message once authenticated, so a
 * logged-in user doesn't see a sign-in prompt they've already cleared.
 */
export function SkillGateCopy() {
  const { status } = useSession();
  const authed = status === "authenticated";

  if (authed) {
    return (
      <>
        <p className="text-[15px] font-semibold leading-snug text-foreground">
          You&apos;re in. Copy the full skill.
        </p>
        <p className="mt-1.5 mb-5 text-[13px] leading-relaxed text-muted">
          Open the skill for the paste-ready block and the .md download, or grab
          both at once from your skills page.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="text-[15px] font-semibold leading-snug text-foreground">
        Read the pitch free. Sign in to copy the full skill.
      </p>
      <p className="mt-1.5 mb-5 text-[13px] leading-relaxed text-muted">
        One Google click unlocks the paste-ready block and the .md download, and
        puts you on the newsletter. Free, no card.
      </p>
    </>
  );
}
