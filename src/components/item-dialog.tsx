import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { itemDetailOptions } from "@/lib/queries";
import type { RobloxAvatarAsset } from "@/lib/roblox.types";

export function ItemDialog({
  item,
  onClose,
}: {
  item: RobloxAvatarAsset | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const detailQuery = useQuery({
    ...itemDetailOptions(item?.id ?? 0),
    enabled: item !== null,
  });

  const detail = detailQuery.data;
  const creatorName = detail?.creatorName ?? null;

  const copyAssetId = async () => {
    if (!item) return;
    try {
      await navigator.clipboard.writeText(String(item.id));
      setCopied(true);
      toast.success("Asset ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the asset ID");
    }
  };

  return (
    <Dialog open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined}>
        {item && (
          <>
            <div className="relative overflow-hidden rounded-xl border bg-plate">
              <div aria-hidden className="absolute inset-0 bg-studs opacity-50" />
              {detail?.thumbnailUrl || item.thumbnailUrl ? (
                <img
                  src={detail?.thumbnailUrl ?? item.thumbnailUrl ?? ""}
                  alt={item.name}
                  className="relative aspect-square w-full object-cover"
                />
              ) : (
                <div className="grid aspect-square w-full place-items-center text-sm text-muted-foreground">
                  No preview available
                </div>
              )}
            </div>

            <div className="min-w-0">
              <span className="inline-flex items-center rounded-md border border-brand/30 bg-brand/12 px-2 py-0.5 text-[11px] font-semibold text-brand">
                {item.assetType.name}
              </span>
              <DialogTitle className="mt-2 truncate text-xl">{item.name}</DialogTitle>
              <DialogDescription className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-mono text-xs tabular-nums">ID {item.id}</span>
                {detailQuery.isLoading && <span>· loading…</span>}
                {creatorName && (
                  <>
                    <span aria-hidden className="size-1 rounded-full bg-border" />
                    <span>
                      by <span className="font-medium text-foreground">{creatorName}</span>
                    </span>
                  </>
                )}
              </DialogDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://www.roblox.com/catalog/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
              >
                View on Roblox
                <ExternalLinkIcon className="size-3.5" aria-hidden />
              </a>
              <button
                type="button"
                onClick={copyAssetId}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-secondary px-3.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
              >
                {copied ? (
                  <CheckIcon className="size-3.5" aria-hidden />
                ) : (
                  <CopyIcon className="size-3.5" aria-hidden />
                )}
                {copied ? "Copied" : "Copy Asset ID"}
              </button>
              <Link
                to="/item/$assetId"
                params={{ assetId: String(item.id) }}
                className="ml-auto text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Full page
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
