import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <details className="mt-3 text-[10px] text-muted-foreground">
        <summary className="cursor-pointer">
          ZIP contents · {Object.keys(files).length} files
        </summary>
        <ul className="mt-2 space-y-1 overflow-x-auto font-mono">
          {Object.keys(files)
            .sort()
            .map((file) => (
              <li key={file}>{file}</li>
            ))}
        </ul>
      </details>
    </>
  );
}
