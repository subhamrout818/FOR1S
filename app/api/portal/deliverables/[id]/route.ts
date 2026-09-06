import { NextResponse } from "next/server";
import { requireAuth, getDeliverableDetail } from "@/lib/portal";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const detail = await getDeliverableDetail(id, user.id);
  if (!detail) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, deliverable: detail });
}
