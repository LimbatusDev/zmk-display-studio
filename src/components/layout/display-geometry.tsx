import { ArrowRight } from "lucide-react";
import { niceView } from "@/lib/displays/nice-view";

const { physical, framebuffer, artwork, statusArea } = niceView;

export function DisplayGeometry() {
  return (
    <figure className="my-6 overflow-hidden rounded-md border bg-card">
      <div
        className="preview-workspace flex flex-wrap items-center justify-center gap-8 p-6 sm:gap-12"
        aria-hidden="true"
      >
        <div className="text-center">
          <div
            className="mx-auto flex w-24 flex-col overflow-hidden rounded-sm border border-primary bg-card"
            style={{ aspectRatio: `${physical.width} / ${physical.height}` }}
          >
            <div
              className="flex items-center justify-center border-b border-primary/30 bg-muted font-mono text-[9px] text-primary"
              style={{ flex: statusArea.physical.height }}
            >
              STATUS
            </div>
            <div
              className="flex items-center justify-center bg-highlight font-mono text-xs text-highlight-foreground"
              style={{ flex: artwork.physical.height }}
            >
              {artwork.physical.width} × {artwork.physical.height}
            </div>
          </div>
          <p className="mt-3 font-mono text-[10px] text-primary">PHYSICAL</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-primary">
          <ArrowRight className="size-5" />
          <span className="font-mono text-[10px]">{physical.rotation}° CW</span>
        </div>
        <div className="text-center">
          <div
            className="flex w-52 overflow-hidden rounded-sm border border-primary bg-card"
            style={{
              aspectRatio: `${framebuffer.width} / ${framebuffer.height}`,
            }}
          >
            <div
              className="flex items-center justify-center bg-highlight font-mono text-xs text-highlight-foreground"
              style={{ flex: artwork.framebuffer.width }}
            >
              {artwork.framebuffer.width} × {artwork.framebuffer.height}
            </div>
            <div
              className="flex items-center justify-center border-l border-primary/30 bg-muted font-mono text-[9px] text-primary [writing-mode:vertical-rl]"
              style={{ flex: statusArea.framebuffer.width }}
            >
              STATUS
            </div>
          </div>
          <p className="mt-3 font-mono text-[10px] text-primary">FRAMEBUFFER</p>
        </div>
      </div>
      <figcaption className="border-t px-5 py-4 text-xs leading-relaxed text-muted-foreground">
        Compose in the {artwork.physical.width} × {artwork.physical.height}{" "}
        portrait artwork area. The editor rotates the finished pixels{" "}
        {physical.rotation}° clockwise into {artwork.framebuffer.width} ×{" "}
        {artwork.framebuffer.height} framebuffer artwork. The status strip is
        shown for context and excluded from export.
      </figcaption>
    </figure>
  );
}
