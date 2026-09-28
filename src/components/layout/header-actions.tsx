"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info } from "lucide-react";
import { infoPages, site } from "@/lib/site";
import { ThemeSelector } from "./theme-selector";

export function HeaderActions() {
  const pathname = usePathname();

  return (
    <div className="col-start-2 row-start-1 flex items-center gap-1 justify-self-end sm:gap-2 xl:col-start-3">
      <nav aria-label="Project navigation" className="flex items-center gap-1">
        <a
          href={site.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="header-action"
          aria-label="GitHub repository (opens in a new tab)"
          title="GitHub repository (opens in a new tab)"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.923c.563.104.768-.244.768-.542 0-.267-.01-.975-.016-1.913-3.13.68-3.79-1.508-3.79-1.508-.512-1.3-1.25-1.646-1.25-1.646-1.022-.7.078-.685.078-.685 1.13.08 1.725 1.16 1.725 1.16 1.005 1.724 2.636 1.226 3.279.938.103-.728.393-1.226.715-1.508-2.499-.284-5.126-1.25-5.126-5.562 0-1.229.439-2.234 1.16-3.021-.116-.284-.503-1.43.111-2.98 0 0 .945-.302 3.094 1.153A10.8 10.8 0 0 1 12 6.19a10.8 10.8 0 0 1 2.818.38c2.148-1.455 3.091-1.153 3.091-1.153.615 1.55.228 2.696.112 2.98.722.787 1.159 1.792 1.159 3.021 0 4.322-2.631 5.275-5.138 5.554.404.348.764 1.035.764 2.086 0 1.507-.014 2.723-.014 3.093 0 .301.203.65.774.54A11.25 11.25 0 0 0 12 .75Z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <Link
          href={infoPages.about.href}
          aria-current={pathname === infoPages.about.href ? "page" : undefined}
          className="header-action"
          title="About"
        >
          <Info className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">About</span>
        </Link>
      </nav>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
      <ThemeSelector />
    </div>
  );
}
