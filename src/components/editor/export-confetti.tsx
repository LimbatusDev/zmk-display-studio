import type { CSSProperties } from "react";

const pieces = Array.from({ length: 24 }, (_, index) => ({
  id: `pixel-${index}`,
  style: {
    left: `${(index * 37) % 100}%`,
    animationDelay: `${(index % 6) * 65}ms`,
    "--confetti-drift": `${((index * 29) % 120) - 60}px`,
    "--confetti-turn": `${(index % 2 === 0 ? 1 : -1) * (180 + index * 17)}deg`,
  } as CSSProperties,
}));

export function ExportConfetti() {
  return (
    <div className="export-confetti" aria-hidden="true">
      {pieces.map(({ id, style }) => (
        <i key={id} style={style} />
      ))}
    </div>
  );
}
