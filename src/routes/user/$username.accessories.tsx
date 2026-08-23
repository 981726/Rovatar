import { createFileRoute } from "@tanstack/react-router";

import { AssetCategoryPage } from "../../components/asset-category-page";
import { LoadErrorState } from "../../components/states";

export const Route = createFileRoute("/user/$username/accessories")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Accessories — Rovatar` },
      {
        name: "description",
        content: `Hats, hair, and layered accessories ${params.username} is currently wearing on Roblox.`,
      },
    ],
  }),
  component: AccessoriesPage,
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

function AccessoriesPage() {
  return <AssetCategoryPage groupKey="accessories" />;
}
