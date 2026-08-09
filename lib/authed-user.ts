import { prisma } from "@/lib/prisma";
import { verifyToken, getSessionToken } from "@/lib/auth";

/** A decoded session token plus its issuance timestamp. */
interface Session {
  userId: string;
  /** Seconds since epoch when the token was issued (0 if unknown). */
  iat: number;
}

/** Extract the session from the httpOnly cookie (or a Bearer header), or null. */
function tokenSession(req: Request): Session | null {
  const token = getSessionToken(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const iat = (payload as { iat?: number }).iat;
  return { userId: payload.userId, iat: typeof iat === "number" ? iat : 0 };
}

/**
 * Reject sessions issued before the account's last update. Password resets,
 * password changes, and email changes bump `updatedAt`, so a stolen token minted
 * before those events stops working immediately. (Trade-off: any account edit —
 * e.g. a profile photo change — also expires existing sessions.)
 */
function issuedBeforeAccountUpdate(iat: number, updatedAt: Date): boolean {
  // 60s grace absorbs clock skew between the DB and the token signer.
  return iat * 1000 + 60_000 < updatedAt.getTime();
}

/** Resolve the authenticated user (without the password hash). */
export async function getAuthUser(req: Request) {
  const session = tokenSession(req);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      updatedAt: true,
    },
  });
  if (!user || issuedBeforeAccountUpdate(session.iat, user.updatedAt)) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
  };
}

/** Resolve the authenticated user including the password hash, for
 *  verifying the current password on email/password changes. */
export async function getAuthUserWithPassword(req: Request) {
  const session = tokenSession(req);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      password: true,
      updatedAt: true,
    },
  });
  if (!user || issuedBeforeAccountUpdate(session.iat, user.updatedAt)) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    password: user.password,
  };
}
