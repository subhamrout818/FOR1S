import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["draft", "in-review", "changes-requested", "approved", "delivered"]),
});

/** Admin-side status updates, keeping the current version and activity feed in sync. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const parsed = statusSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existing = await prisma.deliverable.findUnique({
    where: { id },
    include: { project: { select: { id: true, name: true, archivedAt: true } } },
  });
  if (!existing) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  if (existing.project.archivedAt) {
    return NextResponse.json({ success: false, message: "Archived projects are read-only." }, { status: 409 });
  }

  const status = parsed.data.status;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.deliverable.update({
        where: { id },
        data: {
          status,
          deliveredAt: status === "delivered" || status === "approved"
            ? existing.deliveredAt ?? new Date()
            : null,
        },
      });
      await tx.deliverableVersion.updateMany({
        where: { deliverableId: id, version: existing.version },
        data: { status },
      });
      await tx.activityEvent.create({
        data: {
          projectId: existing.projectId,
          actorId: user.id,
          type: status === "approved" ? "approval" : status === "delivered" ? "delivery" : "system",
          title: `${existing.title}: status changed to ${status}`,
        },
      });
    });
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Admin deliverable status update failed:", error);
    return NextResponse.json({ success: false, message: "Couldn't update this deliverable." }, { status: 500 });
  }
}
