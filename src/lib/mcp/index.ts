import { defineMcp } from "@lovable.dev/mcp-js";

import getAvatarTool from "./tools/get-avatar";
import getItemTool from "./tools/get-item";
import getOutfitTool from "./tools/get-outfit";
import getOutfitsTool from "./tools/get-outfits";
import searchUserTool from "./tools/search-user";

export default defineMcp({
  name: "avatar-viewer-mcp",
  title: "Rovatar",
  version: "0.1.0",
  instructions:
    "Read-only tools for exploring public Roblox player data. Typical flow: search_user to resolve a username, get_avatar for what they're wearing, get_outfits to list saved outfits, get_outfit to inspect one outfit's items, and get_item for catalog details on any asset ID. All data is public Roblox API data; catalogUrl fields link to roblox.com.",
  tools: [searchUserTool, getAvatarTool, getOutfitsTool, getOutfitTool, getItemTool],
});
