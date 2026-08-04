import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";

/**
 * Simulated payment. In production this endpoint would create a Razorpay order
 * and confirm on webhook — here it marks the invoice paid directly.
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, userId: user.id },
    include: { project: { select: { id: true, name: true } } },
  });
  if (!invoice) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
  if (invoice.status === "paid") {
    return NextResponse.json(
      { success: false, message: "This invoice is already paid" },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        invoiceId: invoice.id,
        userId: user.id,
        amount: invoice.amount,
        method: "upi",
        status: "completed",
        reference: `SIM-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      },
    });
    await tx.invoice.update({
      where: { id: invoice.id },
      data: { status: "paid" },
    });
    await tx.activityEvent.create({
      data: {
        projectId: invoice.projectId,
        actorId: user.id,
        type: "payment",
        title: "Payment received",
        detail: `${invoice.number} · ₹${Number(invoice.amount)}`,
      },
    });
  });

  return NextResponse.json({ success: true });
}
