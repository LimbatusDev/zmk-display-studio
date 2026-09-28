"use client";

import { ArrowUpRight, Code2, Cpu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AppHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-17 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="ZMK Display Studio home"
        >
          <span className="pixel-logo" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            ZMK{" "}
            <span className="font-normal text-muted-foreground">
              Display Studio
            </span>
          </span>
          <span className="hidden rounded border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground sm:block">
            BETA
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-2 sm:gap-5"
        >
          <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground md:flex">
            <span className="size-1.5 rounded-full bg-emerald-600" />{" "}
            Browser-based. Private by design.
          </span>
          <Dialog>
            <DialogTrigger render={<Button variant="ghost" size="sm" />}>
              About
            </DialogTrigger>
            <DialogContent>
              <Cpu className="mb-5 size-8 text-primary" />
              <DialogTitle className="text-xl font-semibold">
                Small display. Your expression.
              </DialogTitle>
              <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
                ZMK Display Studio helps keyboard enthusiasts create display
                artwork and ZMK-ready assets without manually converting images
                into firmware data.
              </DialogDescription>
              <div className="mt-5 space-y-4 text-sm leading-relaxed">
                <p className="flex gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" />{" "}
                  Images are processed locally in your browser and are never
                  uploaded.
                </p>
                <p>
                  Built for the open-source keyboard community. Currently
                  supports nice!view peripheral artwork.
                </p>
                <p className="text-muted-foreground">
                  An independent tool. Not affiliated with ZMK or
                  nice!keyboards.
                </p>
                <a
                  className="inline-flex items-center gap-1 underline underline-offset-4"
                  href="https://zmk.dev/docs"
                  target="_blank"
                  rel="noreferrer"
                >
                  ZMK documentation <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled
            title="Project repository link coming soon"
            aria-label="GitHub repository — coming soon"
          >
            <Code2 />
          </Button>
        </nav>
      </div>
    </header>
  );
}
