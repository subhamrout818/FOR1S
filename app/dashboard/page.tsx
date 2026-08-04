"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, CircleAlert, FileCheck2, Loader2, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import ProgressBar from "@/components/portal/ProgressBar";
import GlowCard from "@/components/ui/GlowCard";
import {
  formatINR,
  formatDayMonth,
  formatDate,
  timeAgo,
  DELIVERABLE_STATUS,
  INVOICE_STATUS,
  metaFor,
} from "@/lib/portal-format";
import type { WorkspaceData } from "@/lib/portal-types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Greeting + date                                                    */
/* ------------------------------------------------------------------ */

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ------------------------------------------------------------------ */
/*  Stat strip                                                         */
/* ------------------------------------------------------------------ */

function StatStrip({ data }: { data: WorkspaceData }) {
  const activeHref = data.activeProject
    ? `/dashboard/projects/${data.activeProject.slug}`
    : "/dashboard/projects";

  const items = [
    {
      label: "Active projects",
      value: String(
        data.projects.filter((p) => p.status === "active").length || data.projects.length
      ),
      sub: `${data.projects.length} total`,
      icon: FileCheck2,
      accent: "border-l-accent",
      glow: "rgba(230,57,70,0.15)",
      href: "/dashboard/projects",
    },
    {
      label: "Next deadline",
      value: formatDayMonth(data.activeProject?.nextDeadline),
      sub: data.activeProject
        ? `${data.activeProject.name} · ${formatDayMonth(data.activeProject.nextDeadline)}`
        : "No deadlines yet",
      icon: CalendarClock,
      accent: "border-l-blue-500",
      glow: "rgba(59,130,246,0.15)",
      href: activeHref,
    },
    {
      label: "Outstanding",
      value: formatINR(data.billing.remaining),
      sub: `${formatINR(data.billing.paid)} paid of ${formatINR(data.billing.totalValue)}`,
      icon: Wallet,
      accent: "border-l-emerald-500",
      glow: "rgba(16,185,129,0.15)",
      href: "/dashboard/billing",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.label} delay={i * 0.05}>
          <GlowCard
            href={item.href}
            className={cn("h-full bg-background/60 border-l-4 p-5", item.accent)}
            style={{ boxShadow: `0 0 40px ${item.glow}` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
                  {item.label}
                </p>
                <p className="mt-1.5 font-display text-2xl font-semibold text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 truncate text-xs text-muted">{item.sub}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                <item.icon size={18} strokeWidth={1.5} className="text-foreground/70" />
              </div>
            </div>
          </GlowCard>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Active project card                                                */
/* ------------------------------------------------------------------ */

function ActiveProjectCard({ project }: { project: WorkspaceData["activeProject"] }) {
  if (!project) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
        <p className="font-display text-lg text-foreground">No active project</p>
        <p className="mt-1 text-sm text-muted">
          When FOR1S starts your build it will show up here.
        </p>
      </div>
    );
  }

  return (
    <GlowCard
      href={`/dashboard/projects/${project.slug}`}
      className="border-accent/30 bg-surface p-6 md:p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -top-20 h-32 rotate-6 bg-gradient-to-b from-white/[0.07] to-transparent"
      />
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
            Active project
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tightest text-foreground md:text-3xl">
            {project.name}
          </h2>
          {project.tagline && (
            <p className="mt-1 text-sm text-muted">{project.tagline}</p>
          )}
        </div>
        <Badge meta={metaFor(PROJECT_STATUS_LABELS, project.status)} />
      </div>

      <div className="relative z-10 mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{project.progress}%</span>
          <span className="font-mono text-xs text-muted">
            {project.stats.done} / {project.stats.total} deliverables
          </span>
        </div>
        <ProgressBar value={project.progress} className="mt-2 h-2" />
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Next delivery
          </p>
          <p className="mt-0.5 font-display text-lg font-semibold text-foreground">
            {formatDate(project.nextDeadline)}
          </p>
        </div>
        <span
          data-cursor="hover"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          View project
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </GlowCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Needs attention                                                    */
/* ------------------------------------------------------------------ */

function NeedsAttention({ data }: { data: WorkspaceData }) {
  const { reviews, outstanding } = data.needsAttention;

  return (
    <GlowCard className="bg-background/60">
      <div className="flex items-center gap-2 px-6 pt-6">
        <CircleAlert size={16} className="text-accent" />
        <p className="text-xs font-medium uppercase tracking-widest text-foreground">
          Needs your attention
        </p>
      </div>

      {reviews.length === 0 && outstanding.length === 0 ? (
        <p className="px-6 py-6 text-sm text-muted">
          Nothing waiting on you right now. 🎉
        </p>
      ) : (
        <div className="divide-y divide-hairline/60">
          {reviews.map((d) => (
            <Link
              key={d.id}
              href={`/dashboard/deliverables/${d.id}`}
              data-cursor="hover"
              className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {d.title}
                </p>
                <p className="truncate text-xs text-muted">
                  {d.project?.name} · v{d.version}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge meta={metaFor(DELIVERABLE_STATUS, d.status)} />
                <ArrowRight size={14} className="text-muted transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
          {outstanding.map((inv) => (
            <Link
              key={inv.id}
              href="/dashboard/billing"
              data-cursor="hover"
              className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{inv.number}</p>
                <p className="truncate text-xs text-muted">{inv.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-display text-sm font-semibold text-foreground">
                  {formatINR(inv.amount)}
                </span>
                <Badge meta={metaFor(INVOICE_STATUS, inv.status)} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </GlowCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Upcoming                                                           */
/* ------------------------------------------------------------------ */

function Upcoming({ items }: { items: WorkspaceData["upcoming"] }) {
  return (
    <GlowCard className="bg-background/60">
      <div className="px-6 pt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-foreground">
          Upcoming
        </p>
      </div>
      {items.length === 0 ? (
        <p className="px-6 py-6 text-sm text-muted">Nothing scheduled yet.</p>
      ) : (
        <div className="divide-y divide-hairline/60">
          {items.map((item) => (
            <Link
              key={item.href + item.title}
              href={item.href}
              data-cursor="hover"
              className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
            >
              <span className="w-14 shrink-0 font-mono text-xs uppercase tracking-widest text-muted">
                {formatDayMonth(item.date)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{item.title}</p>
                <p className="truncate text-xs text-muted">{item.project}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </GlowCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent activity                                                    */
/* ------------------------------------------------------------------ */

const ACTIVITY_ICON: Record<string, { char: string; cls: string }> = {
  approval: { char: "✓", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  payment: { char: "₹", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  upload: { char: "↑", cls: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  comment: { char: "↳", cls: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  delivery: { char: "→", cls: "border-accent/40 bg-accent/10 text-accent" },
};

function Activity({ items }: { items: WorkspaceData["activity"] }) {
  return (
    <GlowCard className="bg-background/60">
      <div className="px-6 pt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-foreground">
          Recent activity
        </p>
      </div>
      <div className="divide-y divide-hairline/60">
        {items.map((a) => {
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
              </div>
              <span className="ml-auto shrink-0 pl-3 text-xs text-muted">
                {timeAgo(a.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}

/* Local project status labels (mirrors PROJECT_STATUS in portal-format) */
const PROJECT_STATUS_LABELS = {
  active: { label: "In progress", cls: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400" },
  paused: { label: "Paused", cls: "inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-400" },
  completed: { label: "Completed", cls: "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal", token);

  if (isLoading || !token) return null;

  const firstName = data?.user?.name?.split(" ")[0] ?? "there";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "2-digit",
  });

  return (
    <div>
      {/* Greeting */}
      <div className="mb-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              {today.toUpperCase()}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tightest text-foreground md:text-5xl">
              {greetingForNow()}, {firstName}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Your workspace — everything happening with your projects.
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading your workspace…</p>
        </div>
      )}

      {/* Error */}
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

      {/* Content */}
      {data && (
        <>
          <StatStrip data={data} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <Reveal>
                <ActiveProjectCard project={data.activeProject} />
              </Reveal>
              <Reveal delay={0.1}>
                <NeedsAttention data={data} />
              </Reveal>
            </div>

            <div className="space-y-6">
              <Reveal delay={0.15}>
                <Upcoming items={data.upcoming} />
              </Reveal>
              <Reveal delay={0.2}>
                <Activity items={data.activity} />
              </Reveal>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
