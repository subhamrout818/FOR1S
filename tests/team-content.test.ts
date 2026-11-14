import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MEMBERS } from "../lib/members";
import { PRICING_TIERS } from "../lib/data";

describe("public team and pricing content", () => {
  it("lists the current founders and their responsibilities", () => {
    assert.deepEqual(
      MEMBERS.map(({ name, role }) => ({ name, role })),
      [
        { name: "Subham Rout", role: "CEO" },
        { name: "Tanuj Joshi", role: "Co-Founder · Video Editor" },
        { name: "Haze", role: "Co-Founder" },
      ]
    );
  });

  it("uses the supplied Haze portrait without making a portrait mandatory for every member", () => {
    const haze = MEMBERS.find(({ slug }) => slug === "haze");
    assert.ok(haze);
    assert.equal(haze.image, "/team/haze.svg");
  });

  it("publishes the four India website packages and the ₹69,000 Signature 3D base", () => {
    assert.deepEqual(PRICING_TIERS.map(({ id }) => id), ["launch", "business", "signature-3d", "custom"]);
    for (const plan of PRICING_TIERS) {
      assert.match(plan.price, /^₹/);
      assert.match(plan.priceRange, /^₹/);
    }
    const signature = PRICING_TIERS.find(({ id }) => id === "signature-3d");
    assert.ok(signature);
    assert.equal(signature.price, "₹69,000");
    assert.ok(signature.specs.some((spec) => spec.includes("no 3D add-on fee")));
  });
});
