import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Free Claude skills that kill the AI tell in your writing and design.
            Built by Jonathan Martinez.
          </p>
        </div>
        <div className="flex gap-14">
          <div className="flex flex-col gap-2.5">
            <p className="eyebrow text-muted-2">Skills</p>
            <Link href="/skills/no-slop" className="text-[13px] text-muted transition-colors hover:text-foreground">
              No Slop Copy
            </Link>
            <Link href="/skills/no-slop-design" className="text-[13px] text-muted transition-colors hover:text-foreground">
              No Slop Design
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="eyebrow text-muted-2">More</p>
            <a
              href="https://claudemarketers.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-muted transition-colors hover:text-foreground"
            >
              Newsletter
            </a>
            <a
              href="https://www.linkedin.com/in/jon4growth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-muted transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-border pt-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-2">
          © {new Date().getFullYear()} DeleteSlop · A GrowthPair project
        </p>
      </div>
    </footer>
  );
}
