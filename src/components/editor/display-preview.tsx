import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import {
  BatteryMedium,
  Bluetooth,
  Grid2X2,
  Image,
  Monitor,
  Move,
} from "lucide-react";
import { getDisplay } from "@/lib/displays/registry";
import type { ArtworkArea } from "@/lib/displays/types";
import { bitmapToRgba, type MonochromeBitmap } from "@/lib/image/bitmap";
import { useEditorStore } from "@/store/editor-store";
import type { ImageTransform, PreviewMode } from "@/types/editor";
import { ImageCanvas } from "./image-canvas";

const modes = [
  { id: "device", label: "Device", icon: Monitor },
  { id: "pixels", label: "Pixels", icon: Grid2X2 },
  { id: "source", label: "Source", icon: Image },
] as const;

export function PreviewTabs() {
  const mode = useEditorStore((state) => state.previewMode);
  const setMode = useEditorStore((state) => state.setPreviewMode);
  return (
    <div className="segmented-control" role="group" aria-label="Preview mode">
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          type="button"
          key={id}
          aria-pressed={mode === id}
          onClick={() => setMode(id)}
        >
          <Icon className="size-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}

function PixelGrid({
  width,
  height,
  scale,
}: {
  width: number;
  height: number;
  scale: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, width * scale, height * scale);
    context.strokeStyle = "rgba(100, 125, 140, .32)";
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 1; x < width; x++) {
      context.moveTo(x * scale + 0.5, 0);
      context.lineTo(x * scale + 0.5, height * scale);
    }
    for (let y = 1; y < height; y++) {
      context.moveTo(0, y * scale + 0.5);
      context.lineTo(width * scale, y * scale + 0.5);
    }
    context.stroke();
  }, [width, height, scale]);
  return (
    <canvas
      ref={canvas}
      width={width * scale}
      height={height * scale}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function usePan() {
  const start = useRef<{
    id: number;
    x: number;
    y: number;
    ratio: number;
    transform: ImageTransform;
  } | null>(null);
  const pending = useRef<Partial<ImageTransform> | null>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const flush = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (pending.current)
      useEditorStore.getState().setTransform(pending.current);
    pending.current = null;
  };
  return {
    onPointerDown: (event: PointerEvent<HTMLDivElement>, width: number) => {
      if (event.button !== 0 || start.current) return;
      event.currentTarget.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture(event.pointerId);
      start.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        ratio: width / event.currentTarget.getBoundingClientRect().width,
        transform: useEditorStore.getState().transform,
      };
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      const initial = start.current;
      if (!initial || initial.id !== event.pointerId) return;
      pending.current = {
        offsetX:
          initial.transform.offsetX +
          (event.clientX - initial.x) * initial.ratio,
        offsetY:
          initial.transform.offsetY +
          (event.clientY - initial.y) * initial.ratio,
      };
      if (!frame.current) frame.current = requestAnimationFrame(flush);
    },
    finish: () => {
      flush();
      start.current = null;
    },
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      const deltas: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      const delta = deltas[event.key];
      if (!delta) return;
      event.preventDefault();
      const state = useEditorStore.getState();
      const distance = event.shiftKey ? 10 : 1;
      state.setTransform({
        offsetX: state.transform.offsetX + delta[0] * distance,
        offsetY: state.transform.offsetY + delta[1] * distance,
      });
    },
  };
}

export function DisplayPreview({
  bitmap,
  source,
  area,
}: {
  bitmap: MonochromeBitmap;
  source: Uint8ClampedArray;
  area: ArtworkArea;
}) {
  const mode = useEditorStore((state) => state.previewMode);
  const showGrid = useEditorStore((state) => state.showPixelGrid);
  const displayId = useEditorStore((state) => state.displayId);
  const display = getDisplay(displayId);
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(2);
  const pan = usePan();
  const processed = useMemo(() => bitmapToRgba(bitmap), [bitmap]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(
        Math.max(1, Math.floor((entry.contentRect.width - 32) / area.width)),
      ),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [area.width]);

  const artwork = (previewMode: PreviewMode) => (
    <div
      className="artwork-interaction relative touch-none cursor-grab active:cursor-grabbing"
      tabIndex={0}
      role="group"
      aria-label="Artwork position"
      aria-describedby="pan-help"
      onPointerDown={(event) => pan.onPointerDown(event, area.width)}
      onPointerMove={pan.onPointerMove}
      onPointerUp={pan.finish}
      onPointerCancel={pan.finish}
      onLostPointerCapture={pan.finish}
      onKeyDown={pan.onKeyDown}
    >
      <ImageCanvas
        rgba={previewMode === "source" ? source : processed}
        width={area.width}
        height={area.height}
        label={
          previewMode === "source"
            ? "Transformed source before monochrome conversion"
            : `Exact ${area.width} by ${area.height} monochrome artwork`
        }
        pixelated={previewMode !== "source"}
      />
      {previewMode === "pixels" && showGrid && scale >= 3 && (
        <PixelGrid width={area.width} height={area.height} scale={scale} />
      )}
    </div>
  );

  return (
    <div
      ref={container}
      className="flex min-h-96 flex-1 flex-col items-center justify-center gap-8 py-10"
    >
      <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
        <span className="size-1.5 rounded-full bg-emerald-600" />
        {mode === "device"
          ? "Live device preview"
          : mode === "pixels"
            ? `${scale}× pixel preview`
            : "Original · transformed crop"}
      </div>
      {mode === "device" ? (
        <div className="w-[calc(100%-2rem)] max-w-[640px]">
          <div className="device-frame">
            <div className="device-screw left-2 top-2" />
            <div className="device-screw right-2 bottom-2" />
            <div
              className="device-screen relative"
              style={{ aspectRatio: `${display.width} / ${display.height}` }}
            >
              <div
                className="absolute"
                style={{
                  left: `${(area.x / display.width) * 100}%`,
                  top: `${(area.y / display.height) * 100}%`,
                  width: `${(area.width / display.width) * 100}%`,
                }}
              >
                {artwork(mode)}
              </div>
              {display.statusAreas.map((status) => (
                <div
                  key={status.id}
                  className="absolute flex h-full flex-col items-center justify-between border-l border-black/30 py-[4%] text-black"
                  style={{
                    left: `${(status.x / display.width) * 100}%`,
                    top: `${(status.y / display.height) * 100}%`,
                    width: `${(status.width / display.width) * 100}%`,
                    height: `${(status.height / display.height) * 100}%`,
                  }}
                  aria-label="Simulated status, excluded from export"
                >
                  <Bluetooth className="w-[35%]" />
                  <span className="font-mono text-[clamp(6px,1vw,11px)] font-bold">
                    82%
                  </span>
                  <BatteryMedium className="w-[55%]" />
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[8px] tracking-[0.15em] text-zinc-400">
              <span>{display.name}</span>
              <span>
                {display.width} × {display.height} / {display.colorDepth}-BIT
              </span>
            </div>
          </div>
          <div className="mt-5 flex font-mono text-[9px] text-muted-foreground">
            <span
              className="dimension-line"
              style={{ width: `${(area.width / display.width) * 100}%` }}
            >
              {area.width}px artwork
            </span>
            <span className="dimension-line flex-1">status</span>
          </div>
        </div>
      ) : (
        <div
          className="max-w-full overflow-auto border border-zinc-400 shadow-sm"
          style={{ width: area.width * scale }}
        >
          {artwork(mode)}
        </div>
      )}
      <div className="space-y-2 px-4 text-center">
        <p
          id="pan-help"
          className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground"
        >
          <Move className="size-3" />
          Drag artwork to reposition · Arrow keys to nudge
        </p>
        <p className="font-mono text-[9px] text-muted-foreground">
          {mode === "device"
            ? "Status is simulated. Only artwork is exported."
            : mode === "pixels" && showGrid && scale < 3
              ? "Pixel grid appears at 3× and above. Widen the preview."
              : "Shift + arrow moves 10 pixels. Source stays untouched."}
        </p>
      </div>
    </div>
  );
}
