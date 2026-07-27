import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Users, TrendingUp, Sparkles, CalendarDays } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { ExportCsv, type ExportRow } from "@/components/admin/export-csv";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · DeleteSlop",
  robots: { index: false, follow: false },
};

const DAY_MS = 24 * 60 * 60 * 1000;
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");
  if (!isAdmin(session)) notFound();

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, image: true, source: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date();
  const total = users.length;

  // ---- KPIs -------------------------------------------------------------
  const since = (days: number) => new Date(now.getTime() - days * DAY_MS);
  const d7 = since(7);
  const d14 = since(14);
  const d30 = since(30);
  const todayKey = dayKey(now);

  const newToday = users.filter((u) => dayKey(u.createdAt) === todayKey).length;
  const last7 = users.filter((u) => u.createdAt >= d7).length;
  const prev7 = users.filter((u) => u.createdAt >= d14 && u.createdAt < d7).length;
  const last30 = users.filter((u) => u.createdAt >= d30).length;
  const growthPct =
    prev7 === 0 ? (last7 > 0 ? 100 : 0) : Math.round(((last7 - prev7) / prev7) * 100);

  // ---- Daily buckets for the last 30 days -------------------------------
  const days: { key: string; label: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * DAY_MS);
    days.push({
      key: dayKey(d),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: 0,
    });
  }
  const dayIndex = new Map(days.map((d, i) => [d.key, i]));
  for (const u of users) {
    const idx = dayIndex.get(dayKey(u.createdAt));
    if (idx !== undefined) days[idx].count++;
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  // ---- Cumulative series (full history) ---------------------------------
  const firstDay = users.length ? users[0].createdAt : now;
  const spanDays = Math.max(1, Math.round((now.getTime() - firstDay.getTime()) / DAY_MS) + 1);
  const cumPoints: { total: number }[] = [];
  {
    let running = 0;
    let cursorIdx = 0;
    const sorted = users; // already asc
    for (let i = 0; i < Math.min(spanDays, 120); i++) {
      const day = dayKey(new Date(firstDay.getTime() + i * DAY_MS));
      while (cursorIdx < sorted.length && dayKey(sorted[cursorIdx].createdAt) <= day) {
        running++;
        cursorIdx++;
      }
      cumPoints.push({ total: running });
    }
    if (cumPoints.length) cumPoints[cumPoints.length - 1].total = total;
  }
  const cumMax = Math.max(1, ...cumPoints.map((p) => p.total));
  const n = cumPoints.length;
  const linePath = cumPoints
    .map((p, i) => {
      const x = n <= 1 ? 0 : (i / (n - 1)) * 100;
      const y = 40 - (p.total / cumMax) * 38;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const areaPath = n
    ? `${linePath} L100,40 L0,40 Z`
    : "";

  // ---- Table + export data ---------------------------------------------
  const recent = [...users].reverse(); // newest first
  const exportRows: ExportRow[] = recent.map((u) => ({
    name: u.name ?? "",
    email: u.email ?? "",
    source: u.source ?? "",
    createdAt: u.createdAt.toISOString(),
  }));

  const kpis = [
    { icon: Users, label: "Total users", value: total.toLocaleString() },
    { icon: Sparkles, label: "New today", value: newToday.toLocaleString() },
    { icon: CalendarDays, label: "Last 7 days", value: last7.toLocaleString() },
    {
      icon: TrendingUp,
      label: "vs prior 7 days",
      value: `${growthPct >= 0 ? "+" : ""}${growthPct}%`,
      sub: `${prev7} → ${last7}`,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2 text-accent-ink">Admin</p>
              <h1 className="display text-[clamp(2rem,5vw,3rem)] text-foreground">
                DeleteSlop users
              </h1>
              <p className="mt-2 text-[14px] text-muted">
                {total.toLocaleString()} signup{total === 1 ? "" : "s"} · {last30} in the last 30 days
              </p>
            </div>
            <ExportCsv rows={exportRows} />
          </div>

          {/* KPI tiles */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <k.icon size={17} className="text-accent-ink" />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
                  {k.label}
                </p>
                <p className="mt-1 text-[28px] font-bold leading-none tracking-tight text-foreground">
                  {k.value}
                </p>
                {k.sub && <p className="mt-1.5 font-mono text-[11px] text-muted">{k.sub}</p>}
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {/* Daily signups */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  Daily signups · 30 days
                </h2>
                <span className="font-mono text-[11px] text-muted-2">peak {maxDay}/day</span>
              </div>
              {total === 0 ? (
                <EmptyChart />
              ) : (
                <div className="flex h-40 items-end gap-[3px]">
                  {days.map((d) => (
                    <div
                      key={d.key}
                      title={`${d.label}: ${d.count}`}
                      className="group relative flex-1"
                      style={{ height: "100%" }}
                    >
                      <div className="absolute inset-x-0 bottom-0 rounded-sm bg-border" style={{ height: "2px" }} />
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-sm bg-accent transition-colors group-hover:bg-accent-hover"
                        style={{ height: `${(d.count / maxDay) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-2">
                <span>{days[0]?.label}</span>
                <span>{days[days.length - 1]?.label}</span>
              </div>
            </div>

            {/* Cumulative growth */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  Total users · all time
                </h2>
                <span className="font-mono text-[11px] text-muted-2">{total} total</span>
              </div>
              {total === 0 ? (
                <EmptyChart />
              ) : (
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-40 w-full overflow-visible">
                  <defs>
                    <linearGradient id="cum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#cum)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="var(--accent-ink)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* User table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
                All users
              </h2>
              <span className="font-mono text-[11px] text-muted-2">{total}</span>
            </div>
            {total === 0 ? (
              <p className="px-5 py-10 text-center text-[14px] text-muted">
                No signups yet. Share the site to get your first users.
              </p>
            ) : (
              <div className="max-h-[560px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-surface-2">
                    <tr className="font-mono text-[10px] uppercase tracking-widest text-muted-2">
                      <th className="px-5 py-2.5 font-medium">User</th>
                      <th className="px-5 py-2.5 font-medium">Source</th>
                      <th className="px-5 py-2.5 font-medium text-right">Signed up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((u) => {
                      const initial = (u.name ?? u.email ?? "?").trim().charAt(0).toUpperCase();
                      return (
                        <tr key={u.id} className="border-t border-border">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-[13px] font-semibold text-accent-ink">
                                {initial}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-[13.5px] font-medium text-foreground">
                                  {u.name ?? "—"}
                                </p>
                                <p className="truncate font-mono text-[12px] text-muted">
                                  {u.email ?? "—"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="font-mono text-[12px] text-muted">
                              {u.source ?? "direct"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-[12px] text-muted">
                            {fmtDate(u.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
      <p className="text-[13px] text-muted-2">No data yet</p>
    </div>
  );
}
