"use client";

import Link from "next/link";
import { Loader2, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import PageHeader from "@/components/portal/PageHeader";
import Avatar from "@/components/ui/Avatar";
import { formatINR, formatDate } from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

export default function AdminClientsPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin", token);

  if (isLoading || !token) return null;

  const clients = data?.clients ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title="Clients"
        sub="Every client account, their active work and financial position."
      />

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading clients…</p>
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

      {data && clients.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
          <Users size={28} className="text-muted" />
          <p className="font-display text-lg text-foreground">No clients yet</p>
          <p className="max-w-sm text-sm text-muted">
            Client accounts will show up here as they sign up and start projects.
          </p>
        </div>
      )}

      {data && clients.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((c, i) => (
            <Reveal key={c.id} delay={(i % 6) * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-5 transition-colors hover:border-accent/30">
                <div className="flex items-center gap-3">
                  <Avatar src={c.profileImage} size={44} className="border border-hairline" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-foreground">
                      {c.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {c.company ?? c.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/[0.03] px-2 py-2">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {c.projectsCount}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-muted">Projects</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] px-2 py-2">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {c.activeProjectsCount}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-muted">Active</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] px-2 py-2">
                    <p className="font-display text-sm font-semibold text-emerald-400">
                      {formatINR(c.paid)}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-muted">Paid</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4 text-xs">
                  <span className="text-muted">
                    Value {formatINR(c.totalValue)} · Outstanding{" "}
                    <span className={c.outstanding > 0 ? "text-accent" : "text-muted"}>
                      {formatINR(c.outstanding)}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {formatDate(c.createdAt, { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
