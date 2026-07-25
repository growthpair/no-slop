"use client";

import { useState } from "react";
import { FileText, Palette } from "lucide-react";
import { SlopChecker } from "./slop-checker";
import { DesignChecker } from "./design-checker";

type Tab = "copy" | "design";

/**
 * The interactive hook, tabbed: grade your copy (paste + auto-scan) or your
 * design (self-audit checklist). Both are the skills running once — the score
 * demonstrates the value, the CTA gives the permanent fix.
 */
export function Grade() {
  const [tab, setTab] = useState<Tab>("copy");

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-lg border border-border bg-surface p-1">
        <button
          onClick={() => setTab("copy")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors ${
            tab === "copy"
              ? "bg-accent text-accent-contrast"
              : "text-muted hover:text-foreground"
          }`}
        >
          <FileText size={13} /> Grade your copy
        </button>
        <button
          onClick={() => setTab("design")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors ${
            tab === "design"
              ? "bg-accent text-accent-contrast"
              : "text-muted hover:text-foreground"
          }`}
        >
          <Palette size={13} /> Grade your design
        </button>
      </div>

      {tab === "copy" ? <SlopChecker /> : <DesignChecker />}
    </div>
  );
}
