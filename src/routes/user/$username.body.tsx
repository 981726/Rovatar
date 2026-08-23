import { createFileRoute } from "@tanstack/react-router";

import { AssetCategoryPage } from "../../components/asset-category-page";
import { LoadErrorState } from "../../components/states";

export const Route = createFileRoute("/user/$username/body")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Body — Rovatar` },
      {
        name: "description",
        content: `Head, face, torso, and limb assets ${params.username} is currently using on Roblox.`,
      },
    ],
  }),
  component: BodyPage,
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

function BodyPage() {
  return <AssetCategoryPage groupKey="body" />;
}
