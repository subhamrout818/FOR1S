// ──────────────────────────────────────────────
// Email (Resend) + validated site-origin helpers
// ──────────────────────────────────────────────

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

const ALLOWED_HOSTS = new Set(["for1s.com"]);

/**
 * The request's origin, but only when the Host header is trusted —
 * prevents Host-header injection from driving open redirects or a mismatched
 * OAuth `redirect_uri`. Production domains must be in ALLOWED_HOSTS (or APP_URL
 * set); any localhost port is accepted for local development. Returns null for
 * unknown hosts.
 */
export function allowedOrigin(req: Request): string | null {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "")
    .toLowerCase()
    .replace(/\/$/, "");
  const trusted = ALLOWED_HOSTS.has(host) || host.startsWith("localhost");
  if (!trusted) return null;
  const proto =
    req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Absolute URL for a path, derived from APP_URL or the validated origin.
 * Falls back to a dev default rather than throwing — email links are
 * best-effort, so a build failure shouldn't crash the request.
 */
export function absoluteUrl(req: Request, path: string): string {
  const origin = process.env.APP_URL || allowedOrigin(req) || "http://localhost:3000";
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
