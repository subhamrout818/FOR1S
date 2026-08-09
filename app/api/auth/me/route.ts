import { prisma } from "@/lib/prisma";
import { verifyToken, getSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * GET /api/auth/me — return the signed-in user from the httpOnly session
 * cookie. Sessions issued before the account's last update (password reset,
 * email/password change) are rejected so a stolen token dies with those events.
 */
export async function GET(req: Request) {
  try {
    const token = getSessionToken(req);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const iat = (payload as { iat?: number }).iat ?? 0;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        provider: true,
        emailVerified: true,
        role: true,
        company: true,
        password: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 60s grace absorbs clock skew between the DB and the token signer.
    if (iat * 1000 + 60_000 < user.updatedAt.getTime()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        emailVerified: user.emailVerified,
        role: user.role,
        company: user.company,
        hasPassword: !!user.password,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
