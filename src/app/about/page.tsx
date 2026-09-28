import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/layout/content-page";
import { DisplayGeometry } from "@/components/layout/display-geometry";
import { niceView } from "@/lib/displays/nice-view";
import { pageMetadata } from "@/lib/page-metadata";
import { infoPages } from "@/lib/site";

export const metadata = pageMetadata(infoPages.about);

const sections = [
  { id: "a-personal-touch", title: "A personal touch" },
  { id: "built-for-nice-view", title: "Built for nice!view" },
  { id: "local-by-design", title: "Local by design" },
  { id: "community", title: "Part of the community" },
];

export default function AboutPage() {
  return (
    <ContentPage
      page={infoPages.about}
      title={
        <>
          Small display.
          <br />
          <span className="text-primary">Your expression.</span>
        </>
      }
      introduction="You chose your switches, your keycaps, your layout. Your keyboard’s display deserves a little personality, too."
      sections={sections}
    >
      <ContentSection {...sections[0]}>
        <p>
          ZMK Display Studio turns an image into monochrome artwork for your
          keyboard. Compose a crop, find the right balance of black and white,
          and take the result into your ZMK firmware.
        </p>
        <p>
          The idea is simple: spend more time making something you like and less
          time converting pixels into C arrays. The editor handles image
          processing, framebuffer rotation, and LVGL encoding while you decide
          how it should look.
        </p>
        <p>
          It’s free to use, with no account required. A logo, a tiny landscape,
          a familiar character: start with something that makes the keyboard
          feel like yours.
        </p>
      </ContentSection>
      <ContentSection {...sections[1]}>
        <p>
          The first supported display is <strong>nice!view</strong>, in its
          usual portrait mounting on a split keyboard. The full display is{" "}
          {niceView.physical.width} × {niceView.physical.height} pixels; your
          canvas is the {niceView.artwork.physical.width} ×{" "}
          {niceView.artwork.physical.height} artwork area below the status
          strip.
        </p>
        <DisplayGeometry />
        <p>
          Artwork customization targets the <strong>peripheral half</strong>.
          The central-side layout and other display models are not currently
          supported. The battery and connection strip in the preview is
          simulated; it is not part of the exported image.
        </p>
        <p>
          Exports target ZMK’s LVGL 9 implementation. See the{" "}
          <Link href="/export-guide#compatibility">compatibility notes</Link>{" "}
          before integrating artwork into a firmware build.
        </p>
      </ContentSection>
      <ContentSection {...sections[2]}>
        <p>
          Your images stay in your browser. Cropping, monochrome processing, C
          generation, and ZIP creation all happen on your device.
        </p>
        <p>
          Only processing, preview, export-help, and color-theme preferences are
          saved between visits. Your working image and composition stay in
          memory while you move around the site in the same tab. Read the{" "}
          <Link href="/privacy">privacy page</Link> for the details.
        </p>
      </ContentSection>
      <ContentSection {...sections[3]}>
        <p>
          This is independent community tooling, built for people who enjoy
          making their keyboards their own. It is not affiliated with ZMK or
          nice!keyboards.
        </p>
        <p>
          The firmware integrations build on ZMK’s existing nice!view support.
          ZMK-derived export files retain their MIT attribution and include the
          relevant upstream license.
        </p>
        <p>
          New to the editor? Follow <Link href="/how-to-use">How to Use</Link>.
          For keyboard setup and firmware concepts, visit the{" "}
          <a href="https://zmk.dev/docs">ZMK documentation</a>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
