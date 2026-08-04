"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import VideoPlayer from "@/components/portal/VideoPlayer";
import Badge from "@/components/portal/Badge";
import Avatar from "@/components/ui/Avatar";
import {
  formatDate,
  formatDayMonth,
  metaFor,
  DELIVERABLE_STATUS,
  KIND_LABEL,
} from "@/lib/portal-format";
import type { DeliverableDetail } from "@/lib/portal-types";
import { cn } from "@/lib/utils";

export default function DeliverableDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<{
    deliverable: DeliverableDetail;
  }>(`/api/portal/deliverables/${params.id}`, token);

  const deliverable = data?.deliverable ?? null;

  // Player source: latest version's media by default, clickable per version.
  const [src, setSrc] = useState<string | null | undefined>(null);

  useEffect(() => {
    setSrc(deliverable?.mediaUrl ?? null);
  }, [deliverable?.mediaUrl, deliverable?.id]);

  const [changesOpen, setChangesOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [comment, setComment] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);

  const submitReview = useCallback(
    async (action: "approve" | "changes") => {
      if (!token || !deliverable) return;
      setBusy(true);
      setMsg("");
      setErr("");
      const res = await portalAction(
        `/api/portal/deliverables/${deliverable.id}/review`,
        token,
        { action, note: action === "changes" ? note : "" }
      );
      setBusy(false);
      if (res.ok) {
        setMsg(action === "approve" ? "Approved — nice one! 🎉" : "Notes sent to the team.");
        setChangesOpen(false);
        setNote("");
        reload();
      } else {
        setErr(res.message);
      }
    },
    [token, deliverable, note, reload]
  );

  const submitComment = useCallback(async () => {
    if (!token || !deliverable || !comment.trim()) return;
    setCommentBusy(true);
    setErr("");
    const res = await portalAction(
      `/api/portal/deliverables/${deliverable.id}/comment`,
      token,
      { body: comment }
    );
    setCommentBusy(false);
    if (res.ok) {
      setComment("");
      reload();
    } else {
      setErr(res.message);
    }
  }, [token, deliverable, comment, reload]);

  if (isLoading || !token) return null;

  if (loading && !deliverable) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <Loader2 size={28} className="animate-spin text-accent" />
        <p className="text-sm text-muted">Loading deliverable…</p>
      </div>
    );
  }

  if (error && !deliverable) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!deliverable) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-display text-xl text-foreground">Deliverable not found</p>
        <Link
          href="/dashboard/deliverables"
          data-cursor="hover"
          className="text-sm text-muted underline underline-offset-2 hover:text-accent"
        >
          Back to deliverables
        </Link>
      </div>
    );
  }

  const canReview = ["in-review", "changes-requested"].includes(deliverable.status);
  const latestVersion = deliverable.versions[deliverable.versions.length - 1];
  const selectedVersion = deliverable.versions.find((v) => v.mediaUrl === src);

  return (
    <div>
      <Link
        href="/dashboard/deliverables"
        data-cursor="hover"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        All deliverables
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold uppercase tracking-tightest text-foreground md:text-4xl">
              {deliverable.title}
            </h1>
            <span className="rounded-full border border-hairline px-3 py-1 font-mono text-xs text-muted">
              v{deliverable.version}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            {KIND_LABEL[deliverable.kind] ?? deliverable.kind} ·{" "}
            <Link
              href={`/dashboard/projects/${deliverable.project.slug}`}
              data-cursor="hover"
              className="text-muted underline underline-offset-2 hover:text-accent"
            >
              {deliverable.project.name}
            </Link>
          </p>
        </div>
        <Badge meta={metaFor(DELIVERABLE_STATUS, deliverable.status)} />
      </div>

      {/* Player */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-hairline bg-black">
        <div className="aspect-video w-full">
          <VideoPlayer
            src={src}
            poster={selectedVersion?.posterUrl ?? deliverable.posterUrl}
            title={deliverable.title}
            kind={deliverable.kind}
          />
        </div>
      </div>

      {/* Status + actions */}
      <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-hairline bg-background/60 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Status
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-foreground">
            {metaFor(DELIVERABLE_STATUS, deliverable.status).label}
          </p>
          <p className="mt-1 text-sm text-muted">
            {deliverable.deliveredAt
              ? `Delivered ${formatDate(deliverable.deliveredAt)}`
              : deliverable.dueAt
                ? `Due ${formatDate(deliverable.dueAt)}`
                : "Not delivered yet"}
          </p>
        </div>

        {canReview && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              data-cursor="hover"
              onClick={() => setChangesOpen((v) => !v)}
              className="rounded-full border border-foreground/25 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-amber-500/50 hover:text-amber-400"
            >
              Request changes
            </button>
            <button
              data-cursor="hover"
              onClick={() => submitReview("approve")}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-60"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              Approve
            </button>
          </div>
        )}
      </div>

      {/* Request changes box */}
      {changesOpen && (
        <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <p className="text-sm font-medium text-foreground">
            What would you like changed?
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="e.g. The shot at 0:17 needs a redo — the pour looks rushed."
            className="mt-3 w-full rounded-xl border border-hairline bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              data-cursor="hover"
              onClick={() => submitReview("changes")}
              disabled={busy || !note.trim()}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
            >
              Send feedback
            </button>
            <button
              data-cursor="hover"
              onClick={() => setChangesOpen(false)}
              className="text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Feedback banner */}
      {msg && (
        <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {msg}
        </p>
      )}
      {err && (
        <p className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-red-300">
          {err}
        </p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Comments */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Comments
            </h2>
            <span className="font-mono text-xs text-muted">
              {deliverable.comments.length} total
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {deliverable.comments.length === 0 && (
              <p className="rounded-2xl border border-dashed border-hairline bg-background/40 px-5 py-6 text-sm text-muted">
                No comments yet. Ask away — timestamped notes keep the thread tidy.
              </p>
            )}
            {deliverable.comments.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "flex gap-3",
                  !c.author.isAdmin && "flex-row-reverse"
                )}
              >
                {c.author.isAdmin ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                    <svg width="16" height="16" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="26" stroke="#E63946" strokeWidth="3" />
                      <path d="M32 6 C 20 20, 20 44, 32 58 C 44 44, 44 20, 32 6 Z" stroke="#E63946" strokeWidth="3" />
                    </svg>
                  </span>
                ) : (
                  <Avatar src={user?.profileImage} size={32} />
                )}
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl border border-hairline px-4 py-3",
                    c.author.isAdmin
                      ? "bg-background/60"
                      : "bg-white/[0.04]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {c.author.isAdmin ? "FOR1S" : c.author.name.split(" ")[0]}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {formatDayMonth(c.createdAt)} ·{" "}
                      {new Date(c.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add comment */}
          <div className="mt-6 flex items-end gap-3 rounded-2xl border border-hairline bg-background/60 p-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="Add a comment…"
              className="w-full resize-none rounded-xl border border-hairline bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
            <button
              data-cursor="hover"
              onClick={submitComment}
              disabled={commentBusy || !comment.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
              aria-label="Send comment"
            >
              {commentBusy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </section>

        {/* Versions */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Versions
            </h2>
            <span className="font-mono text-xs text-muted">
              v{deliverable.version} latest
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {deliverable.versions.map((v) => {
              const active = v.mediaUrl === src;
              const selected = v.id === selectedVersion?.id;
              return (
                <button
                  key={v.id}
                  data-cursor="hover"
                  onClick={() => v.mediaUrl && v.mediaUrl !== "#" && setSrc(v.mediaUrl)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                    selected
                      ? "border-accent/40 bg-white/[0.04]"
                      : "border-hairline bg-background/40 hover:border-foreground/20",
                    (!v.mediaUrl || v.mediaUrl === "#") && "pointer-events-none opacity-60"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 font-mono text-xs text-foreground">
                    v{v.version}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {v.note || (v.version === 1 ? "Initial upload" : `Upload ${v.version}`)}
                    </span>
                    <span className="block text-xs text-muted">
                      {formatDate(v.createdAt)} · {metaFor(DELIVERABLE_STATUS, v.status).label}
                    </span>
                  </span>
                  {active && (
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-accent">
                      Playing
                    </span>
                  )}
                </button>
              );
            })}
            {latestVersion && (
              <p className="px-1 pt-1 text-xs text-muted">
                Click a version to preview it in the player above.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
