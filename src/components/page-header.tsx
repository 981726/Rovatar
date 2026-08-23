import type { ReactNode } from "react";

/** Shared heading row for the category / outfit list pages. */
export function PageHeader({
  title,
  count,
  subtitle,
  action,
}: {
  title: string;
  count?: number;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {typeof count === "number" && (
            <span className="rounded-md border border-brand/30 bg-brand/12 px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-brand">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
