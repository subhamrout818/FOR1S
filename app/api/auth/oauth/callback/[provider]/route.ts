import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isSafeRelativePath } from "@/lib/utils";
import { verifyOAuthState, signToken } from "@/lib/auth";
import { allowedOrigin } from "@/lib/email";
import {
  oauthProvider,
  exchangeCodeForToken,
  fetchProfile,
  upsertOAuthUser,
  type OAuthProfile,
} from "@/lib/oauth";

/**
 * GET /api/auth/oauth/callback/:provider
 *
 * The provider redirects here after the user consents. We verify the signed
 * state JWT (and that it matches the cookie — CSRF), exchange the code with
 * PKCE, fetch the profile, upsert/link the user, then hand a FOR1S JWT to
 * the client via the /oauth/callback handoff page.
 */
export async function GET(
  req: Request,
  { params }: { params: { provider: string } }
) {
  const fallbackOrigin = process.env.APP_URL || "http://localhost:3000";
  const redirectToHandoff = (path: string) =>
    NextResponse.redirect(new URL(path, fallbackOrigin));

  try {
    const provider = oauthProvider(params.provider);
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const stateParam = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (!provider) return redirectToHandoff("/oauth/callback?error=invalid_provider");
    if (error) return redirectToHandoff("/oauth/callback?error=access_denied");

    // State must match the cookie we set at initiate time.
    const cookieState = cookies().get("for1s_oauth_verifier")?.value;
    if (!code || !stateParam || !cookieState || stateParam !== cookieState) {
      return redirectToHandoff("/oauth/callback?error=invalid_state");
    }
    const state = verifyOAuthState(stateParam);
    if (!state || state.provider !== provider) {
      return redirectToHandoff("/oauth/callback?error=invalid_state");
    }

    const origin = allowedOrigin(req) ?? fallbackOrigin;
    const redirectUri = `${origin}/api/auth/oauth/callback/${provider}`;

    const accessToken = await exchangeCodeForToken(
      provider,
      code,
      state.codeVerifier,
      redirectUri
    );
    const profile = (await fetchProfile(provider, accessToken)) as Omit<
      OAuthProfile,
      "provider"
    >;
    const user = await upsertOAuthUser({ ...profile, provider });

    const jwt = signToken(user.id, user.email, "7d");
    const next = isSafeRelativePath(state.redirectTo) ? state.redirectTo : "/";
    const location = new URL("/oauth/callback", origin);
    location.searchParams.set("token", jwt);
    location.searchParams.set("next", next);

    const response = NextResponse.redirect(location);
    // Single-use state cookie — clear it on every callback.
    response.cookies.delete("for1s_oauth_verifier");
    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    const location = new URL("/oauth/callback", fallbackOrigin);
    location.searchParams.set("error", "failed");
    return NextResponse.redirect(location);
  }
}
