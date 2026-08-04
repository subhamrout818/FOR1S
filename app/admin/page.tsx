"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  CircleAlert,
  Clock,
  FolderKanban,
  Loader2,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import GlowCard from "@/components/ui/GlowCard";
import {
  formatINR,
  formatDayMonth,
  timeAgo,
  metaFor,
  DELIVERABLE_STATUS,
  TICKET_STATUS,
  LEAD_STATUS,
} from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";
import { cn } from "@/lib/utils";

const ACTIVITY_ICON: Record<string, { char: string; cls: string }> = {
  approval: { char: "✓", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  payment: { char: "₹", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  upload: { char: "↑", cls: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  comment: { char: "↳", cls: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  delivery: { char: "→", cls: "border-accent/40 bg-accent/10 text-accent" },
};

export default function AdminOverviewPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin", token);

  if (isLoading || !token) return null;

  return (
    <div>
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          FOR1S STUDIO
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tightest text-foreground md:text-5xl">
          Overview
        </h1>
        <p className="mt-2 text-sm text-muted">
          Revenue, deadlines and everything that needs you today.
        </p>
      </div>

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading studio…</p>
        </div>
      )}

      {error && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center">
          <p className="text-sm text-red-300">{error}</p>
          <button
            data-cursor="hover"
            onClick={reload}
            className="text-xs uppercase tracking-widest text-foreground/70 underline underline-offset-2 hover:text-accent"
          >
            Retry
          </button>
        </div>
      )}

      {data && (
        <>
          {/* Metrics */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Revenue this month",
                value: formatINR(data.metrics.revenueThisMonth),
                sub: "Paid this calendar month",
                icon: Banknote,
                accent: "border-l-emerald-500",
                glow: "rgba(16,185,129,0.15)",
                href: "/admin/payments",
              },
              {
                label: "Outstanding",
                value: formatINR(data.metrics.outstanding),
                sub: "Open invoices",
                icon: Wallet,
                accent: "border-l-accent",
                glow: "rgba(230,57,70,0.15)",
                href: "/admin/payments",
              },
              {
                label: "Active clients",
                value: String(data.metrics.activeClients),
                sub: `${data.metrics.activeProjects} active projects`,
                icon: Users,
                accent: "border-l-blue-500",
                glow: "rgba(59,130,246,0.15)",
                href: "/admin/clients",
              },
              {
                label: "New leads",
                value: String(data.metrics.newLeads),
                sub: "This month",
                icon: CircleAlert,
                accent: "border-l-amber-500",
                glow: "rgba(245,158,11,0.15)",
                href: "/admin/leads",
              },
            ].map((m, i) => (
              <Reveal key={m.label} delay={i * 0.04}>
                <GlowCard
                  href={m.href}
                  className={cn("h-full bg-background/60 border-l-4 p-5", m.accent)}
                  style={{ boxShadow: `0 0 40px ${m.glow}` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
                        {m.label}
                      </p>
                      <p className="mt-1.5 font-display text-2xl font-semibold text-foreground">
                        {m.value}
                      </p>
                      <p className="mt-1 text-xs text-muted">{m.sub}</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      <m.icon size={18} strokeWidth={1.5} className="text-foreground/70" />
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>

          {/* Secondary row */}
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              {
                label: "Pending approvals",
                value: String(data.metrics.pendingApprovals),
                href: "/admin/deliverables",
              },
              {
                label: "Upcoming deadlines",
                value: String(data.metrics.upcomingDeadlines),
                href: "/admin/projects",
              },
              {
                label: "Total clients",
                value: String(data.metrics.totalClients),
                href: "/admin/clients",
              },
            ].map((c) => (
              <Reveal key={c.label} delay={0.1}>
                <GlowCard
                  href={c.href}
                  className="flex items-center justify-between bg-background/60 px-5 py-4"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted">{c.label}</p>
                    <p className="mt-1 font-display text-xl font-semibold text-foreground">{c.value}</p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </GlowCard>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Recent activity */}
            <Reveal delay={0.15} className="lg:col-span-2">
              <GlowCard className="bg-background/60">
                <div className="px-6 pt-6">
                  <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                    Recent activity
                  </p>
                </div>
                <div className="divide-y divide-hairline/60">
                  {data.recentActivity.map((a) => {
                    const meta = ACTIVITY_ICON[a.type] ?? {
                      char: "↳",
                      cls: "border-amber-500/30 bg-amber-500/10 text-amber-400",
                    };
                    return (
                      <div key={a.id} className="flex items-start gap-3 px-6 py-4">
                        <span
                          className={cn(
                            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                            meta.cls
                          )}
                        >
                          {meta.char}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                          {a.detail && <p className="truncate text-xs text-muted">{a.detail}</p>}
                          <p className="text-[11px] text-muted/70">
                            {a.project?.name ?? "Studio"} · {a.actor?.name ?? "—"}
                          </p>
                        </div>
                        <span className="ml-auto shrink-0 pl-3 text-xs text-muted">
                          {timeAgo(a.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlowCard>
            </Reveal>

            <div className="space-y-6">
              {/* Pending approvals */}
              <Reveal delay={0.2}>
                <GlowCard className="bg-background/60">
                  <div className="flex items-center justify-between px-6 pt-6">
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
                      <CircleAlert size={14} className="text-amber-400" /> Awaiting review
                    </p>
                  </div>
                  <div className="divide-y divide-hairline/60">
                    {data.deliverables
                      .filter((d) => ["in-review", "changes-requested"].includes(d.status))
                      .slice(0, 5)
                      .map((d) => (
                        <Link
                          key={d.id}
                          href="/admin/deliverables"
                          data-cursor="hover"
                          className="flex items-center justify-between gap-3 px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{d.title}</p>
                            <p className="truncate text-xs text-muted">{d.project.name}</p>
                          </div>
                          <Badge meta={metaFor(DELIVERABLE_STATUS, d.status)} />
                        </Link>
                      ))}
                  </div>
                </GlowCard>
              </Reveal>

              {/* Open tickets */}
              <Reveal delay={0.25}>
                <GlowCard className="bg-background/60">
                  <div className="flex items-center justify-between px-6 pt-6">
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
                      <Clock size={14} className="text-blue-400" /> Open tickets
                    </p>
                  </div>
                  <div className="divide-y divide-hairline/60">
                    {data.tickets
                      .filter((t) => t.status !== "closed")
                      .slice(0, 5)
                      .map((t) => (
                        <Link
                          key={t.id}
                          href="/admin/settings"
                          data-cursor="hover"
                          className="block px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium text-foreground">{t.subject}</p>
                            <Badge meta={metaFor(TICKET_STATUS, t.status)} />
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {t.user?.name} · {timeAgo(t.createdAt)}
                          </p>
                        </Link>
                      ))}
                  </div>
                </GlowCard>
              </Reveal>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
