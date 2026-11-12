import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { hashPassword, normalizeEmail, signToken, signVerifyEmail, setSessionCookie } from "@/lib/auth";
import { sendEmail, emailEnabled, absoluteVerificationUrl } from "@/lib/email";
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

async function sendVerificationEmail(req: Request, user: {
  id: string;
  email: string;
  name: string;
  updatedAt: Date;
}): Promise<boolean> {
  const verifyToken = signVerifyEmail(user.id, user.email, user.updatedAt);
  const link = absoluteVerificationUrl(req, verifyToken, "signup");
  return sendEmail({
    to: user.email,
    subject: "Verify your FOR1S email",
    text: `Hi ${user.name},\n\nPlease confirm your email by clicking this link (valid for 24 hours):\n${link}\n\nIf you didn't create a FOR1S account, you can ignore this email.`,
  });
}

export async function POST(req: Request) {
  try {
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

    const { name, password } = result.data;
    const email = normalizeEmail(result.data.email);

    const emailRate = await consumeRateLimit(
      `auth:email:${email}`,
      RATE_LIMITS.emailDelivery.limit,
      RATE_LIMITS.emailDelivery.windowMs
    );
    if (!emailRate.ok) return rateLimitedResponse(emailRate.resetAt);

    if (!emailEnabled() && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Signup email service is unavailable right now. Please try again later." },
        { status: 503 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // A previous attempt may have created the account but failed to send its
      // verification message. Retry verification instead of sending an
      // unrelated "account already exists" notice and leaving the user stuck.
      if (!existingUser.emailVerified && emailEnabled()) {
        const sent = await sendVerificationEmail(req, existingUser);
        if (!sent) {
          return NextResponse.json(
            { success: false, code: "EMAIL_DELIVERY_FAILED", message: "Your account already exists, but we couldn't send its verification email. Please try again shortly." },
            { status: 503 }
          );
        }
        return NextResponse.json(
          { success: true, needsVerification: true, message: "A fresh verification link has been sent." },
          { status: 200 }
        );
      }

      if (emailEnabled()) {
        const sent = await sendEmail({
          to: existingUser.email,
          subject: "A FOR1S account already exists",
          text: "Someone tried to sign up with this email address. If that was you, log in instead. If it wasn't you, you can ignore this message.",
        });
        if (!sent) console.error("Existing-account notification email delivery failed.");
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
        { success: false, message: "An account with this email already exists — try logging in." },
        { status: 409 }
      );
    }

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
      token = signToken(user.id, user.email);
    } else {
      const sent = await sendVerificationEmail(req, user);
      if (!sent) {
        // Keep the newly-created account unverified. A second signup attempt
        // now enters the retry branch above; it never creates a duplicate.
        return NextResponse.json(
          { success: false, code: "EMAIL_DELIVERY_FAILED", message: "Your account was created, but we couldn't send the verification email. Please submit again shortly to retry." },
          { status: 503 }
        );
      }
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

    if (token) setSessionCookie(response, token, true);
    return response;
  } catch (error) {
    console.error("Signup request failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
