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
    showExportSuccess: true,
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
      { ...saved, previewMode, showExportSuccess: true },
    );
  }
});

test("export success preference defaults on for older settings and preserves an explicit opt-out", () => {
  const previous = { ...saved, previewMode: "pixels" };
  assert.deepEqual(parsePreferences(JSON.stringify(previous)), {
    ...previous,
    showExportSuccess: true,
  });
  for (const showExportSuccess of [false, true]) {
    assert.deepEqual(
      parsePreferences(
        JSON.stringify({
          ...previous,
          showExportSuccess,
          lastDownload: { symbol: "private_art" },
        }),
      ),
      {
        ...previous,
        showExportSuccess,
      },
    );
  }
  assert.equal(
    parsePreferences(
      JSON.stringify({ ...previous, showExportSuccess: "false" }),
    ),
    null,
  );
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
