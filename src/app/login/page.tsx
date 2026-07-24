"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Check, ExternalLink } from "lucide-react";
import { Logo } from "@/components/logo";

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Twitter|LinkedInApp|Line\/|KAKAOTALK|Snapchat|Pinterest|TikTok|BytedanceWebview|Musical_ly/i.test(
    ua
  );
}

function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function InAppWarning() {
  const url = (process.env.NEXT_PUBLIC_SITE_URL || "") + "/login";
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-xl border border-accent/30 bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <ExternalLink size={22} className="text-accent-ink" />
          </div>
          <h2 className="mb-2 text-lg font-semibold">Open in your browser</h2>
          <p className="mb-6 text-sm leading-relaxed text-muted">
            Google sign-in doesn&apos;t work inside app browsers (LinkedIn,
            Instagram). Open this page in Safari or Chrome to continue.
          </p>
          <p className="break-all rounded-md border border-border bg-surface p-3 font-mono text-[11px] text-muted">
            {url || "noslop.dev/login"}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginContent() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/#skills";
  const [embedded, setEmbedded] = useState(false);
  useEffect(() => setEmbedded(isInAppBrowser()), []);

  if (embedded) return <InAppWarning />;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-xl border border-border-strong bg-card p-8">
          <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
            Unlock the skills
          </p>
          <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Free with a Google account
          </p>

          <div className="mb-6 space-y-2.5">
            {[
              "Copy-paste No Slop + No Slop Design",
              "Every new skill, free, the day it drops",
              "The newsletter, no spam",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check size={13} className="shrink-0 text-accent-ink" strokeWidth={3} />
                <span className="text-[13px] text-muted">{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-white py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100"
          >
            <GoogleMark />
            Continue with Google
          </button>

          {process.env.NODE_ENV === "development" && (
            <>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-2">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <button
                onClick={() => signIn("credentials", { email: "dev@noslop.dev", callbackUrl })}
                className="flex w-full cursor-pointer items-center justify-center rounded-md border border-border py-3 font-mono text-sm text-foreground transition-colors hover:border-border-strong"
              >
                Dev login
              </button>
            </>
          )}

          <p className="mt-6 text-center font-mono text-[10px] leading-relaxed text-muted-2">
            Signing in subscribes you to{" "}
            <a href="https://claudemarketers.substack.com" target="_blank" rel="noopener noreferrer" className="text-accent-ink hover:underline">
              the newsletter
            </a>
            . Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
