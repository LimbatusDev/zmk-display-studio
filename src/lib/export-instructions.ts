import type { ExportTarget } from "./displays/types.ts";
import { requireCIdentifier } from "./generators/c-identifier.ts";

export interface DownloadReceipt {
  readonly action: "c" | "zip";
  readonly target: ExportTarget;
  readonly symbol: string;
  readonly filename: string;
}

export interface InstallationStep {
  title: string;
  description: string;
  code?: string;
}

export interface ExportInstructions {
  label: string;
  guideHref: string;
  experimental: boolean;
  steps: InstallationStep[];
  note: string;
}

/** Snapshot the actual download, not just the ZIP selector, before async work. */
export function createDownloadReceipt(
  action: DownloadReceipt["action"],
  selectedTarget: ExportTarget,
  symbol: string,
): DownloadReceipt {
  return {
    action,
    target: action === "c" ? "c-image" : selectedTarget,
    symbol: requireCIdentifier(symbol),
    filename: action === "c" ? "art.c" : "zmk-display-studio-export.zip",
  };
}

/** Short on-screen instructions aligned with each package's installation README. */
export function getExportInstructions(
  receipt: DownloadReceipt,
): ExportInstructions {
  switch (receipt.target) {
    case "c-image":
      return {
        label: receipt.action === "c" ? "C image only" : "C image ZIP",
        guideHref: "/export-guide#c-image",
        experimental: false,
        steps: [
          {
            title: "Add the image to your custom widget",
            description: `${receipt.action === "zip" ? "Extract the ZIP and open README.md. " : ""}Place art.c in the source directory of an existing custom LVGL 9 display widget or shield.`,
          },
          {
            title: "Compile the image once",
            description:
              "Add this to that shield’s CMakeLists.txt. Do not compile art.c twice.",
            code: "zephyr_library_sources(art.c)",
          },
          {
            title: "Connect the image to your widget",
            description:
              "Declare your exported symbol at file scope. In your widget setup, use it as the image source; replace image_object with your LVGL image object.",
            code: `/* At file scope */\nLV_IMAGE_DECLARE(${receipt.symbol});\n\n/* After creating your image object */\nlv_image_set_src(image_object, &${receipt.symbol});`,
          },
          {
            title: "Rebuild and flash",
            description:
              "Perform a pristine firmware build with your custom widget, then flash the peripheral half using your keyboard’s normal procedure.",
          },
        ],
        note: "A C image is an asset, not a replacement for the stock balloon/mountain widget. To replace the stock peripheral artwork, go back and download the nice!view customization ZIP instead.",
      };
    case "nice-view-artwork":
      return {
        label: "nice!view customization",
        guideHref: "/export-guide#nice-view-customization",
        experimental: false,
        steps: [
          {
            title: "Extract the ZIP and read the README",
            description:
              "Use a compatible LVGL 9-based ZMK checkout or fork. README.md includes the inspected revisions and instructions for your generated package.",
          },
          {
            title: "Replace both upstream files",
            description:
              "Copy the package’s app/ directory into your ZMK checkout, replacing these two files together:",
            code: "app/boards/shields/nice_view/widgets/art.c\napp/boards/shields/nice_view/widgets/peripheral_status.c",
          },
          {
            title: "Keep your display configuration",
            description:
              "Keep nice_view and any required nice_view_adapter shield. Ensure these settings are enabled:",
            code: "CONFIG_ZMK_DISPLAY=y\nCONFIG_NICE_VIEW_WIDGET_STATUS=y",
          },
          {
            title: "Rebuild and flash the peripheral half",
            description:
              "Perform a pristine rebuild, then flash using your keyboard’s normal procedure. For GitHub Actions, commit the replacements to a ZMK fork and point your west manifest at that fork and commit before rebuilding.",
          },
        ],
        note: "These files replace sources in ZMK itself; placing them in an ordinary config folder will not install the artwork. The peripheral widget retains battery and connection behavior. The central layout is unchanged.",
      };
    case "custom-shield":
      return {
        label: "Full custom shield",
        guideHref: "/export-guide#custom-shield",
        experimental: true,
        steps: [
          {
            title: "Extract and add the shield",
            description:
              "Read README.md, then copy boards/shields/nice_view_custom/ into the boards/shields/ directory of your unified ZMK config/module repository, beside config/.",
          },
          {
            title: "Register the module’s board root",
            description:
              "Merge this setting into zephyr/module.yml. Use the included module file only for a new standalone module, so you keep any existing configuration.",
            code: "build:\n  settings:\n    board_root: .",
          },
          {
            title: "Select nice_view_custom",
            description:
              "In the peripheral entry of build.yaml, replace nice_view with nice_view_custom. Keep the keyboard shield and any nice_view_adapter. The keyboard/adapter must provide &nice_view_spi with MOSI, SCK, and CS pins.",
            code: "CONFIG_NICE_VIEW_WIDGET_STATUS=y",
          },
          {
            title: "Rebuild and flash the peripheral half",
            description:
              "Keep the status setting above enabled, perform a pristine build, and flash your keyboard. Do not select nice_view and nice_view_custom together in the same build. The central half can keep nice_view.",
          },
        ],
        note: "This experimental shield reuses upstream ZMK support sources. Follow the README for compatible revisions, local standalone modules, or legacy config-only repositories, and validate the build on your keyboard.",
      };
  }
}
