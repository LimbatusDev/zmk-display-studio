"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";
import { Label } from "@/components/ui/label";

function Slider<Value extends number | readonly number[]>({
  className,
  children,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbProps,
  ...props
}: SliderPrimitive.Root.Props<Value> & {
  thumbProps?: SliderPrimitive.Thumb.Props;
}) {
  const currentValue = value ?? defaultValue ?? [min, max];
  const values = Array.isArray(currentValue) ? currentValue : [currentValue];

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      {children}
      <SliderPrimitive.Control className="relative flex min-h-5 w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className="relative block size-3.5 shrink-0 rounded-full border border-ring bg-card ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 has-focus-visible:ring-3 active:ring-3 data-disabled:pointer-events-none data-disabled:opacity-50"
            {...thumbProps}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

function SliderLabel(props: SliderPrimitive.Label.Props) {
  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      render={<Label />}
      {...props}
    />
  );
}

function SliderValue(props: SliderPrimitive.Value.Props) {
  return <SliderPrimitive.Value data-slot="slider-value" {...props} />;
}

export { Slider, SliderLabel, SliderValue };
