import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon, MessageCircleIcon, PersonStandingIcon } from "lucide-react";

const DISCORD_USER_ID = "1018319713916432394";

export function AppFooter() {
  return (
    <footer className="border-t bg-[#101215]">
      <section className="border-b bg-[#15181d]">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <article className="overflow-hidden border border-white/10 bg-[#111318]">
            <div className="h-1 bg-brand" />
            <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center border border-brand/50 bg-brand/15 text-sm font-extrabold tracking-tight text-brand">
                  LC
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="font-bold">LC</p>
                    <span className="text-xs text-muted-foreground">Rovatar builder</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Building a better way to inspect Roblox avatars.
                  </p>
                </div>
              </div>
              <a
                href={`discord://-/users/${DISCORD_USER_ID}`}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm bg-[#5865f2] px-4 text-sm font-bold text-white transition-colors hover:bg-[#6974f7]"
                aria-label="Open LC's Discord profile"
              >
                <MessageCircleIcon className="size-4" aria-hidden />
                Add on Discord
                <ArrowUpRightIcon className="size-4" aria-hidden />
              </a>
            </div>
          </article>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid size-6 place-items-center rounded-sm bg-brand text-brand-foreground">
              <PersonStandingIcon className="size-3.5" aria-hidden />
            </span>
            Rovatar
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Search public Roblox profiles. Inspect avatar items. Keep the IDs.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Explore
          </h2>
          <nav className="mt-3 flex flex-col items-start gap-2 text-sm">
            <Link to="/" className="hover:text-brand">
              Player search
            </Link>
            <Link to="/" className="hover:text-brand">
              Avatar lookup
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Community
          </h2>
          <a
            href={`discord://-/users/${DISCORD_USER_ID}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm hover:text-brand"
          >
            Discord <ArrowUpRightIcon className="size-3.5" aria-hidden />
          </a>
          <p className="mt-2 text-xs text-muted-foreground">User ID {DISCORD_USER_ID}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Legal
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">Public Roblox data only.</p>
          <p className="mt-2 text-sm text-muted-foreground">Do Not Sell My Personal Information</p>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Rovatar</span>
          <span>Not affiliated with Roblox Corporation.</span>
        </div>
      </div>
    </footer>
  );
}
