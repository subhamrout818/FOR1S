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

  try {
    const { id } = await context.params;
    const file = await prisma.fileAsset.findUnique({
      where: { id },
      select: { id: true, name: true, url: true, mimeType: true, projectId: true, project: { select: { clientId: true } } },
    });
    if (!file || !file.url.startsWith("r2://")) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }
    const key = file.url.slice(5);
    if (!key.startsWith(`clients/${file.project.clientId}/${file.projectId}/`) || key.includes("..")) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    const stored = await r2Request("GET", key);
    if (!stored.ok) return NextResponse.json({ success: false, message: "Image unavailable" }, { status: 502 });
    const download = new URL(req.url).searchParams.get("download") === "1";
    const safeName = file.name.replace(/["\\\\\\r\\n]/g, "_");
    return new Response(stored.body, {
      status: 200,
      headers: {
        "Content-Type": file.mimeType ?? "application/octet-stream",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${safeName}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Admin image retrieval error:", error);
    return NextResponse.json({ success: false, message: "Unable to retrieve image" }, { status: 500 });
  }
}
