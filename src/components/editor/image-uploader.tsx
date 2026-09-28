import { useEffect, useRef, useState } from "react";
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

interface ImageUploaderProps {
  choose: () => void;
  upload: (file: File) => Promise<void>;
  clear: () => void;
  busy: boolean;
  error: string | null;
}

export function ImageUploader({
  choose,
  upload,
  clear,
  busy,
  error,
}: ImageUploaderProps) {
  const source = useEditorStore((state) => state.sourceImage);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  useEffect(() => {
    if (!source || !canvas.current) return;
    const context = canvas.current.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, 360, 224);
    const scale = Math.min(360 / source.width, 224 / source.height);
    context.drawImage(
      source.element,
      (360 - source.width * scale) / 2,
      (224 - source.height * scale) / 2,
      source.width * scale,
      source.height * scale,
    );
  }, [source]);
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
            <canvas
              ref={canvas}
              width={360}
              height={224}
              className="source-thumbnail"
              aria-label={`Original image: ${source.name}`}
              role="img"
            />
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
            <span className="mb-4 rounded-md border bg-background p-3">
              {busy ? (
                <LoaderCircle className="size-5 animate-spin text-primary" />
              ) : (
                <ImagePlus className="size-5 text-muted-foreground" />
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
              {source.width} × {source.height} ·{" "}
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
