import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, normalizeEmail, setSessionCookie } from "@/lib/auth";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

// A valid bcrypt hash (cost 10) of a throwaway string, used only to equalize
// timing for unknown / passwordless accounts. It matches no real password.
const DUMMY_HASH = "$2b$10$rRA006bFvB1IeNiu1jti8eOoq.hUCZMo8Rrlh7ckyq0F4Gvk/RrCu";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  // Generous cap: only stops absurd payloads, never a real password.
  password: z.string().min(1, "Password is required").max(1024),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    // Atomically consume quota before credential verification. Unlike a
    // check-then-record flow, concurrent requests cannot all pass the same
    // remaining quota window. Successful attempts also count toward the cap.
    const limitKey = `auth:login:${clientIp(req)}`;
    const check = await consumeRateLimit(
      limitKey,
      RATE_LIMITS.login.limit,
      RATE_LIMITS.login.windowMs
    );
    if (!check.ok) return rateLimitedResponse(check.resetAt);

    const body = await req.json().catch(() => null);
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

    // Per-account cap is also consumed atomically before the password check,
    // limiting parallel guesses distributed across different IP addresses.
    const accountKey = `auth:login:acct:${email}`;
    const accountCheck = await consumeRateLimit(
      accountKey,
      RATE_LIMITS.loginAccount.limit,
      RATE_LIMITS.loginAccount.windowMs
    );
    if (!accountCheck.ok) return rateLimitedResponse(accountCheck.resetAt);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Same generic response for unknown email, wrong password, AND
    // passwordless (OAuth) accounts — so we never reveal which is which.
    const invalid = () =>
      NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );

    // Run a bcrypt compare even when there's nothing real to check, so the
    // response time doesn't reveal whether an email has a password account.
    if (!user || !user.password) {
      await comparePassword(password, DUMMY_HASH);
      return invalid();
    }

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

    // Sign JWT — "remember me" controls the lifetime. The token lives in an
    // httpOnly cookie; it is never handed to the client.
    const token = signToken(user.id, user.email, rememberMe ? "7d" : "1d");

    return setSessionCookie(
      NextResponse.json({
        success: true,
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
      }),
      token,
      rememberMe
    );
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
