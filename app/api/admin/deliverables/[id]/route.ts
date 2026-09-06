import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([
    "draft",
    "in-review",
    "changes-requested",
    "approved",
    "delivered",
  ]),
});

/** Admin-side status updates (e.g. mark delivered, back to draft, etc.). */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const parsed = statusSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.deliverable
    .findUnique({ where: { id } })
    .catch(() => null);
  if (!existing) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const deliverable = await prisma.deliverable.update({
    where: { id },
    data: {
      status: parsed.data.status,
      deliveredAt:
        parsed.data.status === "delivered" || parsed.data.status === "approved"
          ? new Date()
          : null, // reverting clears the delivered stamp so clients see the real state
    },
  });

  return NextResponse.json({ success: true, status: deliverable.status });
}
