import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Resolve the authenticated user from the Bearer token, or null when the
 * request carries no valid session.
 */
async function getAuthedUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true },
  });
}

/**
 * GET /api/billing — full billing overview for the current user.
 * Returns the active subscription + plan, available plans, invoices,
 * payment method, and computed stats.
 */
export async function GET(req: Request) {
  try {
    const user = await getAuthedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const [subscription, invoices, paymentMethods, plans] = await Promise.all([
      prisma.subscription.findUnique({
        where: { userId: user.id },
        include: { plan: true },
      }),
      prisma.invoice.findMany({
        where: { userId: user.id },
        orderBy: { issuedAt: "desc" },
      }),
      prisma.paymentMethod.findMany({
        where: { userId: user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      }),
      prisma.plan.findMany({ orderBy: { price: "asc" } }),
    ]);

    const defaultPayment =
      paymentMethods.find((pm) => pm.isDefault) ?? paymentMethods[0] ?? null;

    const nextInvoice =
      invoices
        .filter((inv) => inv.status === "pending" || inv.status === "overdue")
        .sort(
          (a, b) =>
            (a.dueDate ?? a.issuedAt).getTime() -
            (b.dueDate ?? b.issuedAt).getTime()
        )[0] ?? null;

    const totalBilled = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    return NextResponse.json({
      success: true,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            plan: subscription.plan
              ? {
                  key: subscription.plan.key,
                  name: subscription.plan.name,
                  tagline: subscription.plan.tagline,
                  price: Number(subscription.plan.price),
                  priceRange: subscription.plan.priceRange,
                  specs: subscription.plan.specs,
                }
              : null,
          }
        : null,
      plans: plans.map((plan) => ({
        key: plan.key,
        name: plan.name,
        tagline: plan.tagline,
        price: Number(plan.price),
        priceRange: plan.priceRange,
        highlighted: plan.highlighted,
        specs: plan.specs,
      })),
      invoices: invoices.map((inv) => ({
        id: inv.id,
        number: inv.number,
        description: inv.description,
        amount: Number(inv.amount),
        status: inv.status,
        dueDate: inv.dueDate,
        issuedAt: inv.issuedAt,
      })),
      paymentMethod: defaultPayment
        ? {
            id: defaultPayment.id,
            brand: defaultPayment.brand,
            last4: defaultPayment.last4,
            expMonth: defaultPayment.expMonth,
            expYear: defaultPayment.expYear,
          }
        : null,
      stats: {
        nextInvoice: nextInvoice
          ? {
              number: nextInvoice.number,
              amount: Number(nextInvoice.amount),
              dueDate: nextInvoice.dueDate,
            }
          : null,
        totalBilled,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const subscribeSchema = z.object({
  planKey: z.string().min(1, "Plan is required"),
});

/**
 * POST /api/billing — subscribe (or switch) the current user to a plan.
 * Creates an initial milestone invoice the first time the user subscribes.
 */
export async function POST(req: Request) {
  try {
    const user = await getAuthedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.findUnique({
      where: { key: result.data.planKey },
    });
    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Plan not found" },
        { status: 404 }
      );
    }

    // Subscribe + first milestone invoice in one transaction so a failed
    // invoice insert rolls back the plan switch.
    const [subscription] = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.upsert({
        where: { userId: user.id },
        update: { planId: plan.id, status: "active" },
        create: { userId: user.id, planId: plan.id, status: "active" },
      });

      // First-time subscribers get a milestone invoice so the billing page
      // has a real invoice to show. The number embeds a per-user segment so
      // it stays globally unique across users (Invoice.number is @unique).
      const invoiceCount = await tx.invoice.count({ where: { userId: user.id } });
      if (invoiceCount === 0) {
        const number = `INV-${new Date().getFullYear()}-${user.id
          .slice(-6)
          .toUpperCase()}-${String(invoiceCount + 1).padStart(3, "0")}`;
        await tx.invoice.create({
          data: {
            number,
            userId: user.id,
            description: `${plan.name} — Milestone 1`,
            amount: plan.price,
            status: "pending",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });
      }

      return [sub];
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.planId,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
