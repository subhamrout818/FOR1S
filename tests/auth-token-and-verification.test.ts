import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { fakeDb, fakeUsers } from "./fakes/prisma";

process.env.JWT_SECRET ??= "test-secret-that-is-at-least-48-characters-long-for-security";
const auth = await import("../lib/auth");
const { signVerifyEmail, verifyVerifyEmail, signResetPassword, verifyResetPassword,
  signPendingEmailChange, verifyPendingEmailChange, signPurposeToken } = auth;

const NOW = new Date("2026-01-01T00:00:00.000Z");

describe("purpose-scoped authentication tokens", () => {
  it("does not accept a token in another flow", () => {
    const verify = signVerifyEmail("u1", "person@example.com", NOW);
    const reset = signResetPassword("u1", "person@example.com", NOW);
    assert.ok(verifyVerifyEmail(verify));
    assert.equal(verifyResetPassword(verify), null);
    assert.ok(verifyResetPassword(reset));
    assert.equal(verifyVerifyEmail(reset), null);
  });

  it("rejects expired tokens", () => {
    const expired = signPurposeToken({ userId: "u1", email: "person@example.com", updatedAt: NOW.getTime() }, "reset", -1);
    assert.equal(verifyResetPassword(expired), null);
  });

  it("preserves the pending email token's staged address and timestamp", () => {
    const token = signPendingEmailChange("u1", "new@example.com", NOW);
    assert.deepEqual(verifyPendingEmailChange(token), {
      userId: "u1",
      email: "new@example.com",
      pendingEmailUpdatedAt: NOW.getTime(),
    });
  });
});

describe("email verification route", () => {
  beforeEach(() => {
    fakeDb.reset();
    fakeUsers.clear();
  });

  it("GET only redirects to confirmation and does not consume the token", async () => {
    const { GET } = await import("../app/api/auth/verify-email/route");
    const token = signVerifyEmail("u1", "person@example.com", NOW);
    const response = await GET(new Request(`http://localhost/api/auth/verify-email?token=${token}&type=signup`));
    assert.equal(response.status, 302);
    assert.match(response.headers.get("location") ?? "", /\/verify-email\?token=/);
  });

  it("POST consumes signup verification once and rejects replay", async () => {
    const { POST } = await import("../app/api/auth/verify-email/route");
    fakeUsers.set("person@example.com", {
      id: "u1", name: "Person", email: "person@example.com", password: null,
      emailVerified: false, role: "client", company: null, profileImage: null,
      provider: "credentials", updatedAt: NOW,
    });
    const token = signVerifyEmail("u1", "person@example.com", NOW);
    const request = () => new Request("http://localhost/api/auth/verify-email", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }),
    });
    assert.equal((await POST(request())).status, 200);
    assert.equal((await POST(request())).status, 200);
    assert.equal(fakeUsers.get("person@example.com")?.emailVerified, true);
  });
});
