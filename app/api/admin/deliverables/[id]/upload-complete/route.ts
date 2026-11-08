import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { r2Request } from "@/lib/r2-storage";
import { getDeliverableFileKind, matchesDeliverableSignature } from "@/lib/r2-upload-validation";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const mimeType = typeof body?.mimeType === "string" ? body.mimeType.toLowerCase() : "";
  const size = Number(body?.size);
  const key = typeof body?.objectKey === "string" ? body.objectKey : "";
  const kind = getDeliverableFileKind(name, mimeType, size);
  const deliverable = await prisma.deliverable.findUnique({
    where: { id },
    include: { project: { select: { id: true, clientId: true, archivedAt: true } } },
  });
  if (!deliverable) return NextResponse.json({ success: false, message: "Deliverable not found." }, { status: 404 });
  const prefix = `clients/${deliverable.project.clientId}/${deliverable.project.id}/deliverables/${id}/`;
  if (deliverable.project.archivedAt) return NextResponse.json({ success: false, message: "Archived projects are read-only." }, { status: 409 });
  if (!kind || !key.startsWith(prefix) || key.includes("..")) return NextResponse.json({ success: false, message: "Invalid upload details." }, { status: 400 });

  try {
    const head = await r2Request("HEAD", key);
    const storedSize = Number(head.headers.get("content-length"));
    if (!head.ok || !Number.isSafeInteger(storedSize) || storedSize !== size) {
      return NextResponse.json({ success: false, message: "Uploaded file size could not be verified." }, { status: 400 });
    }
    const sample = await r2Request("GET", key, "bytes=0-31");
    if (!sample.ok) return NextResponse.json({ success: false, message: "Uploaded file could not be verified." }, { status: 400 });
    const bytes = new Uint8Array(await sample.arrayBuffer());
    if (!matchesDeliverableSignature(bytes, mimeType)) {
      await r2Request("DELETE", key).catch(() => undefined);
      return NextResponse.json({ success: false, message: "File content does not match its declared type." }, { status: 400 });
    }

    const nextVersion = deliverable.version + 1;
    const version = await prisma.$transaction(async (tx) => {
      const created = await tx.deliverableVersion.create({
        data: {
          deliverableId: id,
          version: nextVersion,
          status: "in-review",
          note: typeof body.note === "string" ? body.note.trim().slice(0, 2000) : `Version ${nextVersion} submitted`,
          mediaUrl: `r2://${key}`,
        },
      });
      await tx.deliverable.update({
        where: { id },
        data: { version: nextVersion, status: "in-review", mediaUrl: `r2://${key}`, posterUrl: null, externalUrl: null, deliveredAt: null },
      });
      await tx.activityEvent.create({
        data: { projectId: deliverable.project.id, actorId: user.id, type: "upload", title: `New file submitted: ${deliverable.title} (v${nextVersion})`, detail: `${name} · ${(size / (1024 * 1024)).toFixed(1)} MB` },
      });
      return created;
    });
    return NextResponse.json({ success: true, version }, { status: 201 });
  } catch (error) {
    console.error("Deliverable upload completion error:", error);
    return NextResponse.json({ success: false, message: "Unable to complete the upload. Check storage and retry." }, { status: 500 });
  }
}
