import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production";

export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Sign a JWT token for the given user.
 */
export function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email } satisfies JwtPayload, JWT_SECRET, {
    expiresIn: "7d",
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
