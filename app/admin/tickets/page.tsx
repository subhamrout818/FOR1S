"use client";

import { useCallback, useState } from "react";
import { LifeBuoy, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import { timeAgo, metaFor, TICKET_STATUS } from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

export default function AdminTicketsPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin");
  const [savingId, setSavingId] = useState<string | null>(null);

  const setStatus = useCallback(
    async (id: string, status: string) => {
      setSavingId(id);
      const res = await portalAction(`/api/admin/tickets/${id}`, { status });
      setSavingId(null);
      if (res.ok) reload();
    },
    [reload]
  );

  if (isLoading) return null;

  const tickets = data?.tickets ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Support"
        title="Tickets"
        sub="Client support requests from the portal — reply and close them here."
      />

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading tickets…</p>
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

      {data && tickets.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
          <LifeBuoy size={28} className="text-muted" />
          <p className="font-display text-lg text-foreground">No tickets yet</p>
          <p className="max-w-sm text-sm text-muted">
            Client support requests will show up here.
          </p>
        </div>
      )}

      {data && tickets.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
          {tickets.map((t, i) => (
            <div
              key={t.id}
              className={`flex flex-col gap-4 p-6 ${i > 0 ? "border-t border-hairline/60" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {t.subject}
                    </h3>
                    <Badge meta={metaFor(TICKET_STATUS, t.status)} />
                  </div>
                  <p className="mt-1 truncate text-xs text-muted">
                    {t.user?.name ?? "Client"} · {t.user?.email ?? ""} ·{" "}
                    {timeAgo(t.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {t.status !== "replied" && (
                    <button
                      data-cursor="hover"
                      disabled={savingId === t.id}
                      onClick={() => setStatus(t.id, "replied")}
                      className="rounded-full border border-hairline px-3 py-1.5 text-xs uppercase tracking-widest text-foreground/80 transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
                    >
                      {savingId === t.id ? "Saving…" : "Mark replied"}
                    </button>
                  )}
                  <button
                    data-cursor="hover"
                    disabled={savingId === t.id}
                    onClick={() => setStatus(t.id, t.status === "closed" ? "open" : "closed")}
                    className={
                      t.status === "closed"
                        ? "rounded-full border border-hairline px-3 py-1.5 text-xs uppercase tracking-widest text-muted transition-colors hover:text-foreground disabled:opacity-50"
                        : "rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
                    }
                  >
                    {savingId === t.id ? "Saving…" : t.status === "closed" ? "Reopen" : "Close"}
                  </button>
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-muted">{t.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
