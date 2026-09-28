import type { MetadataRoute } from "next";
import { infoPages, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    ...Object.values(infoPages).map(({ href }) => ({
      url: new URL(href, site.url).href,
    })),
  ];
}
