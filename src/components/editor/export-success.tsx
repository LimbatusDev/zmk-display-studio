import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  getExportInstructions,
  type DownloadReceipt,
} from "@/lib/export-instructions";
import { useEditorStore } from "@/store/editor-store";
import { ExportConfetti } from "./export-confetti";

export function ExportSuccess({
  receipt,
  celebrate,
  onBack,
  onDone,
}: {
  receipt: DownloadReceipt;
  celebrate: boolean;
  onBack: () => void;
  onDone: () => void;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  const showExportSuccess = useEditorStore((state) => state.showExportSuccess);
  const setShowExportSuccess = useEditorStore(
    (state) => state.setShowExportSuccess,
  );
  const instructions = getExportInstructions(receipt);

  useEffect(() => {
    title.current?.focus();
  }, []);

  return (
    <>
      <div className="relative -mx-6 -mt-6 overflow-hidden border-b bg-secondary px-6 pb-6 pt-8 sm:px-8">
        {celebrate && <ExportConfetti />}
        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
              <Check className="size-6" aria-hidden="true" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] text-primary uppercase">
              Pixels, packed and ready
            </span>
          </div>
          <DialogTitle
            ref={title}
            tabIndex={-1}
            className="mr-3 rounded-sm text-2xl font-medium leading-tight tracking-tight sm:text-3xl"
          >
            {celebrate
              ? "Congrats—your artwork is ready!"
              : "Let’s install your artwork."}
          </DialogTitle>
          <DialogDescription className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {celebrate
              ? "Your download has started. "
              : "Instructions for your last download. "}
            Here’s how to take those pixels from a file to your keyboard.
          </DialogDescription>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-md border px-4 py-3">
        <FileCheck2
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div className="min-w-0 text-xs">
          <p className="break-all font-mono font-medium">{receipt.filename}</p>
          <p className="mt-1 text-muted-foreground">
            {instructions.label}
            {instructions.experimental && (
              <span className="ml-2 font-medium text-primary">
                · Experimental
              </span>
            )}
          </p>
          <p className="mt-2 text-muted-foreground">
            Image symbol:{" "}
            <code className="break-all text-foreground">{receipt.symbol}</code>
          </p>
        </div>
      </div>

      <section aria-labelledby="export-install-heading" className="mt-7">
        <h3
          id="export-install-heading"
          className="text-base font-medium tracking-tight"
        >
          Install it on your keyboard
        </h3>
        <ol className="mt-5 space-y-5">
          {instructions.steps.map((step, index) => (
            <li key={step.title} className="flex gap-3 sm:gap-4">
              <span
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border bg-secondary font-mono text-[10px] text-primary"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium">{step.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {step.code && (
                  <pre
                    tabIndex={0}
                    aria-label={`${step.title} code`}
                    className="code-preview mt-3 overflow-x-auto rounded-sm bg-code-surface p-3 font-mono text-[11px] leading-relaxed text-code-foreground"
                  >
                    <code>{step.code}</code>
                  </pre>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 border-l-2 border-primary/50 pl-4 text-xs leading-relaxed text-muted-foreground">
          {instructions.note}
        </p>
        <Link
          href={instructions.guideHref}
          onClick={onDone}
          className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-medium text-primary underline underline-offset-4 hover:decoration-2"
        >
          Read the full installation guide{" "}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </section>

      <div className="mt-5 border-t pt-4">
        <label className="flex min-h-9 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={!showExportSuccess}
            onChange={(event) => setShowExportSuccess(!event.target.checked)}
            className="size-3.5 shrink-0 accent-primary"
            aria-describedby="export-success-preference-help"
          />
          Don’t show this again
        </label>
        <p
          id="export-success-preference-help"
          className="ml-5.5 text-[11px] leading-relaxed text-muted-foreground"
        >
          Applies to all downloads in this browser. You can still open
          installation steps after exporting.
        </p>
        <div className="mt-5 flex flex-wrap justify-between gap-3">
          <Button variant="ghost" className="min-h-10" onClick={onBack}>
            <ArrowLeft /> Back to export
          </Button>
          <Button className="min-h-10 px-6" onClick={onDone}>
            Done <Check />
          </Button>
        </div>
      </div>
    </>
  );
}
