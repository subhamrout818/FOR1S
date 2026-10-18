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
    // Preserve nullable project value so the admin form can distinguish an
    // unset price from an intentionally configured zero value.
    const commercialFields = await prisma.project.findMany({
      select: { id: true, value: true, endsAt: true },
    });
    const commercialById = new Map(commercialFields.map((project) => [
      project.id,
      { value: project.value === null ? null : Number(project.value.toString()), endsAt: project.endsAt },
    ]));
    return NextResponse.json({
      success: true,
      ...workspace,
      projects: workspace.projects.map((project) => ({
        ...project,
        ...commercialById.get(project.id),
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
