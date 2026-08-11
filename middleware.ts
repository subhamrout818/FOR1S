import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge middleware — defense-in-depth for the authenticated API surface.
 *
 * The per-handler `getAuthUser()` / `requireAuth()` checks remain the source
 * of truth, but this catches the failure mode where a NEW route is added under
 * a protected prefix and its author forgets the guard: the middleware rejects
 * the request before the handler runs.
 *
 * It mirrors lib/auth.ts — same session cookie, same JWT secret — and only
 * accepts the httpOnly cookie (no Bearer
 * header; that fallback was removed from the server in favor of the cookie,
 * keeping the CSRF posture of the cookie flow intact).
 */

const SESSION_COOKIE = "for1s_session";

/**
 * Must match lib/auth.ts — no dev fallback. If JWT_SECRET is missing or too
 * short, all protected routes return 401 instead of silently using a weak key.
 */
const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  return secret;
})();

const PROTECTED_PREFIXES = ["/api/admin", "/api/portal", "/api/account"] as const;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!JWT_SECRET || !token || !(await isTokenValid(token, JWT_SECRET))) {
    return unauthorized();
  }

  return NextResponse.next();
}

async function isTokenValid(token: string, secret: string): Promise<boolean> {
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Unauthorized" },
    { status: 401 }
  );
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/portal/:path*", "/api/account/:path*"],
};
