import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const THEMES = [
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "2017", label: "2017" },
] as const;

type Theme = (typeof THEMES)[number]["value"];

export function ThemePicker() {
  const [theme, setTheme] = useState<Theme>("modern");

  useEffect(() => {
    const saved = window.localStorage.getItem("rovatar-theme") as Theme | null;
    if (saved && THEMES.some((option) => option.value === saved)) setTheme(saved);
  }, []);

  const selectTheme = (value: Theme) => {
    setTheme(value);
    document.documentElement.dataset.rovatarTheme = value;
    window.localStorage.setItem("rovatar-theme", value);
  };

  useEffect(() => {
    document.documentElement.dataset.rovatarTheme = theme;
  }, [theme]);

  return (
    <div
      role="radiogroup"
      aria-label="Client theme"
      className="hidden items-center gap-0.5 rounded-lg border border-border bg-secondary/60 p-0.5 lg:flex"
    >
      {THEMES.map((option) => {
        const active = option.value === theme;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => selectTheme(option.value)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
