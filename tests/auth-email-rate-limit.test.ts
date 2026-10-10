import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { fakeDb, fakeUsers } from "./fakes/prisma";

const EMAIL = "verify-me@example.com";
let resendPOST: (req: Request) => Promise<Response>;
let originalFetch: typeof fetch;
let emailCalls = 0;

function request(ip: string): Request {
  return new Request("https://www.for1s.com/api/auth/resend-verification", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-vercel-forwarded-for": ip,
    },
    body: JSON.stringify({ email: EMAIL }),
  });
}

describe("auth email delivery quota", () => {
  before(async () => {
    process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123";
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.APP_URL = "https://www.for1s.com";
    process.env.VERCEL = "1";
    ({ POST: resendPOST } = await import("../app/api/auth/resend-verification/route"));
  });

  beforeEach(() => {
    fakeDb.reset();
    fakeUsers.clear();
    emailCalls = 0;
    originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      emailCalls += 1;
      return new Response("{}", { status: 200 });
    };
    fakeUsers.set(EMAIL, {
      id: "test-user",
      name: "Test User",
      email: EMAIL,
      password: null,
      emailVerified: false,
      role: "client",
      company: null,
      profileImage: null,
      provider: "credentials",
      updatedAt: new Date(0),
    });
  });

  after(() => {
    globalThis.fetch = originalFetch;
    delete process.env.RESEND_API_KEY;
    delete process.env.APP_URL;
  });

  it("caps verification email delivery across different IP addresses", async () => {
    for (let i = 1; i <= 5; i += 1) {
      const response = await resendPOST(request(`198.51.100.${i}`));
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { success: true });
    }

    const blocked = await resendPOST(request("198.51.100.99"));
    assert.equal(blocked.status, 429);
    assert.equal(emailCalls, 5);
  });
});
