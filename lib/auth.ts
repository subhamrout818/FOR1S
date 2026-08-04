import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("JWT_SECRET environment variable is required in production");
      })()
    : "dev-only-secret-not-for-production");

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

/** 24-hour email-verification link token. */
export function signVerifyEmail(userId: string, email: string): string {
  return signPurposeToken({ userId, email }, "verify", "24h");
}

export function verifyVerifyEmail(token: string): { userId: string; email: string } | null {
  const payload = verifyPurposeToken(token, "verify");
  if (!payload || typeof payload.userId !== "string" || typeof payload.email !== "string") {
    return null;
  }
  return { userId: payload.userId, email: payload.email };
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
