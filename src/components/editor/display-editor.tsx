"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectPreferences, useEditorStore } from "@/store/editor-store";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/image/image-loader";
import { ImageUploader } from "./image-uploader";
import { EditorToolbar } from "./editor-toolbar";
import { SettingsPanel } from "./settings-panel";
import { EmptyState } from "./empty-state";
import { DisplayPreview, PreviewTabs } from "./display-preview";
import { useImagePipeline } from "./use-image-pipeline";
import { useImageUpload } from "./use-image-upload";
import { ExportDialog } from "./export-dialog";

export function DisplayEditor() {
  const { inputRef, upload, clear, choose, sample, busy, error } =
    useImageUpload();
  const pipeline = useImagePipeline();
  const showGrid = useEditorStore((state) => state.showPixelGrid);
  const mode = useEditorStore((state) => state.previewMode);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  useEffect(connectPreferences, []);

  return (
    <div className="editor-shell">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-label="Choose source image"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b bg-card px-5 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="font-medium">WORKSPACE</span>
          <span className="text-border">/</span>
          <span className="text-muted-foreground">Peripheral artwork</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="technical-badge">nice!view</span>
          <span className="technical-badge">1-bit</span>
          <Button
            className="lg:hidden"
            size="sm"
            variant="ghost"
            onClick={() => setSettingsOpen(!settingsOpen)}
            aria-expanded={settingsOpen}
            aria-controls="editor-settings"
          >
            <SlidersHorizontal /> Settings{" "}
            <ChevronDown className={settingsOpen ? "rotate-180" : ""} />
          </Button>
        </div>
      </div>
      <div className="editor-columns">
        <aside aria-label="Source image" className="source-panel">
          <div className="panel-heading">
            <span>
              <span className="section-number">01</span> Source image
            </span>
          </div>
          <div className="space-y-6 p-5">
            <ImageUploader
              choose={choose}
              upload={upload}
              clear={clear}
              busy={busy}
              error={error}
            />
            <div className="border-t pt-5">
              <EditorToolbar />
            </div>
          </div>
        </aside>
        <section aria-label="Display preview" className="preview-panel">
          <div className="panel-heading gap-3">
            <span className="hidden xl:inline">
              <span className="section-number">02</span> Preview
            </span>
            <PreviewTabs />
          </div>
          <div className="preview-workspace flex min-h-100 flex-1 flex-col">
            {pipeline.error ? (
              <p className="m-5 text-sm text-destructive" role="alert">
                {pipeline.error}
              </p>
            ) : pipeline.bitmap && pipeline.rgba ? (
              <DisplayPreview
                bitmap={pipeline.bitmap}
                source={pipeline.rgba}
                area={pipeline.area}
              />
            ) : (
              <EmptyState choose={choose} sample={sample} busy={busy} />
            )}
          </div>
          <div className="flex min-h-11 items-center justify-between gap-2 border-t bg-card px-4 py-2 font-mono text-[9px] text-muted-foreground">
            <span>
              {pipeline.area.width} × {pipeline.area.height} px{" "}
              <span className="mx-1">·</span>{" "}
              {pipeline.area.width * pipeline.area.height} pixels
            </span>
            <label
              className={`flex items-center gap-1.5 ${mode !== "pixels" ? "opacity-40" : "cursor-pointer"}`}
            >
              <input
                type="checkbox"
                checked={showGrid}
                disabled={mode !== "pixels"}
                onChange={(event) =>
                  useEditorStore
                    .getState()
                    .setShowPixelGrid(event.target.checked)
                }
                className="accent-primary"
              />
              Pixel grid
            </label>
          </div>
        </section>
        <aside
          id="editor-settings"
          aria-label="Display and processing settings"
          className={`settings-panel ${settingsOpen ? "settings-open" : ""}`}
        >
          <div className="panel-heading">
            <span>
              <span className="section-number">03</span> Adjustments
            </span>
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
          </div>
          <SettingsPanel />
        </aside>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t bg-card px-5 py-4">
        <div>
          <p className="text-xs font-medium">From pixels to firmware.</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {pipeline.bitmap
              ? "Your artwork is ready. Preview the code before downloading."
              : "Start with an image. Leave with something that’s yours."}
          </p>
        </div>
        <Button
          className="h-10 min-w-32 gap-2 px-5"
          disabled={!pipeline.bitmap || busy}
          onClick={() => setExportOpen(true)}
        >
          <Download /> Export{" "}
          <span className="ml-1 opacity-60" aria-hidden="true">
            ↗
          </span>
        </Button>
      </div>
      {pipeline.bitmap && (
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          bitmap={pipeline.bitmap}
          settings={pipeline.settings}
        />
      )}
    </div>
  );
}
