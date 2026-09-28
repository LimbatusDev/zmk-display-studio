"use client";

import { create } from "zustand";
import {
  legacyPreferencesKey,
  parsePreferences,
  preferencesKey,
  preferencesSchema,
} from "@/lib/editor-preferences";
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
  showExportSuccess: boolean;
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
  setShowExportSuccess: (show: boolean) => void;
  setArtworkName: (name: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  ...processingDefaults,
  displayId: niceView.id,
  artworkAreaId: niceView.artwork.id,
  sourceImage: null,
  transform: { scale: 1, offsetX: 0, offsetY: 0 },
  previewMode: "physical",
  showPixelGrid: false,
  showExportSuccess: true,
  artworkName: "custom_art",
  setSourceImage: (sourceImage) => {
    const state = get();
    if (state.sourceImage !== sourceImage) releaseImage(state.sourceImage);
    set({
      sourceImage,
      transform: sourceImage
        ? fitTransform(
            sourceImage,
            getArtworkArea(state.displayId, state.artworkAreaId).physical,
            "fill",
          )
        : { scale: 1, offsetX: 0, offsetY: 0 },
    });
  },
  setDisplay: (displayId) => {
    const area = getDisplay(displayId).artwork;
    const source = get().sourceImage;
    set({
      displayId,
      artworkAreaId: area.id,
      ...(source
        ? { transform: fitTransform(source, area.physical, "fill") }
        : {}),
    });
  },
  setTransform: (change) => {
    const state = get();
    if (!state.sourceImage) return;
    const bounds = zoomBounds(
      state.sourceImage,
      getArtworkArea(state.displayId, state.artworkAreaId).physical,
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
          getArtworkArea(state.displayId, state.artworkAreaId).physical,
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
  setShowExportSuccess: (showExportSuccess) => set({ showExportSuccess }),
  setArtworkName: (artworkName) => set({ artworkName }),
}));

/** Called after hydration. Neither images nor transforms enter localStorage. */
export function connectPreferences() {
  try {
    const raw =
      localStorage.getItem(preferencesKey) ??
      localStorage.getItem(legacyPreferencesKey);
    if (raw) {
      const preferences = parsePreferences(raw);
      if (preferences) useEditorStore.setState(preferences);
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
      localStorage.setItem(preferencesKey, next);
    } catch {
      /* Editing still works without persistence. */
    }
  });
}
