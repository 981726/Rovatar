import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { BadgeCheckIcon, ExternalLinkIcon } from "lucide-react";

import { CategoryTabs } from "../../components/category-tabs";
import { LoadErrorState, UserNotFoundState } from "../../components/states";
import { userOverviewOptions } from "../../lib/queries";
import { rememberUser } from "../../lib/recent";
import { accountEra } from "../../lib/roblox.types";

export const Route = createFileRoute("/user/$username")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userOverviewOptions(params.username)),
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Rovatar` },
      {
        name: "description",
        content: `Inspect ${params.username}'s Roblox avatar, outfits, and items on Rovatar.`,
      },
      { property: "og:title", content: `@${params.username} — Rovatar` },
      {
        property: "og:description",
        content: `Inspect ${params.username}'s Roblox avatar, outfits, and items on Rovatar.`,
      },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: UserLayout,
  notFoundComponent: UserNotFound,
  errorComponent: UserLoadError,
});

function UserNotFound() {
  const { username } = Route.useParams();
  return <UserNotFoundState username={username} />;
}

function UserLoadError() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20">
      <LoadErrorState
        title="Couldn't load this player"
        description="Roblox didn't return the player information. Try again."
      />
    </div>
  );
}

function UserLayout() {
  const { username } = Route.useParams();
  const { data } = useSuspenseQuery(userOverviewOptions(username));
  const { user, headshotUrl } = data;
  const era = accountEra(user.created);

  useEffect(() => {
    rememberUser({ name: user.name, displayName: user.displayName });
  }, [user.name, user.displayName]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20">
      <header className="relative mt-5 overflow-hidden rounded-2xl border bg-surface elevated">
        <div aria-hidden className="absolute inset-0 bg-blueprint opacity-60" />
        <div
          aria-hidden
          className="absolute -left-20 -top-24 size-64 rounded-full bg-brand/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-plate ring-1 ring-inset ring-white/5 sm:size-24">
            {headshotUrl ? (
              <img
                src={headshotUrl}
                alt={`${user.name}'s Roblox avatar headshot`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-secondary" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              <span className="truncate">@{user.name}</span>
              {user.hasVerifiedBadge && (
                <span className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/12 px-2 py-0.5 text-[11px] font-semibold text-brand">
                  <BadgeCheckIcon className="size-3.5" aria-hidden />
                  Verified
                </span>
              )}
            </h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {user.displayName}
              <span aria-hidden className="mx-2 text-border">
                |
              </span>
              <span className="font-mono text-xs tabular-nums">ID {user.id}</span>
            </p>
            {era && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[11px]">
                <span className="font-semibold text-foreground">{era.label}</span>
                <span aria-hidden className="size-1 rounded-full bg-border" />
                <span className="text-muted-foreground">{era.detail}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <a
              href={`https://www.roblox.com/users/${user.id}/profile`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-sm font-semibold transition-colors hover:border-brand/50 hover:bg-accent"
            >
              Roblox profile
              <ExternalLinkIcon className="size-3.5" aria-hidden />
            </a>

            <dl className="flex gap-2">
              <div className="rounded-lg border border-border bg-card px-3 py-2 text-center">
                <dd className="font-mono text-lg font-semibold tabular-nums leading-none">
                  {data.avatar?.assets.length ?? 0}
                </dd>
                <dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Items
                </dt>
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-2 text-center">
                <dd className="font-mono text-lg font-semibold tabular-nums leading-none">
                  {data.outfits.length}
                </dd>
                <dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Outfits
                </dt>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <CategoryTabs username={user.name} />

      <div className="pt-7">
        <Outlet />
      </div>
    </div>
  );
}
