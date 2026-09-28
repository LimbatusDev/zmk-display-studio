import {
  Focus,
  Maximize,
  Minimize,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RangeControl } from "./range-control";
import { getArtworkArea } from "@/lib/displays/registry";
import { zoomBounds } from "@/lib/image/resize";
import { useEditorStore } from "@/store/editor-store";

export function EditorToolbar() {
  const state = useEditorStore();
  const bounds = state.sourceImage
    ? zoomBounds(
        state.sourceImage,
        getArtworkArea(state.displayId, state.artworkAreaId),
      )
    : { min: 0.1, max: 8, base: 1 };
  const disabled = !state.sourceImage;
  return (
    <fieldset disabled={disabled} className="space-y-5 disabled:opacity-45">
      <legend className="mb-4 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
        Composition
      </legend>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => state.fit("fit")}
          disabled={disabled}
          title="Show the entire image; uncovered pixels are white"
        >
          <Minimize /> Fit image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => state.fit("fill")}
          disabled={disabled}
          title="Cover the entire artwork area"
        >
          <Maximize /> Fill area
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={state.center}
          disabled={disabled}
        >
          <Focus /> Center
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => state.fit("fill")}
          disabled={disabled}
        >
          <RotateCcw /> Reset
        </Button>
      </div>
      <RangeControl
        label="Zoom"
        min={(bounds.min / bounds.base) * 100}
        max={800}
        step={1}
        value={(state.transform.scale / bounds.base) * 100}
        formattedValue={`${Math.round((state.transform.scale / bounds.base) * 100)}%`}
        onChange={(value) =>
          state.setTransform({ scale: (value / 100) * bounds.base })
        }
        disabled={disabled}
      />
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Zoom out"
          onClick={() =>
            state.setTransform({ scale: state.transform.scale / 1.2 })
          }
          disabled={disabled}
        >
          <ZoomOut />
        </Button>
        <span className="font-mono text-[10px] text-muted-foreground">
          100% = fill
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Zoom in"
          onClick={() =>
            state.setTransform({ scale: state.transform.scale * 1.2 })
          }
          disabled={disabled}
        >
          <ZoomIn />
        </Button>
      </div>
    </fieldset>
  );
}
