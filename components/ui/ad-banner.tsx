"use client";

import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdBannerProps = {
  isDark: boolean;
  highlightAds: boolean;
  onHighlightToggle?: (highlight: boolean) => void;
};

export function AdBanner({
  isDark,
  highlightAds,
  onHighlightToggle,
}: AdBannerProps) {
  const rootBg = isDark
    ? "bg-zinc-950 text-zinc-200 selection:bg-zinc-800 selection:text-white"
    : "bg-zinc-50 text-zinc-800 selection:bg-zinc-200 selection:text-zinc-900";
  const cardBg = isDark
    ? "bg-zinc-900 border-zinc-850"
    : "bg-white border-zinc-200 shadow-sm";
  const innerCardBg = isDark
    ? "bg-zinc-950 border-zinc-850"
    : "bg-zinc-50 border-zinc-200";
  const badgeBg = isDark
    ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
    : "bg-white border-zinc-200 text-zinc-500 shadow-sm";
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";

  return (
    <div className={`max-w-6xl mx-auto px-4 mt-4`}>
      <div
        className={cn(
          "relative rounded-xl border transition-all overflow-hidden",
          highlightAds
            ? isDark
              ? "bg-amber-950/10 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
              : "bg-amber-50/50 border-amber-400/60 shadow-sm"
            : isDark
              ? "bg-zinc-900/60 border-zinc-900/50"
              : "bg-white border-zinc-200 shadow-sm"
        )}
      >
        {highlightAds && (
          <div
            className={cn(
              "absolute top-0 left-0 right-0 border-b px-3 py-1 flex items-center justify-between text-[8px] sm:text-[9px] font-mono",
              isDark
                ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                : "bg-amber-50 border-amber-200 text-amber-800"
            )}
          >
            <span className="flex items-center gap-1 truncate">
              <DollarSign className="w-3 h-3" /> **Google AdSense Spot: Top
              Responsive Leaderboard [728x90]**
            </span>
            <span
              className="bg-amber-500 text-zinc-950 px-1 rounded font-bold uppercase text-[7px] tracking-wider shrink-0"
            >
              MAX RPM
            </span>
          </div>
        )}

        <div
          className={cn(
            "flex flex-col items-center justify-center p-4 min-h-[90px]",
            highlightAds && "pt-8"
          )}
        >
          <span className={`text-[9px] font-mono tracking-widest uppercase mb-2 ${textMuted}`}>
            Advertisement
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left max-w-2xl w-full">
            <div
              className={cn(
                "w-12 h-10 rounded border flex items-center justify-center font-mono text-[9px] shrink-0",
                isDark
                  ? "bg-zinc-800/80 border-zinc-700 text-zinc-400"
                  : "bg-zinc-100 border-zinc-200 text-zinc-500"
              )}
            >
              Banner
            </div>
            <div className="min-w-0 flex-1">
              <h5
                className={cn(
                  "text-[11px] sm:text-xs font-semibold truncate",
                  isDark ? "text-zinc-300" : "text-zinc-800"
                )}
              >
                Create Interactive Web App Mockups with Tailwind Blocks
              </h5>
              <p
                className="text-[10px] text-zinc-500 leading-normal truncate"
              >
                Prototype UI views in minutes instead of manually writing long
                css selectors. Export ready-to-run codes.
              </p>
            </div>
            <a
              href="https://google.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => window.dispatchEvent(new CustomEvent("trigger-notification", { detail: { message: "Redirecting safely to secure advertiser site...", type: "info" } }))}
              className={cn(
                "text-[10px] px-3 py-1.5 rounded transition shrink-0 border",
                isDark
                  ? "bg-zinc-950 hover:bg-zinc-850 border-zinc-800 text-zinc-350"
                  : "bg-white hover:bg-zinc-50 border-zinc-250 text-zinc-700 shadow-sm"
              )}
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}