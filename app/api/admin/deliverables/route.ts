import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const createDeliverableSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().trim().min(2).max(160),
  kind: z.enum(["reel", "photo", "design", "video", "website", "document", "other"]),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  dueAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  externalUrl: z.string().trim().url().max(2048).optional().or(z.literal("")),
});

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

/** POST /api/admin/deliverables — create a draft deliverable for a project. */
export async function POST(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = createDeliverableSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors, message: "Check the deliverable details and try again." },
      { status: 400 }
    );
  }

  const { projectId, title, kind, description, dueAt, externalUrl } = parsed.data;
  if (externalUrl) {
    const url = new URL(externalUrl);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      return NextResponse.json({ success: false, message: "Only public http(s) links are allowed." }, { status: 400 });
    }
  }
  const dueDate = parseDate(dueAt);
  if (dueAt && !dueDate) {
    return NextResponse.json({ success: false, message: "Enter a valid due date." }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, archivedAt: true },
  });
  if (!project) {
    return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
  }
  if (project.archivedAt) {
    return NextResponse.json({ success: false, message: "Archived projects cannot receive new deliverables." }, { status: 409 });
  }

  try {
    const deliverable = await prisma.$transaction(async (tx) => {
      const created = await tx.deliverable.create({
        data: {
          projectId,
          title,
          kind,
          description: description || null,
          dueAt: dueDate,
          externalUrl: externalUrl || null,
          status: "draft",
          version: 1,
        },
        select: { id: true, title: true },
      });
      await tx.deliverableVersion.create({
        data: {
          deliverableId: created.id,
          version: 1,
          status: "draft",
          note: "Initial draft",
          externalUrl: externalUrl || null,
        },
      });
      await tx.activityEvent.create({
        data: {
          projectId,
          actorId: user.id,
          type: "system",
          title: `Deliverable "${title}" created`,
          detail: `Added to ${project.name}`,
        },
      });
      return created;
    });
    return NextResponse.json({ success: true, deliverable }, { status: 201 });
  } catch (error) {
    console.error("admin deliverable creation failed:", error);
    return NextResponse.json({ success: false, message: "Couldn't create this deliverable. Please try again." }, { status: 500 });
  }
}
