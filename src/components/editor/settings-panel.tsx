import { ChevronDown, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { displays, getArtworkArea, getDisplay } from "@/lib/displays/registry";
import { useEditorStore } from "@/store/editor-store";
import { processingLabels, type ProcessingMode } from "@/types/editor";
import { RangeControl } from "./range-control";

const displayOptions = displays.map(({ id, name }) => ({
  value: id,
  label: name,
}));
const processingModes = Object.keys(processingLabels) as ProcessingMode[];

export function SettingsPanel() {
  const state = useEditorStore();
  const display = getDisplay(state.displayId);
  const area = getArtworkArea(state.displayId, state.artworkAreaId);
  return (
    <div className="divide-y">
      <section className="space-y-4 p-5">
        <Label className="text-xs" htmlFor="display">
          Display
        </Label>
        <Select
          items={displayOptions}
          value={state.displayId}
          onValueChange={(value) => {
            if (value !== null) state.setDisplay(value);
          }}
        >
          <SelectTrigger id="display" className="w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {displayOptions.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="text-xs"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <dl className="grid grid-cols-2 gap-y-2 text-[11px]">
          <dt className="text-muted-foreground">Physical display</dt>
          <dd className="text-right font-mono">
            {display.physical.width} × {display.physical.height}
          </dd>
          <dt className="text-muted-foreground">Artwork area</dt>
          <dd className="text-right font-mono">
            {area.physical.width} × {area.physical.height}
          </dd>
          <dt className="text-muted-foreground">Color depth</dt>
          <dd className="text-right font-mono">
            {display.colorDepth}-bit / monochrome
          </dd>
        </dl>
        <Collapsible className="text-[10px] text-muted-foreground">
          <CollapsibleTrigger className="group flex min-h-8 items-center gap-1.5 rounded-sm text-left hover:text-foreground">
            <ChevronDown
              className="size-3 shrink-0 transition-transform group-data-panel-open:rotate-180"
              aria-hidden="true"
            />
            ZMK framebuffer dimensions
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="pt-2 font-mono">
              Display: {display.framebuffer.width} ×{" "}
              {display.framebuffer.height}
              <br />
              Artwork: {area.framebuffer.width} × {area.framebuffer.height}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </section>
      <section className="space-y-5 p-5">
        <fieldset>
          <legend id="processing-label" className="mb-3 text-xs font-medium">
            Processing
          </legend>
          <RadioGroup
            name="processing"
            value={state.processingMode}
            onValueChange={(value) => {
              const mode = processingModes.find((mode) => mode === value);
              if (mode) state.setProcessing({ processingMode: mode });
            }}
            aria-labelledby="processing-label"
            aria-describedby="processing-help"
            className="gap-1"
          >
            {processingModes.map((mode) => (
              <Label
                key={mode}
                htmlFor={`processing-${mode}`}
                className="min-h-9 cursor-pointer gap-2.5 rounded-sm px-2 py-2 text-xs font-normal leading-normal hover:bg-muted has-data-checked:bg-secondary"
              >
                <RadioGroupItem id={`processing-${mode}`} value={mode} />
                {processingLabels[mode]}
                {mode === "floyd-steinberg" && (
                  <span className="ml-auto font-mono text-[8px] text-muted-foreground">
                    CLASSIC
                  </span>
                )}
              </Label>
            ))}
          </RadioGroup>
          <p
            id="processing-help"
            className="mt-3 flex gap-1.5 text-[10px] leading-relaxed text-muted-foreground"
          >
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
        <div className="flex min-h-8 items-center justify-between gap-3">
          <Label htmlFor="invert-colors" className="cursor-pointer text-xs">
            Invert colors
          </Label>
          <Switch
            id="invert-colors"
            checked={state.inverted}
            onCheckedChange={(inverted) => state.setProcessing({ inverted })}
          />
        </div>
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
