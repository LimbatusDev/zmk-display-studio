import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import type { InfoPage } from "@/lib/site";

export interface ContentSectionLink {
  id: string;
  title: string;
}

export function ContentPage({
  page,
  title,
  introduction,
  sections,
  children,
}: {
  page: InfoPage;
  title: ReactNode;
  introduction: string;
  sections: ContentSectionLink[];
  children: ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-6xl flex-1 px-5 pb-8 pt-10 sm:px-8 sm:pt-16"
    >
      <header className="border-b pb-8 sm:pb-12">
        <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase">
          <span className="size-2 bg-primary" aria-hidden="true" />
          <span className="text-muted-foreground">Studio notes</span>
          <span className="text-border" aria-hidden="true">
            /
          </span>
          <span className="text-primary">{page.label}</span>
        </p>
        <h1 className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {introduction}
        </p>
      </header>
      <div className="grid gap-8 py-8 sm:py-12 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-16">
        <aside>
          <nav aria-label="On this page" className="lg:sticky lg:top-8">
            <p className="mb-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              On this page
            </p>
            <ol className="flex flex-wrap gap-x-5 gap-y-1 lg:flex-col">
              {sections.map(({ id, title: sectionTitle }, index) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="group flex min-h-10 items-center gap-3 text-xs text-muted-foreground hover:text-primary"
                  >
                    <span className="font-mono text-[10px] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="group-hover:underline underline-offset-4">
                      {sectionTitle}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <Link
              href="/"
              className="mt-5 inline-flex min-h-10 items-center gap-2 text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              Open editor <ArrowRight className="size-3.5" />
            </Link>
          </nav>
        </aside>
        <div className="min-w-0 space-y-12 sm:space-y-16">{children}</div>
      </div>
      <section
        aria-labelledby="create-artwork-heading"
        className="mt-4 flex flex-wrap items-center justify-between gap-6 rounded-lg bg-primary p-7 text-primary-foreground sm:p-9"
      >
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-widest text-highlight uppercase">
            Your next little project
          </p>
          <h2
            id="create-artwork-heading"
            className="text-2xl font-medium tracking-tight"
          >
            Make a few pixels your own.
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            Start with an image. Or see what the sample can do.
          </p>
        </div>
        <Link
          href="/"
          className={buttonVariants({
            variant: "secondary",
            size: "lg",
            className: "min-h-11 gap-3 px-5",
          })}
        >
          Open editor <ArrowRight />
        </Link>
      </section>
    </main>
  );
}

export function ContentSection({
  id,
  title,
  children,
}: ContentSectionLink & { children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-8">
      <h2
        id={`${id}-heading`}
        className="mb-5 text-2xl font-medium tracking-tight"
      >
        {title}
      </h2>
      <div className="guide-copy">{children}</div>
    </section>
  );
}
