import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, normalizeEmail } from "@/lib/auth";
import {
  checkRateLimit,
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    // Only *failed* attempts burn quota, so rate limit before validating.
    const limitKey = `auth:login:${clientIp(req)}`;
    const check = checkRateLimit(
      limitKey,
      RATE_LIMITS.login.limit,
      RATE_LIMITS.login.windowMs
    );
    if (!check.ok) return rateLimitedResponse(check.resetAt);

    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { password, rememberMe = true } = result.data;
    const email = normalizeEmail(result.data.email);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Same generic response for unknown email, wrong password, AND
    // passwordless (OAuth) accounts — so we never reveal which is which.
    const invalid = () => {
      consumeRateLimit(limitKey, RATE_LIMITS.login.limit, RATE_LIMITS.login.windowMs);
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    };

    if (!user) return invalid();

    // Passwordless accounts can't use the email/password form.
    if (!user.password) return invalid();

    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) return invalid();

    // Gate unverified accounts — but only after the password validates, so the
    // response can't be used to probe which emails exist.
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          code: "EMAIL_NOT_VERIFIED",
          message: "Please verify your email before logging in.",
          email: user.email,
        },
        { status: 403 }
      );
    }

    // Sign JWT — "remember me" controls the lifetime.
    const token = signToken(user.id, user.email, rememberMe ? "7d" : "1d");

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        hasPassword: !!user.password,
        emailVerified: user.emailVerified,
        role: user.role,
        company: user.company,
      },
    });
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
