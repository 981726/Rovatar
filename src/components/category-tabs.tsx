import { Link } from "@tanstack/react-router";

const TABS = [
  { label: "Overview", to: "/user/$username", exact: true },
  { label: "Outfits", to: "/user/$username/outfits", exact: false },
  { label: "Clothing", to: "/user/$username/clothing", exact: false },
  { label: "Accessories", to: "/user/$username/accessories", exact: false },
  { label: "Body", to: "/user/$username/body", exact: false },
] as const;

/** Roblox Avatar Editor style category bar: compact pills in an inset track. */
export function CategoryTabs({ username }: { username: string }) {
  return (
    <nav
      aria-label="Avatar categories"
      className="scrollbar-subtle mt-5 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface/70 p-1"
    >
      {TABS.map((tab) => (
        <Link
          key={tab.label}
          to={tab.to}
          params={{ username }}
          activeOptions={{ exact: tab.exact }}
          className="shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
          activeProps={{
            className:
              "bg-brand text-brand-foreground hover:bg-brand hover:text-brand-foreground",
          }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
