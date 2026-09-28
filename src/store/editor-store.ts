"use client";

import { create } from "zustand";
import { z } from "zod";
import { getArtworkArea, getDisplay } from "@/lib/displays/registry";
import { niceView } from "@/lib/displays/nice-view";
import { releaseImage } from "@/lib/image/image-loader";
import { fitTransform, zoomBounds } from "@/lib/image/resize";
import type {
  ImageTransform,
  PreviewMode,
  ProcessingSettings,
  SourceImage,
} from "@/types/editor";

export const processingDefaults: ProcessingSettings = {
  processingMode: "floyd-steinberg",
  threshold: 128,
  brightness: 0,
  contrast: 0,
  inverted: false,
};

interface EditorState extends ProcessingSettings {
  displayId: string;
  artworkAreaId: string;
  sourceImage: SourceImage | null;
  transform: ImageTransform;
  previewMode: PreviewMode;
  showPixelGrid: boolean;
  artworkName: string;
  setSourceImage: (image: SourceImage | null) => void;
  setDisplay: (id: string) => void;
  setTransform: (transform: Partial<ImageTransform>) => void;
  fit: (mode: "fit" | "fill") => void;
  center: () => void;
  setProcessing: (settings: Partial<ProcessingSettings>) => void;
  resetProcessing: () => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setShowPixelGrid: (show: boolean) => void;
  setArtworkName: (name: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  ...processingDefaults,
  displayId: niceView.id,
  artworkAreaId: niceView.artworkAreas[0].id,
  sourceImage: null,
  transform: { scale: 1, offsetX: 0, offsetY: 0 },
  previewMode: "device",
  showPixelGrid: false,
  artworkName: "custom_art",
  setSourceImage: (sourceImage) => {
    const state = get();
    if (state.sourceImage !== sourceImage) releaseImage(state.sourceImage);
    set({
      sourceImage,
      transform: sourceImage
        ? fitTransform(
            sourceImage,
            getArtworkArea(state.displayId, state.artworkAreaId),
            "fill",
          )
        : { scale: 1, offsetX: 0, offsetY: 0 },
    });
  },
  setDisplay: (displayId) => {
    const area = getDisplay(displayId).artworkAreas[0];
    const source = get().sourceImage;
    set({
      displayId,
      artworkAreaId: area.id,
      ...(source ? { transform: fitTransform(source, area, "fill") } : {}),
    });
  },
  setTransform: (change) => {
    const state = get();
    if (!state.sourceImage) return;
    const bounds = zoomBounds(
      state.sourceImage,
      getArtworkArea(state.displayId, state.artworkAreaId),
    );
    const transform = { ...state.transform, ...change };
    if (!Object.values(transform).every(Number.isFinite)) return;
    transform.scale = Math.min(
      bounds.max,
      Math.max(bounds.min, transform.scale),
    );
    set({ transform });
  },
  fit: (mode) => {
    const state = get();
    if (state.sourceImage)
      set({
        transform: fitTransform(
          state.sourceImage,
          getArtworkArea(state.displayId, state.artworkAreaId),
          mode,
        ),
      });
  },
  center: () =>
    set((state) => ({
      transform: { ...state.transform, offsetX: 0, offsetY: 0 },
    })),
  setProcessing: (settings) => set(settings),
  resetProcessing: () => set(processingDefaults),
  setPreviewMode: (previewMode) => set({ previewMode }),
  setShowPixelGrid: (showPixelGrid) => set({ showPixelGrid }),
  setArtworkName: (artworkName) => set({ artworkName }),
}));

const preferencesSchema = z.object({
  processingMode: z.enum(["threshold", "floyd-steinberg", "atkinson"]),
  threshold: z.number().int().min(0).max(255),
  brightness: z.number().min(-100).max(100),
  contrast: z.number().min(-100).max(100),
  inverted: z.boolean(),
  previewMode: z.enum(["device", "pixels", "source"]),
  showPixelGrid: z.boolean(),
});

/** Called after hydration. Neither images nor transforms enter localStorage. */
export function connectPreferences() {
  const key = "zmk-display-studio:preferences:v1";
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const result = preferencesSchema.safeParse(JSON.parse(raw));
      if (result.success) useEditorStore.setState(result.data);
    }
  } catch {
    /* Storage is optional, including in private browsing. */
  }
  let previous = JSON.stringify(
    preferencesSchema.parse(useEditorStore.getState()),
  );
  return useEditorStore.subscribe((state) => {
    const next = JSON.stringify(preferencesSchema.parse(state));
    if (next === previous) return;
    previous = next;
    try {
      localStorage.setItem(key, next);
    } catch {
      /* Editing still works without persistence. */
    }
  });
}
