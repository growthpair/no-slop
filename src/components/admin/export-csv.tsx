"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, RotateCcw } from "lucide-react";

export type ExportRow = {
  name: string;
  email: string;
  source: string;
  createdAt: string; // ISO
};

// Per-browser marker of the last export, so "Export new" only pulls signups
// since then. ISO timestamps compare correctly as strings.
const KEY = "deleteslop_last_export";

function toCsv(rows: ExportRow[]): string {
  const header = ["name", "email", "source", "signed_up"];
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const body = rows
    .map((r) => [r.name, r.email, r.source, r.createdAt].map(esc).join(","))
    .join("\n");
  return `${header.join(",")}\n${body}`;
}

function download(rows: ExportRow[], filename: string) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportCsv({ rows }: { rows: ExportRow[] }) {
  const [lastExport, setLastExport] = useState<string | null>(null);
  const [flash, setFlash] = useState("");

  useEffect(() => setLastExport(localStorage.getItem(KEY)), []);

  const newRows = useMemo(
    () => (lastExport ? rows.filter((r) => r.createdAt > lastExport) : rows),
    [rows, lastExport]
  );

  const mark = () => {
    const now = new Date().toISOString();
    localStorage.setItem(KEY, now);
    setLastExport(now);
  };
  const ping = (m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 2500);
  };

  const exportAll = () => {
    download(rows, `deleteslop-emails-all-${rows.length}.csv`);
    mark();
    ping(`Exported all ${rows.length}`);
  };
  const exportNew = () => {
    if (!newRows.length) return;
    download(newRows, `deleteslop-emails-new-${newRows.length}.csv`);
    mark();
    ping(`Exported ${newRows.length} new`);
  };
  const reset = () => {
    localStorage.removeItem(KEY);
    setLastExport(null);
    ping("Reset — everything counts as new");
  };

  const base =
    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors";

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={exportAll}
          className={`${base} bg-accent text-accent-contrast hover:bg-accent-hover`}
        >
          <Download size={13} /> Export all ({rows.length})
        </button>
        <button
          onClick={exportNew}
          disabled={newRows.length === 0}
          className={`${base} border ${
            newRows.length === 0
              ? "cursor-not-allowed border-border text-muted-2 opacity-60"
              : "border-border text-muted hover:border-border-strong hover:text-foreground"
          }`}
        >
          <Download size={13} /> Export new ({newRows.length})
        </button>
      </div>
      <div className="flex items-center gap-3">
        <p className="font-mono text-[10px] text-muted-2">
          {flash ||
            (lastExport
              ? `Last export: ${new Date(lastExport).toLocaleString()}`
              : "Never exported")}
        </p>
        {lastExport && !flash && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-2 transition-colors hover:text-foreground"
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
