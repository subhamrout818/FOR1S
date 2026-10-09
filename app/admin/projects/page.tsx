"use client";

import { useCallback, useState } from "react";
import { Check, FolderKanban, Layers, Loader2, Plus, Rocket } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import StatCard from "@/components/portal/StatCard";
import Reveal from "@/components/portal/Reveal";
import {
  formatMoney,
  formatDate,
  metaFor,
  PROJECT_STATUS,
} from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

export default function AdminProjectsPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin");
  // Unsaved edits per project: { [projectId]: { progress?, status? } }
  const [drafts, setDrafts] = useState<Record<string, { progress?: number; status?: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const setDraft = (id: string, patch: { progress?: number; status?: string }) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const save = useCallback(
    async (id: string) => {
      const draft = drafts[id];
      if (!draft) return;
      setSavingId(id);
      setRowError(null);
      const res = await portalAction(`/api/admin/projects/${id}`, draft);
      setSavingId(null);
      if (!res.ok) {
        setRowError({ id, message: res.message || "Couldn't save. Try again." });
        return;
      }
      setDrafts((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
      reload();
    },
    [drafts, reload]
  );

  const createProject = useCallback(async () => {
    setCreating(true);
    setCreateError("");
    const res = await portalAction("/api/admin/projects", {
      clientId: newClient,
      name: newName.trim(),
    });
    setCreating(false);
    if (!res.ok) {
      setCreateError(res.message || "Couldn't create the project.");
      return;
    }
    setNewName("");
    setNewClient("");
    setShowNew(false);
    reload();
  }, [newClient, newName, reload]);

  if (isLoading) return null;

  const clients = data?.clients ?? [];
  const projects = data?.projects ?? [];
  const active = projects.filter((p) => p.status === "active").length;
  const inDelivery = projects.filter((p) =>
    ["active", "paused"].includes(p.status)
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Projects"
        title="All projects"
        sub="Every engagement, its progress, deliverables and deadlines."
      />

      <div className="mb-6">
        {!showNew ? (
          <button
            data-cursor="hover"
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
          >
            <Plus size={15} /> New project
          </button>
        ) : (
          <div className="rounded-2xl border border-hairline bg-background/60 p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground">
              New project
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label className="sr-only" htmlFor="np-client">Client</label>
              <select
                id="np-client"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="rounded-xl border border-hairline bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
              >
                <option value="">Select a client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="np-name">Project name</label>
              <input
                id="np-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Project name"
                maxLength={120}
                className="rounded-xl border border-hairline bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  data-cursor="hover"
                  onClick={createProject}
                  disabled={creating || !newClient || newName.trim().length < 2}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
                >
                  {creating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Create
                </button>
                <button
                  data-cursor="hover"
                  onClick={() => {
                    setShowNew(false);
                    setCreateError("");
                  }}
                  className="rounded-full border border-hairline px-4 py-3 text-sm text-muted transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
            {createError && <p className="mt-3 text-sm text-red-400">{createError}</p>}
          </div>
        )}
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Total projects"
          value={projects.length}
          icon={<FolderKanban size={16} />}
          delay={0}
        />
        <StatCard
          label="Active"
          value={active}
          icon={<Rocket size={16} />}
          delay={0.06}
        />
        <StatCard
          label="In delivery"
          value={inDelivery}
          icon={<Layers size={16} />}
          accent
          delay={0.12}
        />
      </div>

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

      {data && projects.length === 0 && (
        <p className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted">
          No projects yet.
        </p>
      )}

      {data && projects.length > 0 && (
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60 transition-colors duration-500 hover:border-accent/25">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-hairline text-xs uppercase tracking-widest text-muted">
                    <th className="px-6 py-3 font-medium">Project</th>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Progress</th>
                    <th className="px-6 py-3 font-medium">Deliverables</th>
                    <th className="px-6 py-3 font-medium">Deadline</th>
                    <th className="px-6 py-3 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      className="group border-b border-hairline/60 transition-colors duration-300 hover:bg-accent/[0.04]"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{p.name}</p>
                      </td>
                      <td className="px-6 py-4 text-muted">{p.client.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <Badge meta={metaFor(PROJECT_STATUS, p.status)} />
                          <select
                            aria-label={`Status for ${p.name}`}
                            value={drafts[p.id]?.status ?? p.status}
                            onChange={(e) => setDraft(p.id, { status: e.target.value })}
                            className="rounded-lg border border-hairline bg-background px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none"
                          >
                            <option value="active">In progress</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            aria-label={`Progress for ${p.name}`}
                            value={drafts[p.id]?.progress ?? p.progress}
                            onChange={(e) => setDraft(p.id, { progress: Number(e.target.value) })}
                            className="w-28 accent-[#AA1515]"
                          />
                          <span className="w-10 font-mono text-xs text-muted">
                            {drafts[p.id]?.progress ?? p.progress}%
                          </span>
                          {drafts[p.id] && (
                            <button
                              data-cursor="hover"
                              onClick={() => save(p.id)}
                              disabled={savingId === p.id}
                              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
                            >
                              {savingId === p.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Check size={12} />
                              )}
                              Save
                            </button>
                          )}
                        </div>
                        {rowError?.id === p.id && (
                          <p className="mt-1 text-xs text-red-400">{rowError.message}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted">
                        {p.approvedCount}/{p.deliverablesCount}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {formatDate(p.nextDeadline)}
                      </td>
                      <td className="px-6 py-4 text-right font-display font-semibold text-foreground">
                        {p.value ? formatMoney(p.value) : "—"}
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
