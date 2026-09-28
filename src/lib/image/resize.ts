import type { ImageTransform } from "../../types/editor.ts";

interface Dimensions {
  width: number;
  height: number;
}

export function fitTransform(
  source: Dimensions,
  target: Dimensions,
  mode: "fit" | "fill",
): ImageTransform {
  const ratioX = target.width / source.width;
  const ratioY = target.height / source.height;
  return {
    scale:
      mode === "fill" ? Math.max(ratioX, ratioY) : Math.min(ratioX, ratioY),
    offsetX: 0,
    offsetY: 0,
  };
}

export function zoomBounds(source: Dimensions, target: Dimensions) {
  const fill = fitTransform(source, target, "fill").scale;
  return {
    min: Math.min(fill * 0.1, fitTransform(source, target, "fit").scale),
    max: fill * 8,
    base: fill,
  };
}

export function drawTransformedSource(
  context: CanvasRenderingContext2D,
  source: CanvasImageSource & Dimensions,
  target: Dimensions,
  transform: ImageTransform,
) {
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, target.width, target.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  const width = source.width * transform.scale;
  const height = source.height * transform.scale;
  context.drawImage(
    source,
    (target.width - width) / 2 + transform.offsetX,
    (target.height - height) / 2 + transform.offsetY,
    width,
    height,
  );
}
