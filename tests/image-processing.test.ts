import assert from "node:assert/strict";
import { test } from "node:test";
import { applyThreshold } from "../src/lib/image/threshold.ts";
import {
  applyAtkinson,
  applyFloydSteinberg,
} from "../src/lib/image/dithering.ts";
import {
  applyBrightness,
  applyContrast,
  toGrayscale,
} from "../src/lib/image/grayscale.ts";
import {
  bitmapToRgba,
  invertBitmap,
  packMonochrome,
  validateBitmap,
} from "../src/lib/image/bitmap.ts";
import { processImage } from "../src/lib/image/pipeline.ts";
import { fitTransform, zoomBounds } from "../src/lib/image/resize.ts";
import {
  MAX_FILE_SIZE,
  validateImageFile,
} from "../src/lib/image/image-loader.ts";

test("threshold includes its boundary and supports both extremes", () => {
  const input = new Uint8ClampedArray([0, 1, 127, 128, 254, 255]);
  assert.deepEqual([...applyThreshold(input, 128)], [0, 0, 0, 1, 1, 1]);
  assert.deepEqual([...applyThreshold(input, 0)], [1, 1, 1, 1, 1, 1]);
  assert.deepEqual([...applyThreshold(input, 255)], [0, 0, 0, 0, 0, 1]);
  assert.deepEqual([...input], [0, 1, 127, 128, 254, 255]);
});

test("brightness and contrast preserve alpha and never mutate the input", () => {
  const input = new Uint8ClampedArray([0, 100, 255, 128]);
  assert.deepEqual([...applyBrightness(input, 0)], [...input]);
  assert.deepEqual([...applyBrightness(input, 100)], [255, 255, 255, 128]);
  assert.deepEqual([...applyBrightness(input, -100)], [0, 0, 0, 128]);
  assert.deepEqual([...applyContrast(input, 0)], [...input]);
  assert.deepEqual([...applyContrast(input, -100)], [128, 128, 128, 128]);
  assert.deepEqual([...applyContrast(input, 100)], [0, 0, 255, 128]);
  assert.deepEqual([...input], [0, 100, 255, 128]);
});

test("grayscale uses luminance weights rather than a channel average", () => {
  assert.deepEqual(
    [
      ...toGrayscale(
        new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255]),
      ),
    ],
    [54, 182, 18],
  );
  assert.throws(() => toGrayscale(new Uint8ClampedArray(3)), /RGBA/);
});

test("error diffusion has the expected boundary behavior for narrow images", () => {
  const input = new Uint8ClampedArray([100, 100, 100, 100]);
  assert.deepEqual([...applyFloydSteinberg(input, 1, 4)], [0, 1, 0, 0]);
  assert.deepEqual([...applyAtkinson(input, 1, 4)], [0, 0, 0, 1]);
  assert.deepEqual([...applyFloydSteinberg(input, 4, 1)], [0, 1, 0, 0]);
  assert.deepEqual([...applyAtkinson(input, 4, 1)], [0, 0, 0, 1]);
  assert.deepEqual([...input], [100, 100, 100, 100]);
  for (const algorithm of [applyFloydSteinberg, applyAtkinson]) {
    assert.deepEqual(
      [...algorithm(new Uint8ClampedArray([0, 255, 0, 255]), 2, 2)],
      [0, 1, 0, 1],
    );
    assert.throws(() => algorithm(input, 3, 2), /dimensions/);
  }
});

test("inversion and RGBA conversion preserve bitmap shape and input", () => {
  const bitmap = { width: 2, height: 2, pixels: new Uint8Array([0, 1, 1, 0]) };
  const inverted = invertBitmap(bitmap);
  assert.deepEqual([...inverted.pixels], [1, 0, 0, 1]);
  assert.deepEqual(invertBitmap(inverted), bitmap);
  assert.deepEqual(
    [...bitmapToRgba(bitmap).slice(0, 8)],
    [0, 0, 0, 255, 255, 255, 255, 255],
  );
  assert.notEqual(inverted.pixels, bitmap.pixels);
});

test("packing uses MSB-first order and pads each row, not the entire image", () => {
  const bitmap = {
    width: 10,
    height: 2,
    pixels: new Uint8Array([
      1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0,
    ]),
  };
  assert.deepEqual([...packMonochrome(bitmap)], [0xaa, 0xc0, 0x55, 0x80]);
  assert.deepEqual(
    [
      ...packMonochrome({
        width: 8,
        height: 1,
        pixels: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 1]),
      }),
    ],
    [0x81],
  );
  assert.deepEqual(
    [
      ...packMonochrome({
        width: 1,
        height: 2,
        pixels: new Uint8Array([1, 1]),
      }),
    ],
    [0x80, 0x80],
  );
  assert.throws(
    () =>
      validateBitmap({ width: 2, height: 1, pixels: new Uint8Array([2, 0]) }),
    /only 0 and 1/,
  );
  assert.throws(
    () => validateBitmap({ width: 0, height: 1, pixels: new Uint8Array() }),
    /dimensions/,
  );
  assert.throws(
    () => validateBitmap({ width: 2, height: 1, pixels: new Uint8Array(1) }),
    /dimensions/,
  );
});

test("pipeline is deterministic, non-cumulative, and applies inversion last", () => {
  const input = new Uint8ClampedArray([
    20, 20, 20, 255, 100, 100, 100, 255, 180, 180, 180, 255, 250, 250, 250, 255,
  ]);
  const original = input.slice();
  for (const processingMode of [
    "threshold",
    "floyd-steinberg",
    "atkinson",
  ] as const) {
    const settings = {
      processingMode,
      brightness: 0,
      contrast: 0,
      threshold: 128,
      inverted: false,
    };
    const bitmap = processImage(input, 4, 1, settings);
    assert.deepEqual(processImage(input, 4, 1, settings), bitmap);
    assert.deepEqual(
      processImage(input, 4, 1, { ...settings, inverted: true }),
      invertBitmap(bitmap),
    );
    assert.deepEqual(input, original);
    if (processingMode === "threshold")
      assert.deepEqual([...bitmap.pixels], [0, 0, 1, 1]);
  }
  assert.throws(
    () =>
      processImage(input, 1, 1, {
        processingMode: "threshold",
        brightness: 0,
        contrast: 0,
        threshold: 128,
        inverted: false,
      }),
    /dimensions/,
  );
});

test("fit and fill are centered and output-pixel based", () => {
  const source = { width: 100, height: 100 };
  const area = { width: 140, height: 68 };
  assert.deepEqual(fitTransform(source, area, "fit"), {
    scale: 0.68,
    offsetX: 0,
    offsetY: 0,
  });
  assert.deepEqual(fitTransform(source, area, "fill"), {
    scale: 1.4,
    offsetX: 0,
    offsetY: 0,
  });
  assert.ok(
    zoomBounds({ width: 16000, height: 1 }, area).min <=
      fitTransform({ width: 16000, height: 1 }, area, "fit").scale,
  );
});

test("file validation rejects unsupported, empty, and oversized inputs", () => {
  for (const type of ["image/png", "image/jpeg", "image/webp"])
    assert.doesNotThrow(() => validateImageFile({ type, size: MAX_FILE_SIZE }));
  assert.throws(
    () => validateImageFile({ type: "image/svg+xml", size: 10 }),
    /PNG/,
  );
  assert.throws(
    () => validateImageFile({ type: "image/png", size: 0 }),
    /empty/,
  );
  assert.throws(
    () => validateImageFile({ type: "image/png", size: MAX_FILE_SIZE + 1 }),
    /10 MB/,
  );
});
