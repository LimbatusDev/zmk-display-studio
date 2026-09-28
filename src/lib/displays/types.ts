/** Clockwise physical-to-framebuffer rotation with a top-left origin (+y down). */
export type Rotation = 0 | 90 | 180 | 270;

export interface Size {
  width: number;
  height: number;
}

export interface RegionBounds extends Size {
  x: number;
  y: number;
}

export interface DisplayRegion {
  id: string;
  name: string;
  framebuffer: RegionBounds;
  physical: RegionBounds;
}

export type ExportTarget = "c-image" | "nice-view-artwork" | "custom-shield";

export interface DisplayPreset {
  id: string;
  name: string;
  manufacturer?: string;
  framebuffer: Size;
  physical: Size & { rotation: Rotation };
  colorDepth: 1 | 2 | 4 | 8 | 16;
  artwork: DisplayRegion;
  statusArea?: DisplayRegion;
  exportTargets: readonly ExportTarget[];
}
