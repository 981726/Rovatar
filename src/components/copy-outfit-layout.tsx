import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { RobloxAvatarAsset } from "@/lib/roblox.types";

function layoutText(label: string, assets: RobloxAvatarAsset[]) {
  return [
    `Rovatar layout: ${label}`,
    "",
    ...assets.map((asset) => `${asset.assetType.name}: ${asset.id} — ${asset.name}`),
    "",
    "Asset IDs (comma-separated):",
    assets.map((asset) => asset.id).join(", "),
  ].join("\n");
}

export function CopyOutfitLayout({
  label,
  assets,
}: {
  label: string;
  assets: RobloxAvatarAsset[];
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(layoutText(label, assets));
      setCopied(true);
      toast.success(`${assets.length} asset IDs copied`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy this layout");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
    >
      {copied ? (
        <CheckIcon className="size-3.5" aria-hidden />
      ) : (
        <CopyIcon className="size-3.5" aria-hidden />
      )}
      {copied ? "Layout copied" : "Copy item IDs"}
    </button>
  );
}
