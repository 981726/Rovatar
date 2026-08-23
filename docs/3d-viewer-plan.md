# 3D Avatar Viewer — Implementation Plan

Scoping notes for the interactive 3D avatar viewer (rotate/pan/zoom), pose
picker, and related export features requested for Rovatar. This is real
work, not a quick add — this doc breaks it into independently shippable
stages so it can be built incrementally across sessions.

## Feasibility

Roblox exposes a real 3D-model endpoint used by their own site:

```
GET https://thumbnails.roblox.com/v1/users/avatar-3d?userId={id}
```

This returns `{ state, imageUrl }`. Once `state === "Completed"`,
`imageUrl` points to a JSON payload containing:

- `camera` — suggested camera position/direction/fov
- `aabb` — bounding box of the model (min/max) — useful for framing
- `obj` — hash of the mesh (Wavefront .obj)
- `mtl` — hash of the material file
- `textures[]` — hashes of texture images

The `obj`/`mtl`/`texture` hashes are **not** full URLs — each has to be
resolved to a specific `tN.rbxcdn.com` CDN shard via a hash function
(documented on the Roblox DevForum; formula changes occasionally, so this
needs to be isolated behind one small utility to make it easy to patch).

This is a **real, non-fake** 3D asset — it satisfies the README's "do not
create fake 3D functionality" requirement, unlike a rotating flat image.

There's an equivalent endpoint for individual catalog assets
(`/v1/assets-thumbnail-3d?assetId=`), which is what would power a
"preview this item in 3D" affordance later.

## Constraints to design around

- The model can be in a `Pending` state right after a user is looked up;
  needs polling with backoff, same pattern as the existing avatar-image
  fetch, before falling back to the flat thumbnail.
- No animation/pose data ships with this endpoint — it's a static rest
  pose. A true "pose & animation picker" (walk cycles, emotes) is **out
  of scope for the public API** entirely; Roblox does not expose rigged
  animation data for arbitrary users. This should be scoped down to:
  camera-angle presets ("bust", "full body", "3/4 view") rather than
  actual character animation, and framed to the user as such rather than
  promised as real emotes.
- Rendering needs `three.js` (~600kb) — should be lazy-loaded only on
  routes that use the viewer, not in the main bundle.
- CORS/textures: must intercept resource URLs at the loader level (the
  `URLModifier` pattern) since the mtl/obj/texture files can each live on
  different CDN shards.

## Staged rollout

**Stage 1 — service layer (small, isolated)**
Add `fetchAvatar3d(userId)` to `roblox.server.ts`: calls the endpoint,
polls on `Pending`, resolves the CDN hash function into full URLs, returns
`{ objUrl, mtlUrl, textureUrls, camera, aabb }`. No UI yet. Fully testable
on its own.

**Stage 2 — minimal viewer component**
New `avatar-3d-viewer.tsx` using `@react-three/fiber` + `OrbitControls`:
loads the resolved URLs, frames the camera from `aabb`, allows drag-to-
rotate / scroll-to-zoom. Rendered behind a "3D" toggle next to the
existing flat avatar image — flat image stays the default/fallback so a
slow or pending model never blocks the page.

**Stage 3 — polish**
Auto-rotate when idle, loading skeleton matching the avatar frame, error
state that falls back to the flat thumbnail silently (per the README's
error-state guidance), camera-angle presets (bust / full body / 3-4
view) instead of true pose animation.

**Stage 4 (separate feature, not blocked on the above) — PNG export**
Canvas `toDataURL`/`toBlob` off the three.js renderer for a transparent
PNG export ("Download Suite"), reusing the same camera presets from
Stage 3.

## Explicitly descoped for the public API

- Real emotes/walk cycles/custom poses — no public endpoint exposes rig
  animation for arbitrary users. If this is wanted later, it would mean
  either shipping a small fixed set of generic humanoid animations
  applied to the fetched rig (a real but much larger effort involving
  skeal binding), or dropping the "animation" framing entirely in favor
  of camera presets.
- Custom skybox/background environments beyond simple color/gradient
  presets — no data source for this exists per-user; would be static
  presets the app ships, not something derived from Roblox data.

## Next step

Build Stage 1 (service layer only) in the next session — it's isolated,
testable without any UI changes, and de-risks the CDN-hash-resolution
part before any rendering code depends on it.
