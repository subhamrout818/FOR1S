import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const commentSchema = z.object({
  body: z.string().trim().min(1, "Write a comment first").max(2000),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = commentSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Must own the project the deliverable belongs to.
  const deliverable = await prisma.deliverable.findFirst({
    where: { id: params.id, project: { clientId: user.id } },
    include: { project: { select: { id: true, name: true } } },
  });
  if (!deliverable) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const comment = await prisma.$transaction(async (tx) => {
    const created = await tx.comment.create({
      data: { deliverableId: deliverable.id, authorId: user.id, body: parsed.data.body },
    });
    await tx.activityEvent.create({
      data: {
        projectId: deliverable.projectId,
        actorId: user.id,
        type: "comment",
        title: `New comment on ${deliverable.title}`,
        detail: parsed.data.body,
      },
    });
    return created;
  });

  return NextResponse.json({ success: true, comment }, { status: 201 });
}
