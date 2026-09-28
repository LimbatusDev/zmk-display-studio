"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { themeStorageKey } from "@/lib/theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey={themeStorageKey}
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
