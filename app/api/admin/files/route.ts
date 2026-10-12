import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** GET /api/admin/files — list image assets across every client project. */
export async function GET(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") ?? "").trim().slice(0, 120);
    const projectId = (searchParams.get("projectId") ?? "").trim();

    const files = await prisma.fileAsset.findMany({
      where: {
        kind: "image",
        ...(projectId ? { projectId } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { project: { name: { contains: query, mode: "insensitive" } } },
                { project: { client: { name: { contains: query, mode: "insensitive" } } } },
                { project: { client: { email: { contains: query, mode: "insensitive" } } } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        name: true,
        mimeType: true,
        size: true,
        kind: true,
        url: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            name: true,
            client: { select: { id: true, name: true, email: true } },
          },
        },
        folder: { select: { id: true, name: true } },
        uploader: { select: { id: true, name: true } },
      },
    });

    const projects = await prisma.project.findMany({
      where: { files: { some: { kind: "image" } } },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        client: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      files,
      projects,
      limit: 200,
    });
  } catch (error) {
    console.error("Admin media library list error:", error);
    return NextResponse.json({ success: false, message: "Unable to load media library." }, { status: 500 });
  }
}
