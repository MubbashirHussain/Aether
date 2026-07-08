"use client";

import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdSenseSlot } from "./adsense-slot";

export type AdBannerProps = {
  isDark: boolean;
  highlightAds: boolean;
  onHighlightToggle?: (highlight: boolean) => void;
  clientId: string;
  slotId?: string;
};

export function AdBanner({
  isDark,
  highlightAds,
  onHighlightToggle,
  clientId,
  slotId = "9876543210",
}: AdBannerProps) {
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";

  return (
    <div
      className={cn(
        "max-w-6xl mx-auto px-4 my-4 rounded-lg overflow-hidden",
        isDark ? "skeleton-shimmer-dark" : "skeleton-shimmer-light",
      )}
    >
      {/* <div
        className={cn(
          "relative rounded-xl border transition-all overflow-hidden",
          highlightAds
            ? isDark
              ? "bg-amber-950/10 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
              : "bg-amber-50/50 border-amber-400/60 shadow-sm"
            : isDark
              ? "bg-zinc-900/60 border-zinc-900/50"
              : "bg-white border-zinc-200 shadow-sm",
        )}
      >
        {highlightAds && (
          <div
            className={cn(
              "absolute top-0 left-0 right-0 border-b px-3 py-1 flex items-center justify-between text-[8px] sm:text-[9px] font-mono z-10",
              isDark
                ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                : "bg-amber-50 border-amber-200 text-amber-800",
            )}
          >
            <span className="flex items-center gap-1 truncate">
              <DollarSign className="w-3.5 h-3.5" />{" "}
              <strong>Google AdSense Spot: Top Leaderboard [{slotId}]</strong>
            </span>
            <span className="bg-amber-500 text-zinc-950 px-1 rounded font-bold uppercase text-[7px] tracking-wider shrink-0">
              MAX RPM
            </span>
          </div>
        )}

        <div
          className={cn(
            "flex flex-col items-center justify-center p-4 min-h-[90px] w-full overflow-hidden",
            highlightAds && "pt-8",
          )}
        >
          <span
            className={`text-[9px] font-mono tracking-widest uppercase mb-2 ${textMuted}`}
          >
            Advertisement
          </span> */}

      <div className="w-full max-w-4xl flex justify-center">
        <AdSenseSlot clientId={clientId} slotId={slotId} format="auto" />
      </div>
    </div>
    //   </div>
    // </div>
  );
}
