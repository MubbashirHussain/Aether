"use client";

import {
  Download,
  ShieldCheck,
  Lock,
  TrendingUp,
  Info,
  AlertCircle,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type VideoDownloaderProps = {
  isDark: boolean;
  videoUrl: string;
  detectedPlatform: string | null;
  isLoading: boolean;
  progress: number;
  errorMessage: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function VideoDownloader({
  isDark,
  videoUrl,
  detectedPlatform,
  isLoading,
  progress,
  errorMessage,
  onUrlChange,
  onAnalyze,
}: VideoDownloaderProps) {
  const inputBg = isDark
    ? "bg-zinc-950 text-zinc-200 placeholder:text-zinc-600 border-zinc-800 focus:border-zinc-700"
    : "bg-zinc-50 text-zinc-800 placeholder:text-zinc-400 border-zinc-200 focus:border-zinc-300";
  const cardBg = isDark
    ? "bg-zinc-900 border-zinc-850"
    : "bg-white border-zinc-200 shadow-sm";
  const innerCardBg = isDark
    ? "bg-zinc-950 border-zinc-850"
    : "bg-zinc-50 border-zinc-200";
  const textTitle = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-400" : "text-zinc-500";
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";
  const btnPrimary = isDark
    ? "bg-zinc-100 hover:bg-white text-zinc-950"
    : "bg-zinc-900 hover:bg-zinc-850 text-white";

  return (
    <section className="lg:col-span-8 space-y-6 sm:space-y-8">
      <section className="text-left py-2">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-wider uppercase border",
            isDark
              ? "bg-zinc-900 border-zinc-800 text-zinc-400"
              : "bg-white border-zinc-200 text-zinc-500 shadow-sm",
          )}
        >
          <TrendingUp className="w-3.5 h-3.5 text-zinc-500" /> Decentralized
          Fast Link Parser
        </div>

        <h1
          className={cn(
            "text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2 leading-snug",
            textTitle,
          )}
        >
          Extract Social Media Streams with Zero Compression
        </h1>

        <p
          className={cn("text-xs sm:text-sm leading-relaxed max-w-xl", textSub)}
        >
          Paste Instagram Reels, TikTok, YouTube Shorts, or Facebook URLs
          directly. We connect straight to uncompressed CDNs to extract clean
          raw formats.
        </p>
      </section>

      <section className={cn("rounded-2xl p-4 sm:p-5", cardBg)}>
        <form onSubmit={onAnalyze} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={videoUrl}
                onChange={onUrlChange}
                placeholder="Paste your video, short, or reel link..."
                className={cn(
                  "w-full text-xs sm:text-sm px-4 py-3.5 rounded-xl outline-none transition pr-28",
                  inputBg,
                )}
              />
              {detectedPlatform && (
                <div
                  className={cn(
                    "absolute right-2 top-2.5 text-[8px] uppercase font-mono tracking-wider px-2 py-1 rounded border",
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                      : "bg-white border-zinc-250 text-zinc-500 shadow-sm",
                  )}
                >
                  {detectedPlatform}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-150 disabled:opacity-50 shrink-0 shadow-sm",
                btnPrimary,
              )}
            >
              {isLoading ? (
                <>
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full border-2 border-t-transparent animate-spin",
                      isDark ? "border-zinc-950" : "border-white",
                    )}
                  />
                  Extracting...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  Search
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div
              className={cn(
                "flex items-center gap-2 text-xs p-3 rounded-lg border",
                isDark
                  ? "bg-zinc-950 text-zinc-400 border-zinc-850"
                  : "bg-red-50 text-red-700 border-red-100",
              )}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
          )}
        </form>

        {isLoading && (
          <div className={cn("mt-4 p-4 rounded-xl border", innerCardBg)}>
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-2 font-mono">
              <span
                className={cn(
                  "text-zinc-500 flex items-center gap-1.5 truncate",
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping" />
                Connecting with Edge Delivery CDN Nodes...
              </span>
              <span
                className={cn(
                  "font-bold shrink-0",
                  isDark ? "text-zinc-300" : "text-zinc-700",
                )}
              >
                {progress}%
              </span>
            </div>
            <div
              className={cn(
                "w-full h-[3px] rounded-full overflow-hidden",
                isDark ? "bg-zinc-900" : "bg-zinc-200",
              )}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-200",
                  isDark ? "bg-zinc-300" : "bg-zinc-650",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 text-[9px] sm:text-[10px] font-mono pt-3 border-t",
            isDark
              ? "border-zinc-850/60 text-zinc-550"
              : "border-zinc-100 text-zinc-500",
          )}
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SSL
            Inspected Node
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Client Sandbox
          </span>
        </div>
      </section>
    </section>
  );
}
