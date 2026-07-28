import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Submission to the Slop Index. Signed-in users only. You give a URL; we scrape
 * the page's marketing copy AND its brand name (og:site_name / title / domain),
 * so the whole entry is auto-populated. Pasting copy is an optional fallback for
 * sites that block bots or render via JS. The score is computed at render from
 * `copy`, so what's shown is exactly what was scored (transparent + defensible).
 */
export async function POST(req: Request) {
  // Relative Location so the browser resolves against the public URL, not the
  // internal container origin (Railway proxies external requests to localhost).
  const back = (path: string) => new NextResponse(null, { status: 303, headers: { Location: path } });

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!session) return back("/login?callbackUrl=/slop-index");

  const form = await req.formData();

  // Honeypot: real users leave this empty; bots fill it.
  if ((form.get("website") as string)?.trim()) return back("/slop-index?added=1");

  const pasted = clean(form.get("copy"), 1200);
  const sourceUrlRaw = clean(form.get("sourceUrl"), 300);
  const sourceUrl = /^https?:\/\//i.test(sourceUrlRaw) ? sourceUrlRaw : "";
  if (!sourceUrl) return back("/slop-index?error=1");

  // Copy: pasted wins; otherwise scrape. Name: scraped site name, else domain.
  let copy = pasted;
  let name = "";
  if (copy.trim().length < 20) {
    const page = await scrapePage(sourceUrl);
    copy = page.copy;
    name = page.name;
    if (copy.trim().length < 20) return back("/slop-index?error=scrape");
  }
  if (!name) name = domainName(sourceUrl);
  if (!name) return back("/slop-index?error=1");

  try {
    await prisma.slopEntry.create({
      data: { name, note: null, copy, sourceUrl, userId: userId || null },
    });
  } catch {
    return back("/slop-index?error=2");
  }

  return back("/slop-index?added=1");
}

function clean(v: FormDataEntryValue | null, max: number): string {
  return (typeof v === "string" ? v : "").trim().slice(0, max);
}

/** Brand name from the domain: "https://www.notion.so/x" -> "Notion". */
function domainName(u: string): string {
  try {
    const label = new URL(u).hostname.replace(/^www\./, "").split(".")[0];
    return label ? label.charAt(0).toUpperCase() + label.slice(1) : "";
  } catch {
    return "";
  }
}

/** Block loopback / private / cloud-metadata hosts (basic SSRF guard). */
function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".internal") ||
    h === "metadata.google.internal" ||
    h === "0.0.0.0" ||
    h === "::1" ||
    /^127\./.test(h) ||
    /^10\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^169\.254\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h)
  );
}

/**
 * Fetch a page and pull its brand name + marketing-ish copy (title, meta/og/
 * twitter tags, hero-zone headings and paragraphs). Best-effort; returns empty
 * copy on any failure (bot block, JS-only page, timeout) so the caller can fall
 * back to pasted copy.
 */
async function scrapePage(url: string): Promise<{ copy: string; name: string }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { copy: "", name: "" };
  }
  if (!/^https?:$/.test(parsed.protocol) || isBlockedHost(parsed.hostname)) {
    return { copy: "", name: "" };
  }

  let html: string;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(parsed.toString(), {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; DeleteSlopBot/1.0; +https://deleteslop.com)",
        accept: "text/html",
      },
    });
    clearTimeout(timer);
    if (!res.ok || !/text\/html/i.test(res.headers.get("content-type") || "")) {
      return { copy: "", name: "" };
    }
    html = (await res.text()).slice(0, 500_000);
  } catch {
    return { copy: "", name: "" };
  }

  const strip = (s: string) =>
    s
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;|&rsquo;|&lsquo;|&apos;/gi, "'")
      .replace(/&quot;|&ldquo;|&rdquo;/gi, '"')
      .replace(/&mdash;/gi, "—")
      .replace(/&[a-z0-9#]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

  const meta = (key: string) => {
    const a = html.match(
      new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]+content=["']([^"']*)["']`, "i")
    );
    const b = html.match(
      new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${key}["']`, "i")
    );
    const m = a || b;
    return m ? strip(m[1]) : "";
  };

  const noHead = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  const bodyIdx = noHead.search(/<body[^>]*>/i);
  const start = bodyIdx >= 0 ? bodyIdx : 0;
  const zone = noHead.slice(start, start + 18000);

  const titleRaw = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleRaw ? strip(titleRaw[1]) : "";
  // Brand name: prefer og:site_name; else the first segment of <title>; else "".
  const name = meta("og:site_name") || title.split(/\s*[|\-–—·:]\s*/)[0].slice(0, 60);

  const parts: string[] = [];
  if (title) parts.push(title);
  for (const key of ["description", "og:title", "og:description", "twitter:description"]) {
    const v = meta(key);
    if (v) parts.push(v);
  }
  const h1 = zone.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) parts.push(strip(h1[1]));
  const paras = [...zone.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => strip(m[1]))
    .filter((p) => p.length > 55)
    .slice(0, 4);
  parts.push(...paras);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const k = p.toLowerCase();
    if (p && !seen.has(k)) {
      seen.add(k);
      out.push(p);
    }
    if (out.join(" ").length > 600) break;
  }
  return { copy: out.join(" ").slice(0, 700), name };
}
