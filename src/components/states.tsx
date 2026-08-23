import { useRouter } from "@tanstack/react-router";
import { CloudOffIcon, RefreshCwIcon, SearchIcon, UserXIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
      <div aria-hidden className="absolute inset-0 bg-studs opacity-60" />
      <div className="relative mb-4 grid size-12 place-items-center rounded-xl border border-border bg-card text-brand">
        {icon ?? <SearchIcon className="size-5" aria-hidden />}
      </div>
      <h2 className="relative text-lg font-bold">{title}</h2>
      <p className="relative mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="relative mt-6">{action}</div>}
    </div>
  );
}

export function LoadErrorState({
  title = "Couldn't load this page",
  description = "Roblox didn't return the information we needed. Try again.",
}: {
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  return (
    <EmptyState
      icon={<CloudOffIcon className="size-5" aria-hidden />}
      title={title}
      description={description}
      action={
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          <RefreshCwIcon className="size-4" aria-hidden />
          Retry
        </button>
      }
    />
  );
}

export function UserNotFoundState({ username }: { username: string }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20">
      <EmptyState
        icon={<UserXIcon className="size-5" aria-hidden />}
        title="User not found"
        description={`We couldn't find a Roblox player named "${username}". Check the spelling and try again.`}
        action={
          <a
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            <SearchIcon className="size-4" aria-hidden />
            Search again
          </a>
        }
      />
    </div>
  );
}
