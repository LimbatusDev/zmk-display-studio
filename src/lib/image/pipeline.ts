import type { ProcessingSettings } from "../../types/editor.ts";
import { invertBitmap, type MonochromeBitmap } from "./bitmap.ts";
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
