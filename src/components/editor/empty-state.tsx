import { ArrowUpRight, Mountain, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDisplay } from "@/lib/displays/registry";
import { useEditorStore } from "@/store/editor-store";

export function EmptyState({
  choose,
  sample,
  busy,
}: {
  choose: () => void;
  sample: () => Promise<void>;
  busy: boolean;
}) {
  const displayId = useEditorStore((state) => state.displayId);
  const display = getDisplay(displayId);
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
      <div
        className="empty-display mb-7"
        style={{
          aspectRatio: `${display.physical.width} / ${display.physical.height}`,
        }}
        aria-hidden="true"
      >
        <span className="empty-display-corner" />
        <Mountain className="size-18 stroke-[0.8]" />
        <span className="absolute right-3 bottom-3 font-mono text-[8px] tracking-widest text-highlight-foreground">
          YOUR ART HERE
        </span>
      </div>
      <h2 className="max-w-64 text-lg font-medium leading-snug tracking-tight">
        Create custom artwork
        <br />
        for your ZMK display
      </h2>
      <p className="mt-3 max-w-68 text-xs leading-relaxed text-muted-foreground">
        Compose {display.artwork.physical.width}×
        {display.artwork.physical.height} portrait artwork as it appears on your
        keyboard. We handle the rotation for ZMK.
      </p>
      <Button className="mt-6 h-9 px-4" onClick={choose} disabled={busy}>
        <Upload /> Choose image
      </Button>
      <Button
        className="mt-3 text-xs text-muted-foreground"
        variant="ghost"
        size="sm"
        onClick={() => void sample()}
        disabled={busy}
      >
        Or try a sample <ArrowUpRight className="size-3" />
      </Button>
    </div>
  );
}
