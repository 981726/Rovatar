import { z } from "zod";

/** Shared output shapes for the Rovatar MCP tools. */

export const assetItemShape = {
  id: z.number(),
  name: z.string(),
  assetType: z.object({ id: z.number(), name: z.string() }),
  thumbnailUrl: z.string().nullable(),
  catalogUrl: z.string(),
};

export const assetGroupShape = {
  category: z.string(),
  items: z.array(z.object(assetItemShape)),
};

export const outfitSummaryShape = {
  id: z.number(),
  name: z.string(),
  thumbnailUrl: z.string().nullable(),
};
