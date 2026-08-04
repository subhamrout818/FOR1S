"use client";

import Link from "next/link";
import { ArrowUpRight, FolderKanban, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import ProgressBar from "@/components/portal/ProgressBar";
import PageHeader from "@/components/portal/PageHeader";
import { formatINR, formatDate } from "@/lib/portal-format";
import type { WorkspaceData, ProjectSummary } from "@/lib/portal-types";

function ProjectCard({ project, index }: { project: ProjectSummary; index: number }) {
  return (
    <Reveal delay={index * 0.06} className="h-full">
      <Link
        href={`/dashboard/projects/${project.slug}`}
        data-cursor="hover"
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-background/60 p-6 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_30px_90px_-40px_rgba(230,57,70,0.35)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
              {project.status === "active" ? "In progress" : project.status}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-tightest text-foreground">
              {project.name}
            </h2>
          </div>
          <ArrowUpRight
            size={18}
            className="shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        </div>

        {project.tagline && (
          <p className="mt-1 text-sm text-muted">{project.tagline}</p>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{project.progress}% complete</span>
            <span className="font-mono text-xs text-muted">
              {project.stats.done}/{project.stats.total} deliverables
            </span>
          </div>
          <ProgressBar value={project.progress} className="mt-2" />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted">
              Next deadline
            </p>
            <p className="mt-0.5 font-medium text-foreground">
              {formatDate(project.nextDeadline)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted">
              Value
            </p>
            <p className="mt-0.5 font-display font-semibold text-foreground">
              {project.value ? formatINR(project.value) : "—"}
            </p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function ProjectsPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal", token);

  if (isLoading || !token) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Projects"
        title="Your projects"
        sub="Every engagement, its timeline, milestones and deliverables."
      />

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading projects…</p>
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

      {data && data.projects.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
          <FolderKanban size={28} className="text-muted" />
          <p className="font-display text-lg text-foreground">No projects yet</p>
          <p className="max-w-sm text-sm text-muted">
            Your first project will appear here once it&apos;s kicked off.
          </p>
        </div>
      )}

      {data && data.projects.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {data.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
