import { createFileRoute } from "@tanstack/react-router";

import { AssetCategoryPage } from "../../components/asset-category-page";
import { LoadErrorState } from "../../components/states";

export const Route = createFileRoute("/user/$username/clothing")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Clothing — Rovatar` },
      {
        name: "description",
        content: `Shirts, pants, and t-shirts ${params.username} is currently wearing on Roblox.`,
      },
    ],
  }),
  component: ClothingPage,
  errorComponent: CategoryError,
});

function CategoryError() {
  return (
    <LoadErrorState
      title="Couldn't load this avatar"
      description="Roblox didn't return the avatar information. Try again."
    />
  );
}

function ClothingPage() {
  return <AssetCategoryPage groupKey="clothing" />;
}
