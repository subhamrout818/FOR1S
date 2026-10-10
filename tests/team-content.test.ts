import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MEMBERS } from "../lib/members";
import { PRICING_TIERS } from "../lib/data";

describe("confirmed public team and pricing content", () => {
  it("lists only the three confirmed team members and their confirmed roles", () => {
    assert.deepEqual(
      MEMBERS.map(({ name, role }) => ({ name, role })),
      [
        { name: "Subham Rout", role: "CEO" },
        { name: "Tanuj Joshi", role: "Video Editor" },
        { name: "Sidhi Samantaray", role: "Video Editor" },
      ]
    );
  });

  it("keeps public price display in dollars", () => {
    assert.ok(PRICING_TIERS.length > 0);
    for (const plan of PRICING_TIERS) {
      assert.match(plan.price, /^\$/);
      assert.match(plan.priceRange, /^\$/);
    }
  });
});
