"use client";

import { useCallback, useState } from "react";
import { Loader2, Magnet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import { timeAgo, metaFor, LEAD_STATUS } from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

const STATUS_ORDER = ["new", "contacted", "qualified", "won", "lost"];

export default function AdminLeadsPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin", token);
  const [savingId, setSavingId] = useState<string | null>(null);

  const changeStatus = useCallback(
    async (id: string, status: string) => {
      if (!token) return;
      setSavingId(id);
      const res = await portalAction(`/api/admin/leads/${id}`, token, { status });
      setSavingId(null);
      if (res.ok) reload();
    },
    [token, reload]
  );

  if (isLoading || !token) return null;

  const leads = data?.leads ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Leads"
        title="Pipeline"
        sub="Enquiries from the contact form, referrals and socials — move them through to won."
      />

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading leads…</p>
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

      {data && leads.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
          <Magnet size={28} className="text-muted" />
          <p className="font-display text-lg text-foreground">No leads yet</p>
          <p className="max-w-sm text-sm text-muted">
            Enquiries from the contact form will land here.
          </p>
        </div>
      )}

      {data && leads.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-widest text-muted">
                  <th className="px-6 py-3 font-medium">Lead</th>
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Service</th>
                  <th className="px-6 py-3 font-medium">Budget</th>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Age</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-hairline/60 transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{l.name}</p>
                      <p className="text-xs text-muted">{l.email}</p>
                    </td>
                    <td className="px-6 py-4 text-muted">{l.company ?? "—"}</td>
                    <td className="px-6 py-4 text-muted">{l.service ?? "—"}</td>
                    <td className="px-6 py-4 text-muted">{l.budget ?? "—"}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-muted">
                      {l.source ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-muted">{timeAgo(l.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {savingId === l.id ? (
                          <Loader2 size={15} className="animate-spin text-accent" />
                        ) : (
                          <Badge meta={metaFor(LEAD_STATUS, l.status)} />
                        )}
                        <select
                          value={l.status}
                          data-cursor="hover"
                          onChange={(e) => changeStatus(l.id, e.target.value)}
                          disabled={savingId !== null}
                          className="rounded-lg border border-hairline bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted focus:border-accent focus:outline-none disabled:opacity-50"
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {metaFor(LEAD_STATUS, s).label}
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
