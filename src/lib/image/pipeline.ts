import type { ProcessingSettings } from "../../types/editor.ts";
import type { DisplayPreset } from "../displays/types.ts";
import {
  invertBitmap,
  rotateMonochromeBitmap,
  type MonochromeBitmap,
} from "./bitmap.ts";
import { applyAtkinson, applyFloydSteinberg } from "./dithering.ts";
import { applyBrightness, applyContrast, toGrayscale } from "./grayscale.ts";
import { applyThreshold } from "./threshold.ts";

export function processImage(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  settings: ProcessingSettings,
): MonochromeBitmap {
  if (rgba.length !== width * height * 4)
    throw new Error("Image data does not match its dimensions.");
  const adjusted = applyContrast(
    applyBrightness(rgba, settings.brightness),
    settings.contrast,
  );
  const grayscale = toGrayscale(adjusted);
  const pixels =
    settings.processingMode === "threshold"
      ? applyThreshold(grayscale, settings.threshold)
      : settings.processingMode === "atkinson"
        ? applyAtkinson(grayscale, width, height)
        : applyFloydSteinberg(grayscale, width, height);
  const bitmap = { width, height, pixels };
  return settings.inverted ? invertBitmap(bitmap) : bitmap;
}

/** Convert processed physical artwork once, before framebuffer preview or export. */
export function toFramebufferArtwork(
  physicalBitmap: MonochromeBitmap,
  display: DisplayPreset,
): MonochromeBitmap {
  const { physical, framebuffer } = display.artwork;
  if (
    physicalBitmap.width !== physical.width ||
    physicalBitmap.height !== physical.height
  )
    throw new Error(
      `Physical artwork must be exactly ${physical.width}×${physical.height} pixels before framebuffer conversion.`,
    );
  const framebufferBitmap = rotateMonochromeBitmap(
    physicalBitmap,
    display.physical.rotation,
  );
  if (
    framebufferBitmap.width !== framebuffer.width ||
    framebufferBitmap.height !== framebuffer.height
  )
    throw new Error(
      `Rotated artwork does not match the ${framebuffer.width}×${framebuffer.height} framebuffer dimensions.`,
    );
  return framebufferBitmap;
}

/** Dithering runs in physical coordinates; rotation only permutes the final pixels. */
export function processArtwork(
  rgba: Uint8ClampedArray,
  display: DisplayPreset,
  settings: ProcessingSettings,
): { physicalBitmap: MonochromeBitmap; framebufferBitmap: MonochromeBitmap } {
  const { width, height } = display.artwork.physical;
  const physicalBitmap = processImage(rgba, width, height, settings);
  const framebufferBitmap = toFramebufferArtwork(physicalBitmap, display);
  return { physicalBitmap, framebufferBitmap };
}
