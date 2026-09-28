import { z } from "zod";

export const preferencesKey = "zmk-display-studio:preferences:v2";
export const legacyPreferencesKey = "zmk-display-studio:preferences:v1";

export const preferencesSchema = z.object({
  processingMode: z.enum(["threshold", "floyd-steinberg", "atkinson"]),
  threshold: z.number().int().min(0).max(255),
  brightness: z.number().min(-100).max(100),
  contrast: z.number().min(-100).max(100),
  inverted: z.boolean(),
  previewMode: z.enum(["physical", "pixels", "framebuffer", "source"]),
  showPixelGrid: z.boolean(),
});

/** Migrate only the old mode name; all saved values still require validation. */
export function parsePreferences(raw: string) {
  try {
    const value: unknown = JSON.parse(raw);
    const migrated =
      value &&
      typeof value === "object" &&
      "previewMode" in value &&
      value.previewMode === "device"
        ? { ...value, previewMode: "physical" }
        : value;
    const result = preferencesSchema.safeParse(migrated);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
