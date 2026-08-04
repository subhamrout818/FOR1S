import { NextResponse } from "next/server";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { isSafeRelativePath } from "@/lib/utils";
import { signOAuthState } from "@/lib/auth";
import { allowedOrigin } from "@/lib/email";
import { oauthProvider, oauthConfigured, pkcePair, buildAuthorizeUrl } from "@/lib/oauth";

/**
 * GET /api/auth/oauth/:provider
 *
 * Kick off the OAuth authorization-code flow: mint a PKCE pair, wrap the
 * state (provider + code verifier + challenge + optional next) in a signed,
 * 10-minute JWT, store it in an httpOnly cookie, then 302 to the provider.
 */
export async function GET(
  req: Request,
  { params }: { params: { provider: string } }
) {
  const provider = oauthProvider(params.provider);
  if (!provider) {
    return NextResponse.json(
      { success: false, message: "Unknown provider" },
      { status: 400 }
    );
  }

  const limitKey = `auth:oauth:${clientIp(req)}`;
  const rate = consumeRateLimit(
    limitKey,
    RATE_LIMITS.oauth.limit,
    RATE_LIMITS.oauth.windowMs
  );
  if (!rate.ok) return rateLimitedResponse(rate.resetAt);

  if (!oauthConfigured(provider)) {
    return NextResponse.json(
      { success: false, message: `${provider} login is not configured` },
      { status: 501 }
    );
  }

  const origin = allowedOrigin(req);
  if (!origin) {
    return NextResponse.json(
      { success: false, message: "Invalid origin" },
      { status: 400 }
    );
  }

  const redirectTo = new URL(req.url).searchParams.get("next") ?? "/";
  if (!isSafeRelativePath(redirectTo)) {
    return NextResponse.json(
      { success: false, message: "Invalid redirect" },
      { status: 400 }
    );
  }

  const redirectUri = `${origin}/api/auth/oauth/callback/${provider}`;
  const { verifier, challenge } = pkcePair();
  const state = signOAuthState({
    provider,
    nonce: verifier,
    codeVerifier: verifier,
    codeChallenge: challenge,
    redirectTo,
  });

  const response = NextResponse.redirect(
    buildAuthorizeUrl(provider, { redirectUri, state, codeChallenge: challenge })
  );
  response.cookies.set("for1s_oauth_verifier", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
  });
  return response;
}
