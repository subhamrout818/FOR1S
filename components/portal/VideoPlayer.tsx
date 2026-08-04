"use client";

import { Play } from "lucide-react";
import { KIND_LABEL } from "@/lib/portal-format";
import { cn } from "@/lib/utils";

/**
 * Media preview for a deliverable. Renders a real <video> when a URL exists
 * ("#" = placeholder marker), otherwise a styled placeholder poster so the
 * deliverable page still reads as a player.
 */
export default function VideoPlayer({
  src,
  poster,
  title,
  kind = "reel",
  className,
}: {
  src?: string | null;
  poster?: string | null;
  title?: string;
  kind?: string;
  className?: string;
}) {
  const hasVideo = !!src && src !== "#";

  if (hasVideo) {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster ?? undefined}
        className={cn(
          "h-full w-full bg-black object-contain",
          className
        )}
      >
        <source src={src!} />
        Your browser doesn&apos;t support embedded video.
      </video>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-surface",
        className
      )}
    >
      {/* faint grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(230,57,70,0.12), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-white/5 backdrop-blur-sm">
        <Play size={22} className="ml-1 text-foreground/80" />
      </div>
      <p className="relative z-10 mt-4 px-6 text-center font-display text-sm font-medium text-foreground/80">
        {title ?? "Preview"}
      </p>
      <p className="relative z-10 mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
        {KIND_LABEL[kind] ?? kind} · awaiting upload
      </p>
    </div>
  );
}
