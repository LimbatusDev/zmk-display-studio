import { ArrowUpRight, Mountain, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  choose,
  sample,
  busy,
}: {
  choose: () => void;
  sample: () => Promise<void>;
  busy: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="empty-display mb-7" aria-hidden="true">
        <span className="empty-display-corner" />
        <Mountain className="size-18 stroke-[0.8]" />
        <span className="absolute right-3 bottom-3 font-mono text-[8px] tracking-widest">
          YOUR ART HERE
        </span>
      </div>
      <h2 className="max-w-64 text-lg font-medium leading-snug tracking-tight">
        Create custom artwork
        <br />
        for your ZMK display
      </h2>
      <p className="mt-3 max-w-68 text-xs leading-relaxed text-muted-foreground">
        Upload an image and preview exactly how it will look on your keyboard
        display.
      </p>
      <Button className="mt-6 h-9 px-4" onClick={choose} disabled={busy}>
        <Upload /> Choose image
      </Button>
      <Button
        className="mt-3 text-xs text-muted-foreground"
        variant="ghost"
        size="sm"
        onClick={() => void sample()}
        disabled={busy}
      >
        Or try a sample <ArrowUpRight className="size-3" />
      </Button>
    </div>
  );
}
