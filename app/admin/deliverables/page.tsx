"use client";

import { useCallback, useState, type FormEvent } from "react";
import { CheckCircle2, FileCheck2, Loader2, Plus, RefreshCcw, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import StatCard from "@/components/portal/StatCard";
import Reveal from "@/components/portal/Reveal";
import {
  formatDate,
  metaFor,
  DELIVERABLE_STATUS,
  KIND_LABEL,
} from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

const STATUS_ORDER = ["draft", "in-review", "changes-requested", "approved", "delivered"];
const fieldClass = "mt-1.5 w-full rounded-xl border border-hairline bg-background/70 px-3.5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10";

export default function AdminDeliverablesPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("website");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");\n  const [externalUrl, setExternalUrl] = useState("");\n  const [revisionId, setRevisionId] = useState<string | null>(null);\n  const [revisionUrl, setRevisionUrl] = useState("");\n  const [revisionNote, setRevisionNote] = useState("");\n  const [revisionBusy, setRevisionBusy] = useState(false);

  const changeStatus = useCallback(
    async (id: string, status: string) => {
      setSavingId(id);
      setActionError("");
      const res = await portalAction(`/api/admin/deliverables/${id}`, { status });
      setSavingId(null);
      if (res.ok) reload();
      else setActionError(res.message || "Couldn't update this deliverable. Try again.");
    },
    [reload]
  );

  const submitRevision = async (event: FormEvent<HTMLFormElement>) => {\n    event.preventDefault();\n    if (!revisionId || !revisionUrl.trim()) return;\n    setRevisionBusy(true);\n    setActionError("");\n    const res = await portalAction(`/api/admin/deliverables/${revisionId}/versions`, { externalUrl: revisionUrl.trim(), note: revisionNote.trim() });\n    setRevisionBusy(false);\n    if (!res.ok) { setActionError(res.message || "Could not submit this version."); return; }\n    setRevisionId(null); setRevisionUrl(""); setRevisionNote(""); reload();\n  };\n\n  const createDeliverable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setCreateError("");
    const res = await portalAction("/api/admin/deliverables", { projectId, title: title.trim(), kind, description, dueAt, externalUrl });
    setCreating(false);
    if (!res.ok) { setCreateError(res.message || "Could not create this deliverable."); return; }
    setProjectId(""); setTitle(""); setKind("website"); setDescription(""); setDueAt(""); setExternalUrl("");
    setShowNew(false);
    reload();
  };

  if (isLoading) return null;

  const deliverables = data?.deliverables ?? [];
  const inReview = deliverables.filter((d) =>
    ["in-review", "changes-requested"].includes(d.status)
  ).length;
  const delivered = deliverables.filter((d) =>
    ["approved", "delivered"].includes(d.status)
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Deliverables"
        title="Review queue"
        sub="Move work through its lifecycle — from draft to delivered."
        actions={<button data-cursor="hover" onClick={() => { setShowNew((v) => !v); setCreateError(""); }} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent-dim">{showNew ? <X size={15} /> : <Plus size={15} />} {showNew ? "Close" : "New deliverable"}</button>}
      />


      {showNew && (
        <form onSubmit={createDeliverable} className="mb-8 rounded-2xl border border-hairline/80 bg-white/[0.025] p-5 sm:p-7">
          <h2 className="text-base font-semibold text-foreground">Create a deliverable</h2>
          <p className="mt-1 mb-5 text-sm text-muted">Add a draft item to a client's project workspace.</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <label className="text-xs text-muted">Project *<select required value={projectId} onChange={(e) => setProjectId(e.target.value)} className={fieldClass}><option value="">Select a project…</option>{(data?.projects ?? []).map((p) => <option key={p.id} value={p.id}>{p.name} — {p.client.name}</option>)}</select></label>
            <label className="text-xs text-muted">Deliverable title *<input required minLength={2} maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Homepage design" className={fieldClass} /></label>
            <label className="text-xs text-muted">Type<select value={kind} onChange={(e) => setKind(e.target.value)} className={fieldClass}><option value="website">Website</option><option value="design">Design</option><option value="video">Video</option><option value="reel">Reel</option><option value="photo">Photo</option><option value="document">Document</option><option value="other">Other</option></select></label>
            <label className="text-xs text-muted">Due date<input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className={fieldClass} /></label>\n            <label className="text-xs text-muted sm:col-span-2">Preview / staging / Figma link<input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://…" className={fieldClass} /></label>
            <label className="text-xs text-muted sm:col-span-2">Description<textarea rows={3} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe what will be delivered…" className={fieldClass + " resize-y"} /></label>
          </div>
          {createError && <p role="alert" className="mt-4 text-sm text-red-400">{createError}</p>}
          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={creating || !projectId || title.trim().length < 2} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">{creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create deliverable</button>
            <button type="button" onClick={() => setShowNew(false)} className="rounded-full border border-hairline px-4 py-2.5 text-sm text-muted">Cancel</button>
          </div>
          {(data?.projects ?? []).length === 0 && <p className="mt-3 text-xs text-amber-300">Create a client project first; deliverables must belong to a project.</p>}
        </form>
      )}
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Total"
          value={deliverables.length}
          icon={<FileCheck2 size={16} />}
          delay={0}
        />
        <StatCard
          label="Awaiting review"
          value={inReview}
          icon={<RefreshCcw size={16} />}
          accent
          delay={0.06}
        />
        <StatCard
          label="Approved / delivered"
          value={delivered}
          icon={<CheckCircle2 size={16} />}
          delay={0.12}
        />
      </div>

      {actionError && <p role="alert" className="mb-5 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">{actionError}</p>}

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading deliverables…</p>
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

      {data && deliverables.length === 0 && (
        <p className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted">
          No deliverables yet. Create one and assign it to a client project.
          <button onClick={() => setShowNew(true)} disabled={(data?.projects ?? []).length === 0} className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"><Plus size={15} /> Add first deliverable</button>
        </p>
      )}

      {revisionId && (\n        <form onSubmit={submitRevision} className="mb-6 rounded-2xl border border-accent/30 bg-accent/[0.04] p-5">\n          <h2 className="text-sm font-semibold text-foreground">Submit a new version for client review</h2>\n          <p className="mt-1 text-xs text-muted">This creates the next version and moves the deliverable to In review.</p>\n          <div className="mt-4 grid gap-3 sm:grid-cols-2">\n            <label className="text-xs text-muted sm:col-span-2">External preview link *<input required type="url" value={revisionUrl} onChange={(e) => setRevisionUrl(e.target.value)} placeholder="https://staging… / Figma…" className={fieldClass} /></label>\n            <label className="text-xs text-muted sm:col-span-2">Version note<textarea rows={2} maxLength={2000} value={revisionNote} onChange={(e) => setRevisionNote(e.target.value)} placeholder="What changed in this version?" className={fieldClass} /></label>\n          </div>\n          <div className="mt-4 flex gap-2"><button type="submit" disabled={revisionBusy || !revisionUrl.trim()} className="rounded-full bg-accent px-4 py-2 text-sm text-white disabled:opacity-50">{revisionBusy ? "Submitting…" : "Submit for review"}</button><button type="button" onClick={() => setRevisionId(null)} className="rounded-full border border-hairline px-4 py-2 text-sm text-muted">Cancel</button></div>\n        </form>\n      )}\n\n      {data && deliverables.length > 0 && (
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-hairline/80 bg-white/[0.02] transition-colors duration-300 hover:border-white/15">
            <div className="overflow-x-auto p-2 sm:p-3">
              <table className="w-full min-w-[760px] text-left text-sm [&_td]:py-4 [&_td]:px-4 [&_th]:px-4 [&_th]:py-4">
                <thead>
                  <tr className="border-b border-hairline text-xs uppercase tracking-widest text-muted">
                    <th className="px-6 py-3 font-medium">Deliverable</th>
                    <th className="px-6 py-3 font-medium">Client / Project</th>
                    <th className="px-6 py-3 font-medium">Kind</th>
                    <th className="px-6 py-3 font-medium">Version</th>
                    <th className="px-6 py-3 font-medium">Due</th>
                    <th className="px-6 py-3 font-medium">Status</th>\n                    <th className="px-6 py-3 font-medium">Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {deliverables.map((d) => (
                    <tr
                      key={d.id}
                      className="group border-b border-hairline/60 transition-colors duration-300 hover:bg-accent/[0.04]"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{d.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-muted">{d.client.name}</p>
                        <p className="text-xs text-muted/70">{d.project.name}</p>
                      </td>
                      <td className="px-6 py-4 text-muted">{KIND_LABEL[d.kind] ?? d.kind}</td>
                      <td className="px-6 py-4 font-mono text-xs text-muted">v{d.version}</td>
                      <td className="px-6 py-4 text-muted">{formatDate(d.dueAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {savingId === d.id ? (
                            <Loader2 size={15} className="animate-spin text-accent" />
                          ) : (
                            <Badge meta={metaFor(DELIVERABLE_STATUS, d.status)} />
                          )}
                          <select
                            value={d.status}
                            data-cursor="hover"
                            onChange={(e) => changeStatus(d.id, e.target.value)}
                            disabled={savingId !== null}
                            className="rounded-lg border border-hairline bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent/40 focus:border-accent focus:outline-none disabled:opacity-50"
                          >
                            {STATUS_ORDER.map((s) => (
                              <option key={s} value={s}>
                                {metaFor(DELIVERABLE_STATUS, s).label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
