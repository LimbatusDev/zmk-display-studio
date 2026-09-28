import type { DisplayPreset } from "./types.ts";

export const niceView = {
  id: "nice-view",
  name: "nice!view",
  manufacturer: "nice!keyboards",
  width: 160,
  height: 68,
  colorDepth: 1,
  orientation: "horizontal",
  artworkAreas: [
    {
      id: "peripheral",
      name: "Peripheral artwork",
      x: 0,
      y: 0,
      width: 140,
      height: 68,
    },
  ],
  statusAreas: [
    {
      id: "status",
      name: "Simulated status",
      x: 140,
      y: 0,
      width: 20,
      height: 68,
    },
  ],
  exportTargets: ["c-image", "nice-view-artwork", "custom-shield"],
} as const satisfies DisplayPreset;
