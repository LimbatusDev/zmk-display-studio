import { useRef, useState } from "react";
import {
  FileImage,
  ImagePlus,
  Upload,
  X,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import type { Size } from "@/lib/displays/types";
import { ArtworkViewport } from "./artwork-viewport";

interface ImageUploaderProps {
  choose: () => void;
  upload: (file: File) => Promise<void>;
  clear: () => void;
  busy: boolean;
  error: string | null;
  sourceRgba: Uint8ClampedArray | null;
  physicalSize: Size;
}

export function ImageUploader({
  choose,
  upload,
  clear,
  busy,
  error,
  sourceRgba,
  physicalSize,
}: ImageUploaderProps) {
  const source = useEditorStore((state) => state.sourceImage);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  return (
    <div className="space-y-3">
      <div
        className={`upload-zone ${dragging ? "is-dragging" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current++;
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current--;
          if (dragDepth.current <= 0) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) void upload(file);
        }}
      >
        {source ? (
          <>
            <div className="px-3 pt-4 pb-3">
              {sourceRgba && (
                <div
                  className="mx-auto max-w-full overflow-hidden border"
                  style={{ width: physicalSize.width * 2 }}
                >
                  <ArtworkViewport
                    rgba={sourceRgba}
                    width={physicalSize.width}
                    height={physicalSize.height}
                    label={`Physical source crop: ${physicalSize.width} by ${physicalSize.height} pixels`}
                    pixelated={false}
                    descriptionId="crop-help"
                  />
                </div>
              )}
              <p className="mt-3 text-center font-mono text-[9px] text-muted-foreground">
                {physicalSize.width} × {physicalSize.height} physical crop
              </p>
              <p
                id="crop-help"
                className="mt-1 text-center text-[9px] text-muted-foreground"
              >
                Drag to position · Arrow keys to nudge
              </p>
            </div>
            <div className="flex gap-2 border-t p-2">
              <Button
                className="flex-1"
                variant="ghost"
                size="sm"
                onClick={choose}
                disabled={busy}
              >
                <Upload /> Replace image
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clear}
                aria-label="Clear image"
                title="Clear image"
              >
                <X />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex min-h-52 flex-col items-center justify-center px-3 py-6 text-center">
            <span className="mb-4 rounded-full border border-primary/15 bg-highlight p-3">
              {busy ? (
                <LoaderCircle className="size-5 animate-spin text-primary" />
              ) : (
                <ImagePlus className="size-5 text-primary" />
              )}
            </span>
            <p className="text-sm font-medium">
              {dragging
                ? "Drop to open"
                : busy
                  ? "Opening image…"
                  : "Drop an image here"}
            </p>
            <p className="my-2 text-xs text-muted-foreground">or</p>
            <Button
              variant="outline"
              size="sm"
              onClick={choose}
              disabled={busy}
            >
              Choose image <Upload className="ml-1" />
            </Button>
          </div>
        )}
      </div>
      {source ? (
        <div className="flex items-start gap-2 text-xs">
          <FileImage className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="truncate font-medium" title={source.name}>
              {source.name}
            </p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Original: {source.width} × {source.height} ·{" "}
              {(source.size / 1024).toFixed(0)} KB
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center font-mono text-[10px] text-muted-foreground">
          PNG, JPG, WEBP · UP TO 10 MB
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded border border-destructive/25 bg-destructive/5 p-2 text-xs leading-relaxed text-destructive"
        >
          {error}
        </p>
      )}
      <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-muted-foreground">
        <LockKeyhole className="mt-0.5 size-3 shrink-0" />
        Processed locally. Your image never leaves your browser.
      </p>
    </div>
  );
}
