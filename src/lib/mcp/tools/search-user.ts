import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { fetchUserProfile, resolveUsername } from "../../roblox.server";

export default defineTool({
  name: "search_user",
  title: "Search Roblox user",
  description:
    "Resolve a Roblox username to the player's profile (user ID, display name, verified badge, join date).",
  inputSchema: {
    username: z.string().min(3).max(20).describe("Roblox username to look up."),
  },
  outputSchema: {
    found: z.boolean(),
    user: z
      .object({
        id: z.number(),
        name: z.string(),
        displayName: z.string(),
        hasVerifiedBadge: z.boolean(),
        description: z.string(),
        created: z.string(),
        isBanned: z.boolean(),
        profileUrl: z.string(),
      })
      .optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ username }) => {
    const base = await resolveUsername(username);
    if (!base) {
      return {
        content: [{ type: "text", text: `No Roblox player found for "${username}".` }],
        structuredContent: { found: false },
      };
    }
    const profile = await fetchUserProfile(base.id).catch(() => null);
    const user = {
      id: base.id,
      name: base.name,
      displayName: profile?.displayName ?? base.displayName,
      hasVerifiedBadge: profile?.hasVerifiedBadge ?? base.hasVerifiedBadge,
      description: profile?.description ?? "",
      created: profile?.created ?? "",
      isBanned: profile?.isBanned ?? false,
      profileUrl: `https://www.roblox.com/users/${base.id}/profile`,
    };
    return {
      content: [
        {
          type: "text",
          text: `${user.displayName} (@${user.name}) — user ID ${user.id}`,
        },
      ],
      structuredContent: { found: true, user },
    };
  },
});
