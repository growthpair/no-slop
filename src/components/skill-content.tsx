"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

/**
 * The unlocked skill payload for signed-in users: the full setup block with
 * copy-to-clipboard and download-as-.md controls. Rendered only when a session
 * exists (server-checked), so the full block never reaches logged-out clients.
 */
export function SkillContent({
  content,
  downloadName,
}: {
  content: string;
  downloadName: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — download still works */
    }
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border-strong bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Skill setup · paste into Claude
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={download}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Download size={13} /> .md
          </button>
        </div>
      </div>
      <pre className="max-h-[560px] overflow-y-auto whitespace-pre-wrap break-words p-4 font-mono text-[12px] leading-relaxed text-foreground/90">
        {content}
      </pre>
    </div>
  );
}
