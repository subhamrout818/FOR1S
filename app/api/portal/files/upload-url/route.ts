import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { createR2UploadUrl } from "@/lib/r2-storage";
import { isAllowedImageMetadata, MAX_IMAGE_BYTES } from "@/lib/r2-upload-validation";

export const runtime = "nodejs";
export async function POST(req: Request) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const projectId = typeof body.projectId === "string" ? body.projectId : "";
    const name = typeof body.name === "string" ? body.name.trim().replace(/[\\/\\0-\\x1f\\x7f]/g, "_").slice(0, 160) : "";
    const mimeType = typeof body.mimeType === "string" ? body.mimeType.toLowerCase() : "";
    const size = Number(body.size);
    if (!projectId || !name || !Number.isSafeInteger(size) || !isAllowedImageMetadata(name, mimeType, size)) {
      return NextResponse.json({ success: false, message: `Choose a JPEG, PNG, WebP or GIF image up to ${MAX_IMAGE_BYTES / (1024 * 1024)} MB.` }, { status: 400 });
    }
    const project = await prisma.project.findFirst({ where: { id: projectId, clientId: user.id }, select: { id: true } });
    if (!project) return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    let folder = await prisma.folder.findFirst({ where: { projectId: project.id, name: "Client uploads" }, select: { id: true } });
    if (!folder) folder = await prisma.folder.create({ data: { projectId: project.id, name: "Client uploads", kind: "general" }, select: { id: true } });
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "image";
    const key = `clients/${user.id}/${project.id}/${randomUUID()}-${safeName}`;
    return NextResponse.json({ success: true, uploadUrl: createR2UploadUrl(key, mimeType), objectKey: key, folderId: folder.id, projectId: project.id, name, mimeType, size });
  } catch (error) {
    console.error("R2 upload URL error:", error);
    return NextResponse.json({ success: false, message: "Unable to prepare upload. Check R2 server configuration." }, { status: 500 });
  }
}