import type { Area } from "react-easy-crop";

/**
 * Render the image, apply rotation, then crop the visible region and scale
 * it into a square JPEG data URL ready for the profile picture.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  outputSize = 256
): Promise<string> {
  const image = await loadImage(imageSrc);
  const { width: bBoxWidth, height: bBoxHeight } = rotatedSize(
    image.width,
    image.height,
    rotation
  );

  // 1. Draw the (rotated) image onto an oversized canvas.
  const canvas = document.createElement("canvas");
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  const rotRad = (rotation * Math.PI) / 180;
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // 2. Crop the visible region and scale it to the square output.
  const output = document.createElement("canvas");
  output.width = outputSize;
  output.height = outputSize;
  const octx = output.getContext("2d");
  if (!octx) throw new Error("Canvas unavailable");

  octx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return output.toDataURL("image/jpeg", 0.85);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image"));
    img.src = src;
  });
}

/** Bounding-box size of `w x h` after rotating by `rotation` degrees. */
function rotatedSize(w: number, h: number, rotation: number) {
  const rad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rad)) * w + Math.abs(Math.sin(rad)) * h,
    height: Math.abs(Math.sin(rad)) * w + Math.abs(Math.cos(rad)) * h,
  };
}
