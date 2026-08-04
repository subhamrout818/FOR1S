"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import {
  formatDate,
  metaFor,
  DELIVERABLE_STATUS,
  KIND_LABEL,
} from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

const STATUS_ORDER = ["draft", "in-review", "changes-requested", "approved", "delivered"];

export default function AdminDeliverablesPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin", token);
  const [savingId, setSavingId] = useState<string | null>(null);

  const changeStatus = useCallback(
    async (id: string, status: string) => {
      if (!token) return;
      setSavingId(id);
      const res = await portalAction(`/api/admin/deliverables/${id}`, token, { status });
      setSavingId(null);
      if (res.ok) reload();
    },
    [token, reload]
  );

  if (isLoading || !token) return null;

  const deliverables = data?.deliverables ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Deliverables"
        title="Review queue"
        sub="Move work through its lifecycle — from draft to delivered."
      />

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
          No deliverables yet.
        </p>
      )}

      {data && deliverables.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-widest text-muted">
                  <th className="px-6 py-3 font-medium">Deliverable</th>
                  <th className="px-6 py-3 font-medium">Client / Project</th>
                  <th className="px-6 py-3 font-medium">Kind</th>
                  <th className="px-6 py-3 font-medium">Version</th>
                  <th className="px-6 py-3 font-medium">Due</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map((d) => (
                  <tr key={d.id} className="border-b border-hairline/60 transition-colors hover:bg-white/[0.02]">
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
                          className="rounded-lg border border-hairline bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted focus:border-accent focus:outline-none disabled:opacity-50"
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
      )}
    </div>
  );
}
