"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Loader2, Magnet, Plus, Target, Trophy, Users, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import StatCard from "@/components/portal/StatCard";
import Reveal from "@/components/portal/Reveal";
import { timeAgo, metaFor, LEAD_STATUS } from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

const STATUS_ORDER = ["new", "contacted", "qualified", "won", "lost"];
const fieldClass = "mt-1.5 w-full rounded-xl border border-hairline bg-background/70 px-3.5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10";

export default function AdminLeadsPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [source, setSource] = useState("manual");
  const [notes, setNotes] = useState("");

  const changeStatus = useCallback(
    async (id: string, status: string) => {
      setSavingId(id);
      setActionError("");
      const res = await portalAction(`/api/admin/leads/${id}`, { status });
      setSavingId(null);
      if (res.ok) reload();
      else setActionError(res.message || "Couldn't update this lead. Try again.");
    },
    [reload]
  );

  const createLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setCreateError("");
    const res = await portalAction("/api/admin/leads", { name: name.trim(), email: email.trim(), company, phone, service, budget, source, notes });
    setCreating(false);
    if (!res.ok) { setCreateError(res.message || "Could not create this lead."); return; }
    setName(""); setEmail(""); setCompany(""); setPhone(""); setService(""); setBudget(""); setSource("manual"); setNotes("");
    setShowNew(false);
    reload();
  };

  if (isLoading) return null;

  const leads = data?.leads ?? [];
  const pipeline = leads.filter((l) =>
    ["new", "contacted", "qualified"].includes(l.status)
  ).length;
  const won = leads.filter((l) => l.status === "won").length;

  return (
    <div>
      <PageHeader
        eyebrow="Leads"
        title="Pipeline"
        sub="Enquiries from the contact form, referrals and socials — move them through to won."
        actions={<button data-cursor="hover" onClick={() => { setShowNew((v) => !v); setCreateError(""); }} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent-dim">{showNew ? <X size={15} /> : <Plus size={15} />} {showNew ? "Close" : "New lead"}</button>}
      />


      {showNew && (
        <form onSubmit={createLead} className="mb-8 rounded-2xl border border-hairline/80 bg-white/[0.025] p-5 sm:p-7">
          <h2 className="text-base font-semibold text-foreground">Create a lead</h2>
          <p className="mt-1 mb-5 text-sm text-muted">Add a prospect from a call, referral or social channel.</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <label className="text-xs text-muted">Name *<input required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Contact name" className={fieldClass} /></label>
            <label className="text-xs text-muted">Email *<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={fieldClass} /></label>
            <label className="text-xs text-muted">Company<input maxLength={100} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" className={fieldClass} /></label>
            <label className="text-xs text-muted">Phone<input maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className={fieldClass} /></label>
            <label className="text-xs text-muted">Service<input maxLength={100} value={service} onChange={(e) => setService(e.target.value)} placeholder="Website, branding…" className={fieldClass} /></label>
            <label className="text-xs text-muted">Budget<input maxLength={100} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $2,500–$5,000" className={fieldClass} /></label>
            <label className="text-xs text-muted">Source<select value={source} onChange={(e) => setSource(e.target.value)} className={fieldClass}><option value="manual">Manual entry</option><option value="referral">Referral</option><option value="instagram">Instagram</option><option value="website">Website</option><option value="other">Other</option></select></label>
            <label className="text-xs text-muted sm:col-span-2">Notes<textarea maxLength={2000} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Context and follow-up notes…" className={fieldClass + " resize-y"} /></label>
          </div>
          {createError && <p role="alert" className="mt-4 text-sm text-red-400">{createError}</p>}
          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={creating || name.trim().length < 2 || !email.trim()} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">{creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create lead</button>
            <button type="button" onClick={() => setShowNew(false)} className="rounded-full border border-hairline px-4 py-2.5 text-sm text-muted">Cancel</button>
          </div>
        </form>
      )}
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Total leads"
          value={leads.length}
          icon={<Users size={16} />}
          delay={0}
        />
        <StatCard
          label="In pipeline"
          value={pipeline}
          icon={<Target size={16} />}
          delay={0.06}
        />
        <StatCard
          label="Won"
          value={won}
          icon={<Trophy size={16} />}
          accent
          delay={0.12}
        />
      </div>

      {actionError && <p role="alert" className="mb-5 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">{actionError}</p>}

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
            Create a lead manually or wait for a contact-form enquiry.
          </p>
          <button onClick={() => setShowNew(true)} className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"><Plus size={15} /> Add your first lead</button>
        </div>
      )}

      {data && leads.length > 0 && (
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-hairline/80 bg-white/[0.02] transition-colors duration-300 hover:border-white/15">
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
                    <tr
                      key={l.id}
                      className="group border-b border-hairline/60 transition-colors duration-300 hover:bg-accent/[0.04]"
                    >
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
                            className="rounded-lg border border-hairline bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent/40 focus:border-accent focus:outline-none disabled:opacity-50"
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
        </Reveal>
      )}
    </div>
  );
}
