import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAllowedImageMetadata, matchesImageSignature, MAX_IMAGE_BYTES } from "../lib/r2-upload-validation";

describe("R2 image upload validation", () => {
  it("accepts supported image types within the 10 MiB limit", () => {
    assert.equal(isAllowedImageMetadata("photo.jpg", "image/jpeg", 1), true);
    assert.equal(isAllowedImageMetadata("photo.png", "image/png", MAX_IMAGE_BYTES), true);
    assert.equal(isAllowedImageMetadata("photo.webp", "image/webp", 100), true);
    assert.equal(isAllowedImageMetadata("photo.gif", "image/gif", 100), true);
  });
  it("rejects SVG, mismatched extensions, empty files, and oversized files", () => {
    assert.equal(isAllowedImageMetadata("image.svg", "image/svg+xml", 100), false);
    assert.equal(isAllowedImageMetadata("image.png", "image/jpeg", 100), false);
    assert.equal(isAllowedImageMetadata("image.jpg", "image/jpeg", 0), false);
    assert.equal(isAllowedImageMetadata("image.jpg", "image/jpeg", MAX_IMAGE_BYTES + 1), false);
  });
  it("checks actual file signatures", () => {
    assert.equal(matchesImageSignature(Uint8Array.from([0xff,0xd8,0xff,0x00]), "image/jpeg"), true);
    assert.equal(matchesImageSignature(Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]), "image/png"), true);
    assert.equal(matchesImageSignature(Uint8Array.from([0x47,0x49,0x46,0x38,0x39,0x61]), "image/gif"), true);
    assert.equal(matchesImageSignature(Uint8Array.from([0x52,0x49,0x46,0x46,0,0,0,0,0x57,0x45,0x42,0x50]), "image/webp"), true);
    assert.equal(matchesImageSignature(Uint8Array.from([0x3c,0x73,0x76,0x67]), "image/png"), false);
  });
}
