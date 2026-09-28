import assert from "node:assert/strict";
import { test } from "node:test";
import { niceView } from "../src/lib/displays/nice-view.ts";
import {
  createDownloadReceipt,
  getExportInstructions,
} from "../src/lib/export-instructions.ts";
import { generateNiceViewArtwork } from "../src/lib/generators/nice-view-artwork.ts";

test("a direct C download gets C-image instructions regardless of the selected ZIP package", () => {
  for (const selectedTarget of niceView.exportTargets) {
    const receipt = createDownloadReceipt(
      "c",
      selectedTarget,
      "my_keyboard_art",
    );
    assert.equal(receipt.target, "c-image");
    assert.equal(receipt.filename, "art.c");
    const instructions = getExportInstructions(receipt);
    assert.equal(instructions.guideHref, "/export-guide#c-image");
    assert.equal(instructions.experimental, false);
    assert.ok(
      instructions.steps.some((step) =>
        step.code?.includes("LV_IMAGE_DECLARE(my_keyboard_art);"),
      ),
    );
    assert.ok(
      instructions.steps.some((step) =>
        step.code?.includes(
          "lv_image_set_src(image_object, &my_keyboard_art);",
        ),
      ),
    );
    assert.ok(
      instructions.steps.every(
        (step) => !step.description.includes("Extract the ZIP"),
      ),
    );
  }
});

test("ZIP instructions describe the actual generated files and agree with package READMEs", () => {
  const bitmap = { width: 140, height: 68, pixels: new Uint8Array(140 * 68) };
  const settings = {
    processingMode: "threshold",
    threshold: 128,
    brightness: 0,
    contrast: 0,
    inverted: false,
  } as const;
  for (const target of niceView.exportTargets) {
    const receipt = createDownloadReceipt("zip", target, "tiny_landscape");
    const instructions = getExportInstructions(receipt);
    const files = generateNiceViewArtwork(
      bitmap,
      receipt.symbol,
      target,
      settings,
    );
    assert.equal(receipt.target, target);
    assert.equal(receipt.filename, "zmk-display-studio-export.zip");
    assert.equal(instructions.experimental, target === "custom-shield");
    const text = instructions.steps
      .map((step) => `${step.description}\n${step.code ?? ""}`)
      .join("\n");
    assert.match(text, /README\.md/);
    assert.match(text, /pristine/);
    if (target === "c-image") {
      assert.match(text, /Extract the ZIP/);
      assert.ok(files["art.c"]);
      for (const snippet of [
        "zephyr_library_sources(art.c)",
        "LV_IMAGE_DECLARE(tiny_landscape);",
        "lv_image_set_src(image_object, &tiny_landscape);",
      ]) {
        assert.ok(text.includes(snippet));
        assert.ok(files["README.md"].includes(snippet));
      }
    } else if (target === "nice-view-artwork") {
      assert.equal(
        instructions.guideHref,
        "/export-guide#nice-view-customization",
      );
      for (const path of Object.keys(files).filter((path) =>
        path.endsWith(".c"),
      )) {
        assert.ok(text.includes(path));
        assert.ok(files["README.md"].includes(path));
      }
      assert.match(text, /ZMK fork/);
    } else {
      assert.equal(instructions.guideHref, "/export-guide#custom-shield");
      assert.ok(
        Object.keys(files).some((path) =>
          path.startsWith("boards/shields/nice_view_custom/"),
        ),
      );
      for (const setting of [
        "board_root: .",
        "CONFIG_NICE_VIEW_WIDGET_STATUS=y",
        "nice_view_spi",
      ]) {
        assert.ok(text.includes(setting));
        assert.ok(files["README.md"].includes(setting));
      }
      assert.match(
        text,
        /Do not select nice_view and nice_view_custom together/,
      );
    }
  }
});
