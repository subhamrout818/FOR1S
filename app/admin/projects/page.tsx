"use client";

import { Fragment, useCallback, useState } from "react";
import Link from "next/link";
import { Check, FolderKanban, Layers, Loader2, Plus, Rocket } from "lucide-react";
import AdminProjectUploads from "@/components/admin/AdminProjectUploads";
import AdminUploadNotifications from "@/components/admin/AdminUploadNotifications";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import StatCard from "@/components/portal/StatCard";
import Reveal from "@/components/portal/Reveal";
import { formatMoney, metaFor, PROJECT_STATUS } from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

type ProjectDraft = {
  progress?: number;
  status?: string;
  value?: string;
  nextDeadline?: string;
  endsAt?: string;
};

function dateInputValue(value: string | null | undefined) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function commercialPayload(draft: ProjectDraft) {
  return {
    ...draft,
    ...(draft.value !== undefined ? { value: draft.value.trim() === "" ? null : Number(draft.value) } : {}),
    ...(draft.nextDeadline !== undefined ? { nextDeadline: draft.nextDeadline || null } : {}),
    ...(draft.endsAt !== undefined ? { endsAt: draft.endsAt || null } : {}),
  };
}

const fieldClass =
  "w-full min-w-0 rounded-xl border border-hairline bg-background/70 px-3.5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10";

export default function AdminProjectsPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin");
  const [drafts, setDrafts] = useState<Record<string, ProjectDraft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newEndsAt, setNewEndsAt] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const setDraft = (id: string, patch: ProjectDraft) =>
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...patch } }));

  const save = useCallback(async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    setRowError(null);
    const res = await portalAction(`/api/admin/projects/${id}`, commercialPayload(draft));
    setSavingId(null);
    if (!res.ok) {
      setRowError({ id, message: res.message || "Couldn't save. Check the values and try again." });
      return;
    }
    setDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    reload();
  }, [drafts, reload]);

  const createProject = useCallback(async () => {
    setCreating(true);
    setCreateError("");
    const res = await portalAction("/api/admin/projects", {
      clientId: newClient,
      name: newName.trim(),
      ...(newValue.trim() ? { value: Number(newValue) } : {}),
      ...(newDeadline ? { nextDeadline: newDeadline } : {}),
      ...(newEndsAt ? { endsAt: newEndsAt } : {}),
    });
    setCreating(false);
    if (!res.ok) {
      setCreateError(res.message || "Couldn't create the project.");
      return;
    }
    setNewName("");
    setNewClient("");
    setNewValue("");
    setNewDeadline("");
    setNewEndsAt("");
    setShowNew(false);
    reload();
  }, [newClient, newName, newValue, newDeadline, newEndsAt, reload]);

  if (isLoading) return null;

  const clients = data?.clients ?? [];
  const projects = data?.projects ?? [];
  const active = projects.filter((p) => p.status === "active").length;
  const inDelivery = projects.filter((p) => ["active", "paused"].includes(p.status)).length;

  return (
    <div>
      <PageHeader eyebrow="Projects" title="All projects" sub="Manage project value, delivery dates, progress and status." />
      <AdminUploadNotifications />

      <div className="mb-8">
        {!showNew ? (
          <button data-cursor="hover" onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim">
            <Plus size={15} /> New project
          </button>
        ) : (
          <div className="rounded-2xl border border-hairline/80 bg-white/[0.025] p-6 shadow-[0_24px_80px_-56px_rgba(255,255,255,0.22)] sm:p-8">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground">New project</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <label className="text-xs text-muted">Client
                <select id="np-client" value={newClient} onChange={(e) => setNewClient(e.target.value)} className={fieldClass + " mt-1"}>
                  <option value="">Select a client…</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                </select>
              </label>
              <label className="text-xs text-muted">Project name
                <input id="np-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Project name" maxLength={120} className={fieldClass + " mt-1"} />
              </label>
              <label className="text-xs text-muted">Agreed project value (USD)
                <input type="number" min="0" max="9999999999" step="0.01" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="e.g. 2500" className={fieldClass + " mt-1"} />
              </label>
              <label className="text-xs text-muted">Next deadline
                <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className={fieldClass + " mt-1"} />
              </label>
              <label className="text-xs text-muted">Target end date
                <input type="date" value={newEndsAt} min={newDeadline || undefined} onChange={(e) => setNewEndsAt(e.target.value)} className={fieldClass + " mt-1"} />
              </label>
              <div className="flex items-end gap-2">
                <button data-cursor="hover" onClick={createProject} disabled={creating || !newClient || newName.trim().length < 2 || (newValue.trim() !== "" && (!Number.isFinite(Number(newValue)) || Number(newValue) < 0))} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50">
                  {creating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create
                </button>
                <button data-cursor="hover" onClick={() => { setShowNew(false); setCreateError(""); }} className="rounded-full border border-hairline px-4 py-2.5 text-sm text-muted hover:text-foreground">Cancel</button>
              </div>
            </div>
            {createError && <p className="mt-3 text-sm text-red-400">{createError}</p>}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total projects" value={projects.length} icon={<FolderKanban size={16} />} delay={0} />
        <StatCard label="Active" value={active} icon={<Rocket size={16} />} delay={0.06} />
        <StatCard label="In delivery" value={inDelivery} icon={<Layers size={16} />} accent delay={0.12} />
      </div>

      {loading && !data && <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4"><Loader2 size={28} className="animate-spin text-accent" /><p className="text-sm text-muted">Loading projects…</p></div>}
      {error && !data && <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center"><p className="text-sm text-red-300">{error}</p><button data-cursor="hover" onClick={reload} className="text-xs uppercase tracking-widest text-foreground/70 underline underline-offset-2 hover:text-accent">Retry</button></div>}
      {data && projects.length === 0 && <p className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted">No projects yet.</p>}

      {data && projects.length > 0 && (
        <Reveal delay={0.08}>
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-base font-semibold tracking-tight text-foreground">Your projects</h2><p className="mt-1 text-sm text-muted">Select a project to open its full workspace.</p></div>
              <span className="rounded-full border border-hairline px-3 py-1.5 text-xs text-muted">{projects.length} engagements</span>
            </div>
            <div className="grid gap-5">
              {projects.map((p) => {
                const draft = drafts[p.id] ?? {};
                const dirty = !!drafts[p.id] && Object.keys(draft).length > 0;
                const progress = draft.progress ?? p.progress;
                return <article key={p.id} className="overflow-hidden rounded-2xl border border-hairline/80 bg-white/[0.025] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.035]">
                  <div className="flex flex-col gap-5 border-b border-hairline/70 p-5 sm:p-7 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><Link href={`/admin/projects/${p.id}`} className="text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-accent">{p.name}<span className="ml-2 text-sm text-accent">↗</span></Link><Badge meta={metaFor(PROJECT_STATUS, p.status)} /></div><p className="mt-2 text-sm text-muted">{p.client.name}</p><Link href={`/admin/projects/${p.id}`} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-hairline px-4 py-2.5 text-xs font-medium text-foreground/80 transition-colors hover:border-accent/40 hover:text-foreground">Open project workspace <span aria-hidden="true">→</span></Link></div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:w-[48%]"><label className="text-xs text-muted">Status<select aria-label={`Status for ${p.name}`} value={draft.status ?? p.status} onChange={(e) => setDraft(p.id, { status: e.target.value })} className={fieldClass + " mt-2"}><option value="active">In progress</option><option value="paused">Paused</option><option value="completed">Completed</option></select></label><div><div className="flex items-center justify-between text-xs text-muted"><span>Progress</span><span className="font-mono text-foreground">{progress}%</span></div><input type="range" min={0} max={100} step={5} aria-label={`Progress for ${p.name}`} value={progress} onChange={(e) => setDraft(p.id, { progress: Number(e.target.value) })} className="mt-4 w-full accent-[#AA1515]" /><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} /></div></div></div>
                  </div>
                  <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4 sm:p-7">
                    <div className="rounded-xl border border-white/[0.05] bg-black/15 p-4 sm:p-5"><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Project value</p><p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{p.value ? formatMoney(p.value) : "Not set"}</p><label className="mt-5 block text-xs text-muted" htmlFor={`value-${p.id}`}>Edit value (USD)</label><input id={`value-${p.id}`} type="number" min="0" max="9999999999" step="0.01" value={draft.value ?? String(p.value ?? "")} onChange={(e) => setDraft(p.id, { value: e.target.value })} placeholder="Not set" className={fieldClass + " mt-2"} /></div>
                    <div className="rounded-xl border border-white/[0.05] bg-black/15 p-4 sm:p-5"><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Next deadline</p><p className="mt-2 text-sm font-medium text-foreground">{p.nextDeadline ? new Date(p.nextDeadline).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}) : "Not scheduled"}</p><label className="mt-5 block text-xs text-muted" htmlFor={`deadline-${p.id}`}>Edit deadline</label><input id={`deadline-${p.id}`} type="date" value={draft.nextDeadline ?? dateInputValue(p.nextDeadline)} onChange={(e) => setDraft(p.id, { nextDeadline: e.target.value })} className={fieldClass + " mt-2"} /></div>
                    <div className="rounded-xl border border-white/[0.05] bg-black/15 p-4 sm:p-5"><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Target end</p><p className="mt-2 text-sm font-medium text-foreground">{p.endsAt ? new Date(p.endsAt).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}) : "Not scheduled"}</p><label className="mt-5 block text-xs text-muted" htmlFor={`ends-${p.id}`}>Edit target end</label><input id={`ends-${p.id}`} type="date" value={draft.endsAt ?? dateInputValue(p.endsAt)} min={(draft.nextDeadline ?? dateInputValue(p.nextDeadline)) || undefined} onChange={(e) => setDraft(p.id, { endsAt: e.target.value })} className={fieldClass + " mt-2"} /></div>
                    <div className="rounded-xl bg-black/15 p-4"><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Deliverables</p><p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{p.approvedCount}<span className="text-sm font-normal text-muted"> / {p.deliverablesCount} approved</span></p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-xs text-muted">{dirty ? "Unsaved changes" : "All changes saved"}</span><button data-cursor="hover" onClick={() => save(p.id)} disabled={!dirty || savingId === p.id} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40">{savingId === p.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save</button></div>{rowError?.id === p.id && <p className="mt-2 text-xs text-red-400">{rowError.message}</p>}</div>
                  </div>
                  <div className="border-t border-hairline/70 bg-black/[0.08] px-5 py-5 sm:px-7 sm:py-6"><AdminProjectUploads projectId={p.id} projectName={p.name} /></div>
                </article>;
              })}
            </div><p className="px-1 py-2 text-xs text-muted">Changes save to the database and appear in the client dashboard. Clear a date or value to remove it.</p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
