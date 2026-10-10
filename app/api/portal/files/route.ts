import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { deletePrivateObject, putPrivateObject } from "@/lib/r2";
import { allowedImageType, hasValidImageSignature, IMAGE_TYPES, MAX_UPLOAD_BYTES, safeImageName } from "@/lib/portal-upload";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "client") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_UPLOAD_BYTES + 64 * 1024) return NextResponse.json({ success: false, message: "Each image must be 10 MiB or smaller." }, { status: 413 });
  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json({ success: false, message: "Invalid upload form." }, { status: 400 }); }
  const file = form.get("file");
  const folderId = form.get("folderId");
  if (!(file instanceof File) || typeof folderId !== "string" || !folderId) return NextResponse.json({ success: false, message: "Choose an image and destination folder." }, { status: 400 });
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ success: false, message: "Each image must be between 1 byte and 10 MiB." }, { status: 413 });
  if (!allowedImageType(file.type)) return NextResponse.json({ success: false, message: "Only JPEG, PNG, WebP, and GIF images are allowed." }, { status: 415 });
  const folder = await prisma.folder.findFirst({ where: { id: folderId, project: { clientId: user.id } }, select: { id: true, projectId: true } });
  if (!folder) return NextResponse.json({ success: false, message: "Folder not found." }, { status: 404 });
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!hasValidImageSignature(file.type, bytes)) return NextResponse.json({ success: false, message: "The file contents do not match the selected image type." }, { status: 415 });
  const name = safeImageName(file.name, IMAGE_TYPES[file.type].extension);
  const key = `clients/${user.id}/projects/${folder.projectId}/folders/${folder.id}/${randomUUID()}-${name}`;
  try {
    await putPrivateObject(key, bytes, file.type);
    const asset = await prisma.fileAsset.create({
      data: { projectId: folder.projectId, folderId: folder.id, uploadedById: user.id, name, url: "/api/portal/files", storageKey: key, mimeType: file.type, size: file.size, kind: "asset" },
      select: { id: true, name: true, mimeType: true, size: true, createdAt: true },
    });
    return NextResponse.json({ success: true, file: asset }, { status: 201 });
  } catch (error) {
    try { await deletePrivateObject(key); } catch { /* best-effort object cleanup */ }
    console.error("Client image upload failed", error);
    return NextResponse.json({ success: false, message: "Upload failed. Please try again." }, { status: 500 });
  }
}
