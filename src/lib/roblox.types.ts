/**
 * Shared Roblox data shapes. The UI is designed around these DTOs and never
 * talks to Roblox endpoints directly — swap the implementation in
 * roblox.server.ts without touching components.
 */

export interface RobloxUserSummary {
  id: number;
  name: string;
  displayName: string;
  hasVerifiedBadge: boolean;
}

export interface RobloxUserProfile extends RobloxUserSummary {
  description: string;
  created: string;
  isBanned: boolean;
}

export interface RobloxAssetType {
  id: number;
  name: string;
}

export interface RobloxAvatarAsset {
  id: number;
  name: string;
  assetType: RobloxAssetType;
  thumbnailUrl: string | null;
}

export interface RobloxAvatar {
  playerAvatarType: string;
  assets: RobloxAvatarAsset[];
}

export interface RobloxOutfit {
  id: number;
  name: string;
  isEditable: boolean;
  thumbnailUrl?: string | null;
}

export interface UserOverview {
  user: RobloxUserProfile;
  /** Null when Roblox didn't return avatar data (e.g. banned/deleted). */
  avatar: RobloxAvatar | null;
  avatarThumbnailUrl: string | null;
  headshotUrl: string | null;
  outfits: RobloxOutfit[];
}

export interface OutfitDetail {
  id: number;
  name: string;
  username: string;
  playerAvatarType: string | null;
  thumbnailUrl: string | null;
  assets: RobloxAvatarAsset[];
}

export interface ItemDetail {
  id: number;
  name: string;
  assetTypeId: number;
  assetTypeName: string;
  creatorName: string | null;
  creatorType: string | null;
  created: string | null;
  thumbnailUrl: string | null;
}

/* ------------------------------------------------------------------ */
/* Asset categorization (Roblox Avatar Editor style groupings)         */
/* ------------------------------------------------------------------ */

export const ASSET_GROUP_ORDER = ["clothing", "accessories", "body", "animation", "other"] as const;

export type AssetGroupKey = (typeof ASSET_GROUP_ORDER)[number];

export const ASSET_GROUP_LABELS: Record<AssetGroupKey, string> = {
  clothing: "Clothing",
  accessories: "Accessories",
  body: "Body",
  animation: "Animations",
  other: "Other",
};

/** assetTypeId ordering inside each group (order doubles as sort order). */
const GROUP_TYPES: Record<Exclude<AssetGroupKey, "other">, number[]> = {
  // Classic clothing followed by the newer layered clothing types. Keeping
  // these together prevents jackets and outerwear being lost in "Other".
  clothing: [11, 12, 2, 55, 56, 57, 58, 59, 60, 61, 62, 63, 65],
  accessories: [41, 8, 42, 43, 44, 45, 46, 47, 19], // Hair, Hat, Face, Neck, Shoulder, Front, Back, Waist, Gear
  body: [17, 18, 25, 26, 27, 28, 29, 30, 31, 66], // Heads, face, torso, limbs, dynamic heads
  animation: [48, 49, 50, 51, 52, 53, 54, 55, 56],
};

export function assetGroupOf(assetTypeId: number): AssetGroupKey {
  for (const key of ASSET_GROUP_ORDER) {
    if (key === "other") continue;
    if (GROUP_TYPES[key].includes(assetTypeId)) return key;
  }
  return "other";
}

export interface AssetGroup<T> {
  key: AssetGroupKey;
  label: string;
  items: T[];
}

/** Group avatar assets into non-empty, Roblox-editor-style categories. */
export function groupAssets<T extends { assetType: { id: number } }>(assets: T[]): AssetGroup<T>[] {
  const buckets = new Map<AssetGroupKey, T[]>();
  for (const asset of assets) {
    const key = assetGroupOf(asset.assetType.id);
    const list = buckets.get(key);
    if (list) list.push(asset);
    else buckets.set(key, [asset]);
  }
  return ASSET_GROUP_ORDER.filter((key) => buckets.has(key)).map((key) => {
    const order = key === "other" ? [] : GROUP_TYPES[key];
    const items = buckets
      .get(key)!
      .slice()
      .sort((a, b) => order.indexOf(a.assetType.id) - order.indexOf(b.assetType.id));
    return { key, label: ASSET_GROUP_LABELS[key], items };
  });
}

/** Asset type ids that belong to a top-level category page. */
export function assetTypeIdsForGroup(key: AssetGroupKey): number[] | null {
  return key === "other" ? null : GROUP_TYPES[key];
}

export function accountEra(created: string): { label: string; detail: string } | null {
  const year = new Date(created).getFullYear();
  if (!Number.isFinite(year)) return null;
  if (year <= 2009) return { label: "Classic era", detail: "Joined before 2010" };
  if (year <= 2016) return { label: "Tix era", detail: `Joined in ${year}` };
  if (year <= 2019) return { label: "Rthro era", detail: `Joined in ${year}` };
  if (year <= 2022) return { label: "Layered era", detail: `Joined in ${year}` };
  return { label: "Modern era", detail: `Joined in ${year}` };
}
