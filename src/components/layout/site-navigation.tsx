"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { infoPages } from "@/lib/site";

const links = [
  { href: "/", label: "Editor" },
  infoPages.howToUse,
  infoPages.exportGuide,
  infoPages.faq,
  infoPages.about,
];

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="w-full border-t py-2 lg:w-auto lg:border-0 lg:py-0"
    >
      <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className="inline-flex min-h-10 items-center rounded-sm px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-primary aria-[current=page]:bg-highlight aria-[current=page]:font-medium aria-[current=page]:text-primary sm:px-3"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
