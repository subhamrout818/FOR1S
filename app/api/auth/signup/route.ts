import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { hashPassword, normalizeEmail, signToken, signVerifyEmail, setSessionCookie } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteUrl } from "@/lib/email";
import { verifyTurnstile, TURNSTILE_FAILED_MESSAGE } from "@/lib/turnstile";
import { NextResponse } from "next/server";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
  turnstileToken: z.string().max(4096).optional().nullable(),
});

export async function POST(req: Request) {
  try {
    // Cap account creation per IP to slow mass-signup / abuse.
    const limitKey = `auth:signup:${clientIp(req)}`;
    const rate = await consumeRateLimit(
      limitKey,
      RATE_LIMITS.signup.limit,
      RATE_LIMITS.signup.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const body = await req.json().catch(() => null);
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    if (!(await verifyTurnstile(result.data.turnstileToken, clientIp(req)))) {
      return NextResponse.json(
        { success: false, message: TURNSTILE_FAILED_MESSAGE },
        { status: 400 }
      );
    }

    const { name, password } = result.data;
    const email = normalizeEmail(result.data.email);

    // Fail closed: without email configured, don't silently create verified
    // accounts that anyone can mass-register. Dev keeps the old behavior.
    if (!emailEnabled() && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Signup is unavailable right now." },
        { status: 503 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Don't reveal whether the email is registered. When email is configured,
      // respond as if signup succeeded (the client shows the "check your inbox"
      // screen) and notify the existing holder instead. In local dev (no email)
      // the account is known to exist, so return a helpful message.
      if (emailEnabled()) {
        await sendEmail({
          to: existingUser.email,
          subject: "A FOR1S account already exists",
          text: `Someone tried to sign up with this email address. If that was you, log in instead. If it wasn't you, you can ignore this message.`,
        }).catch(() => {});
        return NextResponse.json(
          {
            success: true,
            needsVerification: true,
            token: null,
            user: null,
            message: "If this email is available, you'll get a confirmation shortly.",
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists — try logging in.",
        },
        { status: 409 }
      );
    }

    // When email is configured the account starts unverified and the user must
    // confirm before logging in. Without a provider (local dev) accounts are
    // created verified so the old auto-login flow still works.
    const needsVerification = emailEnabled();
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "credentials",
        emailVerified: !needsVerification,
      },
    });

    let token: string | null = null;
    if (!needsVerification) {
      // Dev convenience — no email to confirm, so sign straight in.
      token = signToken(user.id, user.email);
    } else {
      // Email the verification link (best-effort; signup still succeeds).
      const verifyToken = signVerifyEmail(user.id, user.email, user.updatedAt);
      const link = absoluteUrl(req, `/api/auth/verify-email?token=${encodeURIComponent(verifyToken)}`);
      const sent = await sendEmail({
        to: user.email,
        subject: "Verify your FOR1S email",
        text: `Hi ${name},\n\nPlease confirm your email by clicking this link (valid for 24 hours):\n${link}\n\nIf you didn't create a FOR1S account, you can ignore this email.`,
      })
      if (!sent) {
        // Keep the response generic to avoid account enumeration. The account
        // remains unverified; the login screen offers a verification resend.
        console.error("Signup verification email delivery failed; resend is available.");
      };
    }

    const response = NextResponse.json(
      {
        success: true,
        needsVerification,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
          company: user.company,
        },
      },
      { status: 201 }
    );

    // Dev convenience: no email to confirm, so sign straight in — the session
    // goes into an httpOnly cookie, not localStorage.
    if (token) setSessionCookie(response, token, true);

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
