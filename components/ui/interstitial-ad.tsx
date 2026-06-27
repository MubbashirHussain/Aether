"use client";

import { Download, ExternalLink, X, Sparkles, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdSenseSlot } from "./adsense-slot";

export type InterstitialAdProps = {
  isDark: boolean;
  showInterstitial: boolean;
  onClose: () => void;
  pendingDownloadItem: {
    chosenQuality: string;
    chosenSize: string;
    platform: string;
  } | null;
  countdown: number;
  onDownload: () => void;
  clientId: string;
  slotId?: string;
};

export function InterstitialAd({
  isDark,
  showInterstitial,
  onClose,
  pendingDownloadItem,
  countdown,
  onDownload,
  clientId,
  slotId = "3456789012",
}: InterstitialAdProps) {
  const cardBg = isDark
    ? "bg-zinc-900 border-zinc-800 text-zinc-200"
    : "bg-white border-zinc-200 text-zinc-900";
  const innerCardBg = isDark
    ? "bg-zinc-950 border-zinc-850"
    : "bg-zinc-50 border-zinc-200";
  const textTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-400" : "text-zinc-500";
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";

  if (!showInterstitial) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-zinc-950/95 backdrop-blur-md">
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl p-5 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[95vh] border",
          cardBg
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-zinc-500 hover:text-zinc-300 p-2 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5 sm:mb-6">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full tracking-wider uppercase font-semibold"
            )}
          >
            <Sparkles className="w-3 h-3" /> Secure Node Handshake
          </span>
          <h4 className={cn("text-base sm:text-lg font-bold mt-2", textTitle)}>
            Generating Secure Raw Stream Connection
          </h4>
          <p className={cn("text-[11px] mt-1 max-w-sm mx-auto", textSub)}>
            Please wait a few moments for our decentralized cache system.
            Your download remains completely free thanks to our sponsor.
          </p>
        </div>

        <div
          className={cn(
            "rounded-xl p-4 sm:p-5 border transition-all",
            isDark
              ? "bg-amber-500/5 border-amber-500/30"
              : "bg-amber-50/50 border-amber-400/60"
          )}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mb-2.5">
            <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">
              AdSense Vignette Placement
            </span>
            <span>slot: {slotId}</span>
          </div>

          <div
            className={cn(
              "min-h-[140px] border rounded-lg flex flex-col items-center justify-center p-4 text-center overflow-hidden",
              innerCardBg
            )}
          >
            <div className="w-full flex justify-center py-2">
              <AdSenseSlot
                clientId={clientId}
                slotId={slotId}
                format="rectangle, horizontal"
              />
            </div>
          </div>
        </div>

        <div className={cn("mt-5 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4", isDark ? "border-zinc-850" : "border-zinc-100")}>
          <div className="text-center sm:text-left">
            <p className={cn("text-xs font-semibold", textTitle)}>
              Payload Format:{" "}
              <span className={cn(textTitle, "font-extrabold")}>
                {pendingDownloadItem?.chosenQuality}
              </span>
            </p>
            <p className={cn("text-[10px] font-mono mt-0.5", textMuted)}>
              Stream packet size: {pendingDownloadItem?.chosenSize}
            </p>
          </div>

          {countdown > 0 ? (
            <button
              disabled
              className={cn(
                "w-full sm:w-auto text-xs font-semibold px-4 py-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-not-allowed",
                isDark
                  ? "bg-zinc-950 text-zinc-500 border-zinc-850"
                  : "bg-zinc-100 text-zinc-400 border-zinc-200"
              )}
            >
              <span className="w-3.5 h-3.5 rounded-full border-2 border-t-amber-400 animate-spin" />
              Generating links ({countdown}s)
            </button>
          ) : (
            <button
              onClick={onDownload}
              className={cn(
                "w-full sm:w-auto text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-150 animate-pulse shadow-md",
                isDark
                  ? "bg-zinc-100 hover:bg-white text-zinc-950 shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white"
              )}
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Secure Raw Stream File
            </button>
          )}
        </div>
      </div>
    </div>
  );
}