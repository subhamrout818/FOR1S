import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

// Guards for the legal-risk items: age gate, third-party font requests,
// DMCA agent page. They read source files, like auth-security-structure.test.ts.

const root = path.resolve(import.meta.dirname, "..");
const read = (relative: string) => fs.readFileSync(path.join(root, relative), "utf8");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

describe("age gate", () => {
  it("makes the signup API require an explicit age confirmation", () => {
    const route = read("app/api/auth/signup/route.ts");
    assert.match(route, /ageConfirmed:\s*z\.literal\(true/);
    assert.match(route, /MIN_SIGNUP_AGE/);
  });

  it("sends the confirmation from the client and blocks social signup until ticked", () => {
    assert.match(read("lib/auth-context.tsx"), /ageConfirmed:\s*ageConfirmed === true/);
    const page = read("app/register/page.tsx");
    assert.match(page, /type="checkbox"/);
    assert.match(page, /<OAuthButtons mode="signup" disabled=\{!ageConfirmed\}/);
  });

  it("keeps the minimum age at 13 or higher", async () => {
    const { MIN_SIGNUP_AGE } = await import("../lib/legal");
    assert.ok(MIN_SIGNUP_AGE >= 13);
  });
});

describe("third-party fonts", () => {
  it("does not load fonts from Google in the app or the demo sites", () => {
    const files = [...walk(path.join(root, "app")), ...walk(path.join(root, "components")), ...walk(path.join(root, "public/demo"))]
      .filter((f) => /\.(css|html|js|tsx|ts)$/.test(f));
    for (const file of files) {
      const source = fs.readFileSync(file, "utf8");
      assert.doesNotMatch(source, /fonts\.gstatic\.com|fonts\.googleapis\.com|next\/font\/google/, path.relative(root, file));
    }
  });
});

describe("DMCA page", () => {
  it("exists, names an agent, and is linked from the footer and sitemap", () => {
    assert.match(read("app/dmca/page.tsx"), /Designated copyright agent/);
    assert.match(read("lib/data.ts"), /href: "\/dmca"/);
    assert.match(read("app/sitemap.ts"), /"\/dmca"/);
  });
});
