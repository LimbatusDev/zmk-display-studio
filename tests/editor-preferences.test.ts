import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePreferences } from "../src/lib/editor-preferences.ts";

const saved = {
  processingMode: "atkinson",
  threshold: 120,
  brightness: 12,
  contrast: -7,
  inverted: true,
  previewMode: "device",
  showPixelGrid: true,
};

test("legacy device preferences become Physical and keep processing values", () => {
  assert.deepEqual(parsePreferences(JSON.stringify(saved)), {
    ...saved,
    previewMode: "physical",
  });
});

test("preferences support every preview mode and exclude image/transform data", () => {
  for (const previewMode of ["physical", "pixels", "framebuffer", "source"]) {
    assert.deepEqual(
      parsePreferences(
        JSON.stringify({
          ...saved,
          previewMode,
          transform: { scale: 99 },
          sourceImage: "private",
        }),
      ),
      { ...saved, previewMode },
    );
  }
});

test("invalid persisted settings are rejected", () => {
  for (const value of [
    "broken",
    "null",
    "[]",
    JSON.stringify({ ...saved, threshold: 999 }),
    JSON.stringify({ ...saved, previewMode: "invalid" }),
  ]) {
    assert.equal(parsePreferences(value), null);
  }
});
