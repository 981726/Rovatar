import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClockIcon, CopyIcon, LayersIcon, SearchIcon, ShirtIcon, SparklesIcon } from "lucide-react";

import { UsernameSearch } from "../components/username-search";
import { readRecentUsers, type RecentUser } from "../lib/recent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rovatar — Roblox avatar explorer" },
      {
        name: "description",
        content:
          "Look up Roblox players and inspect their current avatar, outfits, and worn items.",
      },
    ],
  }),
  component: Index,
});

const EXAMPLE_USERS = ["builderman", "Roblox", "Shedletsky", "stickmasterluke"];

const STEPS = [
  {
    icon: SearchIcon,
    title: "Search a player",
    body: "Any public Roblox username resolves instantly.",
  },
  {
    icon: ShirtIcon,
    title: "Inspect the avatar",
    body: "Every worn item, grouped by clothing, accessories, and body.",
  },
  {
    icon: CopyIcon,
    title: "Take the IDs",
    body: "Copy a single asset ID or the whole outfit layout at once.",
  },
] as const;

function Index() {
  const [recent, setRecent] = useState<RecentUser[]>([]);

  useEffect(() => {
    setRecent(readRecentUsers());
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div aria-hidden className="absolute inset-0 bg-blueprint opacity-70" />
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-brand/12 blur-[120px]"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              <SparklesIcon className="size-3.5" aria-hidden />
              Public Roblox data
            </span>

            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Find the pieces behind
              <br className="hidden sm:block" />{" "}
              <span className="text-brand">any Roblox avatar.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Search a player to see exactly what they&apos;re wearing, browse every saved outfit,
              and copy the asset IDs you need.
            </p>

            <div className="mx-auto mt-9 max-w-xl">
              <UsernameSearch size="lg" autoFocus className="w-full" />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-muted-foreground">Try</span>
                {EXAMPLE_USERS.map((name) => (
                  <Link
                    key={name}
                    to="/user/$username"
                    params={{ username: name }}
                    className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
                  >
                    @{name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14">
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <article key={step.title} className="rounded-xl border bg-card p-5 elevated">
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-lg bg-brand/12 text-brand">
                  <step.icon className="size-4.5" aria-hidden />
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground/60">
                  0{i + 1}
                </span>
              </div>
              <h2 className="mt-4 text-[15px] font-bold">{step.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>

        {recent.length > 0 && (
          <section
            className="mt-10 rounded-xl border bg-surface p-5"
            aria-labelledby="recent-searches"
          >
            <h2 id="recent-searches" className="flex items-center gap-2 text-eyebrow">
              <ClockIcon className="size-3.5" aria-hidden />
              Recent searches
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {recent.map((user) => (
                <Link
                  key={user.name}
                  to="/user/$username"
                  params={{ username: user.name }}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
                >
                  <LayersIcon className="size-3.5 text-brand" aria-hidden />@{user.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
