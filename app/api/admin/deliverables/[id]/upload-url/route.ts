import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { createR2UploadUrl } from "@/lib/r2-storage";
import { getDeliverableFileKind } from "@/lib/r2-upload-validation";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 160) : "";
  const mimeType = typeof body?.mimeType === "string" ? body.mimeType.toLowerCase() : "";
  const size = Number(body?.size);
  const kind = getDeliverableFileKind(name, mimeType, size);
  if (!name || !kind) return NextResponse.json({ success: false, message: "Supported: images up to 10 MB, videos up to 200 MB, and PDFs up to 25 MB." }, { status: 400 });

  const deliverable = await prisma.deliverable.findUnique({
    where: { id },
    include: { project: { select: { id: true, clientId: true, archivedAt: true } } },
  });
  if (!deliverable) return NextResponse.json({ success: false, message: "Deliverable not found." }, { status: 404 });
  if (deliverable.project.archivedAt) return NextResponse.json({ success: false, message: "Archived projects are read-only." }, { status: 409 });

  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "deliverable";
  const key = `clients/${deliverable.project.clientId}/${deliverable.project.id}/deliverables/${id}/${randomUUID()}-${safeName}`;
  try {
    return NextResponse.json({
      success: true,
      uploadUrl: createR2UploadUrl(key, mimeType, 900),
      objectKey: key,
      name,
      mimeType,
      size,
      kind,
    });
  } catch (error) {
    console.error("Deliverable upload URL error:", error);
    return NextResponse.json({ success: false, message: "Unable to prepare upload. Check R2 configuration." }, { status: 500 });
  }
}
