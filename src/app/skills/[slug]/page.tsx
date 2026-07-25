import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getSkill } from "@/lib/skills";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SkillContent } from "@/components/skill-content";
import { SkillShowcase, hasShowcase } from "@/components/skill-showcase";
import { UnlockButton } from "@/components/unlock-button";

// Per-request render: the gate below reads the session, so this page must not be
// statically cached — otherwise a signed-in user would be served the locked HTML.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return { title: "Skill not found · DeleteSlop" };
  return {
    title: `${skill.name} · DeleteSlop`,
    description: skill.tagline,
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  // Server-side gate: the full `install` block is only fetched + rendered for
  // authenticated users, so it never ships in logged-out HTML.
  const session = await getServerSession(authOptions);

  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/skills"
            className="mb-10 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={13} /> All skills
          </Link>

          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-accent-ink">
            {skill.category} · {skill.tools.join(" · ")}
          </p>
          <h1 className="display text-[clamp(2.4rem,6vw,4rem)] text-foreground">
            {skill.name}
          </h1>
          <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-muted sm:text-base">
            {skill.summary}
          </p>

          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-2">
              Who it&apos;s for
            </p>
            <p className="text-[14px] leading-relaxed text-foreground/90">{skill.forWho}</p>
          </div>

          <div className="mt-8">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted">
              What you get
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {skill.whatYouGet.map((item) => (
                <li key={item} className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-4">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-accent/15">
                    <Check size={11} className="text-accent-ink" strokeWidth={3} />
                  </span>
                  <span className="text-[13px] leading-snug text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {hasShowcase(skill) && (
            <div className="mt-14">
              <SkillShowcase skill={skill} />
            </div>
          )}
        </div>

        {/* The skill block — gated */}
        <div className="mx-auto mt-14 max-w-3xl">
          {session ? (
            <SkillContent content={skill.install} downloadName={skill.downloadName} />
          ) : (
            <div className="relative">
              {/* Safe preview excerpt as the teaser */}
              <pre className="max-h-52 overflow-hidden whitespace-pre-wrap break-words rounded-lg border border-border bg-surface p-4 font-mono text-[12px] leading-relaxed text-muted [mask-image:linear-gradient(to_bottom,#000_40%,transparent)]">
                {skill.preview}
              </pre>
              <div className="mt-5 rounded-xl border border-border-strong bg-card p-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Lock size={20} className="text-accent-ink" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">Sign in to copy the full skill</h3>
                <p className="mx-auto mb-6 mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">
                  Free with a Google account. Unlocks the paste-ready block and
                  the .md download, and puts you on the newsletter.
                </p>
                <div className="flex justify-center">
                  <UnlockButton callbackPath={`/skills/${skill.slug}`} label="Unlock with Google" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
