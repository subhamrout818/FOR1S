import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { r2Request } from "@/lib/r2-storage";

export const runtime = "nodejs";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await context.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, name: true, client: { select: { id: true, name: true, email: true } } },
    });
    if (!project) return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });

    const files = await prisma.fileAsset.findMany({
      where: { projectId, OR: [{ mimeType: { startsWith: "image/" } }, { kind: "image" }] },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, mimeType: true, size: true, kind: true, createdAt: true,
        uploader: { select: { name: true, email: true } },
      },
    });
    return NextResponse.json({ success: true, project, files });
  } catch (error) {
    console.error("Admin project files error:", error);
    return NextResponse.json({ success: false, message: "Unable to load project uploads" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await context.params;
  const body = await req.json().catch(() => null) as { fileId?: unknown } | null;
  const fileId = typeof body?.fileId === "string" ? body.fileId : "";
  if (!fileId) return NextResponse.json({ success: false, message: "File ID is required" }, { status: 400 });

  try {
    const file = await prisma.fileAsset.findFirst({
      where: { id: fileId, projectId },
      select: { id: true, name: true, url: true, uploadedById: true },
    });
    if (!file) return NextResponse.json({ success: false, message: "File not found in this project" }, { status: 404 });
    if (!file.url.startsWith("r2://")) {
      return NextResponse.json({ success: false, message: "Only private R2 uploads can be deleted here" }, { status: 400 });
    }

    const key = file.url.slice(5);
    const owner = await prisma.project.findUnique({ where: { id: projectId }, select: { clientId: true } });
    if (!owner || !key.startsWith(`clients/${owner.clientId}/${projectId}/`) || key.includes("..")) {
      return NextResponse.json({ success: false, message: "File storage reference is invalid" }, { status: 400 });
    }

    const removed = await r2Request("DELETE", key);
    if (!removed.ok && removed.status !== 404) {
      return NextResponse.json({ success: false, message: "Cloud storage could not delete this image. The file record was kept." }, { status: 502 });
    }
    await prisma.fileAsset.delete({ where: { id: file.id } });
    return NextResponse.json({ success: true, fileId: file.id });
  } catch (error) {
    console.error("Admin project file deletion error:", error);
    return NextResponse.json({ success: false, message: "Unable to delete this upload" }, { status: 500 });
  }
}
