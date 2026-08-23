import { ShirtIcon } from "lucide-react";

import { EmptyState } from "./states";
import { ITEM_GRID_CLASSES, ItemCard } from "./item-card";
import { groupAssets, type RobloxAvatarAsset } from "@/lib/roblox.types";

/** Renders avatar assets grouped into non-empty Roblox-editor-style sections. */
export function AssetSections({
  assets,
  onSelect,
}: {
  assets: RobloxAvatarAsset[];
  onSelect: (asset: RobloxAvatarAsset) => void;
}) {
  const groups = groupAssets(assets);

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={<ShirtIcon className="size-5" aria-hidden />}
        title="No items found"
        description="This avatar doesn't have any items available to display."
      />
    );
  }

  return (
    <div className="space-y-9">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`group-${group.key}`}>
          <div className="mb-4 flex items-center gap-3">
            <h2 id={`group-${group.key}`} className="text-eyebrow">
              {group.label}
            </h2>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground/70">
              {group.items.length}
            </span>
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>
          <div className={ITEM_GRID_CLASSES}>
            {group.items.map((item) => (
              <ItemCard key={item.id} item={item} onSelect={onSelect} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
