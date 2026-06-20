"use client";

import { TrendingUp, Sliders, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";

export type PlatformSelectorProps = {
  isDark: boolean;
  activePlatform: string;
  onPlatformChange: (platform: string) => void;
};

export function PlatformSelector({
  isDark,
  activePlatform,
  onPlatformChange,
}: PlatformSelectorProps) {
  const PLATFORMS = [
    { id: "all", name: "All Links", icon: Sliders },
    { id: "instagram", name: "Instagram", icon: FaInstagram },
    { id: "tiktok", name: "TikTok", icon: Flame },
    { id: "youtube", name: "YouTube", icon: FaYoutube },
    { id: "facebook", name: "Facebook", icon: FaFacebook },
  ];

  const cardBg = isDark
    ? "bg-zinc-900/30 border-zinc-900"
    : "bg-white border-zinc-200 shadow-sm";
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";

  return (
    <section
      className={cn("rounded-xl p-4 sm:p-5 border", cardBg)}
    >
      <div className="text-center mb-4 sm:mb-5">
        <h3
          className={cn(
            "text-xs font-mono uppercase tracking-widest",
            textMuted
          )}
        >
          API Compatibility Hub
        </h3>
      </div>

      <div className="flex md:grid md:grid-cols-5 gap-2.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent snap-x">
        {PLATFORMS.map((plat) => {
          const IconComp = plat.icon;

          const isSelected = activePlatform === plat.id;

          return (
            <button
              key={plat.id}
              onClick={() => onPlatformChange(plat.id)}
              className={cn(
                "p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 min-w-[110px] md:min-w-0 snap-align-start shrink-0 flex-1 cursor-pointer",
                isSelected
                  ? isDark
                    ? "bg-zinc-900 border-zinc-750 text-zinc-100 shadow-sm"
                    : "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                  : isDark
                    ? "bg-zinc-900/10 border-zinc-950 hover:border-zinc-850 text-zinc-500 hover:text-zinc-300"
                    : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800"
              )}
            >
              <span className="text-2xl shrink-0"><IconComp /></span>
              <span className="text-xs font-semibold">{plat.name}</span>
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "p-4 mt-4 rounded-xl border text-[10px] sm:text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3",
          isDark ? "bg-zinc-950 border-zinc-850/60 text-zinc-500" : "bg-zinc-50 border-zinc-200 text-zinc-500 shadow-inner"
        )}
      >
        <div className="min-w-0">
          <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>
            Target Extraction Node:
          </span>{" "}
          {activePlatform === "all"
            ? "Unified multi-tenant endpoint active."
            : `Direct query active on ${activePlatform.toUpperCase()} CDN.`}
        </div>
        <div className="flex gap-2 shrink-0">
          <span className={cn("border px-1.5 py-0.5 rounded text-[10px]", isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500 shadow-sm")}>
            Unlimited
          </span>
          <span className={cn("border px-1.5 py-0.5 rounded text-[10px]", isDark ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-500" : "bg-emerald-50 border-emerald-200 text-emerald-700")}>
            High Speed
          </span>
        </div>
      </div>
    </section>
  );
}