import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const reviewSchema = z.object({
  action: z.enum(["approve", "changes"]),
  note: z.string().trim().max(2000).optional().default(""),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = reviewSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { action, note } = parsed.data;

  const deliverable = await prisma.deliverable.findFirst({
    where: { id: params.id, project: { clientId: user.id } },
    include: { project: { select: { id: true, name: true } } },
  });
  if (!deliverable) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const status = action === "approve" ? "approved" : "changes-requested";
  const title =
    action === "approve"
      ? `${deliverable.title} approved`
      : `Changes requested on ${deliverable.title}`;

  await prisma.$transaction(async (tx) => {
    await tx.deliverable.update({
      where: { id: deliverable.id },
      data: { status },
    });
    if (note) {
      await tx.comment.create({
        data: { deliverableId: deliverable.id, authorId: user.id, body: note },
      });
    }
    await tx.activityEvent.create({
      data: {
        projectId: deliverable.projectId,
        actorId: user.id,
        type: action === "approve" ? "approval" : "comment",
        title,
        detail: note || undefined,
      },
    });
  });

  return NextResponse.json({ success: true, status, note });
}
