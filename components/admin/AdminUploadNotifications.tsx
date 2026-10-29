"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BellRing, Check, X } from "lucide-react";

type UploadEvent = {
  id: string;
  title: string;
  detail: string | null;
  createdAt: string;
  project: { id: string; name: string } | null;
  actor: { id: string; name: string; email: string; role: string } | null;
};

export default function AdminUploadNotifications() {
  const seen = useRef<Set<string> | null>(null);
  const [notice, setNotice] = useState<UploadEvent | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    const poll = async () => {
      try {
        const response = await fetch("/api/admin/upload-notifications", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json() as { success?: boolean; events?: UploadEvent[] };
        if (!active || !payload.success || !Array.isArray(payload.events)) return;
        const ids = new Set(payload.events.map((event) => event.id));
        if (seen.current === null) {
          seen.current = ids;
          return;
        }
        const fresh = payload.events.filter((event) => !seen.current?.has(event.id) && event.actor?.role !== "admin");
        if (fresh.length) {
          setNotice(fresh[0]);
          setUnread((count) => Math.min(count + fresh.length, 99));
        }
        seen.current = new Set([...seen.current, ...ids]);
      } catch {
        // Notifications are an enhancement; transient network failures should not disrupt the dashboard.
      }
    };

    void poll();
    timer = setInterval(() => void poll(), 10000);
    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div className="mb-5 flex items-center justify-between rounded-xl border border-hairline bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <BellRing size={15} />
            {unread > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">{unread}</span>}
          </span>
          <div><p className="text-xs font-medium text-foreground">Client upload activity</p><p className="text-[10px] text-muted">Live checks every 10 seconds while this page is open</p></div>
        </div>
        {unread > 0 && <button type="button" onClick={() => setUnread(0)} className="text-[10px] text-muted transition-colors hover:text-foreground">Clear badge</button>}
      </div>
      <AnimatePresence>
        {notice && (
          <motion.div initial={{ opacity: 0, y: -14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.22 }} className="fixed right-4 top-4 z-[90] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl border border-accent/30 bg-[#111114]/95 shadow-[0_20px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="h-0.5 bg-gradient-to-r from-accent via-rose-400 to-transparent" />
            <div className="flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent"><BellRing size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">New client upload</p>
                <p className="mt-1 text-sm font-semibold text-white">{notice.project?.name ?? "Client project"}</p>
                <p className="mt-1 truncate text-xs text-white/55">{notice.detail || notice.title}</p>
                <Link href="/admin/projects" onClick={() => { setNotice(null); setUnread(0); }} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/85 transition-colors hover:text-accent">Open project uploads <ArrowUpRight size={13} /></Link>
              </div>
              <button type="button" onClick={() => setNotice(null)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white" aria-label="Dismiss upload notification"><X size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
