import { NextResponse } from "next/server";
import { requireAuth, getAdminWorkspace } from "@/lib/portal";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const workspace = await getAdminWorkspace();
    // Keep the admin's project editor in sync with the same persisted end date
    // that the client portal displays.
    const endDates = await prisma.project.findMany({
      select: { id: true, endsAt: true },
    });
    const endsAtById = new Map(endDates.map((project) => [project.id, project.endsAt]));
    return NextResponse.json({
      success: true,
      ...workspace,
      projects: workspace.projects.map((project) => ({
        ...project,
        endsAt: endsAtById.get(project.id) ?? null,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
