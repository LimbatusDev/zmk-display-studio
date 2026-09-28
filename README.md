# ZMK Display Studio

A local-first artwork editor for ZMK keyboard displays. Upload an image, compose a crop, preview monochrome pixels, and export LVGL/ZMK assets. The first display is **nice!view**, shown in its usual vertical mounting on split keyboards such as the Piantor Pro BT: a **68×160 physical display**, with **68×140 peripheral artwork** below a **68×20 status strip**.

Compose in the orientation you see on your keyboard. The editor automatically rotates the final monochrome pixels into ZMK’s internal framebuffer representation:

| Region  | Physical/editor  | ZMK framebuffer    |
| ------- | ---------------- | ------------------ |
| Display | 68×160           | 160×68             |
| Artwork | 68×140           | 140×68             |
| Status  | 68×20 at the top | 20×68 at the right |

Use the editor at **https://zmk-display-studio.limbatus.com/**.

## Development

Use Node.js 24+ and the pnpm version in `package.json`.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. Production: `pnpm build` followed by `pnpm start`.

```sh
pnpm test
pnpm test:coverage
pnpm typecheck
pnpm lint:check
pnpm format:check
pnpm build
```

Tests use Node's built-in TypeScript support and test runner. No separate test framework is required. To also compile generated C against real LVGL headers, check out the LVGL revision below and run:

```sh
LVGL_DIR=/absolute/path/to/lvgl pnpm test:coverage
```

This optional check requires `clang`. It checks the image descriptor and arrays, not a full Zephyr firmware build.

## Search and sharing

`src/lib/site.ts` defines the production URL, title, and description shared by page metadata, structured data, and crawler routes. The homepage has a production canonical URL, WebSite/WebApplication JSON-LD, and server-rendered usage guidance. `src/app/opengraph-image.tsx` generates the social preview at build time for Open Graph and Twitter cards.

After deploying, verify `/robots.txt`, `/sitemap.xml`, and `/opengraph-image` on the production domain. Add the site to Google Search Console and Bing Webmaster Tools, submit `https://zmk-display-studio.limbatus.com/sitemap.xml`, and request indexing of the homepage. Domain verification is configured through the respective service (for example, a DNS TXT record).

## Using the editor

1. Choose a PNG, JPEG, or WebP (10 MB maximum), drag one onto the source area, or try the locally generated sample.
2. Compose in the portrait image editor or the Physical, Pixels, and Source previews. Drag to pan; focus the artwork and use arrow keys to nudge; Shift moves 10 physical pixels. Fit, fill, center, reset, and zoom controls are also available.
3. Select threshold, Floyd–Steinberg, or Atkinson. Adjust brightness, contrast, and inversion.
4. Inspect **Physical** (default, full portrait device), **Pixels** (physical artwork), **Framebuffer** (technical ZMK output), or **Source** (transformed crop before monochrome processing). Pixels uses integer enlargement; its optional canvas grid appears at 3× and above. Switching views preserves your composition. Framebuffer is an inspection view.
5. Export, name your artwork, inspect/copy the C, or download a C file / ZIP with installation instructions.

Transparent and uncovered pixels are composited onto white. The top status region in Physical mode is simulated and is never included in the exported artwork.

## Architecture

```text
src/app/                       App Router shell, metadata, styles
src/components/editor/         Upload, composition, settings, preview, export UI
src/components/layout/         Header, About dialog, privacy footer
src/components/ui/             shadcn/Base UI primitives
src/store/editor-store.ts      Zustand state/actions and validated preferences
src/types/editor.ts            Source, transform, and processing types
src/lib/displays/              Display registry, artwork/status areas, export targets
src/lib/image/                 Pure algorithms plus browser decoding/drawing
src/lib/generators/            C identifiers, LVGL encoding, packages, downloads
src/lib/generators/templates/  Isolated ZMK integration and installation templates
tests/                        Algorithm, encoding, package, optional native C tests
```

The display registry explicitly owns both `physical` and `framebuffer` dimensions and region positions. UI composition and monochrome processing use `artwork.physical`; export uses `artwork.framebuffer`. `physical.rotation` is the clockwise physical-to-framebuffer conversion angle in top-left-origin coordinates (+y down). Additional displays need their own geometry and exporter support. The editor handles one artwork area and one source at a time.

The source is retained separately from `{ scale, offsetX, offsetY }`. Scale means physical artwork pixels per source pixel; offsets are measured relative to physical artwork center. `processArtwork` returns a `physicalBitmap` and a derived `framebufferBitmap`. The latter drives the Framebuffer preview and every C/ZIP export path. Source drawing is memoized separately from processing settings, and drag updates are coalesced with `requestAnimationFrame`.

```text
source → physical transform/crop/resize (68×140) → white compositing
       → brightness → contrast → grayscale
       → threshold / error diffusion → invert → physical 0/1 bitmap (68×140)
       → lossless 90° clockwise pixel rotation → framebuffer bitmap (140×68)
       → palette + row-padded I1 data → LVGL descriptor (140×68)
```

Rotation uses `(x, y) → (height − 1 − y, x)` on unpacked monochrome pixels. Dithering runs **before** rotation because error diffusion depends on traversal direction. Neither CSS rotation nor a second processing pass is used for export. The stock nice!view portrait mounting presents these pixels upright, with status at the top. An inverse rotation of decoded export data must exactly reconstruct the physical bitmap; regression tests enforce this.

## Privacy and persistence

Images are decoded and processed with browser Canvas APIs. C files and ZIPs are generated locally with Blob APIs and JSZip. There are no upload endpoints, server actions, accounts, analytics, database, or image-processing services.

Object URLs are revoked on replacement, clearing, failed/stale decoding, and editor unmount. Download URLs are released after use. localStorage holds only validated processing/preview preferences under `zmk-display-studio:preferences:v2`; existing v1 preferences are read with `device` migrated to `physical`. Source files, image data, names, and transforms are not persisted. Storage failures do not prevent editing.

Loading the application requests its normal static assets. Image selection, processing, and export do not require network requests.

## Firmware encoding

Generator: `nice-view-zmk-main`, version `2`.

- ZMK main inspected: [`5b51501fead672c41b5cfb396f3dafe0894bf4e9`](https://github.com/zmkfirmware/zmk/tree/5b51501fead672c41b5cfb396f3dafe0894bf4e9).
- ZMK's pinned LVGL: [`f1db87ee98f1810328a8419572fa42a3b5f352ae`](https://github.com/zmkfirmware/lvgl/tree/f1db87ee98f1810328a8419572fa42a3b5f352ae), reporting 9.3.0-dev.
- References: `app/boards/shields/nice_view/widgets/art.c`, `peripheral_status.c`, and LVGL's indexed-image decoder.
- Internal pixels: `0 = black`, `1 = white`.
- Export: `LV_COLOR_FORMAT_I1`, two opaque BGRA palette entries (8 bytes), MSB-first indices.
- Every row is independently padded: `ceil(140 / 8) = 18` bytes, with 4 zero padding bits.
- Total data: **8 + 18 × 68 = 1,232 bytes**.
- Descriptor: `lv_image_dsc_t` with explicit magic, color format, **`.header.w = 140`**, **`.header.h = 68`**, and stride. Portrait editor dimensions are never substituted into the firmware descriptor.

The palette is fixed so exported artwork matches the preview. Editor inversion is baked into pixels; `CONFIG_NICE_VIEW_WIDGET_INVERTED` affects status-widget colors independently. No timestamp or random selection enters generated C. ZIP entries use stable ordering and timestamps.

## Export choices

**C image only:** `art.c` plus README in the ZIP. Compile it once in an existing custom widget/shield and reference the declared image. This file alone is not a replacement for the stock balloon/mountain widget.

**nice!view customization:** replacements for `art.c` and `peripheral_status.c` under their upstream paths. Apply them to a local ZMK checkout or fork; the generated README explains local and manifest-based builds. The widget calls `lv_image_set_src(art, &your_symbol)` deterministically and retains battery/connection behavior.

**Full custom shield (Experimental):** `boards/shields/nice_view_custom/` and module discovery metadata. Select `nice_view_custom` instead of `nice_view`, keeping the keyboard and any adapter shield. Its CMake integration reuses unchanged upstream utilities and central widgets. Merge module settings into existing configuration rather than overwriting them. Detailed instructions are included in every ZIP.

## Limitations

- PNG/JPEG/WebP only; SVG and animated artwork are not supported. Animated raster sources use the browser-decoded frame.
- Source images are limited to 40 megapixels and 16,384 pixels per side, in addition to the 10 MB limit.
- Artwork customization targets split peripheral displays. Central-side custom layouts and other displays are future work.
- Physical display appearance can differ from the browser simulation. Browser image decoding/resampling can also differ slightly between engines.
- Older LVGL 8-based ZMK releases are unsupported. Future ZMK changes may require a generator/template update.
- A full Zephyr build and physical nice!view test have not been performed. The advanced custom shield remains experimental.
- Clipboard access requires a secure context (HTTPS or localhost); direct downloads are available as an alternative.

Independent community tooling; not affiliated with ZMK or nice!keyboards. ZMK-derived templates retain MIT attribution, and relevant exports include the upstream license.
