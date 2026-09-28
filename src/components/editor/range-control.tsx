import { useId } from "react";

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
  const id = useId();
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-muted-foreground">
          {formattedValue ?? value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-control"
      />
    </div>
  );
}
