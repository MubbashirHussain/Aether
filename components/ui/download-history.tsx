"use client";

import { Check, Copy, Download as DownloadIcon, History } from "lucide-react";

export type DownloadHistoryProps = {
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
  downloadHistory,
  onCopyHistory,
  onReFetch,
  onClearHistory,
  copiedIndex,
}: DownloadHistoryProps) {
  return (
    <section className="rounded-2xl p-4 sm:p-5 border bg-white border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-850">
      <div className="flex items-center justify-between mb-4 pb-3 border-b gap-2 border-zinc-200 dark:border-zinc-850">
        <div className="flex items-center gap-2 min-w-0">
          <History className="w-4 h-4 text-zinc-400 shrink-0" />
          <h3 className="text-sm font-semibold truncate text-zinc-800 dark:text-zinc-200">
            Local Download Cache
          </h3>
        </div>
        {downloadHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-semibold transition shrink-0 cursor-pointer text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Purge Storage
          </button>
        )}
      </div>

      {downloadHistory.length === 0 ? (
        <div className="text-center py-6 rounded-xl border bg-zinc-50 border-zinc-200 dark:bg-zinc-950 dark:border-zinc-850">
          <p className="text-xs text-zinc-500 font-mono p-4">
            No downloaded files in local cache yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {downloadHistory.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 rounded-xl flex items-center gap-3 border transition bg-zinc-50 border-zinc-200 hover:border-zinc-300 shadow-sm dark:bg-zinc-950 dark:border-zinc-850 dark:hover:border-zinc-800"
            >
              <img
                src={item.thumbnail}
                alt="history item preview"
                className="w-10 h-10 rounded object-cover shrink-0 opacity-70 border border-zinc-250 shadow-sm dark:border-zinc-800"
              />

              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                  {item.platform}
                </span>
                <h4 className="text-xs font-semibold truncate mt-0.5 text-zinc-800 dark:text-zinc-200">
                  {item.title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onCopyHistory(item.url, idx)}
                  className="p-1.5 rounded border transition cursor-pointer bg-white hover:bg-zinc-100 border-zinc-250 text-zinc-500 shadow-sm dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-450"
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
                  className="p-1.5 rounded border transition cursor-pointer bg-white hover:bg-zinc-100 border-zinc-250 text-zinc-650 shadow-sm dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-white"
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
