"use client";

import { Download, ExternalLink, Info, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export type VideoPlayerProps = {
  parsedVideo: {
    thumbnail: string;
  } | null;
  streamToken: string | null;
  onOpenInNewTab: () => void;
  onDownload: () => void;
  isLoading: boolean;
  /** Download progress state — when set, shows real progress bars */
  downloadProgress?: {
    phase: "idle" | "ytdlp" | "file" | "completed" | "error";
    ytdlpPercent: number;
    filePercent: number;
    speed: string;
    eta: string;
    transferred: string;
    totalSize: string;
    error?: string;
  };
  /** Called to cancel the current download */
  onCancelDownload?: () => void;
};

export function VideoPlayer({
  parsedVideo,
  streamToken,
  onOpenInNewTab,
  onDownload,
  isLoading,
  downloadProgress,
  onCancelDownload,
}: VideoPlayerProps) {
  const isDownloading =
    downloadProgress?.phase === "ytdlp" ||
    downloadProgress?.phase === "file";

  if (!streamToken || !parsedVideo) return null;

  const renderProgress = () => {
    if (downloadProgress?.phase === "ytdlp") {
      return (
        <div className="space-y-3">
          {/* Phase badge */}
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-mono flex items-center gap-1.5 text-blue-600 dark:text-blue-400"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Processing on server...
            </span>
            <span
              className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300"
            >
              {downloadProgress.ytdlpPercent.toFixed(1)}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800"
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out bg-blue-500"
              style={{ width: `${downloadProgress.ytdlpPercent}%` }}
            />
          </div>

          {/* Speed & ETA */}
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-zinc-500 dark:text-zinc-400">
              Speed: {downloadProgress.speed || "--"}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              ETA: {downloadProgress.eta || "--"}
            </span>
          </div>
        </div>
      );
    }

    if (downloadProgress?.phase === "file") {
      return (
        <div className="space-y-3">
          {/* Phase badge */}
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-mono flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Downloading to your device...
            </span>
            <span
              className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300"
            >
              {downloadProgress.filePercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800"
          >
            <div
              className="h-full rounded-full transition-all duration-150 ease-linear bg-emerald-500"
              style={{ width: `${downloadProgress.filePercent}%` }}
            />
          </div>

          {/* Transferred / Total */}
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-zinc-500 dark:text-zinc-400">
              Downloaded: {downloadProgress.transferred}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              of {downloadProgress.totalSize}
            </span>
          </div>

          {/* Cancel button */}
          {onCancelDownload && (
            <button
              onClick={onCancelDownload}
              className="w-full text-[10px] font-mono px-3 py-1.5 rounded-lg border transition border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-300 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-red-400 dark:hover:border-red-800"
            >
              Cancel Download
            </button>
          )}
        </div>
      );
    }

    if (downloadProgress?.phase === "error") {
      return (
        <div
          className="p-3 rounded-lg border text-[10px] font-mono bg-red-50 border-red-100 text-red-600 dark:bg-red-950/20 dark:border-red-800/30 dark:text-red-400"
        >
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>
              Download failed: {downloadProgress.error || "Unknown error"}
            </span>
          </p>
          <button
            onClick={onDownload}
            className="mt-2 text-[10px] px-3 py-1 rounded-lg border transition inline-flex items-center gap-1.5 border-zinc-200 text-zinc-500 hover:text-zinc-700 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <RefreshCw className="w-3 h-3" />
            Try Again
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <section
      className="border rounded-2xl overflow-hidden animate-fade-in bg-white border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
    >
      <div
        className="px-4 py-3 border-b flex items-center justify-between gap-2 bg-zinc-50 border-zinc-200 dark:bg-zinc-955 dark:border-zinc-850"
      >
        <span
          className="text-[9px] sm:text-[10px] font-mono tracking-wider text-emerald-600 dark:text-emerald-400"
        >
          {isDownloading ? "⏳ Downloading..." : "✓ Stream Token Generated"}
        </span>

        {isDownloading && (
          <span
            className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500"
          >
            {downloadProgress?.phase === "ytdlp"
              ? `${downloadProgress?.ytdlpPercent.toFixed(0)}%`
              : `${downloadProgress?.filePercent}%`}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <h3
            className="text-[11px] sm:text-xs font-mono uppercase tracking-widest mb-2 text-zinc-500 dark:text-zinc-400"
          >
            Video Preview
          </h3>
          <div
            className="relative aspect-video rounded-xl overflow-hidden border bg-zinc-100 border-zinc-250 shadow-sm dark:bg-zinc-950 dark:border-zinc-850"
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
            className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Play or Download
          </h3>

          {/* Progress section — shown during download */}
          {isDownloading && <div className="p-4 rounded-xl border bg-zinc-50 border-zinc-200 dark:bg-zinc-955 dark:border-zinc-850">{renderProgress()}</div>}

          {/* Error state */}
          {downloadProgress?.phase === "error" && (
            <div className="p-4 rounded-xl border bg-zinc-50 border-zinc-200 dark:bg-zinc-955 dark:border-zinc-850">{renderProgress()}</div>
          )}

          {/* Action buttons — hidden during download */}
          {!isDownloading && downloadProgress?.phase !== "error" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenInNewTab}
                className="flex-1 text-xs font-bold px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950"
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
                    : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950",
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
          )}

          <div
            className="p-3 rounded-lg border text-[10px] font-mono bg-zinc-50 border-zinc-200 text-zinc-500 dark:bg-zinc-955 dark:border-zinc-850 dark:text-zinc-500"
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

