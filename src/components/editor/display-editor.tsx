"use client";

import { useState } from "react";
import { ChevronDown, Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/image/image-loader";
import { getDisplay } from "@/lib/displays/registry";
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
  const displayId = useEditorStore((state) => state.displayId);
  const display = getDisplay(displayId);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

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
          <span className="technical-badge">{display.name}</span>
          <span className="technical-badge">{display.colorDepth}-bit</span>
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
        <aside aria-label="Image editor" className="source-panel">
          <div className="panel-heading">
            <span>
              <span className="section-number">01</span> Image editor
            </span>
          </div>
          <div className="space-y-6 p-5">
            <ImageUploader
              choose={choose}
              upload={upload}
              clear={clear}
              busy={busy}
              error={error}
              sourceRgba={pipeline.sourceRgba}
              physicalSize={pipeline.area.physical}
            />
            <div className="border-t pt-5">
              <EditorToolbar />
            </div>
          </div>
        </aside>
        <section aria-label="Display preview" className="preview-panel">
          <div className="panel-heading flex-wrap gap-3">
            <span className="hidden 2xl:inline">
              <span className="section-number">02</span> Preview
            </span>
            <PreviewTabs />
          </div>
          <div className="preview-workspace flex min-h-100 flex-1 flex-col">
            {pipeline.error ? (
              <p className="m-5 text-sm text-destructive" role="alert">
                {pipeline.error}
              </p>
            ) : pipeline.physicalBitmap &&
              pipeline.framebufferBitmap &&
              pipeline.sourceRgba ? (
              <DisplayPreview
                physicalBitmap={pipeline.physicalBitmap}
                framebufferBitmap={pipeline.framebufferBitmap}
                source={pipeline.sourceRgba}
              />
            ) : (
              <EmptyState choose={choose} sample={sample} busy={busy} />
            )}
          </div>
          <div className="flex min-h-11 items-center justify-between gap-2 border-t bg-card px-4 py-2 font-mono text-[9px] text-muted-foreground">
            <span>
              {mode === "framebuffer" ? "Framebuffer" : "Artwork"}{" "}
              {
                pipeline.area[
                  mode === "framebuffer" ? "framebuffer" : "physical"
                ].width
              }{" "}
              ×{" "}
              {
                pipeline.area[
                  mode === "framebuffer" ? "framebuffer" : "physical"
                ].height
              }{" "}
              px
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
            {pipeline.physicalBitmap
              ? "Your artwork is ready. Preview the code before downloading."
              : "Start with an image. Leave with something that’s yours."}
          </p>
        </div>
        <Button
          className="h-10 min-w-32 gap-2 px-5"
          disabled={!pipeline.framebufferBitmap || busy}
          onClick={() => setExportOpen(true)}
        >
          <Download /> Export{" "}
          <span className="ml-1 opacity-60" aria-hidden="true">
            ↗
          </span>
        </Button>
      </div>
      {pipeline.framebufferBitmap && exportOpen && (
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          framebufferBitmap={pipeline.framebufferBitmap}
          display={display}
          settings={pipeline.settings}
        />
      )}
    </div>
  );
}
