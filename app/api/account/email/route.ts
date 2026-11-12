import { prisma } from "@/lib/prisma";
import { getAuthUserWithPassword } from "@/lib/authed-user";
import { comparePassword, signPendingEmailChange, normalizeEmail } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteVerificationUrl } from "@/lib/email";
import {
  consumeRateLimit,
  releaseRateLimit,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const changeEmailSchema = z.object({
  email: z.email("Invalid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

/**
 * POST /api/account/email — change the signed-in user's email, requiring
 * their current password to confirm.
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

    // Passwordless (OAuth) accounts can't confirm with a password.
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has no password. Use 'Forgot password' to create one before changing your email.",
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const result = changeEmailSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const email = normalizeEmail(result.data.email);
    const { currentPassword } = result.data;

    // Confirm it's really them before touching the login identifier. Reserve
    // quota atomically to prevent parallel password guesses from bypassing it.
    const limitKey = `account:email:${user.id}`;
    const limit = await consumeRateLimit(
      limitKey,
      RATE_LIMITS.emailChange.limit,
      RATE_LIMITS.emailChange.windowMs
    );
    if (!limit.ok) return rateLimitedResponse(limit.resetAt);

    const passwordOk = await comparePassword(currentPassword, user.password);
    if (!passwordOk) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    await releaseRateLimit(limitKey);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== user.id) {
      return NextResponse.json(
        { success: false, message: "That email is already in use" },
        { status: 409 }
      );
    }

    if (email === user.email) {
      return NextResponse.json({ success: true, needsVerification: false, message: "That is already your current email address." });
    }

    // Stage the new address; the existing login identifier and sessions remain valid.
    const pending = await prisma.user.update({
      where: { id: user.id },
      data: { pendingEmail: email, pendingEmailUpdatedAt: new Date() },
      select: { id: true, name: true, email: true, pendingEmail: true, pendingEmailUpdatedAt: true },
    });

    let verificationEmailSent = false;
    if (emailEnabled() && pending.pendingEmailUpdatedAt) {
      const verify = signPendingEmailChange(user.id, email, pending.pendingEmailUpdatedAt);
      const link = absoluteVerificationUrl(req, verify, "email-change");
      verificationEmailSent = await sendEmail({
        to: email,
        subject: "Verify your new FOR1S email",
        text: `Hi ${pending.name},\n\nConfirm this email change by clicking this link (valid for 24 hours):\n${link}\n\nYour current login email remains active until confirmation. If you did not request this, ignore this message.`,
      });
      if (!verificationEmailSent) console.error("Account email-change verification delivery failed.");
    }

    return NextResponse.json({
      success: true,
      user: { id: pending.id, name: pending.name, email: pending.email },
      pendingEmail: pending.pendingEmail,
      needsVerification: true,
      verificationEmailSent,
      // Reference to resend-verification endpoint for client-side retry
      resendEndpoint: "/api/auth/resend-verification",
      message: verificationEmailSent
        ? "Verification sent. Your current login email remains active until you confirm the new address."
        : "The new address is pending, but verification could not be sent. Your current login email remains active; use resend verification to retry.",
    });
  } catch (error) {
    console.error("Account email change failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
