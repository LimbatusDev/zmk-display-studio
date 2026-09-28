import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider";

interface RangeControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formattedValue?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  formattedValue,
  onChange,
  disabled,
}: RangeControlProps) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onValueChange={onChange}
      thumbProps={{ "aria-valuetext": formattedValue }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-xs">
        <SliderLabel className="text-xs">{label}</SliderLabel>
        <SliderValue className="font-mono text-muted-foreground">
          {() => formattedValue ?? value}
        </SliderValue>
      </div>
    </Slider>
  );
}
