import assert from "node:assert/strict";
import { before, beforeEach, describe, it } from "node:test";
import bcrypt from "bcrypt";
import { fakeDb, fakeUsers } from "./fakes/prisma";
import type * as LoginRoute from "../app/api/auth/login/route";

// Regression tests for POST /api/auth/login, the route that logged the
// "rate-limit store timed out" errors. Real route, real limiter, real bcrypt;
// only the database and the Next.js runtime are faked.

const EMAIL = "client@example.com";
const PASSWORD = "correct-horse-battery-staple";

let POST: typeof LoginRoute.POST;
let ipCounter = 0;
const nextIp = () => `198.51.100.${++ipCounter}`; // one rate-limit bucket per test

function loginRequest(ip: string, password: string, email = EMAIL): Request {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json", "x-vercel-forwarded-for": ip },
    body: JSON.stringify({ email, password }),
  });
}

describe("POST /api/auth/login", () => {
  before(async () => {
    process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123";
    process.env.VERCEL = "1"; // makes clientIp() trust x-vercel-forwarded-for
    fakeUsers.set(EMAIL, {
      id: "user_1",
      name: "Test Client",
      email: EMAIL,
      password: bcrypt.hashSync(PASSWORD, 4),
      emailVerified: true,
      role: "client",
      company: null,
      profileImage: null,
      provider: "credentials",
    });
    ({ POST } = (await import("../app/api/auth/login/route")) as typeof LoginRoute);
  });

  beforeEach(() => {
    fakeDb.reset();
  });

  it("logs a valid user in and sets the session cookie", async () => {
    const res = await POST(loginRequest(nextIp(), PASSWORD));
    assert.equal(res.status, 200);
    const body = (await res.json()) as { success: boolean; user: { email: string } };
    assert.equal(body.success, true);
    assert.equal(body.user.email, EMAIL);
    assert.match(res.headers.get("set-cookie") ?? "", /^for1s_session=/);
  });

  it("successful logins only peek at the limiter (2 queries); they never burn quota", async () => {
    await POST(loginRequest(nextIp(), PASSWORD));
    assert.deepEqual(fakeDb.calls, ["peek", "peek"]);
    assert.equal(fakeDb.rows.size, 0);
  });

  it("a wrong password gets the generic 401 and burns one hit on the IP and one on the account", async () => {
    const res = await POST(loginRequest(nextIp(), "wrong-password"));
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { success: false, message: "Invalid email or password" });
    assert.deepEqual(fakeDb.calls, ["peek", "peek", "consume", "consume"]);
    assert.equal(fakeDb.rows.size, 2);
  });

  it("unknown emails look identical to wrong passwords", async () => {
    const res = await POST(loginRequest(nextIp(), "whatever", "nobody@example.com"));
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { success: false, message: "Invalid email or password" });
  });

  it("blocks the 16th failed attempt from one IP with 429 + Retry-After", async () => {
    const ip = nextIp();
    for (let i = 0; i < 15; i++) {
      assert.equal((await POST(loginRequest(ip, "wrong"))).status, 401, `attempt ${i + 1}`);
    }
    const blocked = await POST(loginRequest(ip, PASSWORD)); // even the right password
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers.get("retry-after")) >= 1);
    // a different IP is unaffected
    assert.equal((await POST(loginRequest(nextIp(), PASSWORD))).status, 200);
  });

  it("rejects malformed input with 400 without touching the password check", async () => {
    const res = await POST(loginRequest(nextIp(), "x", "not-an-email"));
    assert.equal(res.status, 400);
  });

  // KNOWN GAP (not introduced by the cold-start fix, tracked separately): the route
  // peeks at the counter first and only records a hit AFTER the password check
  // fails, so a burst of parallel guesses all pass the peek before any hit lands.
  // Measured before the fix: 100 parallel wrong guesses -> 100 x 401, 0 x 429.
  // Marked `todo` so it runs and reports but does not fail the suite; remove the
  // flag once the route reserves its slot before verifying the password.
  it(
    "a burst of parallel wrong guesses cannot exceed the 15-attempt limit",
    { todo: "known gap: peek-then-consume lets a parallel burst through" },
    async () => {
      const ip = nextIp();
      const burst = await Promise.all(Array.from({ length: 100 }, () => POST(loginRequest(ip, "wrong"))));
      const answered = burst.filter((r) => r.status === 401).length;
      assert.ok(answered <= 15, `${answered} guesses were answered; the limit is 15`);
    }
  );

  it("when the limiter store hangs, login still answers (after the 4 s budget) and the limit still bites", async () => {
    fakeDb.mode = "hang";
    const ip = nextIp();

    const started = Date.now();
    const first = await POST(loginRequest(ip, "wrong"));
    const elapsed = Date.now() - started;
    assert.equal(first.status, 401, "must not 500 or silently allow");
    assert.ok(elapsed >= 3900 && elapsed < 6500, `first request took ${elapsed} ms (expected ~4 s)`);

    // Store is now paused: fast, and per-instance counters enforce the same 15-attempt limit.
    const t0 = Date.now();
    for (let i = 1; i < 15; i++) {
      assert.equal((await POST(loginRequest(ip, "wrong"))).status, 401, `attempt ${i + 1}`);
    }
    assert.ok(Date.now() - t0 < 2500, "paused store must not slow requests down");
    assert.equal((await POST(loginRequest(ip, "wrong"))).status, 429, "fallback is not fail-open");
    assert.equal((await POST(loginRequest(nextIp(), PASSWORD))).status, 200, "other clients still log in");
  });
});
