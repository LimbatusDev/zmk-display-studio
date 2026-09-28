import { ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function ExportCodePreview({
  code,
  files,
  disabled,
  onCopy,
}: {
  code: string;
  files: Record<string, string>;
  disabled: boolean;
  onCopy: () => void;
}) {
  return (
    <>
      <div className="mt-5 overflow-hidden rounded-md border">
        <div className="flex items-center justify-between border-b bg-secondary px-3 py-2">
          <div>
            <p className="text-[10px] font-medium">
              Generated ZMK/LVGL framebuffer output
            </p>
            <span className="font-mono text-[10px] text-muted-foreground">
              art.c
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={onCopy}
          >
            <Copy /> Copy C code
          </Button>
        </div>
        <pre
          className="code-preview max-h-64 overflow-auto bg-code-surface p-4 font-mono text-[10px] leading-relaxed text-code-foreground"
          tabIndex={0}
          aria-label="Generated ZMK/LVGL framebuffer output"
        >
          <code>
            {code || "/* Give your artwork a name to generate C code. */"}
          </code>
        </pre>
      </div>
      <Collapsible className="mt-3 text-[10px] text-muted-foreground">
        <CollapsibleTrigger className="group flex min-h-8 items-center gap-1.5 rounded-sm text-left hover:text-foreground">
          <ChevronDown
            className="size-3 shrink-0 transition-transform group-data-panel-open:rotate-180"
            aria-hidden="true"
          />
          ZIP contents · {Object.keys(files).length} files
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="space-y-1 overflow-x-auto pt-2 font-mono">
            {Object.keys(files)
              .sort()
              .map((file) => (
                <li key={file}>{file}</li>
              ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
