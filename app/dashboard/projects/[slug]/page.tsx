"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import ProgressBar from "@/components/portal/ProgressBar";
import {
  formatINR,
  formatDate,
  metaFor,
  MILESTONE_STATUS,
  DELIVERABLE_STATUS,
  KIND_LABEL,
  FOLDER_KIND_LABEL,
  formatBytes,
} from "@/lib/portal-format";
import type { WorkspaceData } from "@/lib/portal-types";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { token, isLoading } = useAuth();
  const { data, loading, error } = usePortalData<WorkspaceData>("/api/portal", token);

  if (isLoading || !token) return null;

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <Loader2 size={28} className="animate-spin text-accent" />
        <p className="text-sm text-muted">Loading project…</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center text-sm text-red-300">
        {error}
      </div>
    );
  }

  const project = data?.projects.find((p) => p.slug === params.slug);

  if (!project) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-display text-xl text-foreground">Project not found</p>
        <Link
          href="/dashboard/projects"
          data-cursor="hover"
          className="text-sm text-muted underline underline-offset-2 hover:text-accent"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/projects"
        data-cursor="hover"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        All projects
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold uppercase tracking-tightest text-foreground md:text-4xl">
              {project.name}
            </h1>
            <Badge meta={metaFor(PROJECT_STATUS, project.status)} />
          </div>
          {project.tagline && <p className="mt-2 text-sm text-muted">{project.tagline}</p>}
          {project.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              {project.description}
            </p>
          )}
        </div>
        {project.value ? (
          <div className="rounded-2xl border border-hairline bg-background/60 px-6 py-4 text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted">Project value</p>
            <p className="mt-1 font-display text-2xl font-semibold text-foreground">
              {formatINR(project.value)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {formatINR(project.stats.totalPaid)} paid
            </p>
          </div>
        ) : null}
      </div>

      {/* Progress */}
      <Reveal className="mt-8">
        <div className="rounded-2xl border border-hairline bg-background/60 p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Overall progress</span>
            <span className="font-mono text-xs text-muted">
              {project.stats.done}/{project.stats.total} deliverables ·{" "}
              {project.stats.pendingReviews} awaiting review
            </span>
          </div>
          <ProgressBar value={project.progress} className="mt-3 h-2" />
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <span className="text-muted">
              Starts <span className="text-foreground">{formatDate(project.createdAt)}</span>
            </span>
            <span className="text-muted">
              Next deadline <span className="text-foreground">{formatDate(project.nextDeadline)}</span>
            </span>
            {project.endsAt && (
              <span className="text-muted">
                Target end <span className="text-foreground">{formatDate(project.endsAt)}</span>
              </span>
            )}
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Milestones */}
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
            <div className="px-6 pt-6">
              <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                Timeline &amp; milestones
              </p>
            </div>
            <div className="relative px-6 py-5">
              <div className="absolute bottom-8 left-[37px] top-8 w-px bg-hairline" />
              <div className="space-y-6">
                {project.milestones.map((m) => {
                  const done = m.status === "completed";
                  return (
                    <div key={m.id} className="relative flex items-start gap-4">
                      <span
                        className={cn(
                          "relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                          done
                            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                            : m.status === "in-progress"
                              ? "border-blue-500/50 bg-blue-500/15 text-blue-400"
                              : "border-hairline bg-background text-muted"
                        )}
                      >
                        {done ? "✓" : "•"}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p
                            className={cn(
                              "font-medium text-foreground",
                              done && "line-through decoration-muted/40"
                            )}
                          >
                            {m.title}
                          </p>
                          <Badge meta={metaFor(MILESTONE_STATUS, m.status)} />
                        </div>
                        {m.description && (
                          <p className="mt-1 text-sm text-muted">{m.description}</p>
                        )}
                        <p className="mt-1 font-mono text-xs text-muted">
                          {formatDate(m.dueDate)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="space-y-6">
          {/* Deliverables */}
          <Reveal delay={0.05}>
            <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
              <div className="flex items-center justify-between px-6 pt-6">
                <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                  Deliverables
                </p>
                <span className="font-mono text-xs text-muted">
                  {project.deliverables.length} total
                </span>
              </div>
              <div className="divide-y divide-hairline/60">
                {project.deliverables.map((d) => (
                  <Link
                    key={d.id}
                    href={`/dashboard/deliverables/${d.id}`}
                    data-cursor="hover"
                    className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{d.title}</p>
                      <p className="text-xs text-muted">
                        {KIND_LABEL[d.kind] ?? d.kind} · v{d.version}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge meta={metaFor(DELIVERABLE_STATUS, d.status)} />
                      <ArrowUpRight size={14} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Folders */}
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
              <div className="px-6 pt-6">
                <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                  Files
                </p>
              </div>
              <div className="divide-y divide-hairline/60">
                {project.folders.map((folder) => (
                  <div key={folder.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{folder.name}</p>
                      <span className="font-mono text-xs text-muted">
                        {folder.files.length} files
                      </span>
                    </div>
                    {folder.files.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {folder.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.url && file.url !== "#" ? file.url : undefined}
                            target={file.url && file.url !== "#" ? "_blank" : undefined}
                            rel="noreferrer"
                            data-cursor="hover"
                            className={cn(
                              "rounded-lg border border-hairline bg-white/[0.02] px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground",
                              (file.url === "#" || !file.url) && "pointer-events-none"
                            )}
                          >
                            {file.name} · {formatBytes(file.size)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

const PROJECT_STATUS = {
  active: { label: "In progress", cls: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400" },
  paused: { label: "Paused", cls: "inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-400" },
  completed: { label: "Completed", cls: "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted" },
};
