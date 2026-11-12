import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { signVerifyEmail, signPendingEmailChange, normalizeEmail } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteVerificationUrl } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.email("Invalid email address"),
});

/**
 * POST /api/auth/resend-verification
 *
 * Re-sends the signup verification email. Unknown and already-verified
 * addresses receive the same generic success response. A provider failure
 * for a pending account is surfaced so the UI does not falsely claim success.
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
    const rate = await consumeRateLimit(
      limitKey,
      RATE_LIMITS.resendVerification.limit,
      RATE_LIMITS.resendVerification.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const emailRate = await consumeRateLimit(
      `auth:email:${email}`,
      RATE_LIMITS.emailDelivery.limit,
      RATE_LIMITS.emailDelivery.windowMs
    );
    if (!emailRate.ok) return rateLimitedResponse(emailRate.resetAt);

    if (!emailEnabled() && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Verification email service is unavailable right now." },
        { status: 503 }
      );
    }

    const user = await prisma.user.findFirst({ where: { OR: [{ email }, { pendingEmail: email }] } });
    if (user && user.pendingEmail === email && user.pendingEmailUpdatedAt && emailEnabled()) {
      const token = signPendingEmailChange(user.id, email, user.pendingEmailUpdatedAt);
      const link = absoluteVerificationUrl(req, token, "email-change");
      const sent = await sendEmail({ to: email, subject: "Verify your new FOR1S email", text: `Hi ${user.name},\n\nConfirm this email change by clicking this link (valid for 24 hours):\n${link}\n\nYour current login email remains active until confirmation.` });
      if (!sent) return NextResponse.json({ success: false, message: "We couldn't send the verification email. Please try again shortly." }, { status: 503 });
    } else if (user && user.email === email && !user.emailVerified && emailEnabled()) {
      const token = signVerifyEmail(user.id, user.email, user.updatedAt);
      const link = absoluteVerificationUrl(req, token, "signup");
      const sent = await sendEmail({ to: user.email, subject: "Verify your FOR1S email", text: `Hi ${user.name},\n\nPlease confirm your email by clicking this link (valid for 24 hours):\n${link}\n\nIf you did not create a FOR1S account, you can ignore this message.` });
      if (!sent) return NextResponse.json({ success: false, message: "We couldn't send the verification email. Please try again shortly." }, { status: 503 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification resend request failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
