export const site = {
  name: "ZMK Display Studio",
  url: "https://zmk-display-studio.limbatus.com/",
  repositoryUrl: "https://github.com/LimbatusDev/zmk-display-studio",
  title: "ZMK Display Studio | Custom nice!view Artwork",
  description:
    "Create custom nice!view artwork for your ZMK keyboard. Convert images to 1-bit pixels, preview dithering, and export LVGL C files for free in your browser.",
} as const;

export const infoPages = {
  about: {
    href: "/about",
    label: "About",
    title: "About",
    description:
      "Meet ZMK Display Studio: a free, local-first editor for turning your images into custom nice!view keyboard artwork.",
  },
  howToUse: {
    href: "/how-to-use",
    label: "How to Use",
    title: "How to Use ZMK Display Studio",
    description:
      "Learn to compose an image, tune monochrome processing, compare previews, and export custom nice!view artwork for your ZMK keyboard.",
  },
  faq: {
    href: "/faq",
    label: "FAQ",
    title: "Frequently Asked Questions",
    description:
      "Answers about nice!view dimensions, supported images, dithering, saved artwork, ZMK compatibility, and troubleshooting exports.",
  },
  exportGuide: {
    href: "/export-guide",
    label: "Export Guide",
    title: "Export and Installation Guide",
    description:
      "Choose an LVGL C image, nice!view customization ZIP, or experimental custom shield, and learn how to integrate it into your ZMK firmware.",
  },
  privacy: {
    href: "/privacy",
    label: "Privacy",
    title: "Privacy",
    description:
      "How ZMK Display Studio processes images locally, stores editor preferences in your browser, and handles your artwork during a session.",
  },
} as const;

export type InfoPage = (typeof infoPages)[keyof typeof infoPages];
