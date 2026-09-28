import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { getArtworkArea } from "@/lib/displays/registry";
import { drawTransformedSource } from "@/lib/image/resize";
import { processImage } from "@/lib/image/pipeline";
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
  const source = useMemo(() => {
    if (!sourceImage || typeof document === "undefined")
      return { rgba: null, error: null };
    try {
      const canvas = document.createElement("canvas");
      canvas.width = area.width;
      canvas.height = area.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context)
        throw new Error("Your browser could not create a 2D canvas.");
      drawTransformedSource(context, sourceImage.element, area, transform);
      return {
        rgba: context.getImageData(0, 0, area.width, area.height).data,
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
  }, [sourceImage, area, transform]);
  const bitmap = useMemo(
    () =>
      source.rgba
        ? processImage(source.rgba, area.width, area.height, settings)
        : null,
    [source.rgba, area, settings],
  );
  return { area, rgba: source.rgba, bitmap, error: source.error, settings };
}
