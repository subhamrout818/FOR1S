import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";

export const runtime = "nodejs";

/** GET /api/admin/files — list every project file for the authenticated studio admin. */
export async function GET(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = await prisma.fileAsset.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
            client: { select: { id: true, name: true, email: true } },
          },
        },
        folder: { select: { id: true, name: true, kind: true } },
        uploader: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      files: files.map((file) => ({
        id: file.id,
        name: file.name,
        url: file.url,
        mimeType: file.mimeType,
        size: file.size,
        kind: file.kind,
        createdAt: file.createdAt,
        project: file.project,
        folder: file.folder,
        uploader: file.uploader,
      })),
    });
  } catch (error) {
    console.error("Admin files list error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load project files" },
      { status: 500 }
    );
  }
}
