import { NextResponse } from "next/server";
import { requireAuth, getClientWorkspace } from "@/lib/portal";

/** Full client portal payload for the signed-in user. */
export async function GET(req: Request) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const workspace = await getClientWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, ...workspace });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
