"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * The unlocked skill payload for signed-in users: the full setup block with a
 * copy-to-clipboard control. Rendered only when a session exists (server-
 * checked), so the full block never reaches logged-out clients. The block is a
 * paste-into-Claude prompt, so copy is the whole flow (no file download).
 */
export function SkillContent({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border-strong bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Skill setup · paste into Claude
        </span>
        <button
          onClick={copy}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-[560px] overflow-y-auto whitespace-pre-wrap break-words p-4 font-mono text-[12px] leading-relaxed text-foreground/90">
        {content}
      </pre>
    </div>
  );
}
