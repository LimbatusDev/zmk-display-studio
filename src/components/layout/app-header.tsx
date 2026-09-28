import Link from "next/link";
import { SiteNavigation } from "./site-navigation";

export function AppHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-6 px-5 sm:px-8 lg:min-h-19 lg:flex-nowrap">
        <Link
          href="/"
          className="flex min-h-17 shrink-0 items-center gap-3"
          title="ZMK Display Studio home"
        >
          <span className="pixel-logo" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            ZMK{" "}
            <span className="font-normal text-muted-foreground">
              Display Studio
            </span>
          </span>
          <span className="hidden rounded-full border border-primary/15 bg-highlight px-1.5 py-0.5 font-mono text-[9px] text-primary sm:block">
            BETA
          </span>
        </Link>
        <SiteNavigation />
      </div>
    </header>
  );
}
