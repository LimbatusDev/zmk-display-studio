import { useEffect, useMemo, useRef, useState } from "react";
import {
  BatteryMedium,
  Bluetooth,
  Grid2X2,
  Image,
  Monitor,
  Move,
  RectangleHorizontal,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getDisplay } from "@/lib/displays/registry";
import type { DisplayPreset, RegionBounds } from "@/lib/displays/types";
import { bitmapToRgba, type MonochromeBitmap } from "@/lib/image/bitmap";
import { useEditorStore } from "@/store/editor-store";
import type { PreviewMode } from "@/types/editor";
import { ArtworkViewport } from "./artwork-viewport";
import { ImageCanvas } from "./image-canvas";

const modes = [
  { id: "physical", label: "Physical", icon: Monitor },
  { id: "pixels", label: "Pixels", icon: Grid2X2 },
  { id: "framebuffer", label: "Framebuffer", icon: RectangleHorizontal },
  { id: "source", label: "Source", icon: Image },
] as const;

function describePreview(
  mode: PreviewMode,
  display: DisplayPreset,
  scale: number,
  showGrid: boolean,
) {
  const { artwork, physical, statusArea } = display;
  const physicalDimensions = `${artwork.physical.width} × ${artwork.physical.height} px`;
  switch (mode) {
    case "physical":
      return {
        badge: "Physical display preview",
        title: display.name,
        dimensions: `${physical.width} × ${physical.height} physical · Artwork: ${artwork.physical.width} × ${artwork.physical.height}`,
        note: statusArea
          ? `Top ${statusArea.physical.width}×${statusArea.physical.height} status is simulated. Only artwork is exported.`
          : "Only artwork is exported.",
      };
    case "framebuffer":
      return {
        badge: "ZMK framebuffer",
        title: "ZMK framebuffer artwork",
        dimensions: `${artwork.framebuffer.width} × ${artwork.framebuffer.height} px`,
        note: "Exact bitmap sent to the ZMK/LVGL encoder.",
      };
    case "pixels":
      return {
        badge: `${scale}× physical pixel preview`,
        title: "Physical artwork",
        dimensions: physicalDimensions,
        note:
          showGrid && scale < 3
            ? "Pixel grid appears at 3× and above. Enlarge the preview window."
            : "Shift + arrow moves 10 physical pixels.",
      };
    case "source":
      return {
        badge: "Source · transformed physical crop",
        title: "Physical source crop",
        dimensions: physicalDimensions,
        note: "Shift + arrow moves 10 physical pixels.",
      };
  }
}

export function PreviewTabs() {
  const mode = useEditorStore((state) => state.previewMode);
  const setMode = useEditorStore((state) => state.setPreviewMode);
  return (
    <ToggleGroup
      aria-label="Preview mode"
      value={[mode]}
      onValueChange={(values) => {
        const selected = modes.find(({ id }) => id === values[0]);
        if (selected) setMode(selected.id);
      }}
      spacing={0.5}
      className="max-w-full flex-wrap rounded-md border bg-muted p-0.75"
    >
      {modes.map(({ id, label, icon: Icon }) => (
        <ToggleGroupItem
          key={id}
          value={id}
          className="h-7 gap-1.5 rounded-sm px-2 text-[10px] font-normal text-muted-foreground hover:bg-card hover:text-primary aria-pressed:bg-highlight aria-pressed:text-highlight-foreground max-[479px]:gap-1 max-[479px]:px-1.5"
        >
          <Icon className="size-3.5 max-[479px]:hidden" aria-hidden="true" />
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
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
    context.strokeStyle = getComputedStyle(context.canvas)
      .getPropertyValue("--pixel-grid-color")
      .trim();
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

export function DisplayPreview({
  physicalBitmap,
  framebufferBitmap,
  source,
}: {
  physicalBitmap: MonochromeBitmap;
  framebufferBitmap: MonochromeBitmap;
  source: Uint8ClampedArray;
}) {
  const mode = useEditorStore((state) => state.previewMode);
  const showGrid = useEditorStore((state) => state.showPixelGrid);
  const displayId = useEditorStore((state) => state.displayId);
  const display = getDisplay(displayId);
  const area = display.artwork.physical;
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(2);
  const description = describePreview(mode, display, scale, showGrid);
  const processed = useMemo(
    () => bitmapToRgba(physicalBitmap),
    [physicalBitmap],
  );
  const framebuffer = useMemo(
    () => bitmapToRgba(framebufferBitmap),
    [framebufferBitmap],
  );
  const size =
    mode === "physical"
      ? display.physical
      : mode === "framebuffer"
        ? display.artwork.framebuffer
        : area;

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect;
      setScale(
        Math.max(
          1,
          Math.floor(
            Math.min(
              (available.width - 56) / size.width,
              (available.height - 64) / size.height,
            ),
          ),
        ),
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [size.width, size.height]);

  const placement = (region: RegionBounds) => ({
    left: `${(region.x / display.physical.width) * 100}%`,
    top: `${(region.y / display.physical.height) * 100}%`,
    width: `${(region.width / display.physical.width) * 100}%`,
    height: `${(region.height / display.physical.height) * 100}%`,
  });
  const artwork = (
    <ArtworkViewport
      rgba={mode === "source" ? source : processed}
      width={area.width}
      height={area.height}
      label={
        mode === "source"
          ? "Transformed source before monochrome processing"
          : `Physical monochrome artwork: ${area.width} by ${area.height} pixels`
      }
      pixelated={mode !== "source"}
      descriptionId="pan-help"
    >
      {mode === "pixels" && showGrid && scale >= 3 && (
        <PixelGrid width={area.width} height={area.height} scale={scale} />
      )}
    </ArtworkViewport>
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-6">
      <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
        <span className="size-1.5 rounded-full bg-signal" />
        {description.badge}
      </div>
      <div ref={stage} className="preview-stage">
        {mode === "physical" ? (
          <div className="device-frame">
            <div className="device-screw left-2 top-2" />
            <div className="device-screw right-2 bottom-2" />
            <div
              className="device-screen relative"
              style={{
                width: display.physical.width * scale,
                height: display.physical.height * scale,
              }}
            >
              {display.statusArea && (
                <div
                  className="absolute flex items-center justify-evenly border-b border-black/30 text-black"
                  style={{
                    ...placement(display.statusArea.physical),
                    fontSize: scale * 5,
                  }}
                  role="img"
                  aria-label="Simulated status: battery 82 percent, Bluetooth connected; excluded from export"
                >
                  <BatteryMedium
                    style={{ width: scale * 10, height: scale * 7 }}
                  />
                  <span className="font-mono font-bold">82%</span>
                  <Bluetooth style={{ width: scale * 7, height: scale * 7 }} />
                </div>
              )}
              <div className="absolute" style={placement(area)}>
                {artwork}
              </div>
            </div>
            <div className="mt-3 flex justify-between font-mono text-[8px] tracking-widest text-device-foreground">
              <span>{display.name}</span>
              <span>{display.colorDepth}-BIT</span>
            </div>
          </div>
        ) : mode === "framebuffer" ? (
          <div
            className="box-content border border-input shadow-sm"
            style={{ width: framebufferBitmap.width * scale }}
          >
            <ImageCanvas
              rgba={framebuffer}
              width={framebufferBitmap.width}
              height={framebufferBitmap.height}
              label={`ZMK framebuffer artwork: ${framebufferBitmap.width} by ${framebufferBitmap.height} pixels`}
            />
          </div>
        ) : (
          <div
            className="box-content border border-input shadow-sm"
            style={{ width: area.width * scale }}
          >
            {artwork}
          </div>
        )}
      </div>
      <div className="space-y-2 px-4 text-center">
        <p className="text-xs font-medium">{description.title}</p>
        <p className="font-mono text-[10px] text-muted-foreground">
          {description.dimensions}
        </p>
        {mode === "framebuffer" ? (
          <p className="max-w-80 text-[10px] leading-relaxed text-muted-foreground">
            ZMK uses a rotated {size.width}×{size.height} framebuffer
            representation for this artwork.
          </p>
        ) : (
          <p
            id="pan-help"
            className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground"
          >
            <Move className="size-3 shrink-0" />
            Drag artwork to reposition · Arrow keys to nudge
          </p>
        )}
        <p className="max-w-80 font-mono text-[9px] leading-relaxed text-muted-foreground">
          {description.note}
        </p>
      </div>
    </div>
  );
}
