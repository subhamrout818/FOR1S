import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { normalizeEmail, type OAuthProvider } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Provider configuration                                             */
/* ------------------------------------------------------------------ */

interface ProviderConfig {
  authorizeUrl: string;
  tokenUrl: string;
  profileUrl: string;
  /** Extra profile request for providers that need a second call (GitHub emails). */
  emailsUrl?: string;
  scopes: string[];
  clientId: () => string;
  clientSecret: () => string;
}

const PROVIDERS: Record<OAuthProvider, ProviderConfig> = {
  google: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    profileUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    scopes: ["openid", "email", "profile"],
    clientId: () => process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET ?? "",
  },
  github: {
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    profileUrl: "https://api.github.com/user",
    emailsUrl: "https://api.github.com/user/emails",
    scopes: ["read:user", "user:email"],
    clientId: () => process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: () => process.env.GITHUB_CLIENT_SECRET ?? "",
  },
};

/** Validate a provider name; returns null for anything unknown. */
export function oauthProvider(name: string): OAuthProvider | null {
  return name === "google" || name === "github" ? name : null;
}

/** Whether both client id and secret are configured for a provider. */
export function oauthConfigured(provider: OAuthProvider): boolean {
  const p = PROVIDERS[provider];
  return Boolean(p.clientId() && p.clientSecret());
}

/* ------------------------------------------------------------------ */
/*  PKCE                                                               */
/* ------------------------------------------------------------------ */

function base64Url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Generate a random PKCE code_verifier + its S256 challenge. */
export function pkcePair() {
  const verifier = base64Url(randomBytes(32));
  const challenge = base64Url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

/* ------------------------------------------------------------------ */
/*  Authorize + token exchange                                         */
/* ------------------------------------------------------------------ */

export function buildAuthorizeUrl(
  provider: OAuthProvider,
  opts: { redirectUri: string; state: string; codeChallenge: string }
): string {
  const p = PROVIDERS[provider];
  const params = new URLSearchParams({
    client_id: p.clientId(),
    redirect_uri: opts.redirectUri,
    response_type: "code",
    scope: p.scopes.join(" "),
    state: opts.state,
    code_challenge: opts.codeChallenge,
    code_challenge_method: "S256",
  });
  if (provider === "google") {
    params.set("prompt", "select_account");
    params.set("access_type", "online");
  } else {
    params.set("allow_signup", "true");
  }
  return `${p.authorizeUrl}?${params.toString()}`;
}

/** Exchange an authorization code for an access token (PKCE). */
export async function exchangeCodeForToken(
  provider: OAuthProvider,
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<string> {
  const p = PROVIDERS[provider];
  const body = new URLSearchParams({
    client_id: p.clientId(),
    client_secret: p.clientSecret(),
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (provider === "github") headers["Accept"] = "application/json";

  const res = await fetch(p.tokenUrl, { method: "POST", headers, body });
  if (!res.ok) throw new Error(`Token exchange failed (HTTP ${res.status})`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Token exchange returned no access_token");
  return data.access_token;
}

/* ------------------------------------------------------------------ */
/*  Profile mapping                                                    */
/* ------------------------------------------------------------------ */

export interface OAuthProfile {
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
  name: string;
  avatar: string | null;
}

/** Fetch the user's profile and normalize it to our shape. */
export async function fetchProfile(
  provider: OAuthProvider,
  accessToken: string
): Promise<Omit<OAuthProfile, "provider">> {
  const p = PROVIDERS[provider];
  const headers = { Authorization: `Bearer ${accessToken}`, Accept: "application/json" };

  const res = await fetch(p.profileUrl, { headers });
  if (!res.ok) throw new Error(`Profile fetch failed (HTTP ${res.status})`);
  const data = (await res.json()) as Record<string, unknown>;

  if (provider === "google") {
    return {
      providerAccountId: String(data.sub ?? ""),
      email: normalizeEmail(typeof data.email === "string" ? data.email : ""),
      name: typeof data.name === "string" ? data.name : "",
      avatar: typeof data.picture === "string" ? data.picture : null,
    };
  }

  // GitHub — email is often only available via the /user/emails endpoint.
  let email = typeof data.email === "string" ? data.email : "";
  if (!email && p.emailsUrl) {
    const emailsRes = await fetch(p.emailsUrl, { headers });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as Array<{
        email?: string;
        primary?: boolean;
        verified?: boolean;
      }>;
      const chosen =
        emails.find((e) => e.primary && e.verified) ??
        emails.find((e) => e.verified);
      email = chosen?.email ?? "";
    }
  }
  if (!email) {
    // No public email — use GitHub's noreply address as a stable fallback.
    email = `${data.id ?? "gh"}+${data.login ?? "user"}@users.noreply.github.com`;
  }

  return {
    providerAccountId: String(data.id ?? ""),
    email: normalizeEmail(email),
    name:
      (typeof data.name === "string" && data.name) ||
      (typeof data.login === "string" ? data.login : ""),
    avatar: typeof data.avatar_url === "string" ? data.avatar_url : null,
  };
}

/* ------------------------------------------------------------------ */
/*  User upsert / linking                                              */
/* ------------------------------------------------------------------ */

/**
 * Find or create the user for an OAuth identity:
 * 1. By provider + providerAccountId → reuse.
 * 2. Else by email → link the provider identity to that account (last
 *    provider wins; the existing password, if any, is preserved).
 * 3. Else create a passwordless account.
 * OAuth users are always treated as email-verified.
 */
export async function upsertOAuthUser(profile: OAuthProfile) {
  const existing = await prisma.user.findFirst({
    where: {
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
    },
  });
  if (existing) {
    // The provider avatar is the default profile image: keep whatever the
    // user has, but fill it in if they've never set one.
    if (!existing.profileImage && profile.avatar) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { profileImage: profile.avatar },
      });
    }
    return existing;
  }

  const byEmail = await prisma.user.findUnique({ where: { email: profile.email } });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: {
        provider: profile.provider,
        providerAccountId: profile.providerAccountId,
        emailVerified: true,
        name: byEmail.name || profile.name,
        profileImage: byEmail.profileImage || profile.avatar,
      },
    });
  }

  return prisma.user.create({
    data: {
      name: profile.name || "New user",
      email: profile.email,
      password: null,
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
      emailVerified: true,
      profileImage: profile.avatar,
    },
  });
}
