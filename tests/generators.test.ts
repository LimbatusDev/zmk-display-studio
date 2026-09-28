import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import JSZip from "jszip";
import {
  requireCIdentifier,
  sanitizeCIdentifier,
} from "../src/lib/generators/c-identifier.ts";
import {
  encodeLvglImage,
  generateLvglImage,
} from "../src/lib/generators/lvgl-image.ts";
import { generateNiceViewArtwork } from "../src/lib/generators/nice-view-artwork.ts";
import { generateZip } from "../src/lib/generators/zip-generator.ts";
import { getArtworkArea, getDisplay } from "../src/lib/displays/registry.ts";
import type { ExportTarget } from "../src/lib/displays/types.ts";

const bitmap = {
  width: 140,
  height: 68,
  pixels: new Uint8Array(140 * 68).fill(1),
};
const settings = {
  processingMode: "floyd-steinberg",
  threshold: 128,
  brightness: 0,
  contrast: 0,
  inverted: false,
} as const;

test("C symbols are valid, deterministic, and safe for the integration template", () => {
  for (const [input, expected] of [
    ["My Logo", "my_logo"],
    ["123 logo", "_123_logo"],
    ["ZMK-Dragon", "zmk_dragon"],
    ["return", "custom_return"],
    ["art", "custom_art"],
    ["Café", "cafe"],
    ["!!!", ""],
  ]) {
    assert.equal(sanitizeCIdentifier(input), expected);
    if (expected) assert.equal(sanitizeCIdentifier(expected), expected);
  }
  assert.throws(() => requireCIdentifier("  "), /artwork name/);
  assert.match(
    requireCIdentifier('name */; #include "bad"'),
    /^[a-z_][a-z0-9_]*$/,
  );
});

test("LVGL data contains an opaque palette and all 68 padded rows", () => {
  const { data, stride } = encodeLvglImage(bitmap);
  assert.equal(stride, 18);
  assert.equal(data.length, 1232);
  assert.deepEqual([...data.slice(0, 8)], [0, 0, 0, 255, 255, 255, 255, 255]);
  for (let y = 0; y < 68; y++) {
    assert.deepEqual(
      [...data.slice(8 + y * 18, 8 + y * 18 + 17)],
      Array(17).fill(255),
    );
    assert.equal(data[8 + y * 18 + 17], 0xf0);
  }
});

test("descriptor declares dimensions, magic, stride and real data length", () => {
  const small = { width: 9, height: 2, pixels: new Uint8Array(18).fill(1) };
  const code = generateLvglImage(small, "My Logo");
  assert.match(code, /const lv_image_dsc_t my_logo/);
  assert.match(code, /\.header\.magic = LV_IMAGE_HEADER_MAGIC/);
  assert.match(code, /\.header\.cf = LV_COLOR_FORMAT_I1/);
  assert.match(code, /\.header\.w = 9,/);
  assert.match(code, /\.header\.h = 2,/);
  assert.match(code, /\.header\.stride = 2,/);
  assert.match(code, /\.data_size = 12,/);
  assert.equal((code.match(/0x[0-9a-f]{2}/g) ?? []).length, 12);
  assert.equal(code, generateLvglImage(small, "My Logo"));
});

test("nice!view exports reject an accidental display-sized bitmap", () => {
  assert.equal(getDisplay("nice-view").framebuffer.width, 160);
  assert.equal(
    getArtworkArea("nice-view", "peripheral").framebuffer.width,
    140,
  );
  assert.equal(getArtworkArea("nice-view", "peripheral").physical.width, 68);
  assert.throws(() => getDisplay("unknown"), /Unsupported display/);
  assert.throws(
    () => getArtworkArea("nice-view", "unknown"),
    /Unsupported artwork/,
  );
  assert.throws(
    () =>
      generateNiceViewArtwork(
        { width: 160, height: 68, pixels: new Uint8Array(160 * 68) },
        "logo",
        "c-image",
        settings,
      ),
    /140×68/,
  );
});

test("customization includes both replacement files and no random artwork path", () => {
  const files = generateNiceViewArtwork(
    bitmap,
    "My Logo",
    "nice-view-artwork",
    settings,
  );
  const widget =
    files["app/boards/shields/nice_view/widgets/peripheral_status.c"];
  assert.match(widget, /LV_IMAGE_DECLARE\(my_logo\)/);
  assert.match(widget, /lv_image_set_src\(art, &my_logo\)/);
  assert.match(widget, /lv_obj_set_size\(widget->obj, 160, 68\)/);
  assert.match(widget, /lv_obj_align\(art, LV_ALIGN_TOP_LEFT, 0, 0\)/);
  assert.doesNotMatch(widget, /balloon|mountain|sys_rand|lv_img_set_src/);
  assert.ok(files["app/boards/shields/nice_view/widgets/art.c"]);
  assert.match(files["README.md"], /ZMK checkout/);
  assert.match(files["README.md"], /Processing: Floyd–Steinberg/);
  assert.match(files["README.md"], /Inverted: No/);
  assert.match(files["README.md"], /Generator: nice-view-zmk-main v2/);
  assert.match(files["README.md"], /rotated 90° clockwise once/);
  assert.match(files["README.md"], /Row stride: 18 bytes/);
  assert.match(files["README.md"], /Data size: 1232 bytes/);
});

test("shield package has discovery, hardware, build, and peripheral integration", () => {
  const files = generateNiceViewArtwork(
    bitmap,
    "logo",
    "custom-shield",
    settings,
  );
  const base = "boards/shields/nice_view_custom/";
  for (const file of [
    "Kconfig.shield",
    "Kconfig.defconfig",
    "nice_view_custom.overlay",
    "nice_view_custom.conf",
    "CMakeLists.txt",
    "custom-status-screen.c",
    "widgets/art.c",
    "widgets/peripheral_status.c",
  ])
    assert.ok(files[base + file], file);
  assert.match(files["zephyr/module.yml"], /board_root: \./);
  assert.match(
    files[base + "CMakeLists.txt"],
    /if\(NOT CONFIG_ZMK_SPLIT OR CONFIG_ZMK_SPLIT_ROLE_CENTRAL\)/,
  );
  assert.match(
    files[base + "CMakeLists.txt"],
    /zephyr_library_sources\(widgets\/art.c widgets\/peripheral_status.c\)/,
  );
  assert.match(
    files[base + "custom-status-screen.c"],
    /#include "peripheral_status.h"/,
  );
  assert.match(files["README.md"], /Experimental/);
  assert.match(files[base + "nice_view_custom.overlay"], /width = <160>;/);
  assert.match(files[base + "nice_view_custom.overlay"], /height = <68>;/);
});

test("all ZIP packages contain installation instructions and reproducible content", async () => {
  for (const target of [
    "c-image",
    "nice-view-artwork",
    "custom-shield",
  ] as ExportTarget[]) {
    const files = generateNiceViewArtwork(bitmap, "logo", target, settings);
    const first = await generateZip(files);
    const second = await generateZip(files);
    assert.deepEqual(first, second);
    const zip = await JSZip.loadAsync(first);
    assert.equal(Object.keys(zip.files).length, Object.keys(files).length);
    for (const [path, content] of Object.entries(files)) {
      assert.equal(
        await zip.file(`zmk-display-studio-export/${path}`)?.async("string"),
        content,
      );
    }
  }
});

test(
  "generated C compiles against real LVGL 9 headers",
  {
    skip:
      !process.env.LVGL_DIR &&
      "Set LVGL_DIR to the pinned LVGL checkout to run the native compiler check.",
  },
  () => {
    for (const name of ["custom_art", "123 logo", "art", "ZMK-Dragon"]) {
      const symbol = requireCIdentifier(name);
      const code =
        generateLvglImage(bitmap, name) +
        `\n_Static_assert(sizeof(${symbol}_map) == 1232, "Invalid image length");\n`;
      const result = spawnSync(
        "clang",
        [
          "-x",
          "c",
          "-std=c11",
          "-Werror",
          "-fsyntax-only",
          "-DLV_CONF_SKIP",
          "-I",
          process.env.LVGL_DIR!,
          "-",
        ],
        { input: code, encoding: "utf8" },
      );
      assert.equal(result.status, 0, result.stderr || result.error?.message);
    }
  },
);
