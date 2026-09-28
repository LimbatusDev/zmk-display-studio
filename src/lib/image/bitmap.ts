import type { Rotation } from "../displays/types.ts";

export interface MonochromeBitmap {
  width: number;
  height: number;
  /** Row-major pixels: 0 = black, 1 = white. */
  pixels: Uint8Array;
}

export function validateBitmap(bitmap: MonochromeBitmap) {
  const { width, height, pixels } = bitmap;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width > 65535 ||
    height > 65535 ||
    pixels.length !== width * height
  )
    throw new Error("Invalid bitmap dimensions.");
  if (pixels.some((pixel) => pixel !== 0 && pixel !== 1))
    throw new Error("A monochrome bitmap must contain only 0 and 1.");
}

export function invertBitmap(bitmap: MonochromeBitmap): MonochromeBitmap {
  const pixels = new Uint8Array(bitmap.pixels.length);
  for (let i = 0; i < pixels.length; i++) pixels[i] = 1 - bitmap.pixels[i];
  return { ...bitmap, pixels };
}

/** Rotate clockwise about a top-left origin; even 0° returns a fresh pixel buffer. */
export function rotateMonochromeBitmap(
  bitmap: MonochromeBitmap,
  rotation: Rotation,
): MonochromeBitmap {
  validateBitmap(bitmap);
  if (rotation !== 0 && rotation !== 90 && rotation !== 180 && rotation !== 270)
    throw new Error(
      "Invalid bitmap rotation: expected 0, 90, 180, or 270 degrees.",
    );
  if (rotation === 0)
    return { ...bitmap, pixels: new Uint8Array(bitmap.pixels) };

  const swapAxes = rotation === 90 || rotation === 270;
  const width = swapAxes ? bitmap.height : bitmap.width;
  const height = swapAxes ? bitmap.width : bitmap.height;
  const pixels = new Uint8Array(bitmap.pixels.length);
  for (let y = 0; y < bitmap.height; y++) {
    for (let x = 0; x < bitmap.width; x++) {
      const targetX =
        rotation === 90
          ? bitmap.height - 1 - y
          : rotation === 180
            ? bitmap.width - 1 - x
            : y;
      const targetY =
        rotation === 90
          ? x
          : rotation === 180
            ? bitmap.height - 1 - y
            : bitmap.width - 1 - x;
      pixels[targetY * width + targetX] = bitmap.pixels[y * bitmap.width + x];
    }
  }
  return { width, height, pixels };
}

/** Rows are byte-aligned; trailing bits are zero, never carried into the next row. */
export function packMonochrome(bitmap: MonochromeBitmap) {
  validateBitmap(bitmap);
  const stride = Math.ceil(bitmap.width / 8);
  const packed = new Uint8Array(stride * bitmap.height);
  for (let y = 0; y < bitmap.height; y++) {
    for (let x = 0; x < bitmap.width; x++) {
      packed[y * stride + (x >> 3)] |=
        bitmap.pixels[y * bitmap.width + x] << (7 - (x & 7));
    }
  }
  return packed;
}

export function bitmapToRgba(bitmap: MonochromeBitmap) {
  const rgba = new Uint8ClampedArray(bitmap.pixels.length * 4);
  for (let i = 0; i < bitmap.pixels.length; i++) {
    const value = bitmap.pixels[i] * 255;
    rgba[i * 4] = value;
    rgba[i * 4 + 1] = value;
    rgba[i * 4 + 2] = value;
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}
