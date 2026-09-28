import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ContentPage, ContentSection } from "@/components/layout/content-page";
import { niceView } from "@/lib/displays/nice-view";
import { pageMetadata } from "@/lib/page-metadata";
import { infoPages } from "@/lib/site";

export const metadata = pageMetadata(infoPages.faq);

const { artwork, physical, statusArea } = niceView;
const groups = [
  {
    id: "getting-started",
    title: "Getting started",
    questions: [
      {
        question: "Is it free? Do I need an account?",
        answer: (
          <>
            Yes, the editor is free to use and requires no account. Open an
            image or try the built-in sample. The{" "}
            <Link href="/how-to-use">step-by-step guide</Link> walks through the
            controls.
          </>
        ),
      },
      {
        question: "Which displays and keyboard halves are supported?",
        answer: (
          <>
            Currently, nice!view peripheral artwork on split ZMK keyboards is
            supported. Central-side custom layouts and other display models are
            not supported.
          </>
        ),
      },
      {
        question: "Which image files can I use?",
        answer: (
          <>
            PNG, JPEG, and WebP up to 10 MB, 40 megapixels, and 16,384 pixels
            per side. SVG and animated artwork are not supported. An animated
            raster source uses the browser-decoded frame, not an animation.
          </>
        ),
      },
      {
        question: "Are my images uploaded anywhere?",
        answer: (
          <>
            No. Image decoding, processing, and C/ZIP generation happen in your
            browser. See <Link href="/privacy">Privacy</Link> for what stays in
            memory and which preferences are saved.
          </>
        ),
      },
    ],
  },
  {
    id: "artwork-and-previews",
    title: "Artwork and previews",
    questions: [
      {
        question: "What size should my artwork be?",
        answer: (
          <>
            The editor’s artwork area is {artwork.physical.width} ×{" "}
            {artwork.physical.height} pixels, below a{" "}
            {statusArea.physical.width} × {statusArea.physical.height} status
            strip on the {physical.width} × {physical.height} display. Your
            source image can be larger: pan and zoom to compose the crop.
          </>
        ),
      },
      {
        question: "Why does the export say 140 × 68 instead of 68 × 140?",
        answer: (
          <>
            ZMK uses a rotated framebuffer. The editor processes your portrait
            artwork first, then rotates the finished pixels {physical.rotation}°
            clockwise into {artwork.framebuffer.width} ×{" "}
            {artwork.framebuffer.height} artwork. This is expected; do not
            rotate your source to compensate. See the{" "}
            <Link href="/how-to-use#compose">orientation diagram</Link>.
          </>
        ),
      },
      {
        question: "Will the battery and connection strip be exported?",
        answer: (
          <>
            No. The strip in Physical preview is simulated and excluded from the
            image. The nice!view customization package retains the upstream
            battery and connection behavior in the peripheral widget.
          </>
        ),
      },
      {
        question: "Which processing mode should I choose?",
        answer: (
          <>
            Try Threshold for logos and line art, Floyd–Steinberg for detailed
            shading, or Atkinson for airier dots and stronger contrast.
            Brightness and contrast affect all three. The threshold setting
            affects only Threshold mode.
          </>
        ),
      },
      {
        question: "Why are transparent areas white?",
        answer: (
          <>
            The display artwork is opaque black and white. Transparent pixels
            and uncovered crop space are composited onto white before
            brightness, contrast, dithering, and inversion are applied.
          </>
        ),
      },
      {
        question: "Why can’t I see the pixel grid?",
        answer: (
          <>
            The grid is available only in Pixels preview and appears at 3×
            enlargement or above. Enable Pixel grid and enlarge the preview
            window if it is currently below 3×.
          </>
        ),
      },
    ],
  },
  {
    id: "saving-and-exporting",
    title: "Saving and exporting",
    questions: [
      {
        question: "Can I read a guide without losing my work?",
        answer: (
          <>
            Yes. Use the site links in the same tab to leave the editor and
            return with your image and composition intact. They stay in memory,
            not in a saved project. Reloading or closing the tab clears the
            artwork; only processing, preview, export-help, and color-theme
            preferences are saved between visits.
          </>
        ),
      },
      {
        question: "Can I replace the stock balloon and mountain artwork?",
        answer: (
          <>
            Yes. Choose the nice!view customization ZIP. It contains both
            artwork and a replacement peripheral widget. A C image alone does
            not replace the stock widget, which references its own image
            symbols. Follow the{" "}
            <Link href="/export-guide#nice-view-customization">
              installation instructions
            </Link>
            .
          </>
        ),
      },
      {
        question: "Can I drop art.c into my ordinary ZMK config folder?",
        answer: (
          <>
            Not by itself. The file must be compiled and referenced by a widget.
            The customization package changes source files in a ZMK checkout or
            fork; the experimental custom shield has its own module integration.
            The <Link href="/export-guide">Export Guide</Link> explains each
            option.
          </>
        ),
      },
      {
        question: "Does this work with older ZMK or LVGL 8 builds?",
        answer: (
          <>
            Exports target the inspected LVGL 9-based ZMK revision, not older
            LVGL 8 APIs. Future ZMK updates may also require integration
            changes. Check the{" "}
            <Link href="/export-guide#compatibility">
              pinned revisions and compatibility notes
            </Link>
            .
          </>
        ),
      },
      {
        question: "Why isn’t copying C code working?",
        answer: (
          <>
            Clipboard access needs HTTPS or localhost and browser permission.
            You can select the code manually or use Download art.c instead.
          </>
        ),
      },
      {
        question: "Will the preview look exactly like my screen?",
        answer: (
          <>
            It shows the generated monochrome pixels, but the physical display’s
            appearance can differ. Browser image decoding and resampling can
            also vary slightly. A full firmware build and physical nice!view
            validation have not been performed for this tool; the full custom
            shield remains experimental.
          </>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <ContentPage
      page={infoPages.faq}
      title={
        <>
          Small questions.
          <br />
          <span className="text-primary">Clear answers.</span>
        </>
      }
      introduction="A few things worth knowing before you compose, export, and flash. Start with a topic below."
      sections={groups}
    >
      {groups.map(({ id, title, questions }) => (
        <ContentSection key={id} id={id} title={title}>
          <div className="divide-y border-y">
            {questions.map(({ question, answer }) => (
              <details key={question} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 py-3 text-sm font-medium text-foreground hover:text-primary [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown
                    className="size-4 shrink-0 text-primary transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-5 pr-6 text-sm leading-relaxed">{answer}</p>
              </details>
            ))}
          </div>
        </ContentSection>
      ))}
    </ContentPage>
  );
}
