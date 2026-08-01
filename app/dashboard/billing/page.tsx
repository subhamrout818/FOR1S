"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/contact";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  CreditCard,
  Loader2,
  Receipt,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PlanData {
  key: string;
  name: string;
  tagline: string;
  price: number;
  priceRange: string;
  highlighted: boolean;
  specs: string[];
}

interface InvoiceData {
  id: string;
  number: string;
  description: string;
  amount: number;
  status: string;
  dueDate: string | null;
  issuedAt: string;
}

interface PaymentMethodData {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface SubscriptionData {
  id: string;
  status: string;
  currentPeriodEnd: string | null;
  plan: PlanData | null;
}

interface BillingData {
  subscription: SubscriptionData | null;
  plans: PlanData[];
  invoices: InvoiceData[];
  paymentMethod: PaymentMethodData | null;
  stats: {
    nextInvoice: { number: string; amount: number; dueDate: string | null } | null;
    totalBilled: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  overdue: "border-accent/40 bg-accent/10 text-accent",
};

/* ------------------------------------------------------------------ */
/*  Reveal wrapper — matches dashboard motion language                 */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)", y: 24 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat tile                                                          */
/* ------------------------------------------------------------------ */

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
  icon: typeof Calendar;
  accent: string;
  glow: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border border-hairline bg-background/60 backdrop-blur-sm",
          "border-l-4 transition-all duration-500",
          accent
        )}
        style={{ boxShadow: `0 0 40px ${glow}` }}
      >
        <div
          className="pointer-events-none absolute -inset-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at 50% 50%, ${glow}, transparent 70%)`,
          }}
        />
        <div className="relative z-10 flex items-start justify-between p-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              {label}
            </p>
            <p className="font-display text-2xl font-semibold text-foreground">
              {value}
            </p>
            <p className="text-sm text-muted">{sub}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5">
            <Icon size={20} strokeWidth={1.5} className="text-foreground/70" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Current plan card                                                  */
/* ------------------------------------------------------------------ */

function PlanCard({ subscription }: { subscription: SubscriptionData }) {
  const plan = subscription.plan;

  return (
    <Reveal delay={0.15} className="h-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-accent/40 bg-surface p-7 md:shadow-[0_30px_90px_-40px_rgba(230,57,70,0.35)] lg:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -top-24 h-40 rotate-6 bg-gradient-to-b from-white/[0.08] to-transparent"
        />
        <span className="absolute right-6 top-6 rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
          {subscription.status === "cancelled" ? "Cancelled" : "Active plan"}
        </span>

        <div className="relative z-10 flex h-full flex-col">
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
            <Sparkles size={14} className="text-accent" />
            {plan?.tagline ?? "No plan"}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-tightest text-foreground">
            {plan?.name ?? "—"}
          </h2>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-foreground">
              {plan ? formatMoney(plan.price) : "—"}
            </span>
            <span className="text-sm text-muted">per project</span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {subscription.currentPeriodEnd
              ? `Renews ${formatDate(subscription.currentPeriodEnd)}`
              : "Current engagement"}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {(plan?.specs ?? []).map((spec) => (
              <li
                key={spec}
                className="flex items-start gap-3 text-sm text-foreground/85"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {spec}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
            <MagneticButton
              variant="outline"
              size="md"
              cursorText="Go"
              onClick={() => (window.location.href = `mailto:${CONTACT.contactEmail}`)}
            >
              Contact sales
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              size="md"
              onClick={() => window.open(CONTACT.calendar, "_blank")}
            >
              Book a call
            </MagneticButton>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Payment method card                                                */
/* ------------------------------------------------------------------ */

function PaymentCard({ paymentMethod }: { paymentMethod: PaymentMethodData | null }) {
  return (
    <Reveal delay={0.2} className="h-full">
      <div className="flex h-full flex-col gap-6 rounded-2xl border border-hairline bg-background/60 p-7">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Payment method
        </p>

        {paymentMethod ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
              <CreditCard size={22} strokeWidth={1.5} className="text-foreground/70" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                {paymentMethod.brand} •••• {paymentMethod.last4}
              </p>
              <p className="text-sm text-muted">
                Expires {String(paymentMethod.expMonth).padStart(2, "0")}/
                {paymentMethod.expYear}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-hairline bg-white/[0.02] px-4 py-5 text-center">
            <p className="text-sm text-muted">No card on file</p>
            <p className="mt-1 text-xs text-muted/70">
              We invoice by milestone — reach out to update payment details.
            </p>
          </div>
        )}

        <MagneticButton
          variant="outline"
          size="md"
          cursorText="Go"
          className="mt-auto self-start"
          onClick={() => (window.location.href = `mailto:${CONTACT.contactEmail}`)}
        >
          Update payment method
        </MagneticButton>

        <p className="flex items-center gap-1.5 text-xs text-muted/70">
          <ShieldCheck size={13} className="shrink-0 text-emerald-400" />
          Payments are encrypted and processed securely.
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Invoices table                                                     */
/* ------------------------------------------------------------------ */

function InvoicesTable({ invoices }: { invoices: InvoiceData[] }) {
  return (
    <Reveal delay={0.25}>
      <div className="overflow-hidden rounded-2xl border border-hairline bg-background/60">
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Invoices
          </p>
          <span className="font-mono text-xs text-muted">
            {invoices.length} total
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="px-6 pb-6 text-sm text-muted">
            No invoices yet. Invoices appear here as milestones are billed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-t border-hairline text-xs uppercase tracking-widest text-muted">
                  <th className="px-6 py-3 font-medium">Invoice</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 text-right font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t border-hairline/60 transition-colors duration-300 hover:bg-white/[0.02]"
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
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                          STATUS_STYLES[invoice.status] ?? "border-hairline bg-white/5 text-muted"
                        )}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Plan selection (no active subscription)                            */
/* ------------------------------------------------------------------ */

function PlanSelection({
  plans,
  onSubscribe,
  subscribing,
}: {
  plans: PlanData[];
  onSubscribe: (key: string) => void;
  subscribing: string | null;
}) {
  return (
    <div>
      <Reveal>
        <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Pick the engagement that fits your stage. Every project starts with a
          free discovery call — choose a plan and we&apos;ll map out your build.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
        {plans.map((plan, i) => (
          <Reveal key={plan.key} delay={i * 0.08}>
            <div
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-2xl border p-8",
                plan.highlighted
                  ? "border-accent/40 bg-surface md:shadow-[0_30px_90px_-40px_rgba(230,57,70,0.35)]"
                  : "border-hairline bg-surface/60"
              )}
            >
              {plan.highlighted && (
                <>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-6 -top-24 h-40 rotate-6 bg-gradient-to-b from-white/[0.08] to-transparent"
                  />
                  <span className="absolute right-6 top-6 rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                    Most recommended
                  </span>
                </>
              )}

              <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-foreground">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{plan.tagline}</p>

              <div className="mt-6">
                <span className="font-display text-2xl font-bold text-foreground lg:text-3xl">
                  {plan.priceRange}
                </span>
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {plan.specs.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-start gap-3 text-sm text-foreground/85"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {spec}
                  </li>
                ))}
              </ul>

              <MagneticButton
                variant={plan.highlighted ? "solid" : "outline"}
                size="md"
                cursorText="Go"
                className="mt-8 w-full"
                disabled={subscribing !== null}
                onClick={() => onSubscribe(plan.key)}
              >
                {subscribing === plan.key ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Choosing…
                  </>
                ) : (
                  "Choose this plan"
                )}
              </MagneticButton>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <p className="mt-10 text-center text-xs text-muted">
          Custom scope available. Every project starts with a free discovery call.
        </p>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BillingPage() {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscribing, setSubscribing] = useState<string | null>(null);

  /* Auth guard — key on the stored token, not isAuthenticated, so a
     transient /api/auth/me network failure doesn't bounce a valid user to login. */
  useEffect(() => {
    if (!isLoading && !token) router.push("/login");
  }, [isLoading, token, router]);

  const loadBilling = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing", {
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.message || "Failed to load billing");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadBilling();
  }, [token, loadBilling]);

  const handleSubscribe = async (planKey: string) => {
    if (!token) return;
    setSubscribing(planKey);
    setError("");
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planKey }),
      });
      const json = await res.json();
      if (json.success) {
        await loadBilling();
      } else {
        setError(json.message || "Could not subscribe");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubscribing(null);
    }
  };

  if (isLoading || !token) return null;

  const firstName = user?.name?.split(" ")[0] ?? "User";
  const hasSubscription = !!data?.subscription?.plan;

  return (
    <div className="relative mx-auto min-h-screen max-w-7xl px-6 pb-24 pt-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs tracking-wideish text-accent">
              SC.BL
            </span>
            <span className="h-px w-8 bg-hairline" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Billing
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
            Billing &amp; invoices
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage your subscription, invoices, and payment method, {firstName}.
          </p>
        </div>

        <MagneticButton
          variant="outline"
          size="md"
          cursorText="Go"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </MagneticButton>
      </motion.div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mb-8 flex items-center gap-3 overflow-hidden rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-red-300"
          >
            <AlertCircle size={16} className="shrink-0 text-accent" />
            {error}
            <button
              data-cursor="hover"
              onClick={loadBilling}
              className="ml-auto shrink-0 text-xs uppercase tracking-widest text-foreground/70 underline underline-offset-2 hover:text-accent"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && !data ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-muted">Loading your billing…</p>
        </div>
      ) : !hasSubscription ? (
        /* Plan selection */
        <PlanSelection
          plans={data?.plans ?? []}
          onSubscribe={handleSubscribe}
          subscribing={subscribing}
        />
      ) : data?.subscription ? (
        <>
          {/* Stat tiles */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile
              label="Next invoice"
              value={
                data.stats.nextInvoice
                  ? formatMoney(data.stats.nextInvoice.amount)
                  : "—"
              }
              sub={
                data.stats.nextInvoice
                  ? `Due ${formatDate(data.stats.nextInvoice.dueDate)}`
                  : "No upcoming invoices"
              }
              icon={Calendar}
              accent="border-l-accent"
              glow="rgba(230,57,70,0.15)"
              delay={0}
            />
            <StatTile
              label="Payment method"
              value={
                data.paymentMethod
                  ? `•••• ${data.paymentMethod.last4}`
                  : "None"
              }
              sub={
                data.paymentMethod
                  ? `${data.paymentMethod.brand} · Exp ${String(
                      data.paymentMethod.expMonth
                    ).padStart(2, "0")}/${data.paymentMethod.expYear}`
                  : "Invoiced per milestone"
              }
              icon={CreditCard}
              accent="border-l-blue-500"
              glow="rgba(59,130,246,0.15)"
              delay={0.05}
            />
            <StatTile
              label="Total billed"
              value={formatMoney(data.stats.totalBilled)}
              sub="Paid to date"
              icon={Receipt}
              accent="border-l-emerald-500"
              glow="rgba(16,185,129,0.15)"
              delay={0.1}
            />
          </div>

          {/* Plan + payment method */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <PlanCard subscription={data.subscription} />
            <PaymentCard paymentMethod={data.paymentMethod} />
          </div>

          {/* Invoices */}
          <div className="mt-6">
            <InvoicesTable invoices={data.invoices} />
          </div>
        </>
      ) : null}
    </div>
  );
}
