"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Badge from "@/components/portal/Badge";
import ProgressBar from "@/components/portal/ProgressBar";
import PageHeader from "@/components/portal/PageHeader";
import {
  formatINR,
  formatDate,
  metaFor,
  PROJECT_STATUS,
} from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

export default function AdminProjectsPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin", token);

  if (isLoading || !token) return null;

  const projects = data?.projects ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Projects"
        title="All projects"
        sub="Every engagement, its progress, deliverables and deadlines."
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

      {data && projects.length === 0 && (
        <p className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted">
          No projects yet.
        </p>
      )}

      {data && projects.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
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
                  <tr key={p.id} className="border-b border-hairline/60 transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{p.name}</p>
                    </td>
                    <td className="px-6 py-4 text-muted">{p.client.name}</td>
                    <td className="px-6 py-4">
                      <Badge meta={metaFor(PROJECT_STATUS, p.status)} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={p.progress} className="w-20" animate={false} />
                        <span className="font-mono text-xs text-muted">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted">
                      {p.approvedCount}/{p.deliverablesCount}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {formatDate(p.nextDeadline)}
                    </td>
                    <td className="px-6 py-4 text-right font-display font-semibold text-foreground">
                      {p.value ? formatINR(p.value) : "—"}
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
