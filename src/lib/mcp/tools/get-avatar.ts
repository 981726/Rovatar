import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

import {
  fetchAvatar,
  fetchThumbnails,
  resolveUsername,
} from "../../roblox.server";
import { groupAssets } from "../../roblox.types";
import { assetGroupShape } from "../schemas";

export default defineTool({
  name: "get_avatar",
  title: "Get current avatar",
  description:
    "Fetch a Roblox player's current avatar: body type (R6/R15) and every equipped item with thumbnails, grouped by category.",
  inputSchema: {
    username: z.string().min(3).max(20).describe("Roblox username."),
  },
  outputSchema: {
    username: z.string(),
    playerAvatarType: z.string(),
    avatarThumbnailUrl: z.string().nullable(),
    itemCount: z.number(),
    groups: z.array(z.object(assetGroupShape)),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ username }) => {
    const base = await resolveUsername(username);
    if (!base) throw new ToolError(`No Roblox player found for "${username}".`);

    const avatar = await fetchAvatar(base.id).catch(() => null);
    if (!avatar) {
      throw new ToolError(`Roblox didn't return avatar data for @${base.name}.`);
    }

    const thumbs = await fetchThumbnails([
      { requestId: "avatar", type: "Avatar", targetId: base.id, size: "720x720" },
      ...avatar.assets.map((a) => ({
        requestId: `asset-${a.id}`,
        type: "Asset" as const,
        targetId: a.id,
        size: "420x420",
      })),
    ]).catch(() => ({}) as Record<string, string | null>);

    const assets = avatar.assets.map((a) => ({
      id: a.id,
      name: a.name,
      assetType: a.assetType,
      thumbnailUrl: thumbs[`asset-${a.id}`] ?? null,
      catalogUrl: `https://www.roblox.com/catalog/${a.id}`,
    }));

    const groups = groupAssets(assets).map((g) => ({
      category: g.label,
      items: g.items,
    }));

    return {
      content: [
        {
          type: "text",
          text: `@${base.name}'s avatar (${avatar.playerAvatarType}): ${assets.length} items equipped.`,
        },
      ],
      structuredContent: {
        username: base.name,
        playerAvatarType: avatar.playerAvatarType,
        avatarThumbnailUrl: thumbs["avatar"] ?? null,
        itemCount: assets.length,
        groups,
      },
    };
  },
});
