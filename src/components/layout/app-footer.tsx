import { LockKeyhole } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-[1600px] flex-col justify-between gap-3 px-5 py-6 text-[11px] text-muted-foreground sm:flex-row sm:px-8">
      <p className="flex items-center gap-1.5">
        <LockKeyhole className="size-3.5 shrink-0" /> Images are processed
        locally in your browser and are never uploaded.
      </p>
      <p className="font-mono">Made for the things you make.</p>
    </footer>
  );
}
