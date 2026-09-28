import type { Metadata } from "next";
import { site, type InfoPage } from "./site.ts";

export function pageMetadata(page: InfoPage): Metadata {
  const title = `${page.title} | ${site.name}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.href },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      url: page.href,
      title,
      description: page.description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
    },
  };
}
