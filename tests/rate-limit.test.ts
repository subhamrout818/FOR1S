import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it, mock, type TestContext } from "node:test";
import { fakeDb } from "./fakes/prisma";
import type * as RateLimitModule from "../lib/rate-limit";

type RateLimit = typeof RateLimitModule;

// Each test gets its own copy of the limiter module so its per-instance state
// (in-memory buckets, "store paused" timer) starts clean, like a fresh serverless instance.
let instance = 0;
async function freshLimiter(): Promise<RateLimit> {
  const specifier: string = `../lib/rate-limit?instance=${++instance}`;
  return (await import(specifier)) as RateLimit;
}

/** Let promise continuations run (mocked timers do not drain the microtask queue). */
async function settle(): Promise<void> {
  for (let i = 0; i < 25; i++) await Promise.resolve();
}

/** Advance the fake clock in small steps so chained timeouts get registered in order. */
async function advance(t: TestContext, ms: number, step = 50): Promise<void> {
  for (let done = 0; done < ms; done += step) {
    t.mock.timers.tick(Math.min(step, ms - done));
    await settle();
  }
}

const START = 1_800_000_000_000;
const MIN = 60_000;

describe("rate limiter", () => {
  let logged: string[];

  beforeEach(() => {
    fakeDb.reset();
    logged = [];
    mock.method(console, "error", (...args: unknown[]) => {
      logged.push(args.map(String).join(" "));
    });
    mock.method(Math, "random", () => 1); // never run the 2% opportunistic sweep
  });

  afterEach(() => {
    mock.timers.reset();
    mock.restoreAll();
  });

  it("enforces the limit in the shared store and resets after the window", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });

    const results = [];
    for (let i = 0; i < 4; i++) results.push(await rl.consumeRateLimit("k", 3, MIN));
    assert.deepEqual(results.map((r) => r.ok), [true, true, true, false]);
    assert.deepEqual(results.map((r) => r.remaining), [2, 1, 0, 0]);
    assert.equal((await rl.checkRateLimit("k", 3, MIN)).ok, false);

    await advance(t, MIN + 1, MIN + 1); // window elapses on the (fake) database clock
    const after = await rl.consumeRateLimit("k", 3, MIN);
    assert.equal(after.ok, true);
    assert.equal(after.remaining, 2);
    assert.equal(logged.length, 0, "no fallback should have been needed");
  });

  it("never lets concurrent requests exceed the limit", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });

    const results = await Promise.all(Array.from({ length: 40 }, () => rl.consumeRateLimit("burst", 10, MIN)));
    assert.equal(results.filter((r) => r.ok).length, 10);
    assert.equal(results.filter((r) => !r.ok).length, 30);
    assert.equal(fakeDb.rows.get(fakeDb.rows.keys().next().value as string)?.count, 40);
  });

  it("peek does not count a hit, and each call costs exactly one query", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });

    for (let i = 0; i < 5; i++) await rl.checkRateLimit("q", 3, MIN);
    assert.equal(fakeDb.rows.size, 0);
    assert.deepEqual(fakeDb.calls, ["peek", "peek", "peek", "peek", "peek"]);

    fakeDb.calls = [];
    await rl.consumeRateLimit("q", 3, MIN);
    assert.deepEqual(fakeDb.calls, ["consume"]);
  });

  it("cold start: a 2.5 s database wake-up is served by the shared store, not the fallback", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });
    fakeDb.wakeUpMs = 2500; // first query after the database slept (cf. Neon start_compute 1.7-1.9 s + connect)

    const pending = rl.consumeRateLimit("login", 15, MIN);
    await advance(t, 2600);
    const result = await pending;

    assert.equal(result.ok, true);
    assert.equal(fakeDb.rows.size, 1, "the hit must be recorded in the shared store");
    assert.deepEqual(fakeDb.calls, ["consume"]);
    assert.equal(logged.length, 0, "no 'store unavailable' log expected");
  });

  it("a database that never answers is bounded to 4 s, then falls back per instance", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });
    fakeDb.mode = "hang";

    let settled = false;
    const pending = rl.consumeRateLimit("hang", 3, MIN).then((r) => {
      settled = true;
      return r;
    });
    await advance(t, 3950);
    assert.equal(settled, false, "must still be waiting just under the 4 s budget");
    await advance(t, 100);
    assert.equal(settled, true, "must give up by ~4 s");
    assert.equal((await pending).ok, true);

    assert.equal(logged.length, 1);
    assert.match(logged[0]!, /rate-limit store unavailable, using in-memory fallback/);
    assert.match(logged[0]!, /timeout after/);

    // Paused: further calls do not touch the database and are not slowed down.
    const queriesBefore = fakeDb.calls.length;
    const second = await rl.consumeRateLimit("hang", 3, MIN);
    const third = await rl.consumeRateLimit("hang", 3, MIN);
    const fourth = await rl.consumeRateLimit("hang", 3, MIN);
    assert.equal(fakeDb.calls.length, queriesBefore);

    // ...and the fallback is not fail-open: the limit still bites (3 allowed, the 4th denied).
    assert.deepEqual([second.ok, third.ok, fourth.ok], [true, true, false]);
    assert.equal((await rl.checkRateLimit("hang", 3, MIN)).ok, false);
  });

  it("retries the shared store once the 10 s pause is over", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });
    fakeDb.mode = "error";
    await rl.consumeRateLimit("recover", 3, MIN);
    assert.equal(fakeDb.calls.length, 1);

    fakeDb.mode = "ok"; // database is back
    await rl.consumeRateLimit("recover", 3, MIN);
    assert.equal(fakeDb.calls.length, 1, "still paused: not retried yet");

    await advance(t, 9_000, 1_000);
    await rl.consumeRateLimit("recover", 3, MIN);
    assert.equal(fakeDb.calls.length, 1, "9 s: still paused");

    await advance(t, 1_100, 1_100);
    const back = await rl.consumeRateLimit("recover", 3, MIN);
    assert.equal(fakeDb.calls.length, 2, "after 10 s the store is tried again");
    assert.equal(back.ok, true);
    assert.equal(fakeDb.rows.size, 1);
  });

  it("creates a missing table once, even when many requests arrive together", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });
    fakeDb.tableExists = false;
    fakeDb.ddlLatencyMs = 300;

    const pending = Promise.all(Array.from({ length: 20 }, () => rl.consumeRateLimit("new-table", 100, MIN)));
    await advance(t, 1500);
    const results = await pending;

    assert.equal(fakeDb.count("create-table"), 1, "one shared CREATE TABLE, not one per request");
    assert.equal(results.every((r) => r.ok), true);
    assert.equal(fakeDb.rows.get(fakeDb.rows.keys().next().value as string)?.count, 20);
    assert.equal(logged.length, 0);
  });

  it("table creation shares the single 4 s budget instead of getting a fresh one per step", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });
    fakeDb.tableExists = false;
    fakeDb.ddlLatencyMs = 60_000; // DDL never finishes in time

    let settled = false;
    const pending = rl.consumeRateLimit("slow-ddl", 3, MIN).then((r) => {
      settled = true;
      return r;
    });
    await advance(t, 4100);
    assert.equal(settled, true, "whole sequence must end within ~4 s");
    assert.equal((await pending).ok, true);
    assert.match(logged[0]!, /timeout after/);
  });

  it("database errors fall back without throwing, and logs contain no keys, IPs or credentials", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });
    fakeDb.mode = "error";
    fakeDb.errorMessage = "connect failed: postgresql://app_user:s3cr3t-pw@db.example.neon.tech/neondb?sslmode=require";

    const key = "auth:login:203.0.113.77";
    const result = await rl.consumeRateLimit(key, 15, MIN);
    assert.equal(result.ok, true);

    const log = logged.join("\n");
    assert.match(log, /rate-limit store unavailable/);
    assert.match(log, /\[redacted-url\]/);
    assert.doesNotMatch(log, /s3cr3t-pw|app_user|203\.0\.113\.77|auth:login/);
  });

  it("stores only a hash of the key, never the raw IP or email", async (t) => {
    const rl = await freshLimiter();
    t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: START });
    await rl.consumeRateLimit("auth:login:acct:person@example.com", 5, MIN);
    const [stored] = [...fakeDb.rows.keys()];
    assert.match(stored!, /^[0-9a-f]{64}$/);
  });
});

describe("limiter API used by the routes", () => {
  it("still exports everything the routes import, and every referenced budget exists", async () => {
    const rl = await freshLimiter();
    for (const name of ["checkRateLimit", "consumeRateLimit", "clientIp", "rateLimitedResponse"] as const) {
      assert.equal(typeof rl[name], "function", name);
    }

    const referenced = new Set<string>();
    const walk = (dir: string): void => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tsx?$/.test(entry.name)) {
          for (const m of fs.readFileSync(full, "utf8").matchAll(/RATE_LIMITS\.(\w+)/g)) referenced.add(m[1]!);
        }
      }
    };
    walk(path.resolve("app"));

    assert.ok(referenced.size >= 10, `expected the routes to reference many budgets, found ${referenced.size}`);
    for (const name of referenced) assert.ok(name in rl.RATE_LIMITS, `RATE_LIMITS.${name} is missing`);
  });

  it("keeps the documented budgets unchanged", async () => {
    const { RATE_LIMITS } = await freshLimiter();
    assert.deepEqual(RATE_LIMITS.login, { limit: 15, windowMs: 15 * MIN });
    assert.deepEqual(RATE_LIMITS.loginAccount, { limit: 30, windowMs: 60 * MIN });
    assert.deepEqual(RATE_LIMITS.signup, { limit: 5, windowMs: 60 * MIN });
    assert.deepEqual(RATE_LIMITS.contact, { limit: 5, windowMs: 60 * MIN });
  });

  it("answers 429 with a Retry-After header", async () => {
    const rl = await freshLimiter();
    const res = rl.rateLimitedResponse(Date.now() + 42_000);
    assert.equal(res.status, 429);
    const retryAfter = Number(res.headers.get("retry-after"));
    assert.ok(retryAfter >= 41 && retryAfter <= 43, `retry-after was ${retryAfter}`);
  });
});
