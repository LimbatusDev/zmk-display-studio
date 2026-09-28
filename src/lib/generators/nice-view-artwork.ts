import { niceView } from "../displays/nice-view.ts";
import type { ExportTarget } from "../displays/types.ts";
import type { MonochromeBitmap } from "../image/bitmap.ts";
import type { ProcessingSettings } from "../../types/editor.ts";
import { requireCIdentifier } from "./c-identifier.ts";
import { generateLvglImage } from "./lvgl-image.ts";
import { customShieldFiles } from "./templates/custom-shield.ts";
import { peripheralStatusTemplate } from "./templates/peripheral-status.ts";
import { generateReadme } from "./templates/readme.ts";
import { upstreamLicense } from "./templates/license.ts";

/** Accepts artwork already converted to ZMK framebuffer coordinates. */
export function generateNiceViewArtwork(
  bitmap: MonochromeBitmap,
  artworkName: string,
  target: ExportTarget,
  settings: ProcessingSettings,
): Record<string, string> {
  const area = niceView.artwork.framebuffer;
  if (bitmap.width !== area.width || bitmap.height !== area.height)
    throw new Error(
      `nice!view peripheral framebuffer artwork must be exactly ${area.width}×${area.height} pixels.`,
    );
  if (!niceView.exportTargets.includes(target))
    throw new Error("Unsupported export target.");
  const symbol = requireCIdentifier(artworkName);
  const code = generateLvglImage(bitmap, symbol);
  const files: Record<string, string> = {
    "README.md": generateReadme(target, symbol, settings),
  };
  if (target === "c-image") return { ...files, "art.c": code };
  const base =
    target === "custom-shield"
      ? "boards/shields/nice_view_custom"
      : "app/boards/shields/nice_view";
  if (target === "custom-shield") Object.assign(files, customShieldFiles);
  files[`${base}/widgets/art.c`] = code;
  files[`${base}/widgets/peripheral_status.c`] =
    peripheralStatusTemplate(symbol);
  files["LICENSE-ZMK"] = upstreamLicense;
  return files;
}
