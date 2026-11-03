import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import type * as Auth from "../lib/auth";

// Purpose-scoped tokens (email verify, password reset, OAuth state) are signed
// with the same secret as sessions. They must never be accepted as a login.

let auth: typeof Auth;

describe("verifyToken", () => {
  before(async () => {
    process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123";
    auth = await import("../lib/auth");
  });

  it("accepts a normal session token", () => {
    const token = auth.signToken("user_1", "a@example.com", "1h");
    const payload = auth.verifyToken(token);
    assert.equal(payload?.userId, "user_1");
    assert.equal(payload?.email, "a@example.com");
  });

  it("rejects an email-verification token", () => {
    const token = auth.signVerifyEmail("user_1", "a@example.com", new Date());
    assert.equal(auth.verifyToken(token), null);
  });

  it("rejects a password-reset token", () => {
    const token = auth.signResetPassword("user_1", "a@example.com", new Date());
    assert.equal(auth.verifyToken(token), null);
  });

  it("rejects an OAuth state token", () => {
    const token = auth.signOAuthState({
      provider: "google",
      nonce: "n",
      codeVerifier: "v",
      codeChallenge: "c",
    });
    assert.equal(auth.verifyToken(token), null);
  });

  it("rejects a token without a userId", () => {
    const token = auth.signPurposeToken({ email: "a@example.com" }, "verify", "1h");
    assert.equal(auth.verifyToken(token), null);
  });
});
