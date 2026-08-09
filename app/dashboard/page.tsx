"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  CircleAlert,
  FileCheck2,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import ProgressBar from "@/components/portal/ProgressBar";
import GlowCard from "@/components/ui/GlowCard";
import {
  formatDayMonth,
  timeAgo,
  DELIVERABLE_STATUS,
  INVOICE_STATUS,
  metaFor,
} from "@/lib/portal-format";
import type { WorkspaceData, ProjectSummary, MilestoneItem, DeliverableItem } from "@/lib/portal-types";
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
/*  Overall completion                                                 */
/* ------------------------------------------------------------------ */

function overallProgress(projects: ProjectSummary[]): number {
  if (projects.length === 0) return 0;
  const totalValue = projects.reduce((a, p) => a + (p.value || 0), 0);
  if (totalValue > 0) {
    return Math.round(
      projects.reduce((a, p) => a + p.progress * (p.value || 0), 0) / totalValue
    );
  }
  return Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length);
}

/* ------------------------------------------------------------------ */
/*  Animated progress hero                                             */
/* ------------------------------------------------------------------ */

function ProgressHero({ data }: { data: WorkspaceData }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  const overall = overallProgress(data.projects);
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - overall / 100);
  const active = data.activeProject;

  return (
    <Reveal>
      <GlowCard className="relative overflow-hidden bg-surface p-7 md:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -top-24 h-44 rotate-6 bg-gradient-to-b from-accent/[0.10] to-transparent"
        />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Ring */}
          <div className="flex items-center gap-6">
            <div className="relative h-36 w-36 shrink-0">
              <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#E63946"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={mounted ? dashOffset : circumference}
                  style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-bold text-foreground">
                  {overall}
                  <span className="text-accent">%</span>
                </span>
                <span className="mt-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>
            </div>

            <div className="max-w-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Overall project progress
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tightest text-foreground md:text-3xl">
                {active ? active.name : "No active project"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {active
                  ? "Here&apos;s exactly where your project stands — updated as the team ships."
                  : "When FOR1S starts your build it will show up here."}
              </p>
            </div>
          </div>

          {/* Per-project bars */}
          <div className="w-full max-w-md space-y-4">
            {data.projects.length === 0 && (
              <p className="text-sm text-muted">No projects yet.</p>
            )}
            {data.projects.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.slug}`}
                data-cursor="hover"
                className="group block"
              >
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground/85">{p.name}</span>
                  <span className="font-mono text-xs text-muted">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} className="h-1.5" />
              </Link>
            ))}
          </div>
        </div>
      </GlowCard>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Milestone timeline                                                 */
/* ------------------------------------------------------------------ */

function MilestoneTimeline({ milestones }: { milestones: MilestoneItem[] }) {
  if (milestones.length === 0) {
    return (
      <p className="text-sm text-muted">Milestones appear here once the project kicks off.</p>
    );
  }

  return (
    <ol className="relative space-y-6 border-l border-hairline pl-6">
      {milestones.map((m) => {
        const done = m.status === "completed";
        const inProgress = m.status === "in-progress";
        return (
          <li key={m.id} className="relative">
            <span
              className={cn(
                "absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border",
                done
                  ? "border-emerald-500/50 bg-emerald-500/20"
                  : inProgress
                    ? "border-accent/50 bg-accent/20"
                    : "border-hairline bg-background"
              )}
            >
              {done && <Check size={10} className="text-emerald-400" />}
              {inProgress && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              )}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-medium",
                    done ? "text-foreground/55" : "text-foreground"
                  )}
                >
                  {m.title}
                </p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {done
                    ? `done ${formatDayMonth(m.completedAt)}`
                    : inProgress
                      ? "in progress"
                      : `due ${formatDayMonth(m.dueDate)}`}
                </span>
              </div>
              {m.description && (
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{m.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/*  Deliverable checklist                                              */
/* ------------------------------------------------------------------ */

function DeliverableChecklist({ deliverables }: { deliverables: DeliverableItem[] }) {
  if (deliverables.length === 0) {
    return <p className="text-sm text-muted">Deliverables appear here as they&apos;re built.</p>;
  }

  return (
    <ul className="space-y-2.5">
      {deliverables.map((d) => {
        const done = ["approved", "delivered"].includes(d.status);
        const review = d.status === "in-review" || d.status === "changes-requested";
        return (
          <li key={d.id}>
            <Link
              href={`/dashboard/deliverables/${d.id}`}
              data-cursor="hover"
              className="flex items-center gap-3 rounded-xl border border-hairline bg-background/40 px-4 py-3 transition-colors hover:border-accent/40"
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  done
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                    : review
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-hairline text-transparent"
                )}
              >
                <Check size={11} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm", done ? "text-foreground/55" : "text-foreground")}>
                  {d.title}
                </p>
              </div>
              <Badge meta={metaFor(DELIVERABLE_STATUS, d.status)} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Deliverables-by-status bar chart (SVG)                             */
/* ------------------------------------------------------------------ */

const STATUS_ORDER = ["draft", "in-review", "changes-requested", "approved", "delivered"];
const STATUS_COLORS: Record<string, string> = {
  draft: "#6b6b6b",
  "in-review": "#3b82f6",
  "changes-requested": "#f59e0b",
  approved: "#10b981",
  delivered: "#10b981",
};

function DeliverableBars({ deliverables }: { deliverables: DeliverableItem[] }) {
  const counts = STATUS_ORDER.map((s) => ({
    status: s,
    count: deliverables.filter((d) => d.status === s).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="space-y-3">
      {counts.map((c) => (
        <div key={c.status} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs capitalize text-muted">
            {metaFor(DELIVERABLE_STATUS, c.status).label}
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-out"
              style={{
                width: `${(c.count / max) * 100}%`,
                backgroundColor: STATUS_COLORS[c.status] ?? "#6b6b6b",
              }}
            />
          </div>
          <span className="w-5 shrink-0 text-right font-mono text-xs text-foreground/70">
            {c.count}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress-over-time area chart (SVG)                                */
/* ------------------------------------------------------------------ */

function ProgressArea({
  milestones,
  current,
}: {
  milestones: MilestoneItem[];
  current: number;
}) {
  const done = milestones
    .filter((m) => m.status === "completed" && m.completedAt)
    .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());

  // Build cumulative completion points: each completed milestone raises the
  // completion by an equal share; the final point is the live progress.
  const total = Math.max(milestones.length, 1);
  const points: { x: number; y: number }[] = done.map((m, i) => ({
    x: ((i + 1) / total) * 100,
    y: Math.round(((i + 1) / total) * 100),
  }));
  points.push({ x: 100, y: Math.max(current, points.at(-1)?.y ?? 0) });

  const W = 300;
  const H = 96;
  const pad = 4;
  const toX = (x: number) => pad + (x / 100) * (W - pad * 2);
  const toY = (y: number) => H - pad - (y / 100) * (H - pad * 2);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.x).toFixed(1)},${toY(p.y).toFixed(1)}`).join(" ");
  const area = `${line} L${toX(100).toFixed(1)},${H - pad} L${toX(0).toFixed(1)},${H - pad} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full" role="img" aria-label="Completion over time">
        <defs>
          <linearGradient id="progressAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E63946" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E63946" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#progressAreaFill)" />
        <path
          d={line}
          fill="none"
          stroke="#E63946"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
        <span>Start</span>
        <span>{current}% now</span>
      </div>
    </div>
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
        <p className="px-6 py-6 text-sm text-muted">Nothing waiting on you right now. 🎉</p>
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
                <p className="truncate font-medium text-foreground">{d.title}</p>
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
                  {inv.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
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
/*  Upcoming + activity                                                */
/* ------------------------------------------------------------------ */

function Upcoming({ items }: { items: WorkspaceData["upcoming"] }) {
  return (
    <GlowCard className="bg-background/60">
      <div className="px-6 pt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-foreground">Upcoming</p>
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

const ACTIVITY_ICON: Record<string, { char: string; cls: string }> = {
  approval: { char: "✓", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  payment: { char: "$", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  upload: { char: "↑", cls: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  comment: { char: "↳", cls: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  delivery: { char: "→", cls: "border-accent/40 bg-accent/10 text-accent" },
};

function Activity({ items }: { items: WorkspaceData["activity"] }) {
  return (
    <GlowCard className="bg-background/60">
      <div className="px-6 pt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-foreground">Recent activity</p>
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
              <span className="ml-auto shrink-0 pl-3 text-xs text-muted">{timeAgo(a.createdAt)}</span>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal");

  if (isLoading) return null;

  const firstName = data?.user?.name?.split(" ")[0] ?? "there";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "2-digit",
  });
  const active = data?.activeProject ?? null;
  const milestones = active?.milestones ?? [];
  const deliverables = active?.deliverables ?? [];

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              {today.toUpperCase()}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tightest text-foreground md:text-5xl">
              {greetingForNow()}, {firstName}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Live progress on everything we&apos;re building for you.
            </p>
          </div>
          <Link
            href={active ? `/dashboard/projects/${active.slug}` : "/dashboard/projects"}
            data-cursor="hover"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm text-foreground/80 transition-colors hover:border-accent/50 hover:text-accent"
          >
            View project
            <ArrowUpRight size={15} />
          </Link>
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
          <ProgressHero data={data} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Left column — milestones + checklist */}
            <div className="space-y-6">
              <Reveal delay={0.05}>
                <GlowCard className="bg-background/60">
                  <div className="flex items-center gap-2 px-6 pt-6">
                    <CalendarClock size={16} className="text-accent" />
                    <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                      Milestones
                    </p>
                  </div>
                  <div className="px-6 pb-6 pt-5">
                    <MilestoneTimeline milestones={milestones} />
                  </div>
                </GlowCard>
              </Reveal>

              <Reveal delay={0.1}>
                <GlowCard className="bg-background/60">
                  <div className="flex items-center gap-2 px-6 pt-6">
                    <FileCheck2 size={16} className="text-accent" />
                    <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                      Deliverables
                    </p>
                  </div>
                  <div className="px-6 pb-6 pt-5">
                    <DeliverableChecklist deliverables={deliverables} />
                  </div>
                </GlowCard>
              </Reveal>
            </div>

            {/* Right column — charts + attention */}
            <div className="space-y-6">
              <Reveal delay={0.15}>
                <GlowCard className="bg-background/60">
                  <div className="flex items-center gap-2 px-6 pt-6">
                    <Sparkles size={16} className="text-accent" />
                    <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                      Deliverables by status
                    </p>
                  </div>
                  <div className="px-6 pb-6 pt-5">
                    <DeliverableBars deliverables={deliverables} />
                  </div>
                </GlowCard>
              </Reveal>

              <Reveal delay={0.2}>
                <GlowCard className="bg-background/60">
                  <div className="flex items-center gap-2 px-6 pt-6">
                    <TrendingUp size={16} className="text-accent" />
                    <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                      Completion over time
                    </p>
                  </div>
                  <div className="px-6 pb-6 pt-4">
                    <ProgressArea milestones={milestones} current={active?.progress ?? 0} />
                  </div>
                </GlowCard>
              </Reveal>

              <Reveal delay={0.25}>
                <NeedsAttention data={data} />
              </Reveal>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Reveal delay={0.1}>
              <Upcoming items={data.upcoming} />
            </Reveal>
            <Reveal delay={0.15}>
              <Activity items={data.activity} />
            </Reveal>
          </div>
        </>
      )}
    </div>
  );
}
