import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Caveat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});
const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["600", "700"],
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DeleteSlop: delete the AI tell in your writing and design",
  description:
    "Free Claude skills that scrub the AI tell out of your writing and marketing design. One paste installs a sharp editor and art director. Free with a Google account.",
  openGraph: {
    title: "DeleteSlop: delete the AI tell",
    description:
      "Free Claude skills that scrub the AI tell out of your writing and marketing design.",
    url: SITE_URL,
    siteName: "DeleteSlop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeleteSlop: delete the AI tell",
    description:
      "Free Claude skills that scrub the AI tell out of your writing and marketing design.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${caveat.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
