import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  remainingInvoiceBalance,
  remainingProjectBalance,
  reconciledInvoiceStatus,
  sumCompletedPayments,
} from "../lib/portal-billing";

describe("portal billing calculations", () => {
  it("counts completed payments only", () => {
    assert.equal(
      sumCompletedPayments([
        { status: "completed", amount: 1450 },
        { status: "pending", amount: 300 },
        { status: "failed", amount: 75 },
        { status: "completed", amount: { toString: () => "120.50" } },
      ]),
      1570.5
    );
  });

  it("subtracts partial payments from an invoice without counting more than its balance", () => {
    assert.equal(remainingInvoiceBalance(1450, 700), 750);
    assert.equal(remainingInvoiceBalance(1450, 1600), 0);
  });

  it("calculates the unpaid project balance independently of invoice issuance", () => {
    assert.equal(remainingProjectBalance(3500, 0), 3500);
    assert.equal(remainingProjectBalance(3500, 2270), 1230);
    assert.equal(remainingProjectBalance(null, 100), 0);
  });
});

describe("invoice status reconciliation", () => {
  const now = new Date("2026-11-08T12:00:00.000Z");

  it("uses completed payments instead of a stale paid status", () => {
    assert.equal(reconciledInvoiceStatus("paid", null, 1450, 700, now), "pending");
  });

  it("marks fully paid invoices as paid even when the stored status is pending", () => {
    assert.equal(reconciledInvoiceStatus("pending", null, 1450, 1450, now), "paid");
  });

  it("keeps partially paid overdue invoices overdue", () => {
    assert.equal(reconciledInvoiceStatus("paid", "2026-11-01T00:00:00.000Z", 1450, 700, now), "overdue");
  });

  it("preserves cancelled invoices regardless of payment totals", () => {
    assert.equal(reconciledInvoiceStatus("cancelled", null, 1450, 0, now), "cancelled");
  });
});
