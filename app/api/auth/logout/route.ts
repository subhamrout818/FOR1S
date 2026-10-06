import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSessionToken, verifyToken } from "@/lib/auth";

/**
 * POST /api/auth/logout — expire the httpOnly session cookie and revoke the
 * session server-side.
 *
 * Sessions are revoked by comparing a token's issue time with the user's
 * `updatedAt` (see lib/authed-user.ts), so bumping `updatedAt` kills every
 * token issued before now — a stolen copy of this session stops working too.
 * Trade-off: that also signs the user out of their other devices.
 */
export async function POST(req: Request) {
  try {
    const token = await getSessionToken(req);
    const payload = token ? verifyToken(token) : null;
    if (payload) {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { updatedAt: new Date() },
      });
    }
  } catch (error) {
    // Never block logout: the cookie is cleared below regardless.
    console.error("logout revoke failed:", error);
  }
  return clearSessionCookie(NextResponse.json({ success: true }));
}
