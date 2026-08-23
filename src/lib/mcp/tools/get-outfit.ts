import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

import {
  fetchOutfitDetails,
  fetchOutfits,
  fetchThumbnails,
  resolveUsername,
} from "../../roblox.server";
import { groupAssets } from "../../roblox.types";
import { assetGroupShape } from "../schemas";

export default defineTool({
  name: "get_outfit",
  title: "Inspect an outfit",
  description:
    "Fetch every item in one of a Roblox player's saved outfits, grouped by category with thumbnails and catalog links.",
  inputSchema: {
    username: z.string().min(3).max(20).describe("Roblox username."),
    outfitId: z.number().int().positive().describe("Outfit ID from get_outfits."),
  },
  outputSchema: {
    username: z.string(),
    outfitId: z.number(),
    name: z.string(),
    playerAvatarType: z.string().nullable(),
    thumbnailUrl: z.string().nullable(),
    groups: z.array(z.object(assetGroupShape)),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ username, outfitId }) => {
    const base = await resolveUsername(username);
    if (!base) throw new ToolError(`No Roblox player found for "${username}".`);

    const [details, outfitList] = await Promise.all([
      fetchOutfitDetails(outfitId).catch(() => null),
      fetchOutfits(base.id).catch(() => []),
    ]);
    if (!details) {
      throw new ToolError(`Roblox didn't return details for outfit ${outfitId}.`);
    }
    const name = outfitList.find((o) => o.id === outfitId)?.name ?? "Outfit";
    const assets = details.assets ?? [];

    const thumbs = await fetchThumbnails([
      { requestId: "outfit", type: "Outfit", targetId: outfitId, size: "720x720" },
      ...assets.map((a) => ({
        requestId: `asset-${a.id}`,
        type: "Asset" as const,
        targetId: a.id,
        size: "420x420",
      })),
    ]).catch(() => ({}) as Record<string, string | null>);

    const items = assets.map((a) => ({
      id: a.id,
      name: a.name,
      assetType: a.assetType,
      thumbnailUrl: thumbs[`asset-${a.id}`] ?? null,
      catalogUrl: `https://www.roblox.com/catalog/${a.id}`,
    }));

    return {
      content: [
        {
          type: "text",
          text: `Outfit "${name}" (@${base.name}): ${items.length} items.`,
        },
      ],
      structuredContent: {
        username: base.name,
        outfitId,
        name,
        playerAvatarType: details.playerAvatarType ?? null,
        thumbnailUrl: thumbs["outfit"] ?? null,
        groups: groupAssets(items).map((g) => ({
          category: g.label,
          items: g.items,
        })),
      },
    };
  },
});
