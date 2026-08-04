import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { signVerifyEmail, normalizeEmail } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteUrl } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.email("Invalid email address"),
});

/**
 * POST /api/auth/resend-verification
 *
 * Re-sends the signup verification email. Always returns the same success
 * response (no account enumeration); only actually sends when a matching,
 * unverified account exists.
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

    const limitKey = `auth:resend:${email}:${clientIp(req)}`;
    const rate = consumeRateLimit(
      limitKey,
      RATE_LIMITS.resendVerification.limit,
      RATE_LIMITS.resendVerification.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user && !user.emailVerified && emailEnabled()) {
      const token = signVerifyEmail(user.id, user.email);
      const link = absoluteUrl(req, `/verify-email?token=${encodeURIComponent(token)}`);
      await sendEmail({
        to: user.email,
        subject: "Verify your FOR1S email",
        text: `Hi ${user.name},\n\nPlease confirm your email by clicking this link (valid for 24 hours):\n${link}\n\nIf you didn't create a FOR1S account, you can ignore this email.`,
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
