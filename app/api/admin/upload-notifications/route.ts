import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const events = await prisma.activityEvent.findMany({
      where: { type: "upload", project: { isNot: null } },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        project: { select: { id: true, name: true } },
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    return NextResponse.json({
      success: true,
      events: events.map((event) => ({
        id: event.id,
        title: event.title,
        detail: event.detail,
        createdAt: event.createdAt,
        project: event.project,
        actor: event.actor,
      })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin upload notifications error:", error);
    return NextResponse.json({ success: false, message: "Unable to load upload notifications" }, { status: 500 });
  }
}
