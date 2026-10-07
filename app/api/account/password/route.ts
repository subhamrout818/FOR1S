import { prisma } from "@/lib/prisma";
import { getAuthUserWithPassword } from "@/lib/authed-user";
import { comparePassword, hashPassword, signToken, setSessionCookie } from "@/lib/auth";
import {
  checkRateLimit,
  consumeRateLimit,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password must be at most 128 characters"),
});

/**
 * POST /api/account/password — change the signed-in user's password after
 * verifying their current one.
 */
export async function POST(req: Request) {
  try {
    const user = await getAuthUserWithPassword(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Passwordless (OAuth) accounts should set a password via the email flow
    // ('Forgot password') rather than guessing at a current password here.
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has no password yet. Use 'Forgot password' to set one.",
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    // Only wrong guesses burn quota, so a stolen session can't brute-force the
    // current password.
    const limitKey = `account:password:${user.id}`;
    const limit = await checkRateLimit(
      limitKey,
      RATE_LIMITS.passwordChange.limit,
      RATE_LIMITS.passwordChange.windowMs
    );
    if (!limit.ok) return rateLimitedResponse(limit.resetAt);

    const passwordOk = await comparePassword(currentPassword, user.password);
    if (!passwordOk) {
      await consumeRateLimit(
        limitKey,
        RATE_LIMITS.passwordChange.limit,
        RATE_LIMITS.passwordChange.windowMs
      );
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(newPassword) },
    });

    // Re-issue the session so the password change doesn't log the user out;
    // every previously issued token is now invalid server-side.
    const token = signToken(user.id, user.email);
    return setSessionCookie(NextResponse.json({ success: true }), token, true);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
