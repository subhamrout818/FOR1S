"use client";

import { useCallback, useState } from "react";
import { AlertCircle, Check, CreditCard, Loader2, Receipt, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData, portalAction } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import {
  formatINR,
  formatDate,
  metaFor,
  INVOICE_STATUS,
} from "@/lib/portal-format";
import type { WorkspaceData, InvoiceItem } from "@/lib/portal-types";
import { cn } from "@/lib/utils";

function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  glow,
  delay,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof CreditCard;
  accent: string;
  glow: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border border-hairline bg-background/60 border-l-4 p-6 transition-all duration-500",
          accent
        )}
        style={{ boxShadow: `0 0 40px ${glow}` }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
              {label}
            </p>
            <p className="mt-1.5 font-display text-2xl font-semibold text-foreground md:text-3xl">
              {value}
            </p>
            <p className="mt-1 text-sm text-muted">{sub}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5">
            <Icon size={20} strokeWidth={1.5} className="text-foreground/70" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function BillingPage() {
  const { token, isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal", token);

  const [payingId, setPayingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handlePay = useCallback(
    async (invoice: InvoiceItem) => {
      if (!token) return;
      setPayingId(invoice.id);
      setMsg("");
      setErr("");
      const res = await portalAction(`/api/portal/invoices/${invoice.id}/pay`, token);
      setPayingId(null);
      if (res.ok) {
        setMsg(`${invoice.number} paid — thank you!`);
        reload();
      } else {
        setErr(res.message);
      }
    },
    [token, reload]
  );

  if (isLoading || !token) return null;

  const billing = data?.billing;
  const invoices = data?.invoices ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Billing &amp; invoices"
        sub="Track what's been billed, what's paid, and what's left on each project."
      />

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading billing…</p>
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

      {data && (
        <>
          {/* Stat tiles */}
          <div className="grid gap-5 sm:grid-cols-3">
            <StatTile
              label="Project value"
              value={formatINR(billing?.totalValue ?? 0)}
              sub="Total across all projects"
              icon={Wallet}
              accent="border-l-accent"
              glow="rgba(230,57,70,0.15)"
              delay={0}
            />
            <StatTile
              label="Paid"
              value={formatINR(billing?.paid ?? 0)}
              sub="Received to date"
              icon={Check}
              accent="border-l-emerald-500"
              glow="rgba(16,185,129,0.15)"
              delay={0.05}
            />
            <StatTile
              label="Remaining"
              value={formatINR(billing?.remaining ?? 0)}
              sub="Open invoices"
              icon={Receipt}
              accent="border-l-blue-500"
              glow="rgba(59,130,246,0.15)"
              delay={0.1}
            />
          </div>

          {/* Feedback */}
          {msg && (
            <p className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <Check size={15} /> {msg}
            </p>
          )}
          {err && (
            <p className="mt-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={15} /> {err}
            </p>
          )}

          {/* Invoices */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-hairline bg-background/60">
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <p className="text-xs font-medium uppercase tracking-widest text-foreground">
                Invoices
              </p>
              <span className="font-mono text-xs text-muted">{invoices.length} total</span>
            </div>

            {invoices.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-muted">
                No invoices yet. Invoices appear here as milestones are billed.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-t border-hairline text-xs uppercase tracking-widest text-muted">
                      <th className="px-6 py-3 font-medium">Invoice</th>
                      <th className="px-6 py-3 font-medium">Issued</th>
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 text-right font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => {
                      const payable = ["pending", "overdue"].includes(invoice.status);
                      return (
                        <tr
                          key={invoice.id}
                          className="border-t border-hairline/60 transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-foreground/90">
                            {invoice.number}
                          </td>
                          <td className="px-6 py-4 text-muted">
                            {formatDate(invoice.issuedAt)}
                          </td>
                          <td className="px-6 py-4 text-foreground/85">
                            {invoice.description}
                          </td>
                          <td className="px-6 py-4 text-right font-display font-semibold text-foreground">
                            {formatINR(invoice.amount)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge meta={metaFor(INVOICE_STATUS, invoice.status)} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            {payable && (
                              <button
                                data-cursor="hover"
                                onClick={() => handlePay(invoice)}
                                disabled={payingId !== null}
                                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
                              >
                                {payingId === invoice.id ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <CreditCard size={13} />
                                )}
                                Pay {formatINR(invoice.amount)}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
            <CreditCard size={13} className="shrink-0 text-emerald-400" />
            UPI / Razorpay checkout is being wired up — paying marks the invoice
            as received for now.
          </p>
        </>
      )}
    </div>
  );
}
