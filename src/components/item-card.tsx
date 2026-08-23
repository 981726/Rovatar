import type { RobloxAvatarAsset } from "@/lib/roblox.types";
import { cn } from "@/lib/utils";

export function ItemCard({
  item,
  onSelect,
  className,
}: {
  item: RobloxAvatarAsset;
  onSelect: (item: RobloxAvatarAsset) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn("tile group min-w-0 text-left", className)}
      aria-label={`${item.name}, ${item.assetType.name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-plate">
        <div aria-hidden className="absolute inset-0 bg-studs opacity-50" />
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            loading="lazy"
            className="relative h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
            No preview
          </div>
        )}
        <span className="pointer-events-none absolute inset-x-2 bottom-2 flex translate-y-1.5 items-center justify-center rounded-md bg-background/85 py-1 text-[11px] font-semibold text-foreground opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          View details
        </span>
      </div>
      <div className="border-t border-border/60 p-2.5">
        <p className="truncate text-[13px] font-semibold leading-snug">{item.name}</p>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="truncate">{item.assetType.name}</span>
          <span aria-hidden className="size-1 shrink-0 rounded-full bg-border" />
          <span className="shrink-0 font-mono tabular-nums">{item.id}</span>
        </p>
      </div>
    </button>
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border bg-card">
      <div className="aspect-square bg-secondary" />
      <div className="space-y-2 border-t border-border/60 p-2.5">
        <div className="h-3.5 w-3/4 rounded bg-secondary" />
        <div className="h-3 w-1/2 rounded bg-secondary" />
      </div>
    </div>
  );
}

export const ITEM_GRID_CLASSES =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
