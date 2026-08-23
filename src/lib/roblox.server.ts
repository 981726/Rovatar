/**
 * Roblox public API service layer.
 *
 * Server-only: Roblox's public APIs don't send CORS headers, so all calls go
 * through server functions that wrap these helpers. Components never see
 * these URLs.
 */

const BASE_HEADERS = {
  Accept: "application/json",
  "User-Agent": "RobloxAvatarViewer/1.0",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJson<T>(
  url: string,
  init?: RequestInit,
  attempt = 0,
  maxRetries = 4,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...BASE_HEADERS, ...(init?.headers ?? {}) },
  });
  // Roblox rate-limits aggressively per IP; back off and retry on 429.
  if (res.status === 429 && attempt < maxRetries) {
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 900 * 2 ** attempt;
    await sleep(Math.min(wait, 8000));
    return fetchJson(url, init, attempt + 1, maxRetries);
  }
  if (!res.ok) {
    throw new Error(`Roblox request failed (${res.status}) for ${url}`);
  }
  return (await res.json()) as T;
}

/* ------------------------------ users ------------------------------ */

export interface ResolvedUsername {
  id: number;
  name: string;
  displayName: string;
  hasVerifiedBadge: boolean;
}

export async function resolveUsername(
  username: string,
): Promise<ResolvedUsername | null> {
  const data = await fetchJson<{
    data?: Array<{
      id: number;
      name: string;
      displayName: string;
      hasVerifiedBadge: boolean;
    }>;
  }>("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
  });
  return data.data?.[0] ?? null;
}

export interface UserProfileResponse {
  id: number;
  name: string;
  displayName: string;
  hasVerifiedBadge: boolean;
  description: string;
  created: string;
  isBanned: boolean;
}

export function fetchUserProfile(userId: number) {
  return fetchJson<UserProfileResponse>(
    `https://users.roblox.com/v1/users/${userId}`,
  );
}

/* ------------------------------ avatar ----------------------------- */

export interface AvatarAssetResponse {
  id: number;
  name: string;
  assetType: { id: number; name: string };
}

export interface AvatarResponse {
  playerAvatarType: string;
  assets: AvatarAssetResponse[];
}

/**
 * The official avatar endpoint allows only 6 requests/hour per IP, so we
 * cache aggressively and fall back to the community mirror (roproxy.com),
 * which serves the same payload without the tight bucket.
 */
const AVATAR_CACHE_TTL_MS = 5 * 60 * 1000;
const avatarCache = new Map<number, { at: number; data: AvatarResponse }>();

export async function fetchAvatar(userId: number): Promise<AvatarResponse> {
  const cached = avatarCache.get(userId);
  if (cached && Date.now() - cached.at < AVATAR_CACHE_TTL_MS) {
    return cached.data;
  }
  let data: AvatarResponse;
  try {
    // maxRetries=0: this endpoint's bucket is hourly, so waiting never helps —
    // fall through to the mirror immediately.
    data = await fetchJson<AvatarResponse>(
      `https://avatar.roblox.com/v1/users/${userId}/avatar`,
      undefined,
      0,
      0,
    );
  } catch (err) {
    if (!(err instanceof Error && err.message.includes("(429)"))) throw err;
    data = await fetchJson<AvatarResponse>(
      `https://avatar.roproxy.com/v1/users/${userId}/avatar`,
    );
  }
  avatarCache.set(userId, { at: Date.now(), data });
  return data;
}

export interface OutfitSummaryResponse {
  id: number;
  name: string;
  isEditable: boolean;
}

export async function fetchOutfits(
  userId: number,
): Promise<OutfitSummaryResponse[]> {
  const data = await fetchJson<{
    data?: Array<{ id: number; name: string; isEditable: boolean }>;
  }>(
    `https://avatar.roblox.com/v1/users/${userId}/outfits?page=1&itemsPerPage=50`,
  );
  return (data.data ?? []).map((o) => ({
    id: o.id,
    name: o.name,
    isEditable: Boolean(o.isEditable),
  }));
}

export interface OutfitDetailsResponse {
  playerAvatarType?: string;
  assets?: AvatarAssetResponse[];
}

export function fetchOutfitDetails(outfitId: number) {
  return fetchJson<OutfitDetailsResponse>(
    `https://avatar.roblox.com/v1/outfits/${outfitId}/details`,
  );
}

/* ---------------------------- thumbnails ---------------------------- */

export interface ThumbnailRequest {
  requestId: string;
  type: "Avatar" | "AvatarHeadShot" | "Asset" | "Outfit";
  targetId: number;
  size: string;
}

export async function fetchThumbnails(
  requests: ThumbnailRequest[],
): Promise<Record<string, string | null>> {
  const map: Record<string, string | null> = {};
  if (requests.length === 0) return map;

  // Batch endpoint accepts up to 100 requests per call.
  for (let i = 0; i < requests.length; i += 100) {
    const chunk = requests.slice(i, i + 100);
    const data = await fetchJson<{
      data?: Array<{
        requestId: string;
        state: string;
        imageUrl?: string;
      }>;
    }>("https://thumbnails.roblox.com/v1/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The batch endpoint takes a raw array of requests, not a wrapper object.
      body: JSON.stringify(
        chunk.map((r) => ({
          ...r,
          format: "Png",
          isCircular: false,
        })),
      ),
    });
    for (const t of data.data ?? []) {
      map[t.requestId] = t.state === "Completed" ? (t.imageUrl ?? null) : null;
    }
  }
  return map;
}

/* ------------------------------ assets ----------------------------- */

export interface AssetDetailsResponse {
  Name?: string;
  AssetTypeId?: number;
  Creator?: { Name?: string; CreatorType?: string };
  Created?: string;
}

export function fetchAssetDetails(assetId: number) {
  return fetchJson<AssetDetailsResponse>(
    `https://economy.roblox.com/v2/assets/${assetId}/details`,
  );
}
