import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { r2Request } from "@/lib/r2-storage";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const requestedVersion = Number(new URL(req.url).searchParams.get("version"));
  const deliverable = await prisma.deliverable.findFirst({
    where: { id, project: { clientId: user.id } },
    include: { project: { select: { id: true, clientId: true } }, versions: { where: Number.isInteger(requestedVersion) && requestedVersion > 0 ? { version: requestedVersion } : { version: -1 }, take: 1 } },
  });
  if (!deliverable) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  const selected = requestedVersion > 0 ? deliverable.versions[0] : null;
  const storedUrl = selected?.mediaUrl ?? (requestedVersion > 0 ? null : deliverable.mediaUrl);
  const mimeType = selected?.mimeType ?? deliverable.mimeType ?? "application/octet-stream";
  if (!storedUrl?.startsWith("r2://")) return NextResponse.json({ success: false, message: "Media not found" }, { status: 404 });
  const key = storedUrl.slice(5);
  const prefix = `clients/${deliverable.project.clientId}/${deliverable.project.id}/deliverables/${id}/`;
  if (!key.startsWith(prefix) || key.includes("..")) return NextResponse.json({ success: false, message: "Media not found" }, { status: 404 });

  try {
    const range = req.headers.get("range") ?? undefined;
    const stored = await r2Request("GET", key, range);
    if (!stored.ok && stored.status !== 206) return NextResponse.json({ success: false, message: "Media unavailable" }, { status: 502 });
    const headers = new Headers({
      "Content-Type": mimeType,
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
    });
    const contentLength = stored.headers.get("content-length");
    const contentRange = stored.headers.get("content-range");
    if (contentLength) headers.set("Content-Length", contentLength);
    if (contentRange) headers.set("Content-Range", contentRange);
    return new Response(stored.body, { status: stored.status, headers });
  } catch (error) {
    console.error("Deliverable media proxy failed:", error);
    return NextResponse.json({ success: false, message: "Unable to retrieve media" }, { status: 500 });
  }
}
