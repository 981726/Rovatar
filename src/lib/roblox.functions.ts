/**
 * Server functions exposed to the app. Thin wrappers only — all Roblox logic
 * lives in roblox.server.ts (module scope here must stay import-clean so
 * server-function code splitting works).
 */

import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import {
  fetchAssetDetails,
  fetchAvatar,
  fetchOutfitDetails,
  fetchOutfits,
  fetchThumbnails,
  fetchUserProfile,
  resolveUsername,
} from "./roblox.server";
import type {
  ItemDetail,
  OutfitDetail,
  RobloxOutfit,
  UserOverview,
} from "./roblox.types";

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

function parseUsername(data: unknown): { username: string } {
  const username = String((data as { username?: unknown })?.username ?? "").trim();
  if (!USERNAME_RE.test(username)) {
    throw new Error("Enter a valid Roblox username (3–20 letters, numbers, or underscores).");
  }
  return { username };
}

export const getUserOverview = createServerFn({ method: "GET" })
  .validator(parseUsername)
  .handler(async ({ data }): Promise<UserOverview> => {
    const base = await resolveUsername(data.username);
    if (!base) throw notFound();

    const [profile, avatarRaw, outfitList] = await Promise.all([
      fetchUserProfile(base.id).catch(() => null),
      fetchAvatar(base.id).catch(() => null),
      fetchOutfits(base.id).catch(() => [] as RobloxOutfit[]),
    ]);

    const thumbs = await fetchThumbnails([
      { requestId: "avatar", type: "Avatar", targetId: base.id, size: "720x720" },
      { requestId: "headshot", type: "AvatarHeadShot", targetId: base.id, size: "150x150" },
      ...(avatarRaw?.assets ?? []).map((a) => ({
        requestId: `asset-${a.id}` as const,
        type: "Asset" as const,
        targetId: a.id,
        size: "420x420",
      })),
    ]).catch(() => ({}) as Record<string, string | null>);

    return {
      user: {
        id: base.id,
        name: profile?.name ?? base.name,
        displayName: profile?.displayName ?? base.displayName,
        hasVerifiedBadge: profile?.hasVerifiedBadge ?? base.hasVerifiedBadge,
        description: profile?.description ?? "",
        created: profile?.created ?? "",
        isBanned: profile?.isBanned ?? false,
      },
      avatar: avatarRaw
        ? {
            playerAvatarType: avatarRaw.playerAvatarType,
            assets: avatarRaw.assets.map((a) => ({
              id: a.id,
              name: a.name,
              assetType: a.assetType,
              thumbnailUrl: thumbs[`asset-${a.id}`] ?? null,
            })),
          }
        : null,
      avatarThumbnailUrl: thumbs["avatar"] ?? null,
      headshotUrl: thumbs["headshot"] ?? null,
      outfits: outfitList,
    };
  });

export const getUserOutfits = createServerFn({ method: "GET" })
  .validator(parseUsername)
  .handler(async ({ data }) => {
    const base = await resolveUsername(data.username);
    if (!base) throw notFound();

    const outfitList = await fetchOutfits(base.id);
    const thumbs = await fetchThumbnails(
      outfitList.map((o) => ({
        requestId: `outfit-${o.id}`,
        type: "Outfit" as const,
        targetId: o.id,
        size: "420x420",
      })),
    ).catch(() => ({}) as Record<string, string | null>);

    return {
      user: base,
      outfits: outfitList.map((o) => ({
        ...o,
        thumbnailUrl: thumbs[`outfit-${o.id}`] ?? null,
      })),
    };
  });

export const getOutfitDetail = createServerFn({ method: "GET" })
  .validator((raw: unknown) => {
    const { username } = parseUsername(raw);
    const outfitId = Number((raw as { outfitId?: unknown })?.outfitId);
    if (!Number.isInteger(outfitId) || outfitId <= 0) {
      throw new Error("Invalid outfit id.");
    }
    return { username, outfitId };
  })
  .handler(async ({ data }): Promise<OutfitDetail> => {
    const base = await resolveUsername(data.username);
    if (!base) throw notFound();

    const [details, outfitList] = await Promise.all([
      fetchOutfitDetails(data.outfitId),
      fetchOutfits(base.id).catch(() => [] as RobloxOutfit[]),
    ]);
    const name =
      outfitList.find((o) => o.id === data.outfitId)?.name ?? "Outfit";

    const assets = details.assets ?? [];
    const thumbs = await fetchThumbnails([
      { requestId: "outfit", type: "Outfit", targetId: data.outfitId, size: "720x720" },
      ...assets.map((a) => ({
        requestId: `asset-${a.id}` as const,
        type: "Asset" as const,
        targetId: a.id,
        size: "420x420",
      })),
    ]).catch(() => ({}) as Record<string, string | null>);

    return {
      id: data.outfitId,
      name,
      username: base.name,
      playerAvatarType: details.playerAvatarType ?? null,
      thumbnailUrl: thumbs["outfit"] ?? null,
      assets: assets.map((a) => ({
        id: a.id,
        name: a.name,
        assetType: a.assetType,
        thumbnailUrl: thumbs[`asset-${a.id}`] ?? null,
      })),
    };
  });

export const getItemDetail = createServerFn({ method: "GET" })
  .validator((raw: unknown) => {
    const assetId = Number((raw as { assetId?: unknown })?.assetId);
    if (!Number.isInteger(assetId) || assetId <= 0) {
      throw new Error("Invalid asset id.");
    }
    return { assetId };
  })
  .handler(async ({ data }): Promise<ItemDetail> => {
    const [details, thumbs] = await Promise.all([
      fetchAssetDetails(data.assetId).catch(() => null),
      fetchThumbnails([
        {
          requestId: "asset",
          type: "Asset",
          targetId: data.assetId,
          size: "700x700",
        },
      ]).catch(() => ({}) as Record<string, string | null>),
    ]);
    if (!details?.Name) throw notFound();

    return {
      id: data.assetId,
      name: details.Name,
      assetTypeId: details.AssetTypeId ?? 0,
      assetTypeName: "",
      creatorName: details.Creator?.Name ?? null,
      creatorType: details.Creator?.CreatorType ?? null,
      created: details.Created ?? null,
      thumbnailUrl: thumbs["asset"] ?? null,
    };
  });
