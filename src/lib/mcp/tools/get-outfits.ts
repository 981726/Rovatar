import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { fetchOutfits, fetchThumbnails, resolveUsername } from "../../roblox.server";
import { outfitSummaryShape } from "../schemas";

export default defineTool({
  name: "get_outfits",
  title: "List saved outfits",
  description:
    "List a Roblox player's saved outfits with thumbnail images of the avatar wearing each one.",
  inputSchema: {
    username: z.string().min(3).max(20).describe("Roblox username."),
  },
  outputSchema: {
    username: z.string(),
    outfits: z.array(z.object(outfitSummaryShape)),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ username }) => {
    const base = await resolveUsername(username);
    if (!base) throw new ToolError(`No Roblox player found for "${username}".`);

    const outfitList = await fetchOutfits(base.id).catch(() => []);
    const thumbs = await fetchThumbnails(
      outfitList.map((o) => ({
        requestId: `outfit-${o.id}`,
        type: "Outfit" as const,
        targetId: o.id,
        size: "420x420",
      })),
    ).catch(() => ({}) as Record<string, string | null>);

    const outfits = outfitList.map((o) => ({
      id: o.id,
      name: o.name,
      thumbnailUrl: thumbs[`outfit-${o.id}`] ?? null,
    }));

    return {
      content: [
        {
          type: "text",
          text:
            outfits.length === 0
              ? `@${base.name} has no saved outfits available to display.`
              : `@${base.name} has ${outfits.length} saved outfit${outfits.length === 1 ? "" : "s"}.`,
        },
      ],
      structuredContent: { username: base.name, outfits },
    };
  },
});
