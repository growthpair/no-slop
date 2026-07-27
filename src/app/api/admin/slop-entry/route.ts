import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

/** Admin-only takedown for a Slop Index submission. */
export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const id = (form.get("id") as string) || "";
  if (id) {
    try {
      await prisma.slopEntry.delete({ where: { id } });
    } catch {
      /* already gone */
    }
  }

  return NextResponse.redirect(`${origin}/admin`, { status: 303 });
}
