export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const IMAGE_TYPES = {
  "image/jpeg": { extension: "jpg", signatures: [[0xff, 0xd8, 0xff]] },
  "image/png": { extension: "png", signatures: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]] },
  "image/webp": { extension: "webp", signatures: [[0x52, 0x49, 0x46, 0x46]] },
  "image/gif": { extension: "gif", signatures: [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]] },
} as const;
export function allowedImageType(type: string): type is keyof typeof IMAGE_TYPES {
  return Object.hasOwn(IMAGE_TYPES, type);
}
export function hasValidImageSignature(type: keyof typeof IMAGE_TYPES, bytes: Uint8Array): boolean {
  if (type === "image/webp") {
    return bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  }
  return IMAGE_TYPES[type].signatures.some((signature) => signature.every((value, index) => bytes[index] === value));
}
export function safeImageName(name: string, extension: string): string {
  const base = name.split(/[\\/]/).pop()?.replace(/\.[^.]*$/, "") ?? "image";
  const safe = base.normalize("NFKC").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return `${safe || "image"}.${extension}`;
}
