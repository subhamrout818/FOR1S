// ──────────────────────────────────────────────
// Email (Resend) + validated site-origin helpers
// ──────────────────────────────────────────────

import { SITE_URL } from "@/lib/contact";

/**
 * Send an email through Resend. Returns false (and logs) when no
 * RESEND_API_KEY is configured or the send fails — callers should treat
 * email as best-effort, mirroring the contact/editing routes.
 */
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  try {
    const from = process.env.RESEND_FROM || "FOR1S <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!res.ok) {
      console.error("sendEmail failed:", await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("sendEmail error:", error);
    return false;
  }
}

/** Whether email delivery is configured (gates verification-required signup). */
export function emailEnabled(): boolean {
  return !!process.env.RESEND_API_KEY;
}

const ALLOWED_HOSTS = new Set(["for1s.com", "www.for1s.com"]);

/** Exactly `localhost` / `127.0.0.1`, optionally with a port — nothing else. */
const LOCAL_HOST = /^(localhost|127\.0\.0\.1)(:\d{1,5})?$/;

const isProduction = () => process.env.NODE_ENV === "production";

/**
 * The request's origin, but only when the Host header is trusted —
 * prevents Host-header injection from driving open redirects, a mismatched
 * OAuth `redirect_uri`, or poisoned links in emails. Production accepts only
 * the hosts in ALLOWED_HOSTS; localhost (exact match, any port) is accepted
 * outside production for local development. Returns null for unknown hosts.
 */
export function allowedOrigin(req: Request): string | null {
  // A forwarded-host chain can hold several entries; the first is the client-facing one.
  const host = (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    ""
  )
    .split(",")[0]
    ?.trim()
    .toLowerCase() ?? "";

  const local = !isProduction() && LOCAL_HOST.test(host);
  if (!ALLOWED_HOSTS.has(host) && !local) return null;

  // Only ever http(s). Production is always https; local dev is http unless
  // a proxy says otherwise.
  const forwardedProto =
    (req.headers.get("x-forwarded-proto") || "").split(",")[0]?.trim().toLowerCase() ?? "";
  const proto = isProduction()
    ? "https"
    : forwardedProto === "https"
      ? "https"
      : "http";
  return `${proto}://${host}`;
}

/**
 * Base URL to use when the request's own origin isn't trusted: APP_URL when
 * set, the canonical site in production, localhost in development. Never
 * returns localhost in production, so emails can't contain dead localhost links.
 */
export function fallbackOrigin(): string {
  return (
    process.env.APP_URL ||
    (isProduction() ? SITE_URL : "http://localhost:3000")
  ).replace(/\/$/, "");
}

/**
 * Absolute URL for a path, derived from APP_URL or the validated origin.
 * Falls back to the canonical site (or localhost in dev) rather than throwing —
 * email links are best-effort, so a build failure shouldn't crash the request.
 */
export function absoluteUrl(req: Request, path: string): string {
  const origin =
    (process.env.APP_URL || allowedOrigin(req) || fallbackOrigin()).replace(/\/$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
