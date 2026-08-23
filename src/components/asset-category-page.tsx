import { useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShirtIcon } from "lucide-react";

import { AssetSections } from "./asset-sections";
import { ItemDialog } from "./item-dialog";
import { PageHeader } from "./page-header";
import { EmptyState } from "./states";
import { userOverviewOptions } from "@/lib/queries";
import {
  ASSET_GROUP_LABELS,
  assetGroupOf,
  type AssetGroupKey,
  type RobloxAvatarAsset,
} from "@/lib/roblox.types";

const routeApi = getRouteApi("/user/$username");

/** Shared body for the Clothing / Accessories / Body category pages. */
export function AssetCategoryPage({ groupKey }: { groupKey: AssetGroupKey }) {
  const { username } = routeApi.useParams();
  const { data } = useSuspenseQuery(userOverviewOptions(username));
  const [selected, setSelected] = useState<RobloxAvatarAsset | null>(null);

  if (!data.avatar) {
    return (
      <EmptyState
        icon={<ShirtIcon className="size-5" aria-hidden />}
        title="Couldn't load this avatar"
        description="Roblox didn't return the avatar information. Try again in a moment."
      />
    );
  }

  const label = ASSET_GROUP_LABELS[groupKey];
  const assets = data.avatar.assets.filter((a) => assetGroupOf(a.assetType.id) === groupKey);

  return (
    <div>
      <PageHeader
        title={label}
        count={assets.length}
        subtitle={`Currently worn by @${data.user.name}`}
      />

      {assets.length === 0 ? (
        <EmptyState
          icon={<ShirtIcon className="size-5" aria-hidden />}
          title={`No ${label.toLowerCase()} equipped`}
          description={`This player isn't wearing any ${label.toLowerCase()} items right now.`}
        />
      ) : (
        <AssetSections assets={assets} onSelect={setSelected} />
      )}

      <ItemDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
