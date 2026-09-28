"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { infoPages } from "@/lib/site";

const links = [
  { href: "/", label: "Editor" },
  infoPages.howToUse,
  infoPages.exportGuide,
  infoPages.faq,
];

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="col-span-2 row-start-2 w-full border-t py-2 xl:col-span-1 xl:col-start-2 xl:row-start-1 xl:w-auto xl:justify-self-end xl:border-0 xl:py-0"
    >
      <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className="inline-flex min-h-10 items-center rounded-sm px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-primary aria-[current=page]:bg-highlight aria-[current=page]:font-medium aria-[current=page]:text-highlight-foreground sm:px-3"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
