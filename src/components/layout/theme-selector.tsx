"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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
    <div className="theme-selector" role="group" aria-label="Color theme">
      {choices.map(({ theme, label, icon: Icon }) => (
        <button
          key={theme}
          type="button"
          data-theme-choice={theme}
          aria-label={label}
          title={label}
          aria-pressed={mounted && resolvedTheme === theme}
          disabled={!mounted}
          onClick={() => setTheme(theme)}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
