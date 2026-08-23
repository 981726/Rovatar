import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon, ImageOffIcon } from "lucide-react";

import type { RobloxOutfit } from "@/lib/roblox.types";

export function OutfitCard({
  outfit,
  username,
}: {
  outfit: RobloxOutfit;
  username: string;
}) {
  return (
    <Link
      to="/user/$username/outfit/$outfitId"
      params={{ username, outfitId: String(outfit.id) }}
      className="tile group block min-w-0"
      aria-label={`Open outfit ${outfit.name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-plate">
        <div aria-hidden className="absolute inset-0 bg-studs opacity-50" />
        {outfit.thumbnailUrl ? (
          <img
            src={outfit.thumbnailUrl}
            alt={`Avatar wearing ${outfit.name}`}
            loading="lazy"
            className="relative h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <ImageOffIcon className="size-6" aria-hidden />
          </div>
        )}
        <span className="pointer-events-none absolute right-2 top-2 grid size-7 place-items-center rounded-md bg-brand text-brand-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ArrowUpRightIcon className="size-4" aria-hidden />
        </span>
      </div>
      <div className="border-t border-border/60 p-2.5">
        <p className="truncate text-[13px] font-semibold leading-snug">{outfit.name}</p>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          Outfit
          <span aria-hidden className="size-1 shrink-0 rounded-full bg-border" />
          <span className="font-mono tabular-nums">{outfit.id}</span>
        </p>
      </div>
    </Link>
  );
}

export function OutfitCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border bg-card">
      <div className="aspect-square bg-secondary" />
      <div className="space-y-2 border-t border-border/60 p-2.5">
        <div className="h-3.5 w-3/4 rounded bg-secondary" />
        <div className="h-3 w-1/3 rounded bg-secondary" />
      </div>
    </div>
  );
}
