"use client";

import Link from "next/link";
import { ArrowUpRight, Film, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import {
  formatDayMonth,
  metaFor,
  DELIVERABLE_STATUS,
  KIND_LABEL,
} from "@/lib/portal-format";
import type { WorkspaceData } from "@/lib/portal-types";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<string, string> = {
  reel: "▶",
  photo: "◧",
  design: "◈",
  video: "▷",
  website: "◉",
  document: "¶",
};

export default function DeliverablesPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal", token);

  if (isLoading || !token) return null;

  const all = data?.projects.flatMap((p) =>
    p.deliverables.map((d) => ({ ...d, project: { id: p.id, name: p.name, slug: p.slug } }))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Deliverables"
        title="Everything to review"
        sub="Watch, comment and approve each piece directly — no more guessing which file is latest."
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

      {data && (!all || all.length === 0) && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
          <Film size={28} className="text-muted" />
          <p className="font-display text-lg text-foreground">No deliverables yet</p>
          <p className="max-w-sm text-sm text-muted">
            Uploads and deliveries will appear here for you to review.
          </p>
        </div>
      )}

      {data && all && all.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {all.map((d, i) => (
            <Reveal key={d.id} delay={(i % 6) * 0.05}>
              <Link
                href={`/dashboard/deliverables/${d.id}`}
                data-cursor="hover"
                className="group flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-5 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_30px_90px_-40px_rgba(230,57,70,0.3)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-lg text-foreground/70 transition-transform group-hover:scale-105">
                    {KIND_ICON[d.kind] ?? "•"}
                  </span>
                  <Badge meta={metaFor(DELIVERABLE_STATUS, d.status)} />
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {d.title}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {d.project.name} · v{d.version} · {KIND_LABEL[d.kind] ?? d.kind}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-hairline pt-4 text-xs text-muted">
                  <span>
                    {d.dueAt
                      ? d.status === "approved" || d.status === "delivered"
                        ? `Delivered ${formatDayMonth(d.deliveredAt)}`
                        : `Due ${formatDayMonth(d.dueAt)}`
                      : "No deadline"}
                  </span>
                  <ArrowUpRight
                    size={15}
                    className={cn(
                      "text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    )}
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
