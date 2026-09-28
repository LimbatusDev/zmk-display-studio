import { Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { displays, getArtworkArea, getDisplay } from "@/lib/displays/registry";
import { useEditorStore } from "@/store/editor-store";
import { processingLabels, type ProcessingMode } from "@/types/editor";
import { RangeControl } from "./range-control";

export function SettingsPanel() {
  const state = useEditorStore();
  const display = getDisplay(state.displayId);
  const area = getArtworkArea(state.displayId, state.artworkAreaId);
  return (
    <div className="divide-y">
      <section className="space-y-4 p-5">
        <label className="block text-xs font-medium" htmlFor="display">
          Display
        </label>
        <select
          id="display"
          className="field w-full"
          value={state.displayId}
          onChange={(event) => state.setDisplay(event.target.value)}
        >
          {displays.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <dl className="grid grid-cols-2 gap-y-2 text-[11px]">
          <dt className="text-muted-foreground">Display resolution</dt>
          <dd className="text-right font-mono">
            {display.width} × {display.height}
          </dd>
          <dt className="text-muted-foreground">Artwork area</dt>
          <dd className="text-right font-mono">
            {area.width} × {area.height}
          </dd>
          <dt className="text-muted-foreground">Color depth</dt>
          <dd className="text-right font-mono">
            {display.colorDepth}-bit / monochrome
          </dd>
        </dl>
      </section>
      <section className="space-y-5 p-5">
        <fieldset>
          <legend className="mb-3 text-xs font-medium">Processing</legend>
          <div className="space-y-1">
            {(Object.keys(processingLabels) as ProcessingMode[]).map((mode) => (
              <label
                key={mode}
                className={`flex cursor-pointer items-center gap-2.5 rounded px-2 py-2 text-xs ${state.processingMode === mode ? "bg-secondary" : "hover:bg-muted"}`}
              >
                <input
                  type="radio"
                  name="processing"
                  value={mode}
                  checked={state.processingMode === mode}
                  onChange={() => state.setProcessing({ processingMode: mode })}
                  className="accent-primary"
                />
                {processingLabels[mode]}
                {mode === "floyd-steinberg" && (
                  <span className="ml-auto font-mono text-[8px] text-muted-foreground">
                    CLASSIC
                  </span>
                )}
              </label>
            ))}
          </div>
          <p className="mt-3 flex gap-1.5 text-[10px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-3 shrink-0" />
            {state.processingMode === "threshold"
              ? "A crisp cutoff. Best for logos and line art."
              : state.processingMode === "atkinson"
                ? "Airier dots and stronger contrast. A retro classic."
                : "Fine dot patterns preserve shading and detail."}
          </p>
        </fieldset>
        {state.processingMode === "threshold" && (
          <RangeControl
            label="Threshold"
            min={0}
            max={255}
            value={state.threshold}
            onChange={(threshold) => state.setProcessing({ threshold })}
          />
        )}
        <RangeControl
          label="Brightness"
          min={-100}
          max={100}
          value={state.brightness}
          onChange={(brightness) => state.setProcessing({ brightness })}
        />
        <RangeControl
          label="Contrast"
          min={-100}
          max={100}
          value={state.contrast}
          onChange={(contrast) => state.setProcessing({ contrast })}
        />
        <label className="flex cursor-pointer items-center justify-between text-xs font-medium">
          Invert colors
          <input
            type="checkbox"
            role="switch"
            checked={state.inverted}
            onChange={(event) =>
              state.setProcessing({ inverted: event.target.checked })
            }
            className="toggle"
          />
        </label>
        <Button
          className="text-muted-foreground"
          variant="ghost"
          size="sm"
          onClick={state.resetProcessing}
        >
          <RotateCcw /> Reset adjustments
        </Button>
      </section>
    </div>
  );
}
