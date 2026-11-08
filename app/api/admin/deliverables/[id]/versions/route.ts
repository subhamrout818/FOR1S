import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";

const schema = z.object({
  externalUrl: z.string().trim().url().max(2048),
  note: z.string().trim().max(2000).optional().default(""),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Enter a valid http(s) link and optional revision note." }, { status: 400 });
  }
  const url = new URL(parsed.data.externalUrl);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    return NextResponse.json({ success: false, message: "Only public http(s) links are allowed." }, { status: 400 });
  }

  const { id } = await params;
  const existing = await prisma.deliverable.findUnique({
    where: { id },
    include: { project: { select: { id: true, name: true, archivedAt: true } } },
  });
  if (!existing) return NextResponse.json({ success: false, message: "Deliverable not found." }, { status: 404 });
  if (existing.project.archivedAt) return NextResponse.json({ success: false, message: "Archived projects cannot receive new deliverable versions." }, { status: 409 });

  try {
    const version = await prisma.$transaction(async (tx) => {
      const nextVersion = existing.version + 1;
      const created = await tx.deliverableVersion.create({
        data: {
          deliverableId: existing.id,
          version: nextVersion,
          status: "in-review",
          note: parsed.data.note || `Version ${nextVersion} submitted for review`,
          externalUrl: parsed.data.externalUrl,
        },
      });
      await tx.deliverable.update({
        where: { id: existing.id },
        data: {
          version: nextVersion,
          status: "in-review",
          mediaUrl: null,
          posterUrl: null,
          externalUrl: parsed.data.externalUrl,
          deliveredAt: null,
        },
      });
      await tx.activityEvent.create({
        data: {
          projectId: existing.projectId,
          actorId: user.id,
          type: "upload",
          title: `New version submitted: ${existing.title} (v${nextVersion})`,
          detail: parsed.data.note || parsed.data.externalUrl,
        },
      });
      return created;
    });
    return NextResponse.json({ success: true, version }, { status: 201 });
  } catch (error) {
    console.error("Deliverable version submission failed:", error);
    return NextResponse.json({ success: false, message: "Couldn't submit this version. Try again." }, { status: 500 });
  }
}
