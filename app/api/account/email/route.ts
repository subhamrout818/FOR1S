import { prisma } from "@/lib/prisma";
import { getAuthUserWithPassword } from "@/lib/authed-user";
import { comparePassword, signToken, signVerifyEmail, setSessionCookie } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteUrl } from "@/lib/email";
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

    const { email, currentPassword } = result.data;

    // Confirm it's really them before touching the login identifier.
    const passwordOk = await comparePassword(currentPassword, user.password);
    if (!passwordOk) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

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
      select: { id: true, name: true, email: true, profileImage: true },
    });

    // Best-effort verification to the NEW address so the account is usable
    // again. When email is unconfigured (local dev) the account stays
    // unverified — fine, since dev has no login gate anyway.
    if (emailEnabled()) {
      const verify = signVerifyEmail(user.id, updated.email);
      const link = absoluteUrl(req, `/verify-email?token=${encodeURIComponent(verify)}`);
      await sendEmail({
        to: updated.email,
        subject: "Verify your new FOR1S email",
        text: `Hi ${updated.name},\n\nConfirm your new email by clicking this link (valid for 24 hours):\n${link}\n\nIf you didn't change your email, you can ignore this message.`,
      }).catch(() => {});
    }

    // Re-issue the session (see account/route.ts) so the change doesn't log
    // the user out mid-session; the old token is dead server-side.
    const token = signToken(updated.id, updated.email);
    return setSessionCookie(
      NextResponse.json({ success: true, user: updated }),
      token,
      true
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
