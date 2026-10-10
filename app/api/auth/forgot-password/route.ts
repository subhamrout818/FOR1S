import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { signResetPassword, normalizeEmail } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteUrl } from "@/lib/email";
import { verifyTurnstile, TURNSTILE_FAILED_MESSAGE } from "@/lib/turnstile";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.email("Invalid email address"),
  turnstileToken: z.string().max(4096).optional().nullable(),
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

    if (!(await verifyTurnstile(result.data.turnstileToken, clientIp(req)))) {
      return NextResponse.json(
        { success: false, message: TURNSTILE_FAILED_MESSAGE },
        { status: 400 }
      );
    }

    const email = normalizeEmail(result.data.email);

    // Consume quota unconditionally (anti-spam + anti-enumeration).
    const limitKey = `auth:forgot:${email}:${clientIp(req)}`;
    const rate = await consumeRateLimit(
      limitKey,
      RATE_LIMITS.forgotPassword.limit,
      RATE_LIMITS.forgotPassword.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const user = await prisma.user.findUnique({ where: { email } });

    // Only verified accounts may reset — otherwise "forgot password" becomes
    // a backdoor around the signup verification gate.
    if (user && user.emailVerified && emailEnabled()) {
      const token = signResetPassword(user.id, user.email, user.updatedAt);
      const link = absoluteUrl(req, `/reset-password?token=${encodeURIComponent(token)}`);
      const hasPassword = !!user.password;
      const sent = await sendEmail({
        to: user.email,
        subject: hasPassword
          ? "Reset your FOR1S password"
          : "Set a password for your FOR1S account",
        text: hasPassword
          ? `Hi ${user.name},\n\nClick this link to reset your FOR1S password (valid for 15 minutes):\n${link}\n\nIf you didn't request this, you can ignore this email.`
          : `Hi ${user.name},\n\nYou signed up with ${user.provider}. Click this link to create a password so you can also log in with email (valid for 15 minutes):\n${link}\n\nIf you didn't request this, you can ignore this email.`,
      });
      if (!sent) {
        // Keep the response identical for existing and unknown addresses.
        console.error("Password reset email delivery failed.");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot-password request failed:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
