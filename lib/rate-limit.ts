import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/*  Fixed-window rate limiter                                          */
/*                                                                     */
/*  Counts live in Postgres (the "RateLimit" table), so every serverless */
/*  instance shares them — an in-memory counter on Vercel only sees    */
/*  the requests that happen to hit the same instance.                 */
/*                                                                     */
/*  Resilience: the table is created on first use if it is missing, and */
/*  if the database is slow or unreachable the limiter falls back to a */
/*  per-instance in-memory counter. A limiter outage never takes the   */
/*  site down, and never blocks a legitimate user.                     */
/*                                                                     */
/*  Security trade-off of the fallback: limits are still enforced, but */
/*  only per serverless instance, so while the store is down an        */
/*  attacker spread across many instances gets more attempts than the  */
/*  shared limit allows. The fallback is therefore kept short: one     */
/*  failure pauses the store for DB_RETRY_AFTER_FAILURE_MS, not longer. */
/*                                                                     */
/*  Keys are SHA-256 hashed before storage so no IPs or emails land in */
/*  the table.                                                         */
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

/* ---- in-memory fallback (per instance) ---------------------------- */

function memCheck(
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

function memConsume(
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

/* ---- shared Postgres store ----------------------------------------- */

// All time maths happens on the database clock, in UTC, so instances with
// skewed clocks (or a non-UTC session time zone) agree with each other.
const DB_NOW = `(now() AT TIME ZONE 'UTC')`;

/**
 * Total time budget for ONE limiter operation, covering connection set-up,
 * a Neon compute wake-up and (if needed) creating the table.
 *
 * Why 4 s and not 1.5 s: the first query after the database has been idle has
 * to wake the Neon compute. Neon's operation log for this project shows
 * start_compute taking ~0.35-0.6 s normally and ~1.7-1.9 s when the branch had
 * been archived (the first, and so far only, logged timeout coincided with
 * exactly that). The connection itself also crosses regions (Vercel functions
 * run in iad1, the database is in ap-southeast-1), so TLS + auth take several
 * round trips. 1.5 s is shorter than that wake-up path, so the limiter gave up
 * on a database that was about to answer. A genuinely dead database still
 * degrades to the in-memory fallback, just after 4 s instead of 1.5 s.
 */
const DB_TIMEOUT_MS = 4000;

/**
 * After a failure, skip the store for this long (per instance) so an outage
 * costs each instance at most one slow probe per interval. Kept short: while
 * paused, limits are enforced per instance only (see the header comment), and
 * after a cold-start timeout the database is usually reachable moments later.
 */
const DB_RETRY_AFTER_FAILURE_MS = 10_000;

interface DbRow {
  count: number;
  msLeft: number;
}

let dbPausedUntil = 0;

/** Hash keys so IPs / emails are never stored in the table. */
function storeKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

class StoreTimeoutError extends Error {
  constructor() {
    super("rate-limit store timed out");
    this.name = "StoreTimeoutError";
  }
}

/** Reject after `ms` (at least 1). The underlying promise is left to finish. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new StoreTimeoutError()),
      Math.max(1, ms)
    );
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

async function ensureTable(): Promise<void> {
  await prisma.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS "RateLimit" (
       "key" TEXT NOT NULL,
       "count" INTEGER NOT NULL,
       "resetAt" TIMESTAMP(3) NOT NULL,
       CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
     )`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "RateLimit_resetAt_idx" ON "RateLimit"("resetAt")`
  );
}

let ensuring: Promise<void> | null = null;

/** Share one in-flight CREATE between concurrent requests (DDL races can error). */
function ensureTableOnce(): Promise<void> {
  if (!ensuring) {
    ensuring = ensureTable().finally(() => {
      ensuring = null;
    });
  }
  return ensuring;
}

function isMissingTable(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error);
  return /42P01|relation "?RateLimit"? does not exist/i.test(text);
}

/** Short, secret-free description of a store failure for the logs. */
function describeFailure(error: unknown, elapsedMs: number): string {
  if (error instanceof StoreTimeoutError) return `timeout after ${elapsedMs}ms`;
  const kind = isMissingTable(error) ? "missing-table" : "error";
  const name = error instanceof Error ? error.name : "unknown";
  const message = (error instanceof Error ? error.message : String(error))
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted-url]")
    .slice(0, 200);
  return `${kind} after ${elapsedMs}ms (${name}: ${message})`;
}

/**
 * Run a store operation. Returns null (caller falls back to memory) when the
 * store is unavailable. Creates the table once if it doesn't exist yet.
 *
 * The whole sequence (try, create table, retry) shares ONE DB_TIMEOUT_MS
 * budget, so a failing store can never hold a request for longer than that.
 */
async function withStore<T>(operation: () => Promise<T>): Promise<T | null> {
  if (Date.now() < dbPausedUntil) return null;
  const startedAt = Date.now();
  const remaining = () => DB_TIMEOUT_MS - (Date.now() - startedAt);
  try {
    return await withTimeout(operation(), remaining());
  } catch (error) {
    let failure = error;
    if (isMissingTable(error)) {
      try {
        await withTimeout(ensureTableOnce(), remaining());
        return await withTimeout(operation(), remaining());
      } catch (retryError) {
        failure = retryError;
      }
    }
    console.error(
      "rate-limit store unavailable, using in-memory fallback:",
      describeFailure(failure, Date.now() - startedAt)
    );
    dbPausedUntil = Date.now() + DB_RETRY_AFTER_FAILURE_MS;
    return null;
  }
}

function dbPeek(key: string): Promise<DbRow | null> {
  return prisma
    .$queryRawUnsafe(
      `SELECT "count"::int AS "count",
              (EXTRACT(EPOCH FROM ("resetAt" - ${DB_NOW})) * 1000)::float8 AS "msLeft"
       FROM "RateLimit"
       WHERE "key" = $1 AND "resetAt" > ${DB_NOW}`,
      storeKey(key)
    )
    .then((rows) => (rows as DbRow[])[0] ?? null);
}

function dbConsume(key: string, windowMs: number): Promise<DbRow> {
  // windowMs comes from our own RATE_LIMITS constants; coerce to a safe integer
  // because it is inlined into the SQL (parameter typing for intervals is brittle).
  const ms = Math.max(1, Math.floor(Number(windowMs)) || 1);
  return prisma
    .$queryRawUnsafe(
      `INSERT INTO "RateLimit" ("key", "count", "resetAt")
       VALUES ($1, 1, ${DB_NOW} + (${ms} * interval '1 millisecond'))
       ON CONFLICT ("key") DO UPDATE SET
         "count" = CASE WHEN "RateLimit"."resetAt" <= ${DB_NOW}
                        THEN 1 ELSE "RateLimit"."count" + 1 END,
         "resetAt" = CASE WHEN "RateLimit"."resetAt" <= ${DB_NOW}
                          THEN EXCLUDED."resetAt" ELSE "RateLimit"."resetAt" END
       RETURNING "count"::int AS "count",
                 (EXTRACT(EPOCH FROM ("resetAt" - ${DB_NOW})) * 1000)::float8 AS "msLeft"`,
      storeKey(key)
    )
    .then((rows) => {
      const row = (rows as DbRow[])[0];
      if (!row) throw new Error("rate-limit upsert returned no row");
      return row;
    });
}

/** Occasionally delete long-expired rows so the table stays small. */
function maybeSweep(): void {
  if (Math.random() > 0.02) return;
  prisma
    .$executeRawUnsafe(
      `DELETE FROM "RateLimit" WHERE "resetAt" < ${DB_NOW} - interval '1 hour'`
    )
    .catch(() => {});
}

/* ---- public API ----------------------------------------------------- */

/** Peek at a key's window WITHOUT counting this hit (used before a
 *  credential check, so only *failed* logins burn quota). */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitStatus> {
  // Wrap the row so `null` from withStore unambiguously means "store unavailable",
  // while `{ row: null }` means "available, but no active window for this key".
  const result = await withStore(async () => ({ row: await dbPeek(key) }));
  if (result === null) return memCheck(key, limit, windowMs);

  const { row } = result;
  if (!row) {
    return { ok: true, limit, remaining: limit, resetAt: Date.now() + windowMs };
  }
  return {
    ok: row.count < limit,
    limit,
    remaining: Math.max(0, limit - row.count),
    resetAt: Date.now() + Math.max(0, row.msLeft),
  };
}

/** Record a hit and return whether it is still within the window. */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitStatus> {
  const row = await withStore(() => dbConsume(key, windowMs));
  if (row === null) return memConsume(key, limit, windowMs);
  maybeSweep();
  return {
    ok: row.count <= limit,
    limit,
    remaining: Math.max(0, limit - row.count),
    resetAt: Date.now() + Math.max(0, row.msLeft),
  };
}

/**
 * Number of trusted reverse proxies directly in front of this app. Each
 * trusted proxy appends the real upstream IP to the RIGHT of x-forwarded-for,
 * so the true client IP is `TRUSTED_PROXY_COUNT` hops from the right.
 *
 * Defaults to 1 (e.g. a single nginx/Caddy/Cloudflare in front of `next start`).
 * Set to 0 when the app is exposed directly to the internet — with no trusted
 * proxy, both x-forwarded-for and x-real-ip are client-forgeable, so they are
 * ignored entirely and every direct connection shares one rate-limit bucket.
 * That is a deliberate trade: it caps abuse instead of letting an attacker
 * rotate the bucket by spoofing headers.
 */
const TRUSTED_PROXY_COUNT = (() => {
  const raw = process.env.TRUSTED_PROXY_COUNT;
  if (raw === undefined) return 1;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : 1;
})();

/**
 * Best-effort client IP from proxy headers, only trusted when the chain length
 * is consistent with the configured proxy stack.
 *
 * A header chain shorter than expected means the request skipped a trusted
 * proxy (or the header was forged), so it is not trusted — we return
 * "untrusted" rather than an attacker-chosen value, which keeps the rate-limit
 * key from being spoofed.
 */
export function clientIp(req: Request): string {
  // On Vercel the platform sets (and overwrites) x-vercel-forwarded-for with
  // the real client IP, so it can't be spoofed. Only trusted when we are
  // actually running there. The limiter is shared across instances now, so
  // falling through to the single "untrusted" bucket would lock everyone out
  // together instead of just one attacker.
  if (process.env.VERCEL) {
    const vercel = req.headers.get("x-vercel-forwarded-for");
    const first = vercel?.split(",")[0]?.trim();
    if (first) return first;
  }

  // x-real-ip is set by the terminating proxy from the TCP connection source;
  // only meaningful when we're actually behind that proxy.
  if (TRUSTED_PROXY_COUNT > 0) {
    const real = req.headers.get("x-real-ip");
    if (real) return real.trim();
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded && TRUSTED_PROXY_COUNT > 0) {
    const hops = forwarded
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    // Chain must be one hop longer than the trusted-proxy count for the
    // leftmost entries to include a genuine client IP.
    if (hops.length > TRUSTED_PROXY_COUNT) {
      return hops[hops.length - 1 - TRUSTED_PROXY_COUNT]!;
    }
  }

  return "untrusted";
}

/** Per-endpoint budgets. Tune freely. */
export const RATE_LIMITS = {
  login: { limit: 15, windowMs: 15 * 60_000 }, // 15 attempts / 15 min / IP
  // Failed attempts per email, across all IPs — slows distributed guessing.
  loginAccount: { limit: 30, windowMs: 60 * 60_000 },
  signup: { limit: 5, windowMs: 60 * 60_000 }, // 5 accounts / hour / IP
  contact: { limit: 5, windowMs: 60 * 60_000 }, // 5 messages / hour / IP
  oauth: { limit: 20, windowMs: 15 * 60_000 }, // 20 OAuth starts / 15 min / IP
  forgotPassword: { limit: 5, windowMs: 60 * 60_000 }, // per email+IP
  resetPassword: { limit: 10, windowMs: 15 * 60_000 }, // per IP
  resendVerification: { limit: 5, windowMs: 60 * 60_000 }, // per email+IP
  verifyEmail: { limit: 20, windowMs: 15 * 60_000 }, // per IP
  // Signed-in actions are keyed per user id, not per IP.
  ticket: { limit: 10, windowMs: 60 * 60_000 }, // 10 support tickets / hour
  comment: { limit: 30, windowMs: 60 * 60_000 }, // 30 comments / hour
  review: { limit: 30, windowMs: 60 * 60_000 }, // 30 approve/changes actions / hour
  passwordChange: { limit: 10, windowMs: 15 * 60_000 }, // failed current-password checks
  emailChange: { limit: 10, windowMs: 15 * 60_000 }, // failed current-password checks
} as const;

/** 429 response with a Retry-After header so clients know when to back off. */
export function rateLimitedResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { success: false, message: "Too many requests. Please try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}