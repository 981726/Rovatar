import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";

import { UsernameSearch } from "./username-search";
import { ThemePicker } from "./theme-picker";

export function AppNav() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:gap-5">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 text-foreground"
          aria-label="Rovatar home"
        >
          <span className="relative grid size-8 place-items-center overflow-hidden rounded-lg bg-brand text-brand-foreground elevated">
            <span aria-hidden className="absolute inset-0 bg-studs opacity-60" />
            <span className="relative font-mono text-[13px] font-semibold leading-none">R</span>
          </span>
          <span className="text-[15px] font-bold tracking-tight">Rovatar</span>
        </Link>

        <span aria-hidden className="hidden h-5 w-px bg-border sm:block" />

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-foreground" }}
            inactiveProps={{
              className: "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            }}
            className="rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors"
          >
            Lookup
          </Link>
        </nav>

        <div className="ml-auto hidden w-full max-w-sm sm:block">
          <UsernameSearch size="md" />
        </div>

        <div className="hidden sm:block">
          <ThemePicker />
        </div>

        <button
          type="button"
          aria-label={mobileSearchOpen ? "Close search" : "Open search"}
          aria-expanded={mobileSearchOpen}
          onClick={() => setMobileSearchOpen((v) => !v)}
          className="ml-auto rounded-lg border border-border bg-secondary p-2 text-muted-foreground transition-colors hover:text-foreground sm:hidden"
        >
          {mobileSearchOpen ? <XIcon className="size-4.5" /> : <SearchIcon className="size-4.5" />}
        </button>
      </div>

      {mobileSearchOpen && (
        <div className="border-t px-4 py-3 sm:hidden">
          <UsernameSearch size="md" autoFocus onNavigate={() => setMobileSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
