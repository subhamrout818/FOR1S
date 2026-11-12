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
      for (const deliverable of project.deliverables) {
        const deliverableMedia: { mediaUrl?: null; posterUrl?: null } = {};
        if (deliverable.mediaUrl?.startsWith("r2://") && keys.has(deliverable.mediaUrl.slice(5))) deliverableMedia.mediaUrl = null;
        if (deliverable.posterUrl?.startsWith("r2://") && keys.has(deliverable.posterUrl.slice(5))) deliverableMedia.posterUrl = null;
        if (Object.keys(deliverableMedia).length) {
          await tx.deliverable.update({ where: { id: deliverable.id }, data: deliverableMedia });
        }
        for (const version of deliverable.versions) {
          const versionMedia: { mediaUrl?: null; posterUrl?: null } = {};
          if (version.mediaUrl?.startsWith("r2://") && keys.has(version.mediaUrl.slice(5))) versionMedia.mediaUrl = null;
          if (version.posterUrl?.startsWith("r2://") && keys.has(version.posterUrl.slice(5))) versionMedia.posterUrl = null;
          if (Object.keys(versionMedia).length) {
            await tx.deliverableVersion.update({ where: { id: version.id }, data: versionMedia });
          }
        }
      }
      // Remove only file records whose R2 objects were actually selected for
      // deletion inside this project's namespace.
      if (keys.size) {
        await tx.fileAsset.deleteMany({
          where: { projectId: id, url: { in: [...keys].map((key) => `r2://${key}`) } },
        });
      }

      // Reconcile excess outstanding billing against the agreed project value.
      // Paid invoices and payment rows are immutable. Project value is the total
      // contract value, so only the amount billed above (contract value - paid)
      // is eligible for reduction; never subtract the full contract value.
      const contractValue = Number(project.value ?? 0);
      if (contractValue > 0) {
        const paidTotal = project.invoices.reduce(
          (sum, invoice) => sum + invoice.payments.reduce((paid, payment) => paid + Number(payment.amount), 0),
          0
        );
        const outstandingTotal = project.invoices
          .filter((invoice) => invoice.status !== "paid" && invoice.status !== "cancelled")
          .reduce((sum, invoice) => {
            const paid = invoice.payments.reduce((paidSum, payment) => paidSum + Number(payment.amount), 0);
            return sum + Math.max(0, Number(invoice.amount) - paid);
          }, 0);
        const allowedOutstanding = Math.max(0, contractValue - paidTotal);
        let excess = Math.max(0, outstandingTotal - allowedOutstanding);
        for (const invoice of project.invoices) {
          if (excess <= 0) break;
          if (invoice.status === "paid" || invoice.status === "cancelled") continue;
          const paid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
          const currentAmount = Number(invoice.amount);
          const reducible = Math.max(0, currentAmount - paid);
          const applied = Math.min(reducible, excess);
          if (applied <= 0) continue;
          const nextAmount = Math.max(paid, currentAmount - applied);
          await tx.invoice.update({
            where: { id: invoice.id },
            data: {
              amount: nextAmount,
              ...(nextAmount <= paid ? { status: "paid" } : {}),
              description: `${invoice.description} (archive reconciliation: ${applied.toFixed(2)} removed from outstanding)`,
            },
          });
          excess -= applied;
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
