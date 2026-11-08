import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { r2Request } from "@/lib/r2-storage";

export const runtime = "nodejs";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      files: { select: { id: true, url: true } },
      deliverables: {
        include: {
          versions: { select: { id: true, mediaUrl: true, posterUrl: true } },
        },
      },
      invoices: {
        include: { payments: { where: { status: "completed" }, select: { amount: true } } },
        orderBy: { issuedAt: "asc" },
      },
    },
  });

  if (!project) return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
  if (project.archivedAt) return NextResponse.json({ success: true, alreadyArchived: true });

  // Only delete objects uploaded into this exact client's project namespace.
  const ownedPrefix = `clients/${project.clientId}/${project.id}/`;
  const keys = new Set<string>();
  const collect = (value: string | null) => {
    if (!value?.startsWith("r2://")) return;
    const key = value.slice(5);
    if (key.startsWith(ownedPrefix) && !key.includes("..")) keys.add(key);
  };
  project.files.forEach((file) => collect(file.url));
  project.deliverables.forEach((d) => {
    collect(d.mediaUrl);
    collect(d.posterUrl);
    d.versions.forEach((v) => { collect(v.mediaUrl); collect(v.posterUrl); });
  });

  // Idempotent deletes: missing objects are already cleaned up. Abort on any
  // other storage error so the project is not marked archived prematurely.
  try {
    for (const key of keys) {
      const result = await r2Request("DELETE", key);
      if (!result.ok && result.status !== 404) {
        return NextResponse.json(
          { success: false, message: "Cloud storage cleanup failed. The project was not archived; retry after checking R2." },
          { status: 502 }
        );
      }
    }
  } catch (error) {
    console.error("Project archive storage cleanup failed:", error);
    return NextResponse.json({ success: false, message: "Cloud storage is unavailable. The project was not archived." }, { status: 502 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const archivedAt = new Date();
      await tx.project.update({ where: { id }, data: { archivedAt, status: "completed" } });

      // Keep deliverable metadata for the client's historical record, but
      // remove dead R2 references so the portal never presents broken media.
      await tx.deliverable.updateMany({
        where: { projectId: id },
        data: { mediaUrl: null, posterUrl: null },
      });
      const deliverableIds = project.deliverables.map((d) => d.id);
      if (deliverableIds.length) {
        await tx.deliverableVersion.updateMany({
          where: { deliverableId: { in: deliverableIds } },
          data: { mediaUrl: null, posterUrl: null },
        });
      }
      if (project.files.length) {
        await tx.fileAsset.deleteMany({ where: { projectId: id, url: { startsWith: "r2://" } } });
      }

      // Reconcile only an unpaid invoice linked to this project. Never rewrite
      // paid invoices or payment rows; the issued/settled financial record stays auditable.
      const reduction = Number(project.value ?? 0);
      if (reduction > 0) {
        let remainingReduction = reduction;
        for (const invoice of project.invoices) {
          if (remainingReduction <= 0 || invoice.status === "paid" || invoice.status === "cancelled") continue;
          const paid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
          const currentAmount = Number(invoice.amount);
          const reducible = Math.max(0, currentAmount - paid);
          const applied = Math.min(reducible, remainingReduction);
          if (applied <= 0) continue;
          const nextAmount = Math.max(paid, currentAmount - applied);
          await tx.invoice.update({
            where: { id: invoice.id },
            data: {
              amount: nextAmount,
              ...(nextAmount <= paid ? { status: "paid" } : {}),
              description: `${invoice.description} (project archived; ${applied.toFixed(2)} credited)`,
            },
          });
          remainingReduction -= applied;
        }
      }

      await tx.activityEvent.create({
        data: {
          projectId: id,
          actorId: user.id,
          type: "system",
          title: `Project "${project.name}" archived`,
          detail: `Historical project record retained. ${keys.size} R2 object(s) cleaned up. Paid invoices and payment records preserved.`,
        },
      });
    });
    return NextResponse.json({ success: true, archived: true, deletedObjects: keys.size });
  } catch (error) {
    console.error("Project archive transaction failed:", error);
    return NextResponse.json({ success: false, message: "Storage was cleaned, but the archive record could not be saved. Retry the archive action; storage deletion is safe to repeat." }, { status: 500 });
  }
}
