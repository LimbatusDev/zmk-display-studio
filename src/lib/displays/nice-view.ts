import type { DisplayPreset } from "./types.ts";

export const niceView = {
  id: "nice-view",
  name: "nice!view",
  manufacturer: "nice!keyboards",
  framebuffer: { width: 160, height: 68 },
  physical: { width: 68, height: 160, rotation: 90 },
  colorDepth: 1,
  artwork: {
    id: "peripheral",
    name: "Peripheral artwork",
    framebuffer: { x: 0, y: 0, width: 140, height: 68 },
    physical: { x: 0, y: 20, width: 68, height: 140 },
  },
  statusArea: {
    id: "status",
    name: "Simulated status",
    framebuffer: { x: 140, y: 0, width: 20, height: 68 },
    physical: { x: 0, y: 0, width: 68, height: 20 },
  },
  exportTargets: ["c-image", "nice-view-artwork", "custom-shield"],
} as const satisfies DisplayPreset;
