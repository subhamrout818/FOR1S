import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z
  .object({
    progress: z.number().int().min(0).max(100).optional(),
    status: z.enum(["active", "paused", "completed"]).optional(),
  })
  .refine((v) => v.progress !== undefined || v.status !== undefined, {
    message: "Nothing to update",
  });

const STATUS_LABEL: Record<string, string> = {
  active: "in progress",
  paused: "paused",
  completed: "completed",
};

/** POST /api/admin/projects/[id] — admin sets a project's progress / status. */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors, message: "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.project.findUnique({
    where: { id },
    select: { id: true, name: true, progress: true, status: true },
  });
  if (!existing) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const { progress, status } = parsed.data;
  try {
    const project = await prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id },
        data: {
          ...(progress !== undefined ? { progress } : {}),
          ...(status !== undefined ? { status } : {}),
        },
        select: { id: true, progress: true, status: true },
      });

      // Surface the change in the client's activity feed.
      const changes: string[] = [];
      if (progress !== undefined && progress !== existing.progress) {
        changes.push(`progress updated to ${progress}%`);
      }
      if (status !== undefined && status !== existing.status) {
        changes.push(`marked ${STATUS_LABEL[status] ?? status}`);
      }
      if (changes.length > 0) {
        await tx.activityEvent.create({
          data: {
            projectId: id,
            actorId: user.id,
            type: "system",
            title: `${existing.name}: ${changes.join(", ")}`,
          },
        });
      }
      return updated;
    });
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
