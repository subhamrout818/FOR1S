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
