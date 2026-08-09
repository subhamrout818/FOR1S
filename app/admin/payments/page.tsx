"use client";

import { CreditCard, Loader2, TrendingUp, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import PageHeader from "@/components/portal/PageHeader";
import StatCard from "@/components/portal/StatCard";
import Reveal from "@/components/portal/Reveal";
import { formatMoney, formatDate } from "@/lib/portal-format";
import type { AdminWorkspace } from "@/lib/portal-types";

export default function AdminPaymentsPage() {
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<AdminWorkspace>("/api/admin");

  if (isLoading) return null;

  const payments = data?.payments ?? [];
  const totalReceived = payments.reduce((a, p) => a + p.amount, 0);
  const average =
    payments.length > 0 ? Math.round(totalReceived / payments.length) : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Payments"
        title="Payments"
        sub="Revenue from completed invoices."
      />

      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Payments"
          value={payments.length}
          icon={<CreditCard size={16} />}
          delay={0}
        />
        <StatCard
          label="Total received"
          value={totalReceived}
          icon={<Wallet size={16} />}
          format={(n) => formatMoney(n)}
          accent
          delay={0.06}
        />
        <StatCard
          label="Average"
          value={average}
          icon={<TrendingUp size={16} />}
          format={(n) => formatMoney(n)}
          delay={0.12}
        />
      </div>

      {loading && !data && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading payments…</p>
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

      {data && payments.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-background/40 text-center">
          <Wallet size={28} className="text-muted" />
          <p className="font-display text-lg text-foreground">No payments yet</p>
          <p className="max-w-sm text-sm text-muted">
            Payments will appear here once clients pay their invoices.
          </p>
        </div>
      )}

      {data && payments.length > 0 && (
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60 transition-colors duration-500 hover:border-accent/25">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-hairline text-xs uppercase tracking-widest text-muted">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Invoice</th>
                    <th className="px-6 py-3 font-medium">Method</th>
                    <th className="px-6 py-3 font-medium">Reference</th>
                    <th className="px-6 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr
                      key={p.id}
                      className="group border-b border-hairline/60 transition-colors duration-300 hover:bg-accent/[0.04]"
                    >
                      <td className="px-6 py-4 text-muted">
                        {formatDate(p.paidAt, { month: "short", day: "2-digit" })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{p.user.name}</p>
                        <p className="text-xs text-muted">{p.user.email}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-foreground/90">
                        {p.invoice.number}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] uppercase text-muted">
                        {p.method}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted">
                        {p.reference ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-right font-display font-semibold text-emerald-400">
                        {formatMoney(p.amount)}
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
