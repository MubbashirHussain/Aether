"use client";

import { Check, Copy, Download as DownloadIcon, History } from "lucide-react";
import { cn } from "@/lib/utils";

export type DownloadHistoryProps = {
  isDark: boolean;
  downloadHistory: {
    id: string;
    title: string;
    platform: string;
    url: string;
    thumbnail: string;
    timestamp: string;
  }[];
  onCopyHistory: (url: string, index: number) => void;
  onReFetch: (url: string, platform: string) => void;
  onClearHistory: () => void;
  copiedIndex: number | null;
};

export function DownloadHistory({
  isDark,
  downloadHistory,
  onCopyHistory,
  onReFetch,
  onClearHistory,
  copiedIndex,
}: DownloadHistoryProps) {
  const cardBg = isDark
    ? "bg-zinc-900 border-zinc-850"
    : "bg-white border-zinc-200 shadow-sm";
  const innerCardBg = isDark
    ? "bg-zinc-950 border-zinc-850"
    : "bg-zinc-50 border-zinc-200";
  const textTitle = isDark ? "text-zinc-200" : "text-zinc-800";
  const textMuted = isDark ? "text-zinc-400" : "text-zinc-500";

  return (
    <section className={cn("rounded-2xl p-4 sm:p-5 border", cardBg)}>
      <div
        className={cn(
          "flex items-center justify-between mb-4 pb-3 border-b gap-2",
          isDark ? "border-zinc-850" : "border-zinc-200"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <History className="w-4 h-4 text-zinc-400 shrink-0" />
          <h3 className={cn("text-sm font-semibold truncate", textTitle)}>
            Local Download Cache
          </h3>
        </div>
        {downloadHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className={cn(
              "text-xs font-semibold transition shrink-0 cursor-pointer",
              isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"
            )}
          >
            Purge Storage
          </button>
        )}
      </div>

      {downloadHistory.length === 0 ? (
        <div className={cn("text-center py-6 rounded-xl border", innerCardBg)}>
          <p className="text-xs text-zinc-500 font-mono">
            No downloaded files in local cache yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {downloadHistory.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "p-3 rounded-xl flex items-center gap-3 border transition",
                isDark
                  ? "bg-zinc-950 border-zinc-850 hover:border-zinc-800"
                  : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 shadow-sm"
              )}
            >
              <img
                src={item.thumbnail}
                alt="history item preview"
                className={cn("w-10 h-10 rounded object-cover shrink-0 opacity-70 border", isDark ? "border-zinc-800" : "border-zinc-250 shadow-sm")}
              />

              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                  {item.platform}
                </span>
                <h4 className={cn("text-xs font-semibold truncate mt-0.5", textTitle)}>
                  {item.title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onCopyHistory(item.url, idx)}
                  className={cn(
                    "p-1.5 rounded border transition cursor-pointer",
                    isDark
                      ? "bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-450"
                      : "bg-white hover:bg-zinc-100 border-zinc-250 text-zinc-500 shadow-sm"
                  )}
                  title="Copy Link"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onReFetch(item.url, item.platform)}
                  className={cn(
                    "p-1.5 rounded border transition cursor-pointer",
                    isDark
                      ? "bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300 hover:text-white"
                      : "bg-white hover:bg-zinc-100 border-zinc-250 text-zinc-650 shadow-sm"
                  )}
                  title="Re-fetch Video Stream"
                >
                  <DownloadIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}