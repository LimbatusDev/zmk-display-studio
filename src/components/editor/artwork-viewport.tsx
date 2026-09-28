import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useEditorStore } from "@/store/editor-store";
import type { ImageTransform } from "@/types/editor";
import { ImageCanvas } from "./image-canvas";

/** Pointer and keyboard movement always use physical artwork pixels. */
export function ArtworkViewport({
  rgba,
  width,
  height,
  label,
  pixelated = true,
  descriptionId,
  children,
}: {
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  label: string;
  pixelated?: boolean;
  descriptionId?: string;
  children?: ReactNode;
}) {
  const start = useRef<{
    id: number;
    x: number;
    y: number;
    ratio: number;
    transform: ImageTransform;
  } | null>(null);
  const pending = useRef<Partial<ImageTransform> | null>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const flush = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (pending.current)
      useEditorStore.getState().setTransform(pending.current);
    pending.current = null;
  };
  const finish = () => {
    flush();
    start.current = null;
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || start.current) return;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      ratio: width / event.currentTarget.getBoundingClientRect().width,
      transform: useEditorStore.getState().transform,
    };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const initial = start.current;
    if (!initial || initial.id !== event.pointerId) return;
    pending.current = {
      offsetX:
        initial.transform.offsetX + (event.clientX - initial.x) * initial.ratio,
      offsetY:
        initial.transform.offsetY + (event.clientY - initial.y) * initial.ratio,
    };
    if (!frame.current) frame.current = requestAnimationFrame(flush);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    const state = useEditorStore.getState();
    const distance = event.shiftKey ? 10 : 1;
    state.setTransform({
      offsetX: state.transform.offsetX + delta[0] * distance,
      offsetY: state.transform.offsetY + delta[1] * distance,
    });
  };
  return (
    <div
      className="artwork-interaction relative touch-none cursor-grab active:cursor-grabbing"
      tabIndex={0}
      role="group"
      aria-label="Artwork position"
      aria-describedby={descriptionId}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      onLostPointerCapture={finish}
      onKeyDown={onKeyDown}
    >
      <ImageCanvas
        rgba={rgba}
        width={width}
        height={height}
        label={label}
        pixelated={pixelated}
      />
      {children}
    </div>
  );
}
