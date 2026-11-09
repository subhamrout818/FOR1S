import { prisma } from "@/lib/prisma";
import { getAuthUserWithPassword } from "@/lib/authed-user";
import { comparePassword, signToken, currentSessionLifetime, signVerifyEmail, setSessionCookie, normalizeEmail } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteUrl } from "@/lib/email";
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

    // The new address is unverified until the owner confirms it. Without this,
    // a typo or someone else's address becomes the account's login identifier
    // while keeping the old "verified" state. Also revokes all prior sessions
    // via the updatedAt check in requireAuth/getAuthUser.
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { email, emailVerified: false },
      select: { id: true, name: true, email: true, profileImage: true, updatedAt: true },
    });

    // Send verification to the NEW address. Keep the account reachable so the
    // user can retry through /api/auth/resend-verification if delivery fails.
    let verificationEmailSent = false;
    if (emailEnabled()) {
      const verify = signVerifyEmail(user.id, updated.email, updated.updatedAt);
      const link = absoluteUrl(req, `/api/auth/verify-email?token=${encodeURIComponent(verify)}`);
      verificationEmailSent = await sendEmail({
        to: updated.email,
        subject: "Verify your new FOR1S email",
        text: `Hi ${updated.name},\n\nConfirm your new email by clicking this link (valid for 24 hours):\n${link}\n\nIf you didn't change your email, you can ignore this message.`,
      });
      if (!verificationEmailSent) {
        console.error("Account email-change verification delivery failed.");
      }
    } else if (process.env.NODE_ENV === "production") {
      console.error("Account email changed but verification email service is unavailable.");
    }

    // Re-issue the session so the user can reach account settings and retry.
    const life = await currentSessionLifetime();
    const token = signToken(updated.id, updated.email, life.expiresIn);
    return setSessionCookie(
      NextResponse.json({
        success: true,
        user: updated,
        needsVerification: true,
        verificationEmailSent,
        message: verificationEmailSent
          ? "Email changed. Check your new inbox to verify it."
          : "Email changed, but we couldn't send the verification email. Use resend verification to try again.",
      }),
      token,
      life.remember
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
