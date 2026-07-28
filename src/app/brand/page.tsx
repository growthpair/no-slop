import { Metadata } from "next";
import { Download } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Private-by-obscurity: not linked anywhere, and kept out of search.
export const metadata: Metadata = {
  title: "Brand book · DeleteSlop",
  robots: { index: false, follow: false },
};

const COLORS = [
  { name: "Signal Lime", hex: "#C6F24E", use: "The fix. Highlights + the one primary action. The icon.", dark: false },
  { name: "Ink", hex: "#14140F", use: "Text, wordmark, dark surfaces.", dark: true },
  { name: "Slop Red", hex: "#D6402A", use: "The tell. Strikes and pen marks only. Never a brand fill.", dark: true },
  { name: "Paper", hex: "#F6F5EF", use: "Background. The page you edit on.", dark: false },
  { name: "Accent Ink", hex: "#46600A", use: "Lime as readable text on paper (eyebrows, links).", dark: true },
  { name: "Muted", hex: "#63635A", use: "Secondary text.", dark: true },
];

function Download_({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted transition-colors hover:border-border-strong hover:text-foreground"
    >
      <Download size={13} /> {label}
    </a>
  );
}

export default function BrandPage() {
  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow mb-5 text-accent-ink">Brand book · private</p>
          <h1 className="display text-[clamp(2.6rem,7vw,4.6rem)] text-foreground">
            DeleteSlop assets.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            Everything you need to grab for the LinkedIn page and anywhere else.
            This page isn&apos;t linked or indexed. Right-click any preview to save,
            or use the download buttons.
          </p>

          {/* Icon */}
          <section className="mt-16">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">01 · Icon</h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
              The icon is the solid green box. That&apos;s the profile picture and app
              icon, nothing else. Use the rounded version where a platform doesn&apos;t
              mask corners for you.
            </p>
            <div className="mt-6 flex flex-wrap items-end gap-6">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/deleteslop-icon-green.png" alt="Green box icon" className="h-40 w-40 rounded-lg border border-border" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Download_ href="/brand/deleteslop-icon-green.png" label="PNG" />
                  <Download_ href="/brand/deleteslop-icon.svg" label="SVG" />
                </div>
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/deleteslop-icon-rounded.png" alt="Rounded green box icon" className="h-40 w-40" />
                <div className="mt-3">
                  <Download_ href="/brand/deleteslop-icon-rounded.png" label="Rounded PNG" />
                </div>
              </div>
            </div>
          </section>

          {/* Wordmark */}
          <section className="mt-16">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">02 · Wordmark</h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
              &ldquo;Delete&rdquo; highlighted, &ldquo;Slop&rdquo; struck through. The
              concept in one glance. Monospace, always this lockup.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/deleteslop-wordmark.png" alt="DeleteSlop wordmark" className="w-full" />
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/deleteslop-wordmark-dark.png" alt="DeleteSlop wordmark on dark" className="w-full" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Download_ href="/brand/deleteslop-wordmark.svg" label="SVG" />
              <Download_ href="/brand/deleteslop-wordmark-transparent.png" label="PNG transparent" />
              <Download_ href="/brand/deleteslop-wordmark.png" label="PNG light" />
              <Download_ href="/brand/deleteslop-wordmark-dark.png" label="PNG dark" />
            </div>
          </section>

          {/* Colors */}
          <section className="mt-16">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">03 · Colors</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COLORS.map((c) => (
                <div key={c.hex} className="overflow-hidden rounded-xl border border-border">
                  <div className="flex h-24 items-end p-3" style={{ background: c.hex }}>
                    <span
                      className="font-mono text-[12px] font-semibold"
                      style={{ color: c.dark ? "#F6F5EF" : "#14140F" }}
                    >
                      {c.hex}
                    </span>
                  </div>
                  <div className="bg-card p-4">
                    <p className="text-[14px] font-semibold text-foreground">{c.name}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{c.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Type */}
          <section className="mt-16">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">04 · Type</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="display text-4xl text-foreground">Aa</p>
                <p className="mt-3 text-[13px] font-semibold text-foreground">Geist</p>
                <p className="text-[12.5px] text-muted">Headlines + body. Heavy weight, tight tracking for display.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-4xl font-mono text-foreground">Aa</p>
                <p className="mt-3 text-[13px] font-semibold text-foreground">Geist Mono</p>
                <p className="text-[12.5px] text-muted">Labels + eyebrows. Uppercase, wide tracking.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="font-hand text-4xl text-foreground">Aa</p>
                <p className="mt-3 text-[13px] font-semibold text-foreground">Caveat</p>
                <p className="text-[12.5px] text-muted">Hand accents. The editor&apos;s pen marks and notes.</p>
              </div>
            </div>
          </section>

          {/* Voice */}
          <section className="mt-16">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">05 · Voice</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground">
              Direct, plain, opinionated. Short sentences, real words, first person. No
              corporate jargon, no em-dash rhythm, no AI tells. We practice what the
              skills preach: if it reads like AI wrote it, cut it.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
