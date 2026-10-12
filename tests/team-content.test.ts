import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MEMBERS, } from "../lib/members";
import { PRICING_TIERS } from "../lib/data";

describe("public team and pricing content", () => {
  it("lists the current founders and their responsibilities", () => {
    assert.deepEqual(
      MEMBERS.map(({ name, role }) => ({ name, role })),
      [
        { name: "Subham Rout", role: "Founder · Full-Stack Development" },
        { name: "Tanuj Joshi", role: "Co-Founder · IT" },
        { name: "Sidhi Samantaray", role: "Co-Founder · Marketing" },
      ]
    );
  });

  it("uses the approved indicative INR pricing ranges", () => {
    assert.deepEqual(
      PRICING_TIERS.map(({ id, priceRange }) => ({ id, priceRange })),
      [
        { id: "personal", priceRange: "₹12,000–₹18,000" },
        { id: "business", priceRange: "₹18,000–₹25,000" },
        { id: "custom", priceRange: "₹25,000+" },
      ]
    );
  });
});
