import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { signResetPassword, normalizeEmail } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteUrl } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.email("Invalid email address"),
});

/**
 * POST /api/auth/forgot-password
 *
 * Sends a password-reset link. Always returns the same success response so
 * the endpoint can't be used to enumerate which emails have accounts.
 * Passwordless (OAuth) users get a "create a password" variant so they can
 * start using email/password login.
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

    const email = normalizeEmail(result.data.email);

    // Consume quota unconditionally (anti-spam + anti-enumeration).
    const limitKey = `auth:forgot:${email}:${clientIp(req)}`;
    const rate = consumeRateLimit(
      limitKey,
      RATE_LIMITS.forgotPassword.limit,
      RATE_LIMITS.forgotPassword.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && emailEnabled()) {
      const token = signResetPassword(user.id, user.email);
      const link = absoluteUrl(req, `/reset-password?token=${encodeURIComponent(token)}`);
      const hasPassword = !!user.password;
      await sendEmail({
        to: user.email,
        subject: hasPassword
          ? "Reset your FOR1S password"
          : "Set a password for your FOR1S account",
        text: hasPassword
          ? `Hi ${user.name},\n\nClick this link to reset your FOR1S password (valid for 15 minutes):\n${link}\n\nIf you didn't request this, you can ignore this email.`
          : `Hi ${user.name},\n\nYou signed up with ${user.provider}. Click this link to create a password so you can also log in with email (valid for 15 minutes):\n${link}\n\nIf you didn't request this, you can ignore this email.`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
