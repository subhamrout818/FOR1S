import { CONTACT, SITE_URL } from "@/lib/contact";

export interface InvoiceForDownload {
  number: string;
  description: string;
  amount: number;
  status: string;
  issuedAt: string | null;
  dueDate: string | null;
}

export interface InvoiceDownloadOptions {
  billedToName?: string | null;
  billedToCompany?: string | null;
}

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Math.abs(n) >= 100 ? 0 : 2,
  }).format(n);

const date = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    : "—";

/**
 * Build a self-contained, printable HTML invoice. Opens in any browser and
 * prints/saves to PDF cleanly. No external fonts or scripts — fully offline.
 */
export function buildInvoiceHtml(
  invoice: InvoiceForDownload,
  opts: InvoiceDownloadOptions = {}
): string {
  const statusLabel = invoice.status === "paid" ? "Paid" : invoice.status === "overdue" ? "Overdue" : "Due";
  const statusColor = invoice.status === "paid" ? "#10b981" : invoice.status === "overdue" ? "#E63946" : "#f59e0b";
  const billTo = opts.billedToCompany || opts.billedToName || "Client";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${invoice.number}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; background: #fff; padding: 48px; }
  .wrap { max-width: 720px; margin: 0 auto; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 24px; }
  .brand { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
  .brand span { color: #E63946; }
  .brand small { display: block; font-size: 11px; font-weight: 400; letter-spacing: 0.14em; color: #666; margin-top: 4px; }
  .inv-title { text-align: right; }
  .inv-title h1 { font-size: 20px; text-transform: uppercase; letter-spacing: 0.14em; }
  .inv-title .num { font-size: 15px; color: #555; margin-top: 4px; }
  .inv-title .status { display: inline-block; margin-top: 10px; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #fff; background: ${statusColor}; }
  .meta { display: flex; justify-content: space-between; gap: 32px; margin-top: 28px; }
  .meta h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 6px; }
  .meta p { font-size: 14px; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; margin-top: 32px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; border-bottom: 1px solid #ddd; padding: 10px 0; }
  td { padding: 14px 0; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
  td.amount { text-align: right; font-weight: 600; }
  .total { margin-top: 20px; text-align: right; }
  .total .row { display: flex; justify-content: flex-end; gap: 24px; padding: 6px 0; font-size: 14px; }
  .total .grand { font-size: 18px; font-weight: 700; border-top: 2px solid #111; margin-top: 6px; padding-top: 12px; }
  .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; display: flex; justify-content: space-between; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div class="brand">FOR1S<span>.</span>
        <small>WEBSITES THAT WIN CUSTOMERS</small>
      </div>
      <div class="inv-title">
        <h1>Invoice</h1>
        <div class="num">${invoice.number}</div>
        <div class="status">${statusLabel}</div>
      </div>
    </div>

    <div class="meta">
      <div>
        <h2>From</h2>
        <p>FOR1S Digital<br />${CONTACT.email}<br />${SITE_URL}</p>
      </div>
      <div>
        <h2>Bill to</h2>
        <p>${billTo}</p>
      </div>
      <div>
        <h2>Dates</h2>
        <p>Issued: ${date(invoice.issuedAt)}<br />Due: ${date(invoice.dueDate)}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr><th>Description</th><th style="text-align:right">Amount</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>${invoice.description}</td>
          <td class="amount">${money(invoice.amount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="total">
      <div class="row grand"><span>Total</span><span>${money(invoice.amount)}</span></div>
    </div>

    <div class="footer">
      <span>Thank you for working with FOR1S.</span>
      <span>Invoice ${invoice.number}</span>
    </div>
  </div>
</body>
</html>`;
}

/** Trigger a client-side download of the invoice as an HTML file. */
export function downloadInvoiceHtml(
  invoice: InvoiceForDownload,
  opts: InvoiceDownloadOptions = {}
): void {
  const html = buildInvoiceHtml(invoice, opts);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `FOR1S-${invoice.number}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
