import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is required in all environments. " +
        "Generate one with: openssl rand -base64 48"
    );
  }
  if (secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters long for security. " +
        "Generate one with: openssl rand -base64 48"
    );
  }
  return secret;
})();

export interface JwtPayload {
  userId: string;
  email: string;
}

export type OAuthProvider = "google" | "github";
export type TokenPurpose = "verify" | "reset" | "oauth-state";

/**
 * Sign a JWT token for the given user.
 * `expiresIn` accepts jsonwebtoken durations ("7d", "24h", "15m", "10m", …).
 */
export function signToken(
  userId: string,
  email: string,
  expiresIn: string | number = "7d"
): string {
  return jwt.sign({ userId, email } satisfies JwtPayload, JWT_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

/**
 * Verify a JWT token and return its payload.
 * Returns null when the token is invalid or expired.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/** Normalize an email for storage/lookup: trim + lowercase. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/* ------------------------------------------------------------------ */
/*  HttpOnly session cookie                                            */
/*                                                                     */
/*  The session token lives in an httpOnly SameSite=Lax cookie, not    */
/*  localStorage, so injected scripts can't read it and cross-site      */
/*  requests can't send it (CSRF-safe for POSTs).                      */
/* ------------------------------------------------------------------ */

export const SESSION_COOKIE = "for1s_session";

/**
 * Read the session token from the httpOnly cookie. `cookies()` from
 * next/headers is the reliable way to read cookies in Route Handlers —
 * `request.cookies` is not populated in this Next version.
 *
 * A `req` argument is accepted for signature compatibility with callers that
 * pass it, but it is intentionally NOT consulted: a Bearer-header fallback
 * was removed because it let a stolen token be used outside the cookie flow,
 * bypassing SameSite CSRF protections. The cookie is the only session source.
 */
export async function getSessionToken(_req?: Request): Promise<string | null> {
  try {
    return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
  } catch {
    // cookies() throws outside a request scope (e.g. build-time prerender).
    return null;
  }
}

/** Attach the session cookie to a response. `remember` sets a 7-day cookie;
 *  otherwise the cookie is a session cookie (cleared when the browser closes). */
export function setSessionCookie(
  res: NextResponse,
  token: string,
  remember: boolean
): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? 7 * 24 * 60 * 60 : undefined,
  });
  return res;
}

/** Expire the session cookie immediately. */
export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

/* ------------------------------------------------------------------ */
/*  Purpose-scoped tokens (email verify, password reset, OAuth state)  */
/* ------------------------------------------------------------------ */

/**
 * Sign a JWT carrying a `purpose` claim. Used so a token minted for one
 * flow (e.g. password reset) can never be accepted by another.
 */
export function signPurposeToken(
  claims: Record<string, unknown>,
  purpose: TokenPurpose,
  expiresIn: string | number
): string {
  return jwt.sign({ ...claims, purpose }, JWT_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

/**
 * Verify a purpose-scoped token. Returns its claims, or null when the token
 * is invalid, expired, or its purpose doesn't match.
 */
export function verifyPurposeToken(
  token: string,
  purpose: TokenPurpose
): (Record<string, unknown> & { purpose: TokenPurpose }) | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as Record<string, unknown> & {
      purpose: unknown;
    };
    if (payload.purpose !== purpose) return null;
    return payload as Record<string, unknown> & { purpose: TokenPurpose };
  } catch {
    return null;
  }
}

export interface OAuthStatePayload {
  provider: OAuthProvider;
  /** Random value — also used as the PKCE code_verifier. */
  nonce: string;
  codeVerifier: string;
  codeChallenge: string;
  redirectTo?: string;
}

/** 10-minute signed state for the OAuth authorize round-trip. */
export function signOAuthState(payload: OAuthStatePayload): string {
  return signPurposeToken(
    payload as unknown as Record<string, unknown>,
    "oauth-state",
    "10m"
  );
}

export function verifyOAuthState(token: string): OAuthStatePayload | null {
  const payload = verifyPurposeToken(token, "oauth-state");
  if (!payload) return null;
  if (
    typeof payload.provider !== "string" ||
    typeof payload.nonce !== "string" ||
    typeof payload.codeVerifier !== "string" ||
    typeof payload.codeChallenge !== "string"
  ) {
    return null;
  }
  return {
    provider: payload.provider as OAuthProvider,
    nonce: payload.nonce,
    codeVerifier: payload.codeVerifier,
    codeChallenge: payload.codeChallenge,
    redirectTo: typeof payload.redirectTo === "string" ? payload.redirectTo : undefined,
  };
}

/**
 * 24-hour email-verification link token, bound to the user's `updatedAt`
 * timestamp so it becomes single-use: after a successful verification the
 * `updatedAt` field is bumped, invalidating any remaining copies of the token.
 */
export function signVerifyEmail(
  userId: string,
  email: string,
  updatedAt: Date
): string {
  return signPurposeToken(
    { userId, email, updatedAt: updatedAt.getTime() },
    "verify",
    "24h"
  );
}

export function verifyVerifyEmail(token: string): { userId: string; email: string; updatedAt: number } | null {
  const payload = verifyPurposeToken(token, "verify");
  if (
    !payload ||
    typeof payload.userId !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.updatedAt !== "number"
  ) {
    return null;
  }
  return {
    userId: payload.userId,
    email: payload.email,
    updatedAt: payload.updatedAt,
  };
}

/** 15-minute password-reset link token. */
export function signResetPassword(userId: string, email: string): string {
  return signPurposeToken({ userId, email }, "reset", "15m");
}

export function verifyResetPassword(token: string): { userId: string; email: string } | null {
  const payload = verifyPurposeToken(token, "reset");
  if (!payload || typeof payload.userId !== "string" || typeof payload.email !== "string") {
    return null;
  }
  return { userId: payload.userId, email: payload.email };
}

/* ------------------------------------------------------------------ */
/*  Passwords                                                          */
/* ------------------------------------------------------------------ */

/**
 * Hash a plaintext password.
 */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 */
export function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
