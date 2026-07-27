"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";

export type ExportRow = {
  name: string;
  email: string;
  source: string;
  createdAt: string; // ISO
};

/** Download the full user list as CSV, built client-side from server data. */
export function ExportCsv({ rows }: { rows: ExportRow[] }) {
  const [done, setDone] = useState(false);

  const download = () => {
    const header = ["name", "email", "source", "signed_up"];
    const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const body = rows
      .map((r) => [r.name, r.email, r.source, r.createdAt].map(esc).join(","))
      .join("\n");
    const csv = `${header.join(",")}\n${body}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deleteslop-users-${rows.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <button
      onClick={download}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted transition-colors hover:border-border-strong hover:text-foreground"
    >
      {done ? <Check size={13} /> : <Download size={13} />}
      {done ? "Exported" : "Export CSV"}
    </button>
  );
}
