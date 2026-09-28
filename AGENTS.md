<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands and verification

- Use Node.js 24+ and pnpm (pinned in `package.json`). Run commands from the root; this is a single app despite `pnpm-workspace.yaml`. Start locally with `pnpm dev`.
- `pnpm lint` **auto-fixes**; use `pnpm lint:check` for read-only verification. Both fail on warnings. Likewise, `pnpm format` writes files; `pnpm format:check` only checks.
- Use `pnpm typecheck`, which runs `next typegen` before `tsc --noEmit`; the layout uses generated `LayoutProps`. Bare `tsc` can miss these types on a clean checkout.
- Focused checks: `pnpm exec eslint <file> --max-warnings=0` and `pnpm exec prettier --check <file>`. Production compilation: `pnpm build`.
- `pnpm-lock.yaml` contains multiple YAML documents: the first locks pnpm itself, the second app dependencies. Let pnpm maintain it; Prettier intentionally ignores it.

## Tests

- `pnpm test` and `pnpm test:coverage` use Node's built-in test runner and TypeScript support. Tests import source directly; keep explicit `.ts` relative imports in the tested libraries. Coverage is scoped to `src/lib/**/*.ts`.
- One file: `pnpm exec node --test tests/image-processing.test.ts`. One test: `pnpm exec node --test --test-name-pattern="packing" tests/image-processing.test.ts` (flags precede file paths).
- The native C test skips unless `LVGL_DIR` points to an LVGL checkout; use the revision in `src/lib/generators/metadata.ts`. Run `LVGL_DIR=/absolute/path/to/lvgl pnpm test:coverage` with `clang` installed. This checks generated C against headers, not a full Zephyr build.
- For browser-only editor behavior, use **Or try a sample**, adjust processing, switch previews, and exercise C/ZIP export.

## Editor architecture

- `src/app/page.tsx` renders the client boundary in `src/components/editor/display-editor.tsx`. `use-image-pipeline.ts` rasterizes the transformed source in physical artwork coordinates, then calls `processArtwork` in `src/lib/image/pipeline.ts`. Physical/Pixels use `physicalBitmap`; Framebuffer and every export use the derived `framebufferBitmap`. Keep processing/export local to the browser.
- `src/store/editor-store.ts` owns editor state and releases replaced source images. The root layout mounts `EditorSession` to connect preferences after hydration and release the source on session unmount. Internal navigation preserves artwork; the upload hook only cancels pending decodes on editor unmount. Only Zod-validated processing/preview preferences and the export-success preference persist; images and transforms stay in memory.
- Export success instructions use the in-memory download receipt in `src/lib/export-instructions.ts`: direct C downloads always get C-image guidance, while ZIPs use the captured package target. Keep these steps aligned with the generated README. `showExportSuccess` defaults to true for older saved preferences; opting out covers all downloads, with manual access to the last download’s steps. Copying code does not trigger a celebration.
- The root layout shares the header/footer across `/`, `/about`, `/how-to-use`, `/faq`, `/export-guide`, and `/privacy`. Informational pages are Server Components using `ContentPage`; their route details live in `src/lib/site.ts`, with per-page metadata from `page-metadata.ts`. Keep navigation, sitemap, and guide content aligned with implemented editor/export behavior.
- Display geometry comes from `src/lib/displays/registry.ts`. Only nice!view is registered: physical display 68×160, artwork 68×140 below a top 68×20 status strip; framebuffer display 160×68, artwork 140×68 beside a right 20×68 status strip. Use explicit `.physical`/`.framebuffer` sizes and positions from the preset. `physical.rotation` means clockwise physical-to-framebuffer conversion (90 for nice!view). Process/dither/invert in physical coordinates, then rotate unpacked pixels once. The status preview is simulated and excluded from export. `nice-view-artwork.ts` accepts framebuffer artwork and is preset-specific, so adding a registry entry alone does not add export support.

## Firmware export invariants

- `src/lib/image/bitmap.ts` uses row-major pixels (`0` black, `1` white). Packed rows are MSB-first and independently byte-aligned, with zero padding; never pack continuously across row boundaries.
- `src/lib/generators/lvgl-image.ts` targets **LVGL 9**, with an 8-byte opaque BGRA palette and explicit descriptor magic/stride. A 140×68 image has an 18-byte stride and 1,232 total bytes. Inversion is already baked into pixels; keep the palette fixed.
- `src/lib/generators/metadata.ts` pins ZMK/LVGL revisions. Firmware changes must account for `templates/` and the generated README/license, not just `art.c`. The custom-shield export reuses upstream ZMK support sources and is marked experimental.
- `zip-generator.ts` sorts entries and fixes timestamps for reproducible exports; preserve that determinism.

## UI and naming conventions

- Use kebab-case for folder and file names (for example, `display-editor/` and `display-preview.tsx`).
- Preserve required framework and tooling names, such as `AGENTS.md`, `README.md`, and Next.js special file conventions.
- UI primitives use **Base UI**, with shadcn's `base-nova` configuration in `components.json`; do not assume Radix component APIs.
- Tailwind v4 tokens and theme mappings live in `src/app/globals.css`. `src/lib/utils.ts` re-exports `cn` from the `cn` package rather than implementing the usual clsx/tailwind-merge helper.
- `ThemeProvider` uses `next-themes` with an HTML `.dark` class and the key in `src/lib/theme.ts`. Theme follows the OS until explicitly selected. Use `text-highlight-foreground` on lime surfaces rather than `text-primary`, which becomes lime in dark mode. Keep bitmap pixels and the device screen independent of the interface theme.
