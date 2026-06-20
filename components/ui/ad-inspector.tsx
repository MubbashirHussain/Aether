"use client";

import { Check, Copy, Settings, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type AdInspectorProps = {
  isDark: boolean;
  showAdInspector: boolean;
  onToggle: () => void;
  highlightAds: boolean;
  onHighlightToggle: (highlight: boolean) => void;
  activeInspectorTab: "overview" | "adsense_code";
  onTabChange: (tab: "overview" | "adsense_code") => void;
  selectedAdForCode: string;
  onAdSelect: (ad: string) => void;
  adTemplates: Record<string, string>;
  onCopyCode: () => void;
};

export function AdInspector({
  isDark,
  showAdInspector,
  onToggle,
  highlightAds,
  onHighlightToggle,
  activeInspectorTab,
  onTabChange,
  selectedAdForCode,
  onAdSelect,
  adTemplates,
  onCopyCode,
}: AdInspectorProps) {
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";
  const textTitle = isDark ? "text-zinc-200" : "text-zinc-800";
  const badgeBg = isDark
    ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
    : "bg-white border-zinc-200 text-zinc-500 shadow-sm";

  if (!showAdInspector) return null;

  return (
    <div
      className={cn(
        "fixed bottom-14 right-2 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-1rem)] sm:max-w-md w-full p-4 border rounded-2xl shadow-2xl backdrop-blur-md font-sans",
        isDark
          ? "bg-zinc-900 border-amber-500/30 text-zinc-200"
          : "bg-white border-zinc-250 text-zinc-800 shadow-2xl"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between pb-2.5 border-b",
          isDark ? "border-zinc-850" : "border-zinc-150"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 text-amber-500 animate-pulse">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h4
              className={cn("text-xs font-bold tracking-tight", textTitle)}
            >
              Ad Revenue Control Hub
            </h4>
            <p className="text-[9px] text-zinc-550 font-mono">
              Configure responsive Google AdSense placements
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        className={cn(
          "flex gap-2.5 my-3 border-b pb-2 overflow-x-auto",
          isDark ? "border-zinc-850" : "border-zinc-150"
        )}
      >
        <button
          onClick={() => onTabChange("overview")}
          className={cn(
            "text-[10px] font-semibold px-2.5 py-1 rounded transition shrink-0",
            activeInspectorTab === "overview"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "text-zinc-450 hover:text-zinc-200"
          )}
        >
          Responsive Setup
        </button>
        <button
          onClick={() => onTabChange("adsense_code")}
          className={cn(
            "text-[10px] font-semibold px-2.5 py-1 rounded transition shrink-0",
            activeInspectorTab === "adsense_code"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "text-zinc-455 hover:text-zinc-200"
          )}
        >
          Get Code Code Snippet
        </button>
      </div>

      {activeInspectorTab === "overview" ? (
        <div className="space-y-3">
          <p className={cn("text-[10px] sm:text-[11px] leading-normal", textMuted)}>
            Google AdSense automatically detects screen dimensions to adjust
            layout. Set your parent container's width, and the ad codes will
            handle the rest beautifully!
          </p>

          <div
            className={cn(
              "flex items-center justify-between p-2.5 rounded-lg border",
              isDark
                ? "bg-zinc-950 border-zinc-850"
                : "bg-zinc-50 border-zinc-200 shadow-inner"
            )}
          >
            <span
              className={cn("text-[10px] sm:text-[11px] font-semibold", textMuted)}
            >
              Highlight Active Ad Slots:
            </span>
            <button
              onClick={() => onHighlightToggle(!highlightAds)}
              className={cn(
                "text-[10px] font-mono px-3 py-1 rounded transition-all font-bold",
                highlightAds
                  ? "bg-amber-500 text-zinc-950"
                  : "bg-zinc-850 text-zinc-400"
              )}
            >
              {highlightAds ? "ON" : "OFF"}
            </button>
          </div>

          <div
            className={cn(
              "p-2.5 rounded-lg border flex items-center justify-between text-[9px] font-mono",
              isDark
                ? "bg-zinc-950 border-zinc-850 text-zinc-500"
                : "bg-zinc-50 border-zinc-200 text-zinc-450"
            )}
          >
            <span className="flex items-center gap-1">Mobile Ready</span>
            <span className="flex items-center gap-1">Desktop Fluid</span>
            <span className="text-emerald-500 font-bold">100% Responsive</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label className={cn("text-[10px] font-mono block", textMuted)}>
            Select Placement Unit:
          </label>
          <select
            value={selectedAdForCode}
            onChange={(e) => onAdSelect(e.target.value)}
            className={cn(
              "w-full text-xs px-2 py-1.5 rounded border outline-none",
              isDark
                ? "bg-zinc-950 border-zinc-800 text-zinc-300"
                : "bg-zinc-50 border-zinc-250 text-zinc-750"
            )}
          >
            <option value="leaderboard">Header Leaderboard (728x90)</option>
            <option value="sidebar">Smart Sidebar (Adapting format)</option>
            <option value="infeed">In-Feed Native Ad (Fluid)</option>
            <option value="anchor">Sticky bottom Anchor Ad</option>
            <option value="interstitial">
              Secure Interstitial (Vignette)
            </option>
          </select>

          <div className="relative">
            <textarea
              readOnly
              value={adTemplates[selectedAdForCode]}
              className={cn(
                "w-full h-24 text-[9px] sm:text-[10px] font-mono p-2 rounded border focus:outline-none resize-none leading-relaxed",
                isDark
                  ? "bg-zinc-950 border-zinc-850 text-zinc-400"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600"
              )}
            />
            <button
              onClick={onCopyCode}
              className={cn(
                "absolute bottom-2 right-2 text-[9px] px-2 py-1 rounded border transition flex items-center gap-1 font-semibold shadow-sm",
                isDark
                  ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300"
                  : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-650"
              )}
            >
              <Copy className="w-3 h-3" /> Copy Code
            </button>
          </div>

          <p className={cn("text-[9px] leading-normal font-mono flex items-start gap-1", textMuted)}>
            <span>
              Substitute{" "}
              <code className="text-amber-500">ca-pub-XXXXXXXXXXXXX</code>{" "}
              with your real AdSense Publisher ID.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}