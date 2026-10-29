"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, CircleDollarSign, Clock3, FolderKanban, Loader2, MoveUpRight, Rocket } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import AdminProjectUploads from "@/components/admin/AdminProjectUploads";
import AdminUploadNotifications from "@/components/admin/AdminUploadNotifications";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import Reveal from "@/components/portal/Reveal";
import { formatMoney, metaFor, PROJECT_STATUS } from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default function AdminProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { isLoading: authLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin");
  const project = data?.projects.find((item) => item.id === params.id);

  if (authLoading || (loading && !data)) {
    return <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 text-muted"><Loader2 size={26} className="animate-spin text-accent" /><p className="text-sm">Opening project workspace…</p></div>;
  }

  if (error && !data) {
    return <div className="rounded-2xl border border-hairline bg-background/60 p-8 text-center"><p className="text-sm text-red-300">{error}</p><button onClick={reload} className="mt-4 rounded-full border border-hairline px-4 py-2 text-xs hover:border-accent/40">Try again</button></div>;
  }

  if (!project) {
    return <div className="py-12 text-center"><FolderKanban size={30} className="mx-auto text-muted" /><h1 className="mt-4 text-xl font-semibold text-foreground">Project not found</h1><p className="mt-2 text-sm text-muted">This project may have been removed or you may not have access.</p><Link href="/admin/projects" className="mt-5 inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm hover:border-accent/40"><ArrowLeft size={14} /> Back to projects</Link></div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-foreground"><ArrowLeft size={14} /> All projects</Link>
      <PageHeader eyebrow="Project workspace" title={project.name} sub={`Managed for ${project.client.name} · ${project.client.email}`} />
      <AdminUploadNotifications />

      <Reveal>
        <section className="relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-accent/[0.10] via-background/70 to-background/50 p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-accent/[0.08] blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Project overview</p>
              <div className="mt-3 flex flex-wrap items-center gap-3"><Badge meta={metaFor(PROJECT_STATUS, project.status)} /></div>
              <div className="mt-5 flex items-end gap-3"><span className="text-4xl font-semibold tracking-tight text-foreground">{project.progress}%</span><span className="pb-1 text-xs text-muted">complete</span></div>
              <div className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }} /></div>
            </div>
            <div className="grid w-full gap-3 sm:w-auto sm:min-w-[320px] sm:grid-cols-2">
              <div className="rounded-xl border border-hairline bg-background/55 p-4"><CircleDollarSign size={16} className="text-accent" /><p className="mt-3 text-[10px] uppercase tracking-widest text-muted">Project value</p><p className="mt-1 text-lg font-semibold text-foreground">{project.value == null ? "Not set" : formatMoney(project.value)}</p></div>
              <div className="rounded-xl border border-hairline bg-background/55 p-4"><CheckCircle2 size={16} className="text-accent" /><p className="mt-3 text-[10px] uppercase tracking-widest text-muted">Deliverables</p><p className="mt-1 text-lg font-semibold text-foreground">{project.approvedCount}<span className="text-sm font-normal text-muted"> / {project.deliverablesCount} approved</span></p></div>
            </div>
          </div>
          <div className="relative mt-6 grid gap-3 border-t border-hairline/70 pt-5 sm:grid-cols-2">
            <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-background/60 text-muted"><CalendarDays size={15} /></span><div><p className="text-[10px] uppercase tracking-widest text-muted">Next deadline</p><p className="mt-1 text-sm text-foreground">{formatDate(project.nextDeadline)}</p></div></div>
            <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-background/60 text-muted"><Clock3 size={15} /></span><div><p className="text-[10px] uppercase tracking-widest text-muted">Target end date</p><p className="mt-1 text-sm text-foreground">{formatDate(project.endsAt)}</p></div></div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.08}>
        <section className="overflow-hidden rounded-2xl border border-hairline bg-background/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4 sm:px-6">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Asset room</p><h2 className="mt-1 text-lg font-semibold text-foreground">Client uploads</h2><p className="mt-1 text-xs text-muted">Images submitted by {project.client.name}, stored privately in R2.</p></div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/[0.025] px-3 py-1.5 text-[10px] text-muted"><Rocket size={12} className="text-accent" /> Private storage <MoveUpRight size={11} /></span>
          </div>
          <div className="p-3 sm:p-5"><AdminProjectUploads projectId={project.id} projectName={project.name} /></div>
        </section>
      </Reveal>
    </div>
  );
}
