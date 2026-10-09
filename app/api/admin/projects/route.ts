import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  clientId: z.string().min(1),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  tagline: z.string().trim().max(200).optional(),
  status: z.enum(["active", "paused", "completed"]).optional(),
  progress: z.number().int().min(0).max(100).optional(),
});

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  // Random suffix keeps slugs unique without a lookup race.
  return `${base || "project"}-${randomBytes(3).toString("hex")}`;
}

/** POST /api/admin/projects — admin creates a project for a client. */
export async function POST(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { clientId, name, tagline, status, progress } = parsed.data;

  const client = await prisma.user.findUnique({
    where: { id: clientId },
    select: { id: true, role: true },
  });
  if (!client || client.role !== "client") {
    return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
  }

  try {
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          clientId,
          name,
          slug: slugify(name),
          tagline: tagline || null,
          status: status ?? "active",
          progress: progress ?? 0,
        },
        select: { id: true, slug: true },
      });
      await tx.activityEvent.create({
        data: {
          projectId: created.id,
          actorId: user.id,
          type: "system",
          title: `Project "${name}" started`,
        },
      });
      return created;
    });
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
