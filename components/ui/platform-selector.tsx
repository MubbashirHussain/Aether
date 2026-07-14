"use client";

import { Sliders, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";

export type PlatformSelectorProps = {
  activePlatform: string;
  onPlatformChange: (platform: string) => void;
};

export function PlatformSelector({
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

  return (
    <section className="rounded-xl p-4 sm:p-5 border bg-white border-zinc-200 shadow-sm dark:bg-zinc-900/30 dark:border-zinc-900">
      <div className="text-center mb-4 sm:mb-5">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
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
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                  : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800 dark:bg-zinc-900/10 dark:border-zinc-950 dark:hover:border-zinc-850 dark:text-zinc-500 dark:hover:text-zinc-300",
              )}
            >
              <span className="text-2xl shrink-0"><IconComp /></span>
              <span className="text-xs font-semibold">{plat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 mt-4 rounded-xl border text-[10px] sm:text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border-zinc-200 text-zinc-500 shadow-inner dark:bg-zinc-950 dark:border-zinc-850/60 dark:text-zinc-500">
        <div className="min-w-0">
          <span className="text-zinc-600 dark:text-zinc-400">
            Target Extraction Node:
          </span>{" "}
          {activePlatform === "all"
            ? "Unified multi-tenant endpoint active."
            : `Direct query active on ${activePlatform.toUpperCase()} CDN.`}
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="border px-1.5 py-0.5 rounded text-[10px] bg-white border-zinc-200 text-zinc-500 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
            Unlimited
          </span>
          <span className="border px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-500">
            High Speed
          </span>
        </div>
      </div>
    </section>
  );
}