import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center px-5 pt-24 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow mb-5 text-accent-ink">404</p>
          <h1 className="display text-[clamp(2.6rem,7vw,4.5rem)] text-foreground">
            This page is{" "}
            <span className="relative whitespace-nowrap text-muted">
              slop
              <span className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-slop" />
            </span>
            .
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            We cut it. Nothing lives at this URL. Head back to the skills.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            <ArrowLeft size={14} /> Back to DeleteSlop
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
