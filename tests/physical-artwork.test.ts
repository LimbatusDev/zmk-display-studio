import assert from "node:assert/strict";
import { test } from "node:test";
import * as bitmaps from "../src/lib/image/bitmap.ts";
import * as pipeline from "../src/lib/image/pipeline.ts";
import { niceView } from "../src/lib/displays/nice-view.ts";
import type { DisplayPreset, Rotation } from "../src/lib/displays/types.ts";
import {
  fitTransform,
  drawTransformedSource,
} from "../src/lib/image/resize.ts";
import {
  encodeLvglImage,
  generateLvglImage,
} from "../src/lib/generators/lvgl-image.ts";
import { generateNiceViewArtwork } from "../src/lib/generators/nice-view-artwork.ts";

const settings = {
  processingMode: "floyd-steinberg",
  threshold: 128,
  brightness: 0,
  contrast: 0,
  inverted: false,
} as const;

test("nice!view separates portrait editing geometry from native framebuffer geometry", () => {
  assert.deepEqual(niceView.physical, { width: 68, height: 160, rotation: 90 });
  assert.deepEqual(niceView.framebuffer, { width: 160, height: 68 });
  assert.deepEqual(niceView.artwork.physical, {
    x: 0,
    y: 20,
    width: 68,
    height: 140,
  });
  assert.deepEqual(niceView.artwork.framebuffer, {
    x: 0,
    y: 0,
    width: 140,
    height: 68,
  });
  assert.deepEqual(niceView.statusArea.physical, {
    x: 0,
    y: 0,
    width: 68,
    height: 20,
  });
  assert.deepEqual(niceView.statusArea.framebuffer, {
    x: 140,
    y: 0,
    width: 20,
    height: 68,
  });
});

test("quarter-turns permute an asymmetric non-square bitmap without mutating it", () => {
  const source = {
    width: 2,
    height: 3,
    pixels: new Uint8Array([1, 0, 1, 1, 0, 0]),
  };
  const cases: [Rotation, number, number, number[], number[]][] = [
    [0, 2, 3, [1, 0, 1, 1, 0, 0], [0x80, 0xc0, 0]],
    [90, 3, 2, [0, 1, 1, 0, 1, 0], [0x60, 0x40]],
    [180, 2, 3, [0, 0, 1, 1, 0, 1], [0, 0xc0, 0x40]],
    [270, 3, 2, [0, 1, 0, 1, 1, 0], [0x40, 0xc0]],
  ];
  for (const [angle, width, height, pixels, packed] of cases) {
    const actual = bitmaps.rotateMonochromeBitmap(source, angle);
    assert.equal(actual.width, width);
    assert.equal(actual.height, height);
    assert.deepEqual([...actual.pixels], pixels);
    assert.deepEqual([...bitmaps.packMonochrome(actual)], packed);
    assert.notEqual(actual.pixels, source.pixels);
  }
  assert.deepEqual([...source.pixels], [1, 0, 1, 1, 0, 0]);
});

test("rotation validates pixel data, dimensions, and angles", () => {
  assert.throws(
    () =>
      bitmaps.rotateMonochromeBitmap(
        { width: 2, height: 3, pixels: new Uint8Array(5) },
        90,
      ),
    /dimensions/,
  );
  assert.throws(
    () =>
      bitmaps.rotateMonochromeBitmap(
        { width: 1, height: 1, pixels: new Uint8Array([2]) },
        90,
      ),
    /0 and 1/,
  );
  assert.throws(
    () =>
      bitmaps.rotateMonochromeBitmap(
        { width: 1, height: 1, pixels: new Uint8Array(1) },
        45 as Rotation,
      ),
    /rotation/i,
  );
});

test("rotation round trips preserve every pixel including single-row and single-column artwork", () => {
  for (const [width, height] of [
    [68, 140],
    [1, 1],
    [1, 7],
    [9, 1],
  ]) {
    const bitmap = {
      width,
      height,
      pixels: Uint8Array.from({ length: width * height }, (_, i) =>
        Number((i * 17 + Math.floor(i / width) * 3) % 23 < 11),
      ),
    };
    const rotated = bitmaps.rotateMonochromeBitmap(bitmap, 90);
    assert.equal(rotated.width, height);
    assert.equal(rotated.height, width);
    assert.equal(rotated.pixels.length, bitmap.pixels.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        assert.equal(
          rotated.pixels[x * height + height - 1 - y],
          bitmap.pixels[y * width + x],
        );
      }
    }
    assert.deepEqual(bitmaps.rotateMonochromeBitmap(rotated, 270), bitmap);
    assert.deepEqual(
      bitmaps.rotateMonochromeBitmap(
        bitmaps.rotateMonochromeBitmap(bitmap, 180),
        180,
      ),
      bitmap,
    );
    assert.deepEqual(
      bitmaps.rotateMonochromeBitmap(rotated, 90),
      bitmaps.rotateMonochromeBitmap(bitmap, 180),
    );
    assert.deepEqual(
      bitmaps.rotateMonochromeBitmap(bitmaps.invertBitmap(bitmap), 90),
      bitmaps.invertBitmap(rotated),
    );
  }
});

test("fit, fill, and source drawing compose in the portrait artwork viewport", () => {
  const target = niceView.artwork.physical;
  const source = { width: 100, height: 200 } as HTMLImageElement;
  assert.equal(fitTransform(source, target, "fit").scale, 0.68);
  const fill = fitTransform(source, target, "fill");
  assert.equal(fill.scale, 0.7);
  const calls: unknown[][] = [];
  const context = {
    fillRect: (...args: unknown[]) => calls.push(["fill", ...args]),
    drawImage: (...args: unknown[]) => calls.push(["draw", ...args]),
  } as unknown as CanvasRenderingContext2D;
  drawTransformedSource(context, source, target, {
    ...fill,
    offsetX: 5,
    offsetY: -7,
  });
  assert.deepEqual(calls, [
    ["fill", 0, 0, 68, 140],
    ["draw", source, 4, -7, 70, 140],
  ]);
  assert.equal(context.imageSmoothingEnabled, true);
});

test("artwork pipeline dithers in physical coordinates before rotating", () => {
  const display: DisplayPreset = {
    ...niceView,
    physical: { width: 2, height: 3, rotation: 90 },
    framebuffer: { width: 3, height: 2 },
    artwork: {
      ...niceView.artwork,
      physical: { x: 0, y: 0, width: 2, height: 3 },
      framebuffer: { x: 0, y: 0, width: 3, height: 2 },
    },
    statusArea: undefined,
  };
  const rgba = new Uint8ClampedArray(
    Array.from({ length: 6 }, () => [100, 100, 100, 255]).flat(),
  );
  for (const [mode, physical, framebuffer] of [
    ["floyd-steinberg", [0, 1, 0, 0, 1, 0], [1, 0, 0, 0, 0, 1]],
    ["atkinson", [0, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 0]],
  ] as const) {
    const result = pipeline.processArtwork(rgba, display, {
      ...settings,
      processingMode: mode,
    });
    assert.deepEqual([...result.physicalBitmap.pixels], [...physical]);
    assert.deepEqual([...result.framebufferBitmap.pixels], [...framebuffer]);
    const wrongOrder = pipeline.processImage(rgba, 3, 2, {
      ...settings,
      processingMode: mode,
    });
    assert.notDeepEqual(result.framebufferBitmap.pixels, wrongOrder.pixels);
  }
});

test("all processing modes export the exact physical pixels in framebuffer order", () => {
  const width = 68;
  const height = 140;
  const rgba = Uint8ClampedArray.from({ length: width * height * 4 }, (_, i) =>
    i % 4 === 3
      ? 255
      : (Math.floor(i / 4) * 37 + Math.floor(i / (width * 4)) * 11) % 256,
  );
  const untouched = rgba.slice();
  for (const processingMode of [
    "threshold",
    "floyd-steinberg",
    "atkinson",
  ] as const) {
    const configured = {
      ...settings,
      processingMode,
      brightness: 12,
      contrast: -8,
      threshold: 117,
    };
    const { physicalBitmap, framebufferBitmap } = pipeline.processArtwork(
      rgba,
      niceView,
      configured,
    );
    assert.deepEqual(
      physicalBitmap,
      pipeline.processImage(rgba, width, height, configured),
    );
    assert.equal(physicalBitmap.pixels.length, 9520);
    assert.equal(framebufferBitmap.width, 140);
    assert.equal(framebufferBitmap.height, 68);
    const { data, stride } = encodeLvglImage(framebufferBitmap);
    assert.equal(stride, 18);
    assert.equal(data.length, 1232);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const fx = height - 1 - y;
        const fy = x;
        const decoded: number =
          (data[8 + fy * stride + (fx >> 3)] >> (7 - (fx & 7))) & 1;
        assert.equal(decoded, physicalBitmap.pixels[y * width + x]);
      }
    }
    for (let row = 0; row < 68; row++)
      assert.equal(data[8 + row * stride + 17] & 15, 0);
    const inverted = pipeline.processArtwork(rgba, niceView, {
      ...configured,
      inverted: true,
    });
    assert.deepEqual(
      inverted.physicalBitmap,
      bitmaps.invertBitmap(physicalBitmap),
    );
    assert.deepEqual(
      inverted.framebufferBitmap,
      bitmaps.invertBitmap(framebufferBitmap),
    );
    assert.deepEqual(pipeline.processArtwork(rgba, niceView, configured), {
      physicalBitmap,
      framebufferBitmap,
    });
    const code = generateLvglImage(framebufferBitmap, "portrait");
    assert.match(code, /\.header\.w = 140,/);
    assert.match(code, /\.header\.h = 68,/);
    for (const target of niceView.exportTargets) {
      const files = generateNiceViewArtwork(
        framebufferBitmap,
        "portrait",
        target,
        configured,
      );
      const art = Object.entries(files).find(([path]) =>
        path.endsWith("art.c"),
      )?.[1];
      assert.equal(art, code);
      assert.match(files["README.md"], /Physical display: 68×160/);
      assert.match(files["README.md"], /Physical artwork: 68×140/);
      assert.match(files["README.md"], /ZMK framebuffer: 160×68/);
      assert.match(files["README.md"], /ZMK artwork representation: 140×68/);
    }
    assert.throws(
      () =>
        generateNiceViewArtwork(
          physicalBitmap,
          "portrait",
          "c-image",
          configured,
        ),
      /framebuffer/i,
    );
  }
  assert.deepEqual(rgba, untouched);
});

test("framebuffer conversion rejects already-rotated and display-sized inputs", () => {
  const physical = {
    width: 68,
    height: 140,
    pixels: new Uint8Array(68 * 140),
  };
  const framebuffer = pipeline.toFramebufferArtwork(physical, niceView);
  assert.deepEqual(framebuffer, bitmaps.rotateMonochromeBitmap(physical, 90));
  assert.throws(
    () => pipeline.toFramebufferArtwork(framebuffer, niceView),
    /physical artwork.*68×140/i,
  );
  assert.throws(
    () =>
      pipeline.toFramebufferArtwork(
        { width: 68, height: 160, pixels: new Uint8Array(68 * 160) },
        niceView,
      ),
    /physical artwork.*68×140/i,
  );
});

test("zero-degree rotation copies Buffer-backed artwork without aliasing pixels", () => {
  const source = { width: 2, height: 1, pixels: Buffer.from([0, 1]) };
  const rotated = bitmaps.rotateMonochromeBitmap(source, 0);
  rotated.pixels[0] = 1;
  assert.deepEqual([...source.pixels], [0, 1]);
  assert.deepEqual([...rotated.pixels], [1, 1]);
});

test("artwork processing rejects incompatible geometry and physical image data", () => {
  const rgba = new Uint8ClampedArray(68 * 140 * 4);
  for (const framebuffer of [
    { x: 0, y: 0, width: 68, height: 140 },
    { x: 0, y: 0, width: 140, height: 67 },
    { x: 0, y: 0, width: 139.5, height: 68 },
  ]) {
    const display = {
      ...niceView,
      artwork: { ...niceView.artwork, framebuffer },
    };
    assert.throws(
      () => pipeline.processArtwork(rgba, display, settings),
      /framebuffer/i,
    );
  }
  assert.throws(
    () => pipeline.processArtwork(rgba.subarray(4), niceView, settings),
    /dimensions/,
  );
  assert.throws(
    () =>
      pipeline.processArtwork(
        new Uint8ClampedArray(0),
        {
          ...niceView,
          artwork: {
            ...niceView.artwork,
            physical: { x: 0, y: 0, width: 0, height: 140 },
          },
        },
        settings,
      ),
    /dimensions/,
  );
});
