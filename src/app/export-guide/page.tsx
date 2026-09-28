import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/layout/content-page";
import { niceViewGenerator } from "@/lib/generators/metadata";
import { getLvglImageLayout } from "@/lib/generators/lvgl-image";
import { niceView } from "@/lib/displays/nice-view";
import { pageMetadata } from "@/lib/page-metadata";
import { infoPages } from "@/lib/site";

export const metadata = pageMetadata(infoPages.exportGuide);

const sections = [
  { id: "choose-a-package", title: "Choose a package" },
  { id: "nice-view-customization", title: "nice!view customization" },
  { id: "c-image", title: "C image only" },
  { id: "custom-shield", title: "Full custom shield" },
  { id: "compatibility", title: "Compatibility & encoding" },
];
const layout = getLvglImageLayout(niceView.artwork.framebuffer);

export default function ExportGuidePage() {
  return (
    <ContentPage
      page={infoPages.exportGuide}
      title={
        <>
          The last step:
          <br />
          <span className="text-primary">make it real.</span>
        </>
      }
      introduction="Your export is a firmware asset, not a firmware build. Pick the package that fits your setup, integrate it into ZMK, then rebuild and flash your keyboard."
      sections={sections}
    >
      <ContentSection {...sections[0]}>
        <p>
          In the editor’s <strong>Export</strong> dialog, name your artwork and
          choose a <strong>ZIP package</strong>. Every ZIP includes installation
          instructions specific to that package and your generated image symbol.
        </p>
        <ul>
          <li>
            <strong>nice!view customization:</strong> replace the stock
            peripheral artwork using a local ZMK checkout or fork. This is the
            default export choice.
          </li>
          <li>
            <strong>C image only:</strong> use an LVGL image asset in a custom
            widget or shield you already maintain.
          </li>
          <li>
            <strong>Full custom shield · Experimental:</strong> add a{" "}
            <code>nice_view_custom</code> shield through your config/module
            repository, reusing upstream ZMK support sources.
          </li>
        </ul>
        <p>
          Choose <strong>Download ZIP</strong> for the complete selected
          package. <strong>Download art.c</strong> and{" "}
          <strong>Copy C code</strong> provide only the image asset, not the
          supporting widget or shield files.
        </p>
      </ContentSection>
      <ContentSection {...sections[1]}>
        <p>
          Use this package to replace the stock peripheral artwork and keep the
          existing battery and connection behavior.
        </p>
        <ol>
          <li>
            Use a ZMK checkout based on the{" "}
            <a href="#compatibility">inspected revision</a>.
          </li>
          <li>
            Copy the ZIP’s <code>app/</code> directory into the ZMK checkout. It
            replaces <code>app/boards/shields/nice_view/widgets/art.c</code> and{" "}
            <code>
              app/boards/shields/nice_view/widgets/peripheral_status.c
            </code>
            .
          </li>
          <li>
            Keep your existing <code>nice_view</code> shield and, if required by
            your keyboard, <code>nice_view_adapter</code>.
          </li>
          <li>
            Ensure <code>CONFIG_ZMK_DISPLAY=y</code> and{" "}
            <code>CONFIG_NICE_VIEW_WIDGET_STATUS=y</code>.
          </li>
          <li>
            Perform a pristine rebuild and flash the peripheral half using your
            keyboard’s normal build and flashing procedure.
          </li>
        </ol>
        <h3>Using GitHub Actions?</h3>
        <p>
          Commit the source replacements to a ZMK fork. Point the ZMK project in
          your config’s west manifest at that fork and commit, then rebuild.
          Files placed in an unrelated config directory do not override upstream
          C sources.
        </p>
        <p>
          This package changes peripheral artwork. It does not change the
          central-side layout.
        </p>
      </ContentSection>
      <ContentSection {...sections[2]}>
        <p>
          The ZIP contains <code>art.c</code> and a README. You need an existing
          custom LVGL 9 widget that displays the image.
        </p>
        <ol>
          <li>
            Add <code>art.c</code> to your custom display or shield source
            directory.
          </li>
          <li>
            Compile it exactly once with{" "}
            <code>zephyr_library_sources(art.c)</code> in that shield’s{" "}
            <code>CMakeLists.txt</code>.
          </li>
          <li>
            Declare the image at file scope and set it as the source of your
            LVGL image object.
          </li>
        </ol>
        <pre tabIndex={0} aria-label="Example LVGL 9 image integration">
          <code>{`/* At file scope; use the symbol shown in your export. */
LV_IMAGE_DECLARE(custom_art);

/* In your widget setup, after creating image_object. */
lv_image_set_src(image_object, &custom_art);`}</code>
        </pre>
        <p>
          Replace <code>custom_art</code> with your exported symbol and{" "}
          <code>image_object</code> with your widget’s image object. Do not
          replace the stock <code>art.c</code> with this file alone: the stock
          widget references balloon and mountain images. Use the customization
          package to replace that widget too.
        </p>
      </ContentSection>
      <ContentSection {...sections[3]}>
        <p>
          <span className="technical-badge">Experimental</span>
        </p>
        <p>
          This package adds <code>nice_view_custom</code>, a shield that reuses
          support sources from the inspected ZMK tree. It is not a
          self-contained fork of ZMK.
        </p>
        <ol>
          <li>
            Copy <code>boards/shields/nice_view_custom/</code> into the{" "}
            <code>boards/shields/</code> directory of your unified ZMK
            config/module repository, beside its <code>config/</code> directory.
          </li>
          <li>
            Ensure <code>zephyr/module.yml</code> declares the repository as a
            board root. Merge this setting into an existing module file; use the
            included file only for a new standalone module.
          </li>
        </ol>
        <pre tabIndex={0} aria-label="Module board root configuration">
          <code>{`build:
  settings:
    board_root: .`}</code>
        </pre>
        <ol start={3}>
          <li>
            In the peripheral entry of <code>build.yaml</code>, replace{" "}
            <code>nice_view</code> with <code>nice_view_custom</code>. Keep the
            keyboard shield and any <code>nice_view_adapter</code> entry.
          </li>
          <li>
            The keyboard or adapter must provide <code>&amp;nice_view_spi</code>{" "}
            with MOSI, SCK, and CS pins. Keep{" "}
            <code>CONFIG_NICE_VIEW_WIDGET_STATUS=y</code>.
          </li>
          <li>Perform a pristine build and flash the peripheral half.</li>
        </ol>
        <p>
          Do not select <code>nice_view</code> and <code>nice_view_custom</code>{" "}
          together for the same build. The central half can keep{" "}
          <code>nice_view</code>.
        </p>
        <p>
          For a local standalone module, add{" "}
          <code>
            -DZMK_EXTRA_MODULES=/absolute/path/to/zmk-display-studio-export
          </code>{" "}
          after <code>--</code> in your normal west build command and select{" "}
          <code>nice_view_custom</code> in <code>SHIELD</code>. Legacy
          config-only repositories can place <code>boards/</code> inside their{" "}
          <code>config/</code> directory, registered via <code>ZMK_CONFIG</code>
          . Follow the included README for these layouts.
        </p>
      </ContentSection>
      <ContentSection {...sections[4]}>
        <p>
          The generator targets <strong>LVGL 9</strong>, using these inspected
          revisions:
        </p>
        <ul>
          <li>
            ZMK:{" "}
            <a
              href={`https://github.com/zmkfirmware/zmk/tree/${niceViewGenerator.zmkRevision}`}
            >
              <code>{niceViewGenerator.zmkRevision}</code>
            </a>
          </li>
          <li>
            LVGL:{" "}
            <a
              href={`https://github.com/zmkfirmware/lvgl/tree/${niceViewGenerator.lvglRevision}`}
            >
              <code>{niceViewGenerator.lvglRevision}</code>
            </a>{" "}
            (9.3.0-dev)
          </li>
          <li>
            Generator: <code>{niceViewGenerator.id}</code>, version{" "}
            {niceViewGenerator.version}
          </li>
        </ul>
        <p>
          Older LVGL 8 APIs are unsupported. Future ZMK changes may require
          updated integration files. A full Zephyr firmware build and physical
          nice!view test have not been performed for this tool; validate the
          generated package with your keyboard’s build.
        </p>
        <h3>What’s in the image?</h3>
        <p>
          The {niceView.artwork.framebuffer.width} ×{" "}
          {niceView.artwork.framebuffer.height} image uses{" "}
          <code>LV_COLOR_FORMAT_I1</code>: an {layout.paletteSize}-byte opaque
          black/white palette followed by row-aligned monochrome pixels. Its
          stride is {layout.stride} bytes and total data size is{" "}
          {layout.dataSize.toLocaleString("en-US")} bytes.
        </p>
        <p>
          Inversion is already baked into the image.{" "}
          <code>CONFIG_NICE_VIEW_WIDGET_INVERTED</code> affects the status UI
          independently. The{" "}
          <Link href="/how-to-use#compose">
            portrait-to-framebuffer conversion
          </Link>{" "}
          is handled automatically.
        </p>
        <p>
          For general firmware setup and flashing, use the{" "}
          <a href="https://zmk.dev/docs">ZMK documentation</a> and your
          keyboard’s instructions.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
