"use client";

import { Fragment, useCallback, useState } from "react";
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
  "w-full min-w-28 rounded-lg border border-hairline bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

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

      <div className="mb-6">
        {!showNew ? (
          <button data-cursor="hover" onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim">
            <Plus size={15} /> New project
          </button>
        ) : (
          <div className="rounded-2xl border border-hairline bg-background/60 p-5">
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

      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard label="Total projects" value={projects.length} icon={<FolderKanban size={16} />} delay={0} />
        <StatCard label="Active" value={active} icon={<Rocket size={16} />} delay={0.06} />
        <StatCard label="In delivery" value={inDelivery} icon={<Layers size={16} />} accent delay={0.12} />
      </div>

      {loading && !data && <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4"><Loader2 size={28} className="animate-spin text-accent" /><p className="text-sm text-muted">Loading projects…</p></div>}
      {error && !data && <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center"><p className="text-sm text-red-300">{error}</p><button data-cursor="hover" onClick={reload} className="text-xs uppercase tracking-widest text-foreground/70 underline underline-offset-2 hover:text-accent">Retry</button></div>}
      {data && projects.length === 0 && <p className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted">No projects yet.</p>}

      {data && projects.length > 0 && (
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60 transition-colors duration-500 hover:border-accent/25">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead><tr className="border-b border-hairline text-xs uppercase tracking-widest text-muted">
                  <th className="px-4 py-3 font-medium">Project / Client</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Progress</th><th className="px-4 py-3 font-medium">Value (USD)</th><th className="px-4 py-3 font-medium">Next deadline</th><th className="px-4 py-3 font-medium">Target end</th><th className="px-4 py-3 font-medium">Deliverables</th><th className="px-4 py-3 font-medium">Save</th>
                </tr></thead>
                <tbody>
                  {projects.map((p) => {
                    const draft = drafts[p.id] ?? {};
                    const dirty = !!drafts[p.id] && Object.keys(draft).length > 0;
                    return <Fragment key={p.id}><tr className="group border-b border-hairline/60 align-top transition-colors hover:bg-accent/[0.04]">
                      <td className="px-4 py-4"><p className="font-medium text-foreground">{p.name}</p><p className="mt-1 text-xs text-muted">{p.client.name}</p></td>
                      <td className="px-4 py-4"><div className="flex flex-col items-start gap-2"><Badge meta={metaFor(PROJECT_STATUS, p.status)} /><select aria-label={`Status for ${p.name}`} value={draft.status ?? p.status} onChange={(e) => setDraft(p.id, { status: e.target.value })} className={fieldClass}><option value="active">In progress</option><option value="paused">Paused</option><option value="completed">Completed</option></select></div></td>
                      <td className="px-4 py-4"><div className="flex items-center gap-2"><input type="range" min={0} max={100} step={5} aria-label={`Progress for ${p.name}`} value={draft.progress ?? p.progress} onChange={(e) => setDraft(p.id, { progress: Number(e.target.value) })} className="w-24 accent-[#AA1515]" /><span className="w-10 font-mono text-xs text-muted">{draft.progress ?? p.progress}%</span></div></td>
                      <td className="px-4 py-4"><label className="sr-only" htmlFor={`value-${p.id}`}>Value for {p.name}</label><input id={`value-${p.id}`} type="number" min="0" max="9999999999" step="0.01" value={draft.value ?? String(p.value ?? "")} onChange={(e) => setDraft(p.id, { value: e.target.value })} placeholder="Not set" className={fieldClass} /><p className="mt-1 text-[10px] text-muted">{p.value ? formatMoney(p.value) : "Leave blank to unset"}</p></td>
                      <td className="px-4 py-4"><label className="sr-only" htmlFor={`deadline-${p.id}`}>Next deadline for {p.name}</label><input id={`deadline-${p.id}`} type="date" value={draft.nextDeadline ?? dateInputValue(p.nextDeadline)} onChange={(e) => setDraft(p.id, { nextDeadline: e.target.value })} className={fieldClass} /><p className="mt-1 text-[10px] text-muted">Blank clears date</p></td>
                      <td className="px-4 py-4"><label className="sr-only" htmlFor={`ends-${p.id}`}>Target end date for {p.name}</label><input id={`ends-${p.id}`} type="date" value={draft.endsAt ?? dateInputValue(p.endsAt)} min={(draft.nextDeadline ?? dateInputValue(p.nextDeadline)) || undefined} onChange={(e) => setDraft(p.id, { endsAt: e.target.value })} className={fieldClass} /><p className="mt-1 text-[10px] text-muted">Blank clears date</p></td>
                      <td className="px-4 py-4 font-mono text-xs text-muted">{p.approvedCount}/{p.deliverablesCount} approved</td>
                      <td className="px-4 py-4"><button data-cursor="hover" onClick={() => save(p.id)} disabled={!dirty || savingId === p.id} className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40">{savingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save</button>{rowError?.id === p.id && <p className="mt-2 max-w-40 text-xs text-red-400">{rowError.message}</p>}</td>
                    </tr>
                    <tr className="border-b border-hairline/60"><td colSpan={8} className="px-4 pb-4 pt-0"><AdminProjectUploads projectId={p.id} projectName={p.name} /></td></tr>
                    </Fragment>;
                  })}
                </tbody>
              </table>
            </div>
            <p className="border-t border-hairline px-4 py-3 text-xs text-muted">Changes are saved to the database and reflected in the client dashboard. Clear a date or value to remove it.</p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
