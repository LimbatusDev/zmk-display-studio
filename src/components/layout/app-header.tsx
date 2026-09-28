import Link from "next/link";
import { SiteNavigation } from "./site-navigation";
import { HeaderActions } from "./header-actions";

export function AppHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-5 sm:px-8 xl:min-h-19 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-x-6">
        <Link
          href="/"
          className="flex min-h-17 items-center gap-2 justify-self-start sm:gap-3"
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
            <span className="sr-only font-normal text-muted-foreground sm:not-sr-only">
              Display Studio
            </span>
          </span>
          <span className="hidden rounded-full border border-primary/15 bg-highlight px-1.5 py-0.5 font-mono text-[9px] text-highlight-foreground sm:block">
            BETA
          </span>
        </Link>
        <SiteNavigation />
        <HeaderActions />
      </div>
    </header>
  );
}
