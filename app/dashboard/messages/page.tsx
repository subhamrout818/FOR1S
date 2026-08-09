"use client";

import Link from "next/link";
import { ArrowUpRight, Loader2, MessageSquareText } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import {
  metaFor,
  DELIVERABLE_STATUS,
  KIND_LABEL,
  timeAgo,
} from "@/lib/portal-format";
import type { WorkspaceData } from "@/lib/portal-types";
import { CONTACT } from "@/lib/contact";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal");

  if (isLoading) return null;

  const threads = data?.threads ?? [];
  const byProject = data?.projects
    .map((p) => ({ project: p, threads: threads.filter((t) => t.project.id === p.id) }))
    .filter((group) => group.threads.length > 0);

  const totalComments = threads.reduce((acc, t) => acc + t.commentsCount, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Messages"
        title="Conversations"
        sub="Every thread lives with its deliverable — comments, versions, and decisions in one place."
      />

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading conversations…</p>
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

      {data && (!byProject || byProject.length === 0) && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
          <MessageSquareText size={28} className="text-muted" />
          <p className="font-display text-lg text-foreground">No conversations yet</p>
          <p className="max-w-sm text-sm text-muted">
            Comments on your deliverables will appear here as threads.
          </p>
        </div>
      )}

      {data && byProject && byProject.length > 0 && (
        <div className="space-y-8">
          {byProject.map((group, gi) => (
            <Reveal key={group.project.id} delay={gi * 0.05}>
              <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
                <div className="flex items-center justify-between border-b border-hairline/60 px-6 py-4">
                  <Link
                    href={`/dashboard/projects/${group.project.slug}`}
                    data-cursor="hover"
                    className="font-display text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:text-accent"
                  >
                    {group.project.name}
                  </Link>
                  <span className="font-mono text-xs text-muted">
                    {group.threads.reduce((a, t) => a + t.commentsCount, 0)} comments
                  </span>
                </div>

                <div className="divide-y divide-hairline/60">
                  {group.threads.map((t) => (
                    <Link
                      key={t.id}
                      href={t.href}
                      data-cursor="hover"
                      className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-foreground/70">
                          <MessageSquareText size={17} strokeWidth={1.5} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {t.title}
                            <span className="ml-2 font-mono text-xs text-muted">
                              v{t.version} · {KIND_LABEL[t.kind] ?? t.kind}
                            </span>
                          </p>
                          <p className="text-xs text-muted">
                            {t.commentsCount} comment{t.commentsCount === 1 ? "" : "s"} in thread
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Badge meta={metaFor(DELIVERABLE_STATUS, t.status)} />
                        <ArrowUpRight
                          size={15}
                          className={cn(
                            "text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                          )}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          <p className="text-center text-xs text-muted">
            Threads open directly on the deliverable, so the playback and the
            discussion are always next to each other.
          </p>
        </div>
      )}

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-hairline bg-background/60 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-base font-semibold text-foreground">
              Need to reach FOR1S directly?
            </p>
            <p className="mt-1 text-sm text-muted">
              For anything outside a deliverable thread — billing, scope, or
              general questions — email us and we&apos;ll reply within a day.
            </p>
          </div>
          <a
            href={`mailto:${CONTACT.contactEmail}`}
            data-cursor="hover"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
          >
            Email FOR1S
            <ArrowUpRight size={15} />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
