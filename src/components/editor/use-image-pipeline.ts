import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { getArtworkArea, getDisplay } from "@/lib/displays/registry";
import { drawTransformedSource } from "@/lib/image/resize";
import { processArtwork } from "@/lib/image/pipeline";
import { useEditorStore } from "@/store/editor-store";

export function useImagePipeline() {
  const { sourceImage, transform, displayId, artworkAreaId } = useEditorStore(
    useShallow((state) => ({
      sourceImage: state.sourceImage,
      transform: state.transform,
      displayId: state.displayId,
      artworkAreaId: state.artworkAreaId,
    })),
  );
  const settings = useEditorStore(
    useShallow((state) => ({
      processingMode: state.processingMode,
      threshold: state.threshold,
      brightness: state.brightness,
      contrast: state.contrast,
      inverted: state.inverted,
    })),
  );
  const area = getArtworkArea(displayId, artworkAreaId);
  const display = getDisplay(displayId);
  const physical = area.physical;
  const source = useMemo(() => {
    if (!sourceImage || typeof document === "undefined")
      return { rgba: null, error: null };
    try {
      const canvas = document.createElement("canvas");
      canvas.width = physical.width;
      canvas.height = physical.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context)
        throw new Error("Your browser could not create a 2D canvas.");
      drawTransformedSource(context, sourceImage.element, physical, transform);
      return {
        rgba: context.getImageData(0, 0, physical.width, physical.height).data,
        error: null,
      };
    } catch (error) {
      return {
        rgba: null,
        error:
          error instanceof Error
            ? error.message
            : "Could not process the image.",
      };
    }
  }, [sourceImage, physical, transform]);
  const processed = useMemo(
    () => (source.rgba ? processArtwork(source.rgba, display, settings) : null),
    [source.rgba, display, settings],
  );
  return {
    area,
    sourceRgba: source.rgba,
    physicalBitmap: processed?.physicalBitmap ?? null,
    framebufferBitmap: processed?.framebufferBitmap ?? null,
    error: source.error,
    settings,
  };
}
