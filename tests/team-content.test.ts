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
        { name: "Sidhi Samantaray", role: "Video Editor" },
      ]
    );
  });

  it("keeps public price display in dollars until pricing strategy is deliberately changed", () => {
    assert.ok(PRICING_TIERS.length > 0);
    for (const plan of PRICING_TIERS) {
      assert.match(plan.price, /^\$/);
      assert.match(plan.priceRange, /^\$/);
    }
  });
});
