import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { verifyVerifyEmail, verifyPendingEmailChange } from "@/lib/auth";
import { allowedOrigin, fallbackOrigin } from "@/lib/email";
import { NextResponse } from "next/server";

/**
 * Email security scanners routinely prefetch GET links. GET must therefore
 * never consume a verification token or mutate account state.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const origin = allowedOrigin(req) ?? fallbackOrigin();
  const target = new URL("/verify-email", origin);
  if (token) target.searchParams.set("token", token);
  return NextResponse.redirect(target);
}

/** Explicit user confirmation: POST /api/auth/verify-email { token }. */
export async function POST(req: Request) {
  try {
    const rate = await consumeRateLimit(
      `auth:verify:${clientIp(req)}`,
      RATE_LIMITS.verifyEmail.limit,
      RATE_LIMITS.verifyEmail.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const body = await req.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token : "";
    if (!token) return NextResponse.json({ success: false, message: "Verification link is invalid or expired." }, { status: 400 });

    const pendingClaims = verifyPendingEmailChange(token);
    if (pendingClaims) {
      const user = await prisma.user.findUnique({ where: { id: pendingClaims.userId } });
      if (!user || user.pendingEmail !== pendingClaims.email ||
          user.pendingEmailUpdatedAt?.getTime() !== pendingClaims.pendingEmailUpdatedAt) {
        return NextResponse.json({ success: false, message: "This email-change link is invalid or has expired." }, { status: 400 });
      }
      try {
        const promoted = await prisma.user.updateMany({
          where: { id: user.id, pendingEmail: pendingClaims.email, pendingEmailUpdatedAt: new Date(pendingClaims.pendingEmailUpdatedAt) },
          data: { email: pendingClaims.email, emailVerified: true, pendingEmail: null, pendingEmailUpdatedAt: null },
        });
        if (promoted.count !== 1) return NextResponse.json({ success: false, message: "This email-change link has already been used or replaced." }, { status: 409 });
        return NextResponse.json({ success: true, kind: "email-change", message: "Your email address has been updated. Please sign in again with your new address." });
      } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
          return NextResponse.json({ success: false, message: "That email address is already associated with another account." }, { status: 409 });
        }
        throw error;
      }
    }

    const claims = verifyVerifyEmail(token);
    if (!claims) return NextResponse.json({ success: false, message: "Verification link is invalid or expired." }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { id: claims.userId } });
    if (!user || user.email !== claims.email) return NextResponse.json({ success: false, message: "Verification link is invalid or expired." }, { status: 400 });

    if (user.updatedAt.getTime() !== claims.updatedAt) {
      return user.emailVerified
        ? NextResponse.json({ success: true, kind: "signup", message: "Your email address is already verified. You can sign in." })
        : NextResponse.json({ success: false, message: "This verification link has expired. Request a new one." }, { status: 400 });
    }

    if (!user.emailVerified) {
      const verified = await prisma.user.updateMany({
        where: { id: user.id, email: claims.email, updatedAt: new Date(claims.updatedAt), emailVerified: false },
        data: { emailVerified: true },
      });
      if (verified.count !== 1) {
        const latest = await prisma.user.findUnique({ where: { id: user.id }, select: { emailVerified: true } });
        return latest?.emailVerified
          ? NextResponse.json({ success: true, kind: "signup", message: "Your email address is verified. You can sign in." })
          : NextResponse.json({ success: false, message: "This verification link has expired. Request a new one." }, { status: 409 });
      }
    }
    return NextResponse.json({ success: true, kind: "signup", message: "Your email address is verified. You can sign in." });
  } catch (error) {
    console.error("Email verification failed:", error);
    return NextResponse.json({ success: false, message: "We couldn't verify this link. Please try again." }, { status: 500 });
  }
}
