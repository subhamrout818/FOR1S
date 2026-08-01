import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/** Extract the authenticated user id from a Bearer token, or null. */
async function tokenUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const payload = verifyToken(authHeader.slice(7));
  if (!payload) return null;
  return payload.userId;
}

/** Resolve the authenticated user (without the password hash). */
export async function getAuthUser(req: Request) {
  const userId = await tokenUserId(req);
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, profileImage: true },
  });
}

/** Resolve the authenticated user including the password hash, for
 *  verifying the current password on email/password changes. */
export async function getAuthUserWithPassword(req: Request) {
  const userId = await tokenUserId(req);
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      password: true,
    },
  });
}
