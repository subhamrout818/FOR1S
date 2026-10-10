export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
} as const;
export type AllowedImageType = keyof typeof ALLOWED_IMAGE_TYPES;
export function isAllowedImageMetadata(name: string, mimeType: string, size: number) {
  const extensions = ALLOWED_IMAGE_TYPES[mimeType as AllowedImageType] as readonly string[] | undefined;
  return size > 0 && size <= MAX_IMAGE_BYTES && !!extensions?.some((extension) => name.toLowerCase().endsWith(extension));
}
export function matchesImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.length >= 8 && [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((byte, i) => bytes[i] === byte);
  if (mimeType === "image/gif") return bytes.length >= 6 && /^GIF8[79]a$/.test(String.fromCharCode(...bytes.slice(0, 6)));
  if (mimeType === "image/webp") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}