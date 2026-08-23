import { queryOptions } from "@tanstack/react-query";
import {
  getAvatar3d,
  getItemDetail,
  getOutfitDetail,
  getUserOutfits,
  getUserOverview,
} from "./roblox.functions";

export const userOverviewOptions = (username: string) =>
  queryOptions({
    queryKey: ["roblox", "user", username.trim().toLowerCase()],
    queryFn: () => getUserOverview({ data: { username } }),
    staleTime: 60_000,
    retry: 1,
  });

export const userOutfitsOptions = (username: string) =>
  queryOptions({
    queryKey: ["roblox", "user", username.trim().toLowerCase(), "outfits"],
    queryFn: () => getUserOutfits({ data: { username } }),
    staleTime: 60_000,
    retry: 1,
  });

export const outfitDetailOptions = (username: string, outfitId: number) =>
  queryOptions({
    queryKey: ["roblox", "user", username.trim().toLowerCase(), "outfit", outfitId],
    queryFn: () => getOutfitDetail({ data: { username, outfitId } }),
    staleTime: 60_000,
    retry: 1,
  });

export const avatar3dOptions = (username: string) =>
  queryOptions({
    queryKey: ["roblox", "user", username.trim().toLowerCase(), "avatar3d"],
    queryFn: () => getAvatar3d({ data: { username } }),
    staleTime: 300_000,
    retry: 0,
  });

export const itemDetailOptions = (assetId: number) =>
  queryOptions({
    queryKey: ["roblox", "item", assetId],
    queryFn: () => getItemDetail({ data: { assetId } }),
    staleTime: 300_000,
    retry: 1,
  });
