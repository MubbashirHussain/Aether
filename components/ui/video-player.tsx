"use client";

import { Download, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type VideoPlayerProps = {
  isDark: boolean;
  parsedVideo: {
    thumbnail: string;
  } | null;
  streamToken: string | null;
  onOpenInNewTab: () => void;
  onDownload: () => void;
  isLoading: boolean;
};

export function VideoPlayer({
  isDark,
  parsedVideo,
  streamToken,
  onOpenInNewTab,
  onDownload,
  isLoading,
}: VideoPlayerProps) {
  const cardBg = isDark
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-zinc-200 shadow-sm";
  const innerCardBg = isDark
    ? "bg-zinc-950 border-zinc-850"
    : "bg-zinc-50 border-zinc-200";
  const textTitle = isDark ? "text-zinc-200" : "text-zinc-800";
  const textMuted = isDark ? "text-zinc-400" : "text-zinc-500";
  const btnPrimary = isDark
    ? "bg-zinc-100 hover:bg-white text-zinc-950"
    : "bg-zinc-900 hover:bg-zinc-800 text-white";

  if (!streamToken || !parsedVideo) return null;

  return (
    <section
      className={cn("border rounded-2xl overflow-hidden animate-fade-in", cardBg)}
    >
      <div
        className={cn(
          "px-4 py-3 border-b flex items-center justify-between gap-2",
          isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200"
        )}
      >
        <span
          className={cn(
            "text-[9px] sm:text-[10px] font-mono tracking-wider",
            isDark ? "text-emerald-400" : "text-emerald-600"
          )}
        >
          ✓ Stream Token Generated
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <h3
            className={cn(
              "text-[11px] sm:text-xs font-mono uppercase tracking-widest mb-2",
              isDark ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            Video Preview
          </h3>
          <div
            className={cn(
              "relative aspect-video rounded-xl overflow-hidden border",
              isDark
                ? "bg-zinc-950 border-zinc-850"
                : "bg-zinc-100 border-zinc-250 shadow-sm"
            )}
          >
            <img
              src={parsedVideo.thumbnail}
              alt="video preview"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3
            className={cn(
              "text-[11px] sm:text-xs font-mono uppercase tracking-widest",
              isDark ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            Play or Download
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenInNewTab}
              className={cn(
                "flex-1 text-xs font-bold px-4 py-3 rounded-xl transition flex items-center justify-center gap-2",
                btnPrimary
              )}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </button>

            <button
              onClick={onDownload}
              disabled={isLoading}
              className={cn(
                "flex-1 text-xs font-bold px-4 py-3 rounded-xl transition flex items-center justify-center gap-2",
                isLoading
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  : btnPrimary
              )}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Video</span>
                </>
              )}
            </button>
          </div>

          <div
            className={cn(
              "p-3 rounded-lg border text-[10px] font-mono",
              isDark ? "bg-zinc-950 border-zinc-850 text-zinc-500" : "bg-zinc-50 border-zinc-200 text-zinc-500"
            )}
          >
            <p className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>
                Stream token expires in 5 minutes. Download your video
                before it becomes unavailable.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}