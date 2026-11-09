// ──────────────────────────────────────────────
// Email (Resend) + validated site-origin helpers
// ──────────────────────────────────────────────

import { SITE_URL } from "@/lib/contact";

const PRODUCTION_SENDER = /(?:<\s*)?[^<>\s]+@for1s\.com(?:\s*>)?$/i;

function configuredSender(): string | null {
  const configured = process.env.RESEND_FROM?.trim();
  if (process.env.NODE_ENV === "production") {
    return configured && PRODUCTION_SENDER.test(configured) ? configured : null;
  }
  return configured || "FOR1S <onboarding@resend.dev>";
}

/**
 * Send an email through Resend. Returns false and logs a safe provider error
 * when delivery cannot be requested. Production must use a verified FOR1S
 * sender; never silently fall back to Resend's restricted test sender.
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
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = configuredSender();
  if (!apiKey || !from) {
    console.error(
      "sendEmail unavailable:",
      !apiKey ? "RESEND_API_KEY is missing." : "RESEND_FROM must use the verified for1s.com domain."
    );
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("sendEmail failed:", res.status, detail.slice(0, 1000));
      return false;
    }
    return true;
  } catch (error) {
    console.error("sendEmail error:", error);
    return false;
  }
}

/** Whether a usable email provider and production sender are configured. */
export function emailEnabled(): boolean {
  return !!process.env.RESEND_API_KEY?.trim() && !!configuredSender();
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
 * set, the canonical site in production, localhost in development.
 */
export function fallbackOrigin(): string {
  return (
    process.env.APP_URL ||
    (isProduction() ? SITE_URL : "http://localhost:3000")
  ).replace(/\/$/, "");
}

/** Absolute URL for a path, derived from APP_URL or the validated origin. */
export function absoluteUrl(req: Request, path: string): string {
  const origin =
    (process.env.APP_URL || allowedOrigin(req) || fallbackOrigin()).replace(/\/$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
