import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { fetchAssetDetails, fetchThumbnails } from "../../roblox.server";

export default defineTool({
  name: "get_item",
  title: "Get catalog item",
  description:
    "Look up a Roblox catalog item by asset ID: name, type, creator, thumbnail, and its catalog URL.",
  inputSchema: {
    assetId: z.number().int().positive().describe("Roblox asset ID."),
  },
  outputSchema: {
    item: z.object({
      id: z.number(),
      name: z.string(),
      assetTypeId: z.number().nullable(),
      creatorName: z.string().nullable(),
      created: z.string().nullable(),
      thumbnailUrl: z.string().nullable(),
      catalogUrl: z.string(),
    }),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ assetId }) => {
    const [details, thumbs] = await Promise.all([
      fetchAssetDetails(assetId).catch(() => null),
      fetchThumbnails([
        { requestId: "asset", type: "Asset", targetId: assetId, size: "700x700" },
      ]).catch(() => ({}) as Record<string, string | null>),
    ]);
    if (!details?.Name) {
      throw new ToolError(`No Roblox item found with asset ID ${assetId}.`);
    }

    const item = {
      id: assetId,
      name: details.Name,
      assetTypeId: details.AssetTypeId ?? null,
      creatorName: details.Creator?.Name ?? null,
      created: details.Created ?? null,
      thumbnailUrl: thumbs["asset"] ?? null,
      catalogUrl: `https://www.roblox.com/catalog/${assetId}`,
    };

    return {
      content: [
        { type: "text", text: `${item.name} (asset ${assetId}) — ${item.catalogUrl}` },
      ],
      structuredContent: { item },
    };
  },
});
