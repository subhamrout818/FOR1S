import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAuth, getClientWorkspace } from "@/lib/portal";

/** Full client portal payload for the signed-in user. */
export async function GET(req: Request) {
  const requestId = req.headers.get("x-request-id") || randomUUID();
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
    const prismaError = error && typeof error === "object" ? error as { code?: unknown; meta?: unknown } : null;
    console.error("portal workspace load failed", {
      requestId,
      operation: "GET /api/portal",
      category: prismaError?.code === "P2022" ? "schema_mismatch" : "database_or_runtime",
      code: typeof prismaError?.code === "string" ? prismaError.code : undefined,
      meta: prismaError?.meta,
    });
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
