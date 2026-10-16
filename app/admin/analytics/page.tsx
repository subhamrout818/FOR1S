"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const EVENTS = [
  "hero_cta_click",
  "portfolio_project_open",
  "pricing_tier_select",
  "contact_form_start",
  "contact_form_success",
  "contact_form_error",
] as const;

type EventCount = { name: string; count: number };
type RecentEvent = {
  id: string;
  name: string;
  path: string;
  metadata: Record<string, string>;
  createdAt: string;
};

export default function SiteAnalyticsPage() {
  const [counts, setCounts] = useState<EventCount[]>([]);
  const [recent, setRecent] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/analytics", { credentials: "same-origin" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Could not load analytics.");
        return data;
      })
      .then((data) => {
        if (!active) return;
        setCounts(data.counts);
        setRecent(data.recentEvents);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load analytics.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const countFor = (name: string) => counts.find((item) => item.name === name)?.count ?? 0;

  return (
    <div>
      <div className="mb-10">
        <Link href="/admin" className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent">← Admin overview</Link>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">FOR1S STUDIO</p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tightest text-foreground md:text-5xl">Site analytics</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">Conversion events from the last 30 days. No names, email addresses, form contents, or raw IP addresses are collected here.</p>
      </div>

      {loading && <p className="py-10 text-sm text-muted">Loading events…</p>}
      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {EVENTS.map((name) => (
              <div key={name} className="rounded-2xl border border-hairline bg-surface/50 p-6">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{name.replaceAll("_", " ")}</p>
                <p className="mt-4 font-display text-4xl font-semibold text-foreground">{countFor(name).toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted">events · last 30 days</p>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-hairline">
            <div className="border-b border-hairline px-5 py-4">
              <h2 className="font-display text-lg font-semibold uppercase text-foreground">Recent events</h2>
            </div>
            {recent.length === 0 ? (
              <p className="p-5 text-sm text-muted">No events recorded yet. Visit the public site and try the CTAs, work cards, pricing buttons, and contact form.</p>
            ) : (
              <div className="divide-y divide-hairline">
                {recent.map((event) => (
                  <div key={event.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.name.replaceAll("_", " ")}</p>
                      <p className="mt-1 text-xs text-muted">{event.path}{event.metadata?.project ? \` · \${event.metadata.project}\` : ""}{event.metadata?.tier ? \` · \${event.metadata.tier}\` : ""}</p>
                    </div>
                    <span className="text-xs text-muted">{new Date(event.createdAt).toLocaleString()}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Recorded</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
