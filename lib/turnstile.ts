/**
 * Cloudflare Turnstile (CAPTCHA) — server-side verification.
 *
 * Switched on only when BOTH keys are configured:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  (public, used by the widget in the browser)
 *   TURNSTILE_SECRET_KEY            (private, used here)
 * With either one missing the check is skipped, so a half-finished setup can
 * never lock real visitors out of a form that has no widget on it.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileEnabled(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
}

/**
 * True when the request may proceed.
 *  - Turnstile off                       → true (nothing to check)
 *  - missing / rejected / expired token  → false
 *  - Cloudflare unreachable or too slow  → true (fail open: an outage on their
 *    side must not take our forms down; rate limiting still applies)
 */
export async function verifyTurnstile(
  token: unknown,
  remoteIp?: string
): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (typeof token !== "string" || token.length === 0 || token.length > 4096) {
    return false;
  }

  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY as string,
      response: token,
    });
    if (remoteIp && remoteIp !== "untrusted") body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error("turnstile verify HTTP", res.status, "— failing open");
      return true;
    }
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("turnstile verify unavailable — failing open:", error);
    return true;
  }
}

/** Standard error body for a failed check. */
export const TURNSTILE_FAILED_MESSAGE =
  "Security check failed. Please refresh the page and try again.";
