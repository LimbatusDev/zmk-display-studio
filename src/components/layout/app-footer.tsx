import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { infoPages } from "@/lib/site";

export function AppFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1600px] px-5 py-6 text-[11px] text-muted-foreground sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t pt-5">
        <Link
          href="/"
          className="font-medium text-foreground hover:text-primary"
        >
          ZMK Display Studio
        </Link>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {Object.values(infoPages).map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-9 items-center hover:text-primary hover:underline underline-offset-4"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row">
        <p className="flex items-center gap-1.5">
          <LockKeyhole className="size-3.5 shrink-0" /> Images are processed
          locally in your browser and are never uploaded.
        </p>
        <p className="font-mono">Made for the things you make.</p>
      </div>
    </footer>
  );
}
