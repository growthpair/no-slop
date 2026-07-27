import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public submission to the Slop Index. Anyone can add a brand's marketing copy;
 * it auto-publishes. The score is computed at render from `copy`, so what's
 * shown is exactly what was scored (transparent + defensible). Abuse is handled
 * by admin takedown (/admin), not gating — per product decision.
 */
export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const back = (path: string) => NextResponse.redirect(`${origin}${path}`, { status: 303 });

  const form = await req.formData();

  // Honeypot: real users leave this empty; bots fill it.
  if ((form.get("website") as string)?.trim()) {
    return back("/slop-index?added=1");
  }

  const name = clean(form.get("name"), 80);
  const note = clean(form.get("note"), 40);
  const copy = clean(form.get("copy"), 1200);
  const sourceUrlRaw = clean(form.get("sourceUrl"), 300);
  const sourceUrl = /^https?:\/\//i.test(sourceUrlRaw) ? sourceUrlRaw : "";

  if (name.length < 1 || copy.trim().length < 20) {
    return back("/slop-index?error=1");
  }

  try {
    await prisma.slopEntry.create({
      data: { name, note: note || null, copy, sourceUrl: sourceUrl || null },
    });
  } catch {
    return back("/slop-index?error=2");
  }

  return back("/slop-index?added=1");
}

function clean(v: FormDataEntryValue | null, max: number): string {
  return (typeof v === "string" ? v : "").trim().slice(0, max);
}
