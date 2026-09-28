export interface SourceImage {
  name: string;
  width: number;
  height: number;
  size: number;
  url: string;
  element: HTMLImageElement;
}

export interface ImageTransform {
  /** Output pixels per source pixel; offsets are relative to artwork center. */
  scale: number;
  offsetX: number;
  offsetY: number;
}

export type ProcessingMode = "threshold" | "floyd-steinberg" | "atkinson";
export type PreviewMode = "device" | "pixels" | "source";

export interface ProcessingSettings {
  processingMode: ProcessingMode;
  threshold: number;
  brightness: number;
  contrast: number;
  inverted: boolean;
}

export const processingLabels: Record<ProcessingMode, string> = {
  threshold: "Threshold",
  "floyd-steinberg": "Floyd–Steinberg",
  atkinson: "Atkinson",
};
