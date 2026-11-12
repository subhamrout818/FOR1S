export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
export const MAX_PDF_BYTES = 25 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
} as const;
export type AllowedImageType = keyof typeof ALLOWED_IMAGE_TYPES;

const ALLOWED_VIDEO_TYPES: Record<string, string[]> = {
  "video/mp4": [".mp4", ".m4v"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
};
const ALLOWED_DOCUMENT_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
};

export type DeliverableFileKind = "image" | "video" | "document";

export function getDeliverableFileKind(name: string, mimeType: string, size: number): DeliverableFileKind | null {
  const lower = name.toLowerCase();
  const imageExt = ALLOWED_IMAGE_TYPES[mimeType as AllowedImageType] as readonly string[] | undefined;
  if (imageExt?.some((ext) => lower.endsWith(ext)) && size > 0 && size <= MAX_IMAGE_BYTES) return "image";
  if (ALLOWED_VIDEO_TYPES[mimeType]?.some((ext) => lower.endsWith(ext)) && size > 0 && size <= MAX_VIDEO_BYTES) return "video";
  if (ALLOWED_DOCUMENT_TYPES[mimeType]?.some((ext) => lower.endsWith(ext)) && size > 0 && size <= MAX_PDF_BYTES) return "document";
  return null;
}

export function isAllowedImageMetadata(name: string, mimeType: string, size: number) {
  return getDeliverableFileKind(name, mimeType, size) === "image";
}

export function matchesImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.length >= 8 && [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((byte, i) => bytes[i] === byte);
  if (mimeType === "image/gif") return bytes.length >= 6 && /^GIF8[79]a$/.test(String.fromCharCode(...bytes.slice(0, 6)));
  if (mimeType === "image/webp") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}

export function matchesDeliverableSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType.startsWith("image/")) return matchesImageSignature(bytes, mimeType);
  if (mimeType === "application/pdf") return bytes.length >= 5 && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
  if (mimeType === "video/mp4" || mimeType === "video/quicktime") {
    return bytes.length >= 12 && String.fromCharCode(...bytes.slice(4, 8)) === "ftyp";
  }
  if (mimeType === "video/webm") return bytes.length >= 4 && [0x1a,0x45,0xdf,0xa3].every((byte, i) => bytes[i] === byte);
  return false;
}
