import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { verifyResetPassword, hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * POST /api/auth/reset-password
 *
 * Validates the signed reset token and sets a new password. Also marks the
 * account verified — this doubles as the "create a password" path for
 * passwordless OAuth users.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const limitKey = `auth:reset:${clientIp(req)}`;
    const rate = consumeRateLimit(
      limitKey,
      RATE_LIMITS.resetPassword.limit,
      RATE_LIMITS.resetPassword.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const { token, password } = result.data;
    const claims = verifyResetPassword(token);
    if (!claims) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: claims.userId } });
    if (!user || user.email !== claims.email) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, emailVerified: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
