import { lazy, Suspense, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BoxIcon, DownloadIcon, LoaderCircleIcon } from "lucide-react";

import { avatar3dOptions } from "@/lib/queries";

// Deferred: three.js + @react-three/fiber are a meaningful chunk (~400kb+
// gzipped) that most visitors will never need since 2D is the default view.
const Avatar3dViewer = lazy(() =>
  import("./avatar-3d-viewer").then((m) => ({ default: m.Avatar3dViewer })),
);

export function AvatarViewerCard({
  username,
  avatarThumbnailUrl,
  playerAvatarType,
}: {
  username: string;
  avatarThumbnailUrl: string | null;
  playerAvatarType: string;
}) {
  const [mode, setMode] = useState<"flat" | "3d">("flat");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const query = useQuery({ ...avatar3dOptions(username), enabled: mode === "3d" });

  const flatImage = avatarThumbnailUrl ? (
    <img
      src={avatarThumbnailUrl}
      alt={`${username}'s current Roblox avatar`}
      className="relative h-full w-full object-cover"
    />
  ) : (
    <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
      Avatar preview unavailable
    </div>
  );

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${username}-avatar.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-card elevated">
      <div className="relative aspect-square bg-plate">
        <div aria-hidden className="absolute inset-0 bg-studs opacity-50" />

        {mode === "flat" ? (
          flatImage
        ) : query.isPending ? (
          <div className="grid h-full w-full place-items-center">
            <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" aria-hidden />
          </div>
        ) : query.data ? (
          <Suspense
            fallback={
              <div className="grid h-full w-full place-items-center">
                <LoaderCircleIcon
                  className="size-6 animate-spin text-muted-foreground"
                  aria-hidden
                />
              </div>
            }
          >
            <Avatar3dViewer
              mesh={query.data}
              fallback={flatImage}
              onCanvasReady={(c) => (canvasRef.current = c)}
            />
          </Suspense>
        ) : (
          flatImage
        )}

        <div className="absolute right-2 top-2 z-10 flex gap-1.5">
          {mode === "3d" && query.data && (
            <button
              type="button"
              onClick={downloadPng}
              aria-label="Download avatar as PNG"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background/80 px-2 py-1 text-[11px] font-semibold backdrop-blur transition-colors hover:border-brand/50"
            >
              <DownloadIcon className="size-3" aria-hidden />
              PNG
            </button>
          )}
          <button
            type="button"
            onClick={() => setMode((m) => (m === "3d" ? "flat" : "3d"))}
            aria-pressed={mode === "3d"}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background/80 px-2 py-1 text-[11px] font-semibold backdrop-blur transition-colors hover:border-brand/50"
          >
            <BoxIcon className="size-3" aria-hidden />
            {mode === "3d" ? "2D" : "3D"}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border/60 p-3">
        <span className="text-eyebrow">Current avatar</span>
        <span className="truncate rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-semibold">
          {playerAvatarType}
        </span>
      </div>
    </div>
  );
}
