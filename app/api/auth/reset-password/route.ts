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
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

/**
 * POST /api/auth/reset-password
 *
 * Validates the signed reset token and sets a new password. Reset links are
 * only issued to verified accounts (see forgot-password), and OAuth users are
 * verified through their provider, so this doesn't touch the verification flag.
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
    const rate = await consumeRateLimit(
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

    const hashedPassword = await hashPassword(password);
    // Atomic compare-and-swap closes the race where two simultaneous requests
    // could both validate the same reset token before either update completed.
    const consumed = await prisma.user.updateMany({
      where: {
        id: claims.userId,
        email: claims.email,
        updatedAt: new Date(claims.updatedAt),
      },
      data: { password: hashedPassword },
    });
    if (consumed.count !== 1) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }
    // The update bumps updatedAt, invalidating the token and all old sessions.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
