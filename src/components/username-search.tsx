import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

export function UsernameSearch({
  size = "md",
  autoFocus = false,
  className,
  onNavigate,
}: {
  size?: "md" | "lg";
  autoFocus?: boolean;
  className?: string;
  /** Called right before navigating (lets callers close menus etc). */
  onNavigate?: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const username = value.trim();
    if (!USERNAME_RE.test(username)) {
      setError("Enter a valid Roblox username (3–20 letters, numbers, or underscores).");
      return;
    }
    setError(null);
    onNavigate?.();
    void navigate({ to: "/user/$username", params: { username } });
  };

  const large = size === "lg";

  return (
    <div className={className}>
      <form
        onSubmit={submit}
        role="search"
        className={cn(
          "group flex items-stretch overflow-hidden rounded-xl border border-border bg-secondary/60 transition-colors",
          "focus-within:border-brand/60 focus-within:bg-secondary",
          large ? "p-1.5" : "p-1",
          error && "border-destructive focus-within:border-destructive",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-2.5">
          <SearchIcon
            className={cn(
              "shrink-0 text-muted-foreground transition-colors group-focus-within:text-brand",
              large ? "size-5" : "size-4",
            )}
            aria-hidden
          />
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            autoFocus={autoFocus}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={large ? "Enter a Roblox username…" : "Search username…"}
            aria-label="Roblox username"
            aria-invalid={Boolean(error)}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/80",
              large ? "h-11 text-base" : "h-8 text-sm",
            )}
          />
          {value && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setValue("")}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className={cn(
            "ml-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand font-semibold text-brand-foreground transition-opacity hover:opacity-90",
            large ? "px-5 text-sm" : "px-3 text-xs",
          )}
        >
          Search
          <ArrowRightIcon className={large ? "size-4" : "size-3.5"} aria-hidden />
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
