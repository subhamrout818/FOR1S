import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { signedPrivateObjectUrl } from "@/lib/r2";
export const runtime = "nodejs";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const file = await prisma.fileAsset.findFirst({ where: { id, project: { clientId: user.id } }, select: { storageKey: true } });
  if (!file?.storageKey) return NextResponse.json({ success: false, message: "File not found." }, { status: 404 });
  try {
    const url = await signedPrivateObjectUrl(file.storageKey);
    return NextResponse.redirect(url, { status: 302, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Private file URL signing failed", error);
    return NextResponse.json({ success: false, message: "File storage is unavailable." }, { status: 503 });
  }
}
