import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
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

    const { email, password } = result.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      consumeRateLimit(limitKey, RATE_LIMITS.login.limit, RATE_LIMITS.login.windowMs);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      consumeRateLimit(limitKey, RATE_LIMITS.login.limit, RATE_LIMITS.login.windowMs);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = signToken(user.id, user.email);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
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
