"use client";

import { useCallback, useState } from "react";
import { AlertCircle, Check, LifeBuoy, Loader2, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import { timeAgo, metaFor, TICKET_STATUS } from "@/lib/portal-format";
import type { WorkspaceData } from "@/lib/portal-types";

export default function SupportPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal", token);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = useCallback(async () => {
    if (!token) return;
    setBusy(true);
    setMsg("");
    setErr("");
    const res = await portalAction("/api/portal/tickets", token, { subject, message });
    setBusy(false);
    if (res.ok) {
      setMsg("Ticket raised — we'll get back to you here and by email.");
      setSubject("");
      setMessage("");
      reload();
    } else {
      setErr(res.message || "Could not raise the ticket");
    }
  }, [token, subject, message, reload]);

  if (isLoading || !token) return null;

  const tickets = data?.tickets ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Support"
        title="How can we help?"
        sub="Raise a ticket and we'll respond here — maintenance, requests and everything after delivery."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* New ticket */}
        <Reveal>
          <div className="rounded-2xl border border-hairline bg-background/60 p-6">
            <div className="flex items-center gap-2">
              <LifeBuoy size={16} className="text-accent" />
              <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                New ticket
              </p>
            </div>

            <label className="mt-5 block text-sm font-medium text-foreground">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What do you need help with?"
              className="mt-1.5 w-full rounded-xl border border-hairline bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
            />

            <label className="mt-4 block text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Add any detail that helps us help you — links, project, screenshots…"
              className="mt-1.5 w-full resize-none rounded-xl border border-hairline bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
            />

            <button
              data-cursor="hover"
              onClick={submit}
              disabled={busy || !subject.trim() || !message.trim()}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Raise ticket
            </button>

            {msg && (
              <p className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
                <Check size={14} /> {msg}
              </p>
            )}
            {err && (
              <p className="mt-4 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle size={14} /> {err}
              </p>
            )}
          </div>
        </Reveal>

        {/* Ticket list */}
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
            <div className="flex items-center justify-between px-6 pt-6">
              <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                Your tickets
              </p>
              <span className="font-mono text-xs text-muted">{tickets.length} total</span>
            </div>

            {loading && !data && (
              <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-muted">
                <Loader2 size={20} className="animate-spin text-accent" />
                Loading…
              </div>
            )}

            {data && tickets.length === 0 && (
              <p className="px-6 py-12 text-sm text-muted">
                No tickets yet. We&apos;re here if you need us.
              </p>
            )}

            {data && tickets.length > 0 && (
              <div className="divide-y divide-hairline/60">
                {tickets.map((t) => (
                  <div key={t.id} className="px-6 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">{t.subject}</p>
                      <Badge meta={metaFor(TICKET_STATUS, t.status)} />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted">{t.message}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                      Raised {timeAgo(t.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
