import { memo, useEffect, useRef } from "react";

interface ImageCanvasProps {
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  label: string;
  pixelated?: boolean;
}

export const ImageCanvas = memo(function ImageCanvas({
  rgba,
  width,
  height,
  label,
  pixelated = true,
}: ImageCanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    const image = context.createImageData(width, height);
    image.data.set(rgba);
    context.putImageData(image, 0, 0);
  }, [rgba, width, height]);
  return (
    <canvas
      ref={canvas}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      className={`block h-auto w-full ${pixelated ? "pixelated" : ""}`}
    />
  );
});
