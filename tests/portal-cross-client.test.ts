import assert from "node:assert/strict";
import { afterEach, before, beforeEach, describe, it } from "node:test";
import { fakeDb, fakeDeliverables, fakeUsers } from "./fakes/prisma";
import { setTestSessionCookie } from "./fakes/next-headers";

const CLIENT_A = {
  id: "portal_client_a",
  name: "Client A",
  email: "client-a@example.com",
  password: null,
  emailVerified: true,
  role: "client",
  company: null,
  profileImage: null,
  provider: "credentials",
};
const CLIENT_B = {
  id: "portal_client_b",
  name: "Client B",
  email: "client-b@example.com",
  password: null,
  emailVerified: true,
  role: "client",
  company: null,
  profileImage: null,
  provider: "credentials",
};

let detailGET: (req: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;
let commentPOST: (req: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;
let reviewPOST: (req: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;
let signToken: (userId: string, email: string) => string;

function request(method: string, body?: unknown): Request {
  return new Request("http://localhost/api/portal/deliverables/deliverable-b", {
    method,
    headers: { "content-type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

describe("portal routes reject cross-client deliverable access", () => {
  before(async () => {
    process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123";
    const auth = await import("../lib/auth");
    signToken = auth.signToken;
    ({ GET: detailGET } = await import("../app/api/portal/deliverables/[id]/route"));
    ({ POST: commentPOST } = await import("../app/api/portal/deliverables/[id]/comment/route"));
    ({ POST: reviewPOST } = await import("../app/api/portal/deliverables/[id]/review/route"));
  });

  beforeEach(() => {
    fakeDb.reset();
    fakeUsers.clear();
    fakeDeliverables.clear();
    fakeUsers.set(CLIENT_A.email, CLIENT_A);
    fakeUsers.set(CLIENT_B.email, CLIENT_B);
    fakeDeliverables.set("deliverable-b", {
      id: "deliverable-b",
      projectId: "project-b",
      project: { id: "project-b", name: "Client B Project", slug: "client-b-project", clientId: CLIENT_B.id },
      title: "Private deliverable",
      kind: "file",
      status: "in-review",
    });
    setTestSessionCookie(signToken(CLIENT_A.id, CLIENT_A.email));
  });

  afterEach(() => {
    setTestSessionCookie(null);
  });

  it("does not return another client's deliverable detail", async () => {
    const response = await detailGET(request("GET"), { params: Promise.resolve({ id: "deliverable-b" }) });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { success: false, message: "Not found" });
  });

  it("does not allow another client to comment on a deliverable", async () => {
    const response = await commentPOST(request("POST", { body: "Unauthorized comment" }), { params: Promise.resolve({ id: "deliverable-b" }) });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { success: false, message: "Not found" });
  });

  it("does not allow another client to review a deliverable", async () => {
    const response = await reviewPOST(request("POST", { action: "approve", note: "Unauthorized approval" }), { params: Promise.resolve({ id: "deliverable-b" }) });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { success: false, message: "Not found" });
  });
});
