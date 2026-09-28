const steps = [
  {
    title: "Compose your image",
    description:
      "Choose a PNG, JPEG, or WebP up to 10 MB, or try the sample. Pan, zoom, and crop to fit the artwork area. Bold shapes and clear silhouettes work well at this size.",
  },
  {
    title: "Find your monochrome style",
    description:
      "Use threshold for crisp black-and-white shapes, or Floyd–Steinberg and Atkinson dithering to preserve shading. Tune brightness and contrast, then inspect the device and pixel previews.",
  },
  {
    title: "Export for your ZMK build",
    description:
      "Download an LVGL 9 C image or a ZIP with nice!view customization files and installation instructions. Add the files to your ZMK firmware project, then rebuild and flash your keyboard.",
  },
];

const questions = [
  {
    question: "What size is nice!view artwork?",
    answer:
      "The nice!view display is 160 × 68 pixels. This editor targets the 140 × 68 pixel artwork area on a split keyboard’s peripheral side. The remaining 20 × 68 pixels are reserved for status information. The simulated status preview is excluded from your exported artwork.",
  },
  {
    question: "Are my images uploaded anywhere?",
    answer:
      "No. Image processing and C/ZIP generation happen locally in your browser. The editor is free to use and requires no account. Only your processing and preview preferences are saved between visits.",
  },
  {
    question: "Can I replace the stock nice!view artwork?",
    answer:
      "Yes. Choose the nice!view customization ZIP to get artwork and peripheral widget replacements, then follow its README to integrate them into your ZMK checkout or fork. A C image alone needs an existing custom widget to display it. Exports target LVGL 9-based ZMK; older LVGL 8 builds are unsupported. The full custom shield export is experimental.",
  },
];

export function EditorGuide() {
  return (
    <section
      aria-labelledby="artwork-guide-heading"
      className="mt-12 border-t py-8 sm:mt-16 sm:py-10"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            From pixels to firmware
          </p>
          <h2
            id="artwork-guide-heading"
            className="text-xl font-medium tracking-tight sm:text-2xl"
          >
            A small display.
            <br />
            Room for your character.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            ZMK Display Studio converts your images into 1-bit nice!view
            artwork. Make a keyboard display that feels like yours, from the
            first crop to the final firmware asset.
          </p>
        </div>
        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-sm font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-10 grid gap-5 border-t pt-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 className="text-lg font-medium tracking-tight">Before you flash</h2>
        <div className="divide-y border-y">
          {questions.map(({ question, answer }) => (
            <details key={question} className="py-4">
              <summary className="cursor-pointer text-sm font-medium">
                {question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Independent community tooling, not affiliated with ZMK or
        nice!keyboards. For firmware setup, see the{" "}
        <a
          href="https://zmk.dev/docs"
          className="underline underline-offset-4 hover:text-foreground"
        >
          ZMK documentation
        </a>
        .
      </p>
    </section>
  );
}
