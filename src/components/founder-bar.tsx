/**
 * Thin credibility strip. Real names as text — no fake logos or avatars (the
 * design skill bans those). This is the reason a stranger trusts an anonymous
 * skill: the operator behind it.
 */
export function FounderBar() {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:gap-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-2">
        Built by
      </p>
      <p className="text-[14px] leading-relaxed text-foreground">
        <span className="font-semibold">Jonathan Martinez</span>
        <span className="text-muted">
          {" "}— growth at Uber, Coinbase &amp; Postmates. Now I teach marketers to run Claude at{" "}
        </span>
        <a
          href="https://claudemarketers.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-ink underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
        >
          Claude Marketers
        </a>
        <span className="text-muted">.</span>
      </p>
    </div>
  );
}
