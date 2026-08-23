/**
 * Resolves a Roblox content hash (as returned by the avatar-3d endpoint's
 * obj/mtl/texture fields) to its actual t0-t7.rbxcdn.com CDN shard.
 *
 * Pure and isomorphic on purpose: the server uses it once for the top-level
 * obj/mtl URLs, and the 3D viewer needs the identical function client-side
 * as a three.js loader URL modifier, since the .mtl file internally
 * references texture files by hash only — each has to be resolved the same
 * way at load time, not just the ones we already know about up front.
 */
export function resolveRbxCdnUrl(hash: string): string {
  let i = 31;
  for (let t = 0; t < 38 && t < hash.length; t++) {
    i ^= hash.charCodeAt(t);
  }
  return `https://t${i % 8}.rbxcdn.com/${hash}`;
}
