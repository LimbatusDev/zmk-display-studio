import { niceView } from "./nice-view.ts";
import type { DisplayPreset } from "./types.ts";

export const displays: readonly DisplayPreset[] = [niceView];

export function getDisplay(id: string): DisplayPreset {
  const display = displays.find((preset) => preset.id === id);
  if (!display) throw new Error(`Unsupported display: ${id}`);
  return display;
}

export function getArtworkArea(displayId: string, areaId: string) {
  const area = getDisplay(displayId).artworkAreas.find(
    (item) => item.id === areaId,
  );
  if (!area) throw new Error(`Unsupported artwork area: ${areaId}`);
  return area;
}
