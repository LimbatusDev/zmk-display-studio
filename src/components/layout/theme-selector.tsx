"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const choices = [
  { theme: "light", label: "Light mode", icon: Sun },
  { theme: "dark", label: "Dark mode", icon: Moon },
] as const;

export function ThemeSelector() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );

  return (
    <ToggleGroup
      aria-label="Color theme"
      value={mounted && resolvedTheme ? [resolvedTheme] : []}
      disabled={!mounted}
      onValueChange={(values) => {
        const selected = choices.find(({ theme }) => theme === values[0]);
        if (selected) setTheme(selected.theme);
      }}
      spacing={0.5}
      className="theme-selector shrink-0 rounded-full border bg-muted p-0.75"
    >
      {choices.map(({ theme, label, icon: Icon }) => (
        <ToggleGroupItem
          key={theme}
          value={theme}
          data-theme-choice={theme}
          aria-label={label}
          title={label}
          className="size-8 rounded-full p-0 text-muted-foreground hover:text-primary"
        >
          <Icon className="size-4" aria-hidden="true" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
