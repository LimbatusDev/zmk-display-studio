export interface ArtworkArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ExportTarget = "c-image" | "nice-view-artwork" | "custom-shield";

export interface DisplayPreset {
  id: string;
  name: string;
  manufacturer?: string;
  width: number;
  height: number;
  colorDepth: 1 | 2 | 4 | 8 | 16;
  orientation: "horizontal" | "vertical";
  artworkAreas: readonly ArtworkArea[];
  statusAreas: readonly ArtworkArea[];
  exportTargets: readonly ExportTarget[];
}
