export type MoneyValue = number | { toString(): string } | null | undefined;

function numeric(value: MoneyValue): number {
  const parsed = value == null ? 0 : typeof value === "number" ? value : Number(value.toString());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function sumCompletedPayments(
  payments: readonly { status: string; amount: MoneyValue }[]
): number {
  return payments.reduce(
    (total, payment) => total + (payment.status === "completed" ? numeric(payment.amount) : 0),
    0
  );
}

export function remainingInvoiceBalance(amount: MoneyValue, paid: number): number {
  return Math.max(0, numeric(amount) - Math.max(0, paid));
}

export function remainingProjectBalance(projectValue: MoneyValue, paid: number): number {
  return Math.max(0, numeric(projectValue) - Math.max(0, paid));
}

/** Derive the visible invoice state from the payment ledger, not a stale status flag. */
export function reconciledInvoiceStatus(
  status: string,
  dueDate: string | Date | null,
  amount: MoneyValue,
  paid: number,
  now: Date = new Date()
): string {
  if (status === "cancelled") return "cancelled";
  if (remainingInvoiceBalance(amount, paid) === 0) return "paid";
  if (dueDate && new Date(dueDate).getTime() < now.getTime()) return "overdue";
  return "pending";
}
