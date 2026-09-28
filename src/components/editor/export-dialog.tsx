import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Download,
  FileCode2,
  FolderArchive,
  LoaderCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import type { MonochromeBitmap } from "@/lib/image/bitmap";
import type { ProcessingSettings } from "@/types/editor";
import type { DisplayPreset, ExportTarget } from "@/lib/displays/types";
import { sanitizeCIdentifier } from "@/lib/generators/c-identifier";
import { getLvglImageLayout } from "@/lib/generators/lvgl-image";
import { generateNiceViewArtwork } from "@/lib/generators/nice-view-artwork";
import { generateZip } from "@/lib/generators/zip-generator";
import { downloadBlob } from "@/lib/generators/download";
import { niceViewGenerator } from "@/lib/generators/metadata";
import {
  createDownloadReceipt,
  type DownloadReceipt,
} from "@/lib/export-instructions";
import { ExportSuccess } from "./export-success";
import { ExportCodePreview } from "./export-code-preview";

type ExportView =
  | { step: "configure"; lastDownload: DownloadReceipt | null }
  | { step: "instructions"; receipt: DownloadReceipt; celebrate: boolean };

const targets: { id: ExportTarget; label: string; description: string }[] = [
  {
    id: "c-image",
    label: "C image only",
    description: "LVGL asset for your own widget.",
  },
  {
    id: "nice-view-artwork",
    label: "nice!view customization",
    description: "Replace artwork and the peripheral widget in a ZMK checkout.",
  },
  {
    id: "custom-shield",
    label: "Full custom shield",
    description:
      "Config/module shield reusing ZMK support sources. Experimental.",
  },
];

export function ExportDialog({
  open,
  onOpenChange,
  framebufferBitmap,
  display,
  settings,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  framebufferBitmap: MonochromeBitmap;
  display: DisplayPreset;
  settings: ProcessingSettings;
}) {
  const name = useEditorStore((state) => state.artworkName);
  const setName = useEditorStore((state) => state.setArtworkName);
  const [target, setTarget] = useState<ExportTarget>("nice-view-artwork");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<ExportView>({
    step: "configure",
    lastDownload: null,
  });
  const exportTitle = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (view.step === "configure") exportTitle.current?.focus();
  }, [view.step]);
  const symbol = sanitizeCIdentifier(name);
  const layout = getLvglImageLayout(display.artwork.framebuffer);
  const generated = useMemo(() => {
    if (!symbol)
      return {
        code: "",
        files: {},
        error: "Enter a name with at least one letter or number.",
      };
    try {
      const files = generateNiceViewArtwork(
        framebufferBitmap,
        symbol,
        target,
        settings,
      );
      const code = Object.entries(files).find(
        ([path]) => path === "art.c" || path.endsWith("/widgets/art.c"),
      )?.[1];
      if (!code) throw new Error("The export package is missing its artwork.");
      return {
        code,
        files,
        error: "",
      };
    } catch (cause) {
      return {
        code: "",
        files: {},
        error:
          cause instanceof Error
            ? cause.message
            : "Could not generate artwork.",
      };
    }
  }, [framebufferBitmap, symbol, target, settings]);

  const perform = async (action: "copy" | "c" | "zip") => {
    if (busy || generated.error) return;
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (action === "copy") {
        await navigator.clipboard.writeText(generated.code);
        setMessage("C code copied to clipboard.");
      } else {
        const receipt = createDownloadReceipt(action, target, symbol);
        const blob =
          action === "c"
            ? new Blob([generated.code], { type: "text/plain;charset=utf-8" })
            : new Blob([new Uint8Array(await generateZip(generated.files))], {
                type: "application/zip",
              });
        downloadBlob(blob, receipt.filename);
        setMessage(`${receipt.filename} download started.`);
        setView(
          useEditorStore.getState().showExportSuccess
            ? { step: "instructions", receipt, celebrate: true }
            : { step: "configure", lastDownload: receipt },
        );
      }
    } catch (cause) {
      setError(
        action === "copy"
          ? "Clipboard access was unavailable. Select the code below to copy it, or download art.c."
          : cause instanceof Error
            ? cause.message
            : "Export failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {view.step === "instructions" ? (
          <ExportSuccess
            receipt={view.receipt}
            celebrate={view.celebrate}
            onBack={() =>
              setView({ step: "configure", lastDownload: view.receipt })
            }
            onDone={() => onOpenChange(false)}
          />
        ) : (
          <>
            <div className="mb-1 flex items-center gap-2 text-primary">
              <FileCode2 className="size-5" />
              <span className="font-mono text-[10px] tracking-widest">
                PIXELS → FIRMWARE
              </span>
            </div>
            <DialogTitle
              ref={exportTitle}
              tabIndex={-1}
              className="mt-3 rounded-sm text-2xl font-medium tracking-tight"
            >
              Take your artwork with you.
            </DialogTitle>
            <DialogDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Physical artwork: {display.artwork.physical.width}×
              {display.artwork.physical.height}. Encoded artwork:{" "}
              {display.artwork.framebuffer.width}×
              {display.artwork.framebuffer.height}.{" "}
              {layout.dataSize.toLocaleString("en-US")} bytes. Generated locally
              for ZMK’s LVGL 9 implementation.
            </DialogDescription>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="artwork-name" className="text-xs font-medium">
                  Artwork name
                </label>
                <input
                  id="artwork-name"
                  className="field w-full font-mono"
                  maxLength={100}
                  value={name}
                  disabled={busy}
                  onChange={(event) => {
                    setName(event.target.value);
                    setMessage("");
                  }}
                  aria-invalid={!symbol}
                  aria-describedby="artwork-symbol"
                />
                <p
                  id="artwork-symbol"
                  className="text-[10px] text-muted-foreground"
                >
                  C symbol:{" "}
                  <code className="text-foreground">
                    {symbol || "Enter a valid name"}
                  </code>
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="export-target" className="text-xs font-medium">
                  ZIP package
                </label>
                <select
                  id="export-target"
                  className="field w-full"
                  value={target}
                  disabled={busy}
                  onChange={(event) =>
                    setTarget(event.target.value as ExportTarget)
                  }
                >
                  {targets.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                      {item.id === "custom-shield" ? " · Experimental" : ""}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  {targets.find((item) => item.id === target)?.description}
                </p>
              </div>
            </div>
            <ExportCodePreview
              code={generated.code}
              files={generated.files}
              disabled={busy || !!generated.error}
              onCopy={() => void perform("copy")}
            />
            <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
              Target: ZMK main{" "}
              <code>{niceViewGenerator.zmkRevision.slice(0, 8)}</code> ·{" "}
              {niceViewGenerator.id} v{niceViewGenerator.version}. Follow the
              included README and rebuild firmware for your keyboard.
            </p>
            {(error || generated.error) && (
              <p role="alert" className="mt-3 text-xs text-destructive">
                {error || generated.error}
              </p>
            )}
            <p
              role="status"
              className="mt-3 flex min-h-4 items-center gap-1.5 text-xs text-success"
            >
              {message && (
                <>
                  <Check className="size-3.5" />
                  {message}
                </>
              )}
            </p>
            {view.lastDownload && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Button
                  variant="link"
                  size="sm"
                  className="min-h-9 px-0"
                  disabled={busy}
                  onClick={() => {
                    if (view.lastDownload)
                      setView({
                        step: "instructions",
                        receipt: view.lastDownload,
                        celebrate: false,
                      });
                  }}
                >
                  View installation steps
                </Button>
                <span className="break-all text-[10px] text-muted-foreground">
                  Last download: {view.lastDownload.filename}
                </span>
              </div>
            )}
            <div className="mt-4 flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                className="h-9"
                variant="outline"
                disabled={busy || !!generated.error}
                onClick={() => void perform("c")}
              >
                <Download /> Download art.c
              </Button>
              <Button
                className="h-9 px-4"
                disabled={busy || !!generated.error}
                onClick={() => void perform("zip")}
              >
                {busy ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <FolderArchive />
                )}{" "}
                Download ZIP
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
