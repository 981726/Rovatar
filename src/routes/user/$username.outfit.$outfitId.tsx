import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ImageOffIcon } from "lucide-react";

import { AssetSections } from "../../components/asset-sections";
import { CopyOutfitLayout } from "../../components/copy-outfit-layout";
import { ItemDialog } from "../../components/item-dialog";
import { LoadErrorState } from "../../components/states";
import { outfitDetailOptions } from "../../lib/queries";
import type { RobloxAvatarAsset } from "../../lib/roblox.types";

export const Route = createFileRoute("/user/$username/outfit/$outfitId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      outfitDetailOptions(params.username, Number(params.outfitId)),
    ),
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Outfit — Rovatar` },
      {
        name: "description",
        content: `Inspect every item in one of ${params.username}'s saved Roblox outfits.`,
      },
    ],
  }),
  component: OutfitDetailPage,
  errorComponent: OutfitError,
});

function OutfitError() {
  return (
    <LoadErrorState
      title="Couldn't load this outfit"
      description="Roblox didn't return the outfit information. Try again."
    />
  );
}

function OutfitDetailPage() {
  const { username, outfitId } = Route.useParams();
  const { data } = useSuspenseQuery(
    outfitDetailOptions(username, Number(outfitId)),
  );
  const [selected, setSelected] = useState<RobloxAvatarAsset | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/user/$username/outfits"
          params={{ username: data.username }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden />
          All outfits
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight">{data.name}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          @{data.username}
          {data.playerAvatarType && ` · ${data.playerAvatarType}`}
          {" · "}
          <span className="tabular-nums">{data.assets.length} items</span>
        </p>
        <div className="mt-3">
          <CopyOutfitLayout label={data.name} assets={data.assets} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="self-start overflow-hidden rounded-lg border bg-card">
          <div className="aspect-square bg-secondary">
            {data.thumbnailUrl ? (
              <img
                src={data.thumbnailUrl}
                alt={`Avatar wearing the ${data.name} outfit`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <ImageOffIcon className="size-6" aria-hidden />
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <AssetSections assets={data.assets} onSelect={setSelected} />
        </div>
      </div>

      <ItemDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
