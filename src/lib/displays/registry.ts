import { niceView } from "./nice-view.ts";
import type { DisplayPreset, DisplayRegion } from "./types.ts";

export const displays: readonly DisplayPreset[] = [niceView];

export function getDisplay(id: string): DisplayPreset {
  const display = displays.find((preset) => preset.id === id);
  if (!display) throw new Error(`Unsupported display: ${id}`);
  return display;
}

export function getArtworkArea(
  displayId: string,
  areaId: string,
): DisplayRegion {
  const area = getDisplay(displayId).artwork;
  if (area.id !== areaId)
    throw new Error(`Unsupported artwork area: ${areaId}`);
  return area;
}
