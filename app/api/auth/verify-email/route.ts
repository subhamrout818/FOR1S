import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { verifyVerifyEmail } from "@/lib/auth";
import { allowedOrigin } from "@/lib/email";
import { NextResponse } from "next/server";

/**
 * GET /api/auth/verify-email?token=…
 *
 * The link inside the signup email. Idempotent — re-verifying within the
 * token's 24h lifetime is a no-op (email-client link prefetching can't break
 * it). Redirects to /login with a banner flag.
 */
export async function GET(req: Request) {
  const origin = allowedOrigin(req) ?? process.env.APP_URL ?? "http://localhost:3000";
  const to = (path: string) => NextResponse.redirect(new URL(path, origin));

  try {
    const limitKey = `auth:verify:${clientIp(req)}`;
    const rate = consumeRateLimit(
      limitKey,
      RATE_LIMITS.verifyEmail.limit,
      RATE_LIMITS.verifyEmail.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const token = new URL(req.url).searchParams.get("token") ?? "";
    const claims = verifyVerifyEmail(token);
    if (!claims) return to("/login?verify=invalid");

    const user = await prisma.user.findUnique({ where: { id: claims.userId } });
    if (!user || user.email !== claims.email) return to("/login?verify=invalid");

    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    }

    return to("/login?verified=1");
  } catch (error) {
    console.error(error);
    return to("/login?verify=invalid");
  }
}
