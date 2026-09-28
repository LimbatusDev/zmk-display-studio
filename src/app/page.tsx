import type { Metadata } from "next";
import { EditorGuide } from "@/components/layout/editor-guide";
import { DisplayEditor } from "@/components/editor/display-editor";
import { site } from "@/lib/site";
import { niceView } from "@/lib/displays/nice-view";

export const metadata: Metadata = {
  alternates: { canonical: site.url },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": `${site.url}#application`,
      url: site.url,
      name: site.name,
      description: site.description,
      applicationCategory: "DesignApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and a modern web browser.",
      isAccessibleForFree: true,
      inLanguage: "en",
      isPartOf: { "@id": `${site.url}#website` },
      featureList: [
        `${niceView.artwork.physical.width} × ${niceView.artwork.physical.height} pixel portrait nice!view artwork, automatically rotated for ZMK`,
        "PNG, JPEG, and WebP image conversion",
        "Threshold, Floyd–Steinberg, and Atkinson dithering",
        "LVGL 9 C image and ZMK customization ZIP export",
        "Local image processing with no uploads",
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1600px] flex-1 px-5 pt-8 sm:px-8 lg:pt-10"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              A little canvas. A lot of character.
            </p>
            <h1 className="text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
              Custom artwork for your{" "}
              <span className="text-primary">nice!view.</span>
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Turn an image into monochrome artwork for your ZMK keyboard.
              Adjust, preview, and export LVGL assets for free, right in your
              browser.
            </p>
          </div>
          <ol
            aria-label="Workflow"
            className="mb-1 flex flex-wrap items-center gap-3 font-mono text-[10px] text-muted-foreground sm:gap-5"
          >
            {["Upload", "Adjust", "Preview", "Export"].map((step, index) => (
              <li key={step} className="flex items-center gap-1.5">
                <span className="text-primary">0{index + 1}</span>
                {step}
                {index < 3 && (
                  <span className="ml-2 text-border" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
        <DisplayEditor />
        <EditorGuide />
      </main>
    </>
  );
}
