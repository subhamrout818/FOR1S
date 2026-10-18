import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const dateInput = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date (YYYY-MM-DD)").nullable().optional();

const updateSchema = z
  .object({
    progress: z.number().int().min(0).max(100).optional(),
    status: z.enum(["active", "paused", "completed"]).optional(),
    value: z.number().finite().min(0).max(9999999999).nullable().optional(),
    nextDeadline: dateInput,
    endsAt: dateInput,
  })
  .refine((v) => Object.values(v).some((value) => value !== undefined), {
    message: "Nothing to update",
  });

const STATUS_LABEL: Record<string, string> = {
  active: "in progress",
  paused: "paused",
  completed: "completed",
};

function parseDateInput(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateLabel(value: Date | null | undefined): string {
  return value ? value.toISOString().slice(0, 10) : "not set";
}

/** POST /api/admin/projects/[id] — admin updates project commercial details and progress. */
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
    select: { id: true, name: true, progress: true, status: true, value: true, nextDeadline: true, endsAt: true },
  });
  if (!existing) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const { progress, status, value, nextDeadline, endsAt } = parsed.data;
  const parsedNextDeadline = parseDateInput(nextDeadline);
  const parsedEndsAt = parseDateInput(endsAt);
  const effectiveDeadline = nextDeadline !== undefined ? parsedNextDeadline : existing.nextDeadline;
  const effectiveEnd = endsAt !== undefined ? parsedEndsAt : existing.endsAt;

  if (nextDeadline && !parsedNextDeadline) {
    return NextResponse.json({ success: false, message: "Invalid next deadline." }, { status: 400 });
  }
  if (endsAt && !parsedEndsAt) {
    return NextResponse.json({ success: false, message: "Invalid target end date." }, { status: 400 });
  }
  if (effectiveDeadline && effectiveEnd && effectiveEnd.getTime() < effectiveDeadline.getTime()) {
    return NextResponse.json({ success: false, message: "Target end date cannot be before the next deadline." }, { status: 400 });
  }

  try {
    const project = await prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id },
        data: {
          ...(progress !== undefined ? { progress } : {}),
          ...(status !== undefined ? { status } : {}),
          ...(value !== undefined ? { value } : {}),
          ...(nextDeadline !== undefined ? { nextDeadline: parsedNextDeadline } : {}),
          ...(endsAt !== undefined ? { endsAt: parsedEndsAt } : {}),
        },
        select: { id: true, progress: true, status: true, value: true, nextDeadline: true, endsAt: true },
      });

      const changes: string[] = [];
      if (progress !== undefined && progress !== existing.progress) changes.push(`progress updated to ${progress}%`);
      if (status !== undefined && status !== existing.status) changes.push(`marked ${STATUS_LABEL[status] ?? status}`);
      if (value !== undefined && Number(value ?? 0) !== Number(existing.value ?? 0)) {
        changes.push(value === null ? "project value cleared" : `project value set to ${value}`);
      }
      if (nextDeadline !== undefined && dateLabel(parsedNextDeadline) !== dateLabel(existing.nextDeadline)) {
        changes.push(`next deadline changed to ${dateLabel(parsedNextDeadline)}`);
      }
      if (endsAt !== undefined && dateLabel(parsedEndsAt) !== dateLabel(existing.endsAt)) {
        changes.push(`target end date changed to ${dateLabel(parsedEndsAt)}`);
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
