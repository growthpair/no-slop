import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { NavAuth } from "./nav-auth";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/skills"
            className="hidden px-2 font-mono text-[12px] uppercase tracking-widest text-muted transition-colors hover:text-foreground sm:inline"
          >
            Skills
          </Link>
          <Link
            href="/#the-tell"
            className="hidden px-2 font-mono text-[12px] uppercase tracking-widest text-muted transition-colors hover:text-foreground sm:inline"
          >
            The tell
          </Link>
          <ThemeToggle />
          <NavAuth />
        </nav>
      </div>
    </header>
  );
}
