import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LayersIcon } from "lucide-react";

import { OutfitCard } from "../../components/outfit-card";
import { PageHeader } from "../../components/page-header";
import { EmptyState, LoadErrorState } from "../../components/states";
import { userOutfitsOptions } from "../../lib/queries";

export const Route = createFileRoute("/user/$username/outfits")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userOutfitsOptions(params.username)),
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Outfits — Rovatar` },
      {
        name: "description",
        content: `Browse every outfit saved by ${params.username} on Roblox.`,
      },
    ],
  }),
  component: OutfitsPage,
  errorComponent: OutfitsError,
});

function OutfitsError() {
  return (
    <LoadErrorState
      title="Couldn't load outfits"
      description="Roblox didn't return this player's outfits. Try again."
    />
  );
}

function OutfitsPage() {
  const { username } = Route.useParams();
  const { data } = useSuspenseQuery(userOutfitsOptions(username));

  if (data.outfits.length === 0) {
    return (
      <EmptyState
        icon={<LayersIcon className="size-5" aria-hidden />}
        title="No outfits found"
        description="This player doesn't have any outfits available to display."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Outfits"
        count={data.outfits.length}
        subtitle={`Saved by @${data.user.name}`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data.outfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} username={data.user.name} />
        ))}
      </div>
    </div>
  );
}
