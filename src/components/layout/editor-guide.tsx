import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { infoPages } from "@/lib/site";

const guides = [
  {
    ...infoPages.howToUse,
    description:
      "From choosing an image to finding the right monochrome style. A walkthrough of every step.",
  },
  {
    ...infoPages.exportGuide,
    description:
      "Choose your package and take your artwork into a ZMK build, from C asset to custom shield.",
  },
  {
    ...infoPages.faq,
    description:
      "Dimensions, display support, saved preferences, and a few things worth knowing before you flash.",
  },
];

export function EditorGuide() {
  return (
    <section
      aria-labelledby="artwork-guide-heading"
      className="mt-12 border-t py-8 sm:mt-16 sm:py-10"
    >
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            A few useful field notes
          </p>
          <h2
            id="artwork-guide-heading"
            className="text-xl font-medium tracking-tight sm:text-2xl"
          >
            A little guidance goes a long way.
          </h2>
        </div>
        <Link
          href="/about"
          className="inline-flex min-h-10 items-center gap-2 text-xs text-primary hover:underline underline-offset-4"
        >
          About the studio <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {guides.map(({ href, label, description }, index) => (
          <Link
            key={href}
            href={href}
            className="group rounded-md border bg-card p-5 transition-colors hover:border-primary hover:bg-secondary"
          >
            <div className="flex items-center justify-between font-mono text-[10px] text-primary">
              <span>0{index + 1}</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-sm font-medium">{label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
