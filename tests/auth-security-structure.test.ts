import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const read = (relative: string) => fs.readFileSync(path.join(root, relative), "utf8");

describe("authentication and portal authorization structure", () => {
  it("consumes login quotas before looking up users or comparing passwords", () => {
    const source = read("app/api/auth/login/route.ts");
    const consume = source.indexOf("consumeRateLimit(");
    const lookup = source.indexOf("prisma.user.findUnique(");
    const compare = source.indexOf("comparePassword(");
    assert.notEqual(consume, -1, "login must consume quota atomically");
    assert.ok(lookup > consume, "quota must be consumed before user lookup");
    assert.ok(compare > consume, "quota must be consumed before password comparison");
    assert.doesNotMatch(source, /checkRateLimit\(/, "login must not use check-then-record");
  });

  it("scopes deliverable detail, comments and reviews to the authenticated client", () => {
    const detail = read("lib/portal.ts");
    const comment = read("app/api/portal/deliverables/[id]/comment/route.ts");
    const review = read("app/api/portal/deliverables/[id]/review/route.ts");
    const detailScope = /where:\s*\{\s*id:\s*deliverableId,\s*project:\s*\{\s*clientId:\s*userId\s*\}\s*\}/;
    const mutationScope = /where:\s*\{\s*id,\s*project:\s*\{\s*clientId:\s*user\.id\s*\}\s*\}/;
    assert.match(detail, detailScope, "detail query must scope by owning client");
    assert.match(comment, mutationScope, "comment mutation must scope by owning client");
    assert.match(review, mutationScope, "review mutation must scope by owning client");
  });

  it("requires an authenticated user before portal mutation routes", () => {
    for (const relative of [
      "app/api/portal/deliverables/[id]/comment/route.ts",
      "app/api/portal/deliverables/[id]/review/route.ts",
      "app/api/portal/tickets/route.ts",
    ]) {
      const source = read(relative);
      assert.ok(source.includes("const user = await requireAuth(req)"), relative);
      assert.ok(source.includes("if (!user)"), relative);
    }
  });

  it("requires the admin role on administrative mutation routes", () => {
    for (const relative of [
      "app/api/admin/projects/route.ts",
      "app/api/admin/projects/[id]/route.ts",
      "app/api/admin/deliverables/[id]/route.ts",
      "app/api/admin/leads/[id]/route.ts",
      "app/api/admin/tickets/[id]/route.ts",
    ]) {
      const source = read(relative);
      assert.ok(source.includes("const user = await requireAuth(req)"), relative);
      assert.match(source, /user\.role !== ["']admin["']/, relative);
    }
  });

  it("guards every admin API route, including the read-only workspace", () => {
    for (const relative of [
      "app/api/admin/route.ts",
      "app/api/admin/projects/route.ts",
      "app/api/admin/projects/[id]/route.ts",
      "app/api/admin/deliverables/[id]/route.ts",
      "app/api/admin/leads/[id]/route.ts",
      "app/api/admin/tickets/[id]/route.ts",
    ]) {
      const source = read(relative);
      assert.ok(source.includes("const user = await requireAuth(req)"), relative);
      assert.ok(source.includes('user.role !== "admin"'), relative);
    }
  });

  it("protects profile and portal workspace reads and binds profile writes to the session user", () => {
    const account = read("app/api/account/route.ts");
    const portal = read("app/api/portal/route.ts");
    assert.ok(account.includes("const user = await getAuthUser(req)"));
    assert.ok(account.includes("where: { id: user.id }"));
    assert.ok(portal.includes("const user = await requireAuth(req)"));
    assert.ok(portal.includes("if (!user)"));
  });

  it("rejects unauthenticated account mutations", () => {
    for (const relative of [
      "app/api/account/route.ts",
      "app/api/account/email/route.ts",
      "app/api/account/password/route.ts",
    ]) {
      const source = read(relative);
      assert.ok(source.includes("if (!user)"), relative);
    }
  });

  it("uses atomic reservations for password-confirmed account mutations", () => {
    for (const relative of [
      "app/api/account/password/route.ts",
      "app/api/account/email/route.ts",
    ]) {
      const source = read(relative);
      assert.match(source, /consumeRateLimit\(/, relative + " must reserve quota atomically");
      assert.match(source, /releaseRateLimit\(/, relative + " must release quota after valid credentials");
      assert.doesNotMatch(source, /checkRateLimit\(/, relative + " must not use check-then-record");
    }
  });

  it("keeps email failure responses generic and leaves resend recovery available", () => {
    const signup = read("app/api/auth/signup/route.ts");
    const reset = read("app/api/auth/forgot-password/route.ts");
    const resend = read("app/api/auth/resend-verification/route.ts");
    assert.match(signup, /Signup verification email delivery failed/);
    assert.match(reset, /Password reset email delivery failed/);
    assert.match(resend, /Verification resend email delivery failed/);
    assert.match(reset, /return NextResponse\.json\(\{ success: true \}\)/);
    assert.match(resend, /return NextResponse\.json\(\{ success: true \}\)/);
  });
});
