import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  ImageOffIcon,
  PackageIcon,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState, LoadErrorState } from "../../components/states";
import { itemDetailOptions } from "../../lib/queries";

export const Route = createFileRoute("/item/$assetId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(itemDetailOptions(Number(params.assetId))),
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Rovatar` },
          {
            name: "description",
            content: `${loaderData.name} (asset ${params.assetId}) on Roblox — previewed via Rovatar.`,
          },
          { property: "og:title", content: `${loaderData.name} — Rovatar` },
          {
            property: "og:description",
            content: `${loaderData.name} (asset ${params.assetId}) on Roblox — previewed via Rovatar.`,
          },
        ]
      : [{ title: "Item unavailable — Rovatar" }, { name: "robots", content: "noindex" }],
  }),
  component: ItemPage,
  notFoundComponent: ItemNotFound,
  errorComponent: ItemError,
});

function ItemNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20">
      <EmptyState
        icon={<PackageIcon className="size-5" aria-hidden />}
        title="Item not found"
        description="We couldn't find a Roblox item with that asset ID."
      />
    </div>
  );
}

function ItemError() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20">
      <LoadErrorState
        title="Couldn't load this item"
        description="Roblox didn't return the item information. Try again."
      />
    </div>
  );
}

function ItemPage() {
  const { assetId } = Route.useParams();
  const { data: item } = useSuspenseQuery(itemDetailOptions(Number(assetId)));
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyAssetId = async () => {
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
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <button
        type="button"
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden />
        Back
      </button>

      <div className="mt-4 grid gap-6 sm:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <div className="self-start overflow-hidden rounded-lg border bg-card">
          <div className="aspect-square bg-secondary">
            {item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <ImageOffIcon className="size-6" aria-hidden />
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{item.name}</h1>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">Asset ID</dt>
              <dd className="tabular-nums">{item.id}</dd>
            </div>
            {item.creatorName && (
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">Creator</dt>
                <dd>{item.creatorName}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={`https://www.roblox.com/catalog/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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
          </div>
        </div>
      </div>
    </div>
  );
}
