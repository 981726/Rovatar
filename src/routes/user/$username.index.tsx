import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRightIcon, CalendarIcon, PersonStandingIcon, ShirtIcon } from "lucide-react";

import { AssetSections } from "../../components/asset-sections";
import { CopyOutfitLayout } from "../../components/copy-outfit-layout";
import { ItemDialog } from "../../components/item-dialog";
import { LoadErrorState } from "../../components/states";
import { userOverviewOptions } from "../../lib/queries";
import type { RobloxAvatarAsset } from "../../lib/roblox.types";

export const Route = createFileRoute("/user/$username/")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Overview — Rovatar` },
      {
        name: "description",
        content: `View ${params.username}'s current Roblox avatar and everything they're wearing.`,
      },
    ],
  }),
  component: OverviewPage,
  errorComponent: OverviewError,
});

function OverviewError() {
  return (
    <LoadErrorState
      title="Couldn't load this avatar"
      description="Roblox didn't return the avatar information. Try again."
    />
  );
}

function formatJoined(created: string): string | null {
  if (!created) return null;
  const date = new Date(created);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function OverviewPage() {
  const { username } = Route.useParams();
  const { data } = useSuspenseQuery(userOverviewOptions(username));
  const [selected, setSelected] = useState<RobloxAvatarAsset | null>(null);

  const { user, avatar, avatarThumbnailUrl, outfits } = data;
  const joined = formatJoined(user.created);

  if (!avatar) {
    return (
      <LoadErrorState
        title="Couldn't load this avatar"
        description="Roblox didn't return the avatar information. Try again."
      />
    );
  }

  const facts: Array<{ icon: typeof ShirtIcon; label: string; value: string }> = [
    {
      icon: PersonStandingIcon,
      label: "Avatar type",
      value: avatar.playerAvatarType || "—",
    },
    {
      icon: ShirtIcon,
      label: "Items worn",
      value: String(avatar.assets.length),
    },
    {
      icon: CalendarIcon,
      label: "Outfits",
      value: String(outfits.length),
    },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-5 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border bg-card elevated">
          <div className="relative aspect-square bg-plate">
            <div aria-hidden className="absolute inset-0 bg-studs opacity-50" />
            {avatarThumbnailUrl ? (
              <img
                src={avatarThumbnailUrl}
                alt={`${user.name}'s current Roblox avatar`}
                className="relative h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
                Avatar preview unavailable
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border/60 p-3">
            <span className="text-eyebrow">Current avatar</span>
            <span className="truncate rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-semibold">
              {avatar.playerAvatarType}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border bg-card p-4">
                <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <fact.icon className="size-3.5 text-brand" aria-hidden />
                  {fact.label}
                </dt>
                <dd className="mt-2 truncate font-mono text-2xl font-semibold tabular-nums leading-none">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-3 flex-1 rounded-xl border bg-surface p-4">
            <h2 className="text-eyebrow">About</h2>
            {joined && (
              <p className="mt-2 text-sm text-muted-foreground">
                Joined Roblox in <span className="font-semibold text-foreground">{joined}</span>
              </p>
            )}
            <p className="mt-2 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {user.description || "This player hasn't written a profile description."}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/user/$username/outfits"
              params={{ username: user.name }}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Browse {outfits.length} outfits
              <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
            <CopyOutfitLayout label={`@${user.name}'s current avatar`} assets={avatar.assets} />
          </div>
        </div>
      </div>

      <section aria-labelledby="currently-wearing">
        <div className="mb-5 flex items-center gap-3">
          <h2 id="currently-wearing" className="text-xl font-bold">
            Currently wearing
          </h2>
          <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs tabular-nums text-muted-foreground">
            {avatar.assets.length}
          </span>
          <span aria-hidden className="h-px flex-1 bg-border" />
        </div>
        <AssetSections assets={avatar.assets} onSelect={setSelected} />
      </section>

      <ItemDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
