import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/layout/content-page";
import { DisplayGeometry } from "@/components/layout/display-geometry";
import { pageMetadata } from "@/lib/page-metadata";
import { infoPages } from "@/lib/site";

export const metadata = pageMetadata(infoPages.howToUse);

const sections = [
  { id: "choose-an-image", title: "Choose an image" },
  { id: "compose", title: "Compose your crop" },
  { id: "adjust", title: "Find your monochrome style" },
  { id: "preview", title: "Check the previews" },
  { id: "export", title: "Export your artwork" },
];

export default function HowToUsePage() {
  return (
    <ContentPage
      page={infoPages.howToUse}
      title={
        <>
          From your image
          <br />
          <span className="text-primary">to your keyboard.</span>
        </>
      }
      introduction="Five steps from a source image to firmware-ready artwork. Try the built-in sample if you want to get a feel for the controls first."
      sections={sections}
    >
      <ContentSection {...sections[0]}>
        <p>
          Open the <Link href="/">editor</Link> and choose a PNG, JPEG, or WebP,
          drag a file onto the source area, or select{" "}
          <strong>Or try a sample</strong>. Images are opened locally in your
          browser.
        </p>
        <p>
          The file limit is <strong>10 MB</strong>, with a maximum of 40
          megapixels and 16,384 pixels on either side. SVG and animated artwork
          are not supported; animated raster sources use the browser-decoded
          frame.
        </p>
        <p>
          <strong>A useful starting point:</strong> pick a clear subject, bold
          silhouette, or uncluttered composition. Tiny text and subtle details
          can disappear on a small monochrome display. Transparent areas are
          composited onto white before processing.
        </p>
      </ContentSection>
      <ContentSection {...sections[1]}>
        <p>
          Compose in the portrait orientation you see on your keyboard. Drag the
          image to pan in the source editor or the Physical, Pixels, and Source
          previews.
        </p>
        <ul>
          <li>
            <strong>Fill area</strong> covers the canvas, cropping the edges
            when necessary. New images start this way.
          </li>
          <li>
            <strong>Fit image</strong> shows the entire image. Any uncovered
            space starts white.
          </li>
          <li>
            <strong>Center</strong> recenters the image without changing its
            zoom.
          </li>
          <li>
            <strong>Reset</strong> returns the composition to a centered fill.
          </li>
          <li>
            <strong>Zoom</strong> lets you crop more closely. The displayed 100%
            means “fill the artwork area.”
          </li>
        </ul>
        <p>
          For precise placement, focus the artwork with <kbd>Tab</kbd>, then use
          the <kbd>arrow keys</kbd> to move one physical pixel. Hold{" "}
          <kbd>Shift</kbd> to move 10 pixels at a time.
        </p>
        <DisplayGeometry />
      </ContentSection>
      <ContentSection {...sections[2]}>
        <p>
          Use the Adjustments panel to choose a processing method. On smaller
          screens, open <strong>Settings</strong> in the workspace toolbar.
        </p>
        <h3>Threshold — clean edges</h3>
        <p>
          Turns each pixel black or white using a single cutoff. Start here for
          logos, line art, and strong shapes. Adjust the Threshold slider to
          change that cutoff.
        </p>
        <h3>Floyd–Steinberg — more shading</h3>
        <p>
          Uses fine dot patterns to suggest gray tones. It’s the default and a
          useful starting point for photographs and detailed illustrations.
        </p>
        <h3>Atkinson — an airier texture</h3>
        <p>
          Produces a lighter dot pattern with stronger contrast. Try it when you
          want a more graphic, retro-looking result.
        </p>
        <p>
          Tune <strong>Brightness</strong> and <strong>Contrast</strong>, then
          try <strong>Invert colors</strong> to swap black and white.{" "}
          <strong>Reset adjustments</strong> restores processing defaults
          without changing your crop. The Threshold slider applies only to
          Threshold mode.
        </p>
      </ContentSection>
      <ContentSection {...sections[3]}>
        <ul>
          <li>
            <strong>Physical:</strong> a portrait device simulation, including
            the top status strip. Use it to judge the overall composition.
          </li>
          <li>
            <strong>Pixels:</strong> enlarged physical artwork with crisp,
            integer-scaled pixels. Enable <strong>Pixel grid</strong> to inspect
            individual pixels; the grid appears at 3× enlargement and above.
          </li>
          <li>
            <strong>Framebuffer:</strong> the rotated artwork bitmap passed to
            the ZMK/LVGL encoder. This is an inspection view, so you cannot pan
            here.
          </li>
          <li>
            <strong>Source:</strong> the transformed crop before monochrome
            processing. Use it to separate composition changes from processing
            changes.
          </li>
        </ul>
        <p>
          Switching previews preserves your composition. The simulated status
          strip is excluded from export, and a physical screen may look
          different from the browser simulation.
        </p>
      </ContentSection>
      <ContentSection {...sections[4]}>
        <ol>
          <li>
            Select <strong>Export</strong> once your image is ready.
          </li>
          <li>
            Give the artwork a name. The dialog shows the C symbol generated
            from it.
          </li>
          <li>
            Choose a <strong>ZIP package</strong>. For replacing stock
            peripheral artwork, start with{" "}
            <strong>nice!view customization</strong>.
          </li>
          <li>
            Inspect or copy the C code, download <code>art.c</code>, or download
            the full ZIP.
          </li>
        </ol>
        <p>
          <strong>Download ZIP</strong> includes the integration files for the
          selected package and its installation README.{" "}
          <strong>Download art.c</strong> downloads only the image asset,
          regardless of the selected package.
        </p>
        <p>
          After a download starts, a congratulations screen shows installation
          steps for the file or package you downloaded. Select{" "}
          <strong>Don’t show this again</strong> to turn off automatic
          celebrations for all downloads in this browser.{" "}
          <strong>View installation steps</strong>
          remains available after a download; reopen it and uncheck the option
          to turn celebrations back on. Copying C code keeps its inline
          confirmation.
        </p>
        <p>
          For the full instructions, follow the{" "}
          <Link href="/export-guide">Export Guide</Link> to integrate the files,
          rebuild your firmware, and flash the peripheral half. The editor
          generates assets; it does not build or flash firmware.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
