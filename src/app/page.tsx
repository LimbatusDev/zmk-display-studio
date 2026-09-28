import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { DisplayEditor } from "@/components/editor/display-editor";

export default function Home() {
  return (
    <>
      <AppHeader />
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
              Make it <span className="text-primary">yours.</span>
            </h1>
            <p className="mt-2.5 text-sm text-muted-foreground">
              Design custom artwork for your ZMK keyboard display.
            </p>
          </div>
          <ol
            aria-label="Workflow"
            className="mb-1 flex items-center gap-3 font-mono text-[10px] text-muted-foreground sm:gap-5"
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
      </main>
      <AppFooter />
    </>
  );
}
