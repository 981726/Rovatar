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

/**
 * Official Roblox subdomains block a meaningful share of server-to-server
 * traffic (rate limits, and outright 403s from IPs that look like cloud /
 * datacenter hosts — which is exactly what most deployment targets are).
 * roproxy.com mirrors the same public endpoints 1:1 under the same paths,
 * just on a different host, so on a blocked/limited response we retry the
 * identical request against the mirror before giving up.
 */
const MIRROR_HOST_MAP: Record<string, string> = {
  "users.roblox.com": "users.roproxy.com",
  "avatar.roblox.com": "avatar.roproxy.com",
  "thumbnails.roblox.com": "thumbnails.roproxy.com",
  "economy.roblox.com": "economy.roproxy.com",
};

function toMirrorUrl(url: string): string | null {
  const parsed = new URL(url);
  const mirrorHost = MIRROR_HOST_MAP[parsed.hostname];
  if (!mirrorHost) return null;
  parsed.hostname = mirrorHost;
  return parsed.toString();
}

// Statuses worth retrying against the mirror: 429 (rate limited), 403
// (blocked — Roblox's Cloudflare layer occasionally challenges datacenter
// IPs outright instead of rate-limiting them), and 503 (upstream hiccup).
const MIRROR_FALLBACK_STATUSES = new Set([403, 429, 503]);

async function fetchJson<T>(
  url: string,
  init?: RequestInit,
  attempt = 0,
  maxRetries = 2,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...BASE_HEADERS, ...(init?.headers ?? {}) },
  });

  if (res.status === 429 && attempt < maxRetries) {
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 900 * 2 ** attempt;
    await sleep(Math.min(wait, 8000));
    return fetchJson(url, init, attempt + 1, maxRetries);
  }

  if (!res.ok) {
    if (MIRROR_FALLBACK_STATUSES.has(res.status)) {
      const mirrorUrl = toMirrorUrl(url);
      if (mirrorUrl) {
        const mirrorRes = await fetch(mirrorUrl, {
          ...init,
          headers: { ...BASE_HEADERS, ...(init?.headers ?? {}) },
        });
        if (mirrorRes.ok) return (await mirrorRes.json()) as T;
      }
    }
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

export async function resolveUsername(username: string): Promise<ResolvedUsername | null> {
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
  return fetchJson<UserProfileResponse>(`https://users.roblox.com/v1/users/${userId}`);
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
 * cache aggressively on top of the shared mirror fallback above.
 */
const AVATAR_CACHE_TTL_MS = 5 * 60 * 1000;
const avatarCache = new Map<number, { at: number; data: AvatarResponse }>();

export async function fetchAvatar(userId: number): Promise<AvatarResponse> {
  const cached = avatarCache.get(userId);
  if (cached && Date.now() - cached.at < AVATAR_CACHE_TTL_MS) {
    return cached.data;
  }
  // maxRetries=0: this endpoint's bucket is hourly, so waiting never helps —
  // fall through to the mirror immediately (handled inside fetchJson).
  const data = await fetchJson<AvatarResponse>(
    `https://avatar.roblox.com/v1/users/${userId}/avatar`,
    undefined,
    0,
    0,
  );
  avatarCache.set(userId, { at: Date.now(), data });
  return data;
}

export interface OutfitSummaryResponse {
  id: number;
  name: string;
  isEditable: boolean;
}

export async function fetchOutfits(userId: number): Promise<OutfitSummaryResponse[]> {
  const data = await fetchJson<{
    data?: Array<{ id: number; name: string; isEditable: boolean }>;
  }>(`https://avatar.roblox.com/v1/users/${userId}/outfits?page=1&itemsPerPage=50`);
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
  return fetchJson<AssetDetailsResponse>(`https://economy.roblox.com/v2/assets/${assetId}/details`);
}

/* --------------------------- avatar 3D ------------------------------ */

export interface Avatar3dResponse {
  camera: {
    position: { x: number; y: number; z: number };
    direction: { x: number; y: number; z: number };
    fov: number;
  };
  aabb: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  obj: string;
  mtl: string;
  textures: string[];
}

const AVATAR_3D_CACHE_TTL_MS = 5 * 60 * 1000;
const avatar3dCache = new Map<number, { at: number; data: Avatar3dResponse | null }>();

/**
 * Fetches the real (non-fake) 3D mesh for a user's current avatar: an
 * obj/mtl/texture set on Roblox's own CDN. Polls briefly if the render is
 * still `Pending`, then gives up and returns null so callers can fall back
 * to the flat thumbnail image.
 */
export async function fetchAvatar3d(userId: number): Promise<Avatar3dResponse | null> {
  const cached = avatar3dCache.get(userId);
  if (cached && Date.now() - cached.at < AVATAR_3D_CACHE_TTL_MS) {
    return cached.data;
  }

  let data: Avatar3dResponse | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const meta = await fetchJson<{ state: string; imageUrl: string | null }>(
      `https://thumbnails.roblox.com/v1/users/avatar-3d?userId=${userId}`,
    );
    if (meta.state === "Completed" && meta.imageUrl) {
      data = await fetchJson<Avatar3dResponse>(meta.imageUrl);
      break;
    }
    if (meta.state !== "Pending") break;
    await sleep(600 * (attempt + 1));
  }

  avatar3dCache.set(userId, { at: Date.now(), data });
  return data;
}
