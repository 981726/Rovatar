/** Recently searched players, stored locally. Best-effort, SSR-safe. */

export interface RecentUser {
  name: string;
  displayName: string;
}

const KEY = "avatar-viewer:recent-users";
const MAX = 6;

export function readRecentUsers(): RecentUser[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (u): u is RecentUser =>
          !!u && typeof u === "object" && typeof (u as RecentUser).name === "string",
      )
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function rememberUser(user: RecentUser) {
  try {
    const next = [
      { name: user.name, displayName: user.displayName },
      ...readRecentUsers().filter(
        (u) => u.name.toLowerCase() !== user.name.toLowerCase(),
      ),
    ].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — ignore
  }
}
