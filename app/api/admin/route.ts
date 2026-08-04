import { NextResponse } from "next/server";
import { requireAuth, getAdminWorkspace } from "@/lib/portal";

export async function GET(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const workspace = await getAdminWorkspace();
    return NextResponse.json({ success: true, ...workspace });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
