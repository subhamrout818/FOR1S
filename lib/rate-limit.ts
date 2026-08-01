import { NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/*  In-memory fixed-window rate limiter                                */
/*                                                                     */
/*  Designed for the repo's current deployment model — a single        */
/*  `next start` process. If FOR1S moves to serverless / multiple      */
/*  instances (Vercel, Lambda, replicas), swap the two functions below */
/*  for a shared store (Redis) — the route call sites only depend on   */
/*  `checkRateLimit` / `consumeRateLimit`, so the swap is contained    */
/*  entirely in this file.                                             */
/* ------------------------------------------------------------------ */

interface Bucket {
  count: number;
  resetAt: number; // epoch ms
}

const buckets = new Map<string, Bucket>();

// Periodically drop expired windows so the map can't grow unbounded.
const SWEEP_INTERVAL_MS = 60_000;
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, SWEEP_INTERVAL_MS).unref();
}

export interface RateLimitStatus {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // epoch ms when the window resets
}

/** Peek at a key's window WITHOUT counting this hit (used before a
 *  credential check, so only *failed* logins burn quota). */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitStatus {
  const now = Date.now();
  const bucket = buckets.get(key);
  const count = bucket && bucket.resetAt > now ? bucket.count : 0;
  const resetAt = bucket && bucket.resetAt > now ? bucket.resetAt : now + windowMs;
  return { ok: count < limit, limit, remaining: Math.max(0, limit - count), resetAt };
}

/** Record a hit and return whether it is still within the window. */
export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitStatus {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      ok: 1 <= limit,
      limit,
      remaining: Math.max(0, limit - 1),
      resetAt: now + windowMs,
    };
  }

  bucket.count += 1;
  return {
    ok: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

/** Best-effort client IP from common proxy headers. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/** Per-endpoint budgets. Tune freely. */
export const RATE_LIMITS = {
  login: { limit: 15, windowMs: 15 * 60_000 }, // 15 attempts / 15 min / IP
  signup: { limit: 5, windowMs: 60 * 60_000 }, // 5 accounts / hour / IP
  contact: { limit: 5, windowMs: 60 * 60_000 }, // 5 messages / hour / IP
} as const;

/** 429 response with a Retry-After header so clients know when to back off. */
export function rateLimitedResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { success: false, message: "Too many requests. Please try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}