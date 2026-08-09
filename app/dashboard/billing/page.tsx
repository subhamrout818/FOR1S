"use client";

import { Check, CreditCard, Download, Loader2, Receipt, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePortalData } from "@/components/portal/usePortal";
import Reveal from "@/components/portal/Reveal";
import Badge from "@/components/portal/Badge";
import PageHeader from "@/components/portal/PageHeader";
import {
  formatMoney,
  formatDate,
  metaFor,
  INVOICE_STATUS,
} from "@/lib/portal-format";
import { downloadInvoiceHtml } from "@/lib/invoice";
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
  const { isLoading } = useAuth();
  const { data, loading, error, reload } = usePortalData<WorkspaceData>("/api/portal");

  if (isLoading) return null;

  const billing = data?.billing;
  const invoices = data?.invoices ?? [];
  const billedTo = {
    billedToName: data?.user?.name ?? null,
    billedToCompany: data?.user?.company ?? null,
  };

  const download = (invoice: InvoiceItem) =>
    downloadInvoiceHtml(invoice, billedTo);

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Billing &amp; invoices"
        sub="A clear record of what's been billed and what's been paid — payment is arranged directly, no checkout needed."
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
              value={formatMoney(billing?.totalValue ?? 0)}
              sub="Total across all projects"
              icon={Wallet}
              accent="border-l-accent"
              glow="rgba(230,57,70,0.15)"
              delay={0}
            />
            <StatTile
              label="Paid"
              value={formatMoney(billing?.paid ?? 0)}
              sub="Received to date"
              icon={Check}
              accent="border-l-emerald-500"
              glow="rgba(16,185,129,0.15)"
              delay={0.05}
            />
            <StatTile
              label="Remaining"
              value={formatMoney(billing?.remaining ?? 0)}
              sub="Open invoices"
              icon={Receipt}
              accent="border-l-blue-500"
              glow="rgba(59,130,246,0.15)"
              delay={0.1}
            />
          </div>

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
                    {invoices.map((invoice) => (
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
                          {formatMoney(invoice.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge meta={metaFor(INVOICE_STATUS, invoice.status)} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            data-cursor="hover"
                            onClick={() => download(invoice)}
                            title={`Download ${invoice.number}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs uppercase tracking-widest text-foreground/80 transition-colors hover:border-accent/50 hover:text-accent"
                          >
                            <Download size={12} />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
            <CreditCard size={13} className="shrink-0 text-emerald-400" />
            Every project starts with a free call — we&apos;ll talk scope and
            money there, then send your invoice over email when it&apos;s time.
            Nothing is charged online.
          </p>
        </>
      )}
    </div>
  );
}
