"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormatSelectorProps = {
  isDark: boolean;
  parsedVideo: {
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
    formats: {
      quality: string;
      size: string;
      label: string;
      formatId: string;
      isAudioAvailable: boolean;
    }[];
  } | null;
  onDownload: (format: any, formatId: string, isAudioAvailable: boolean) => void;
};

export function FormatSelector({
  isDark,
  parsedVideo,
  onDownload,
}: FormatSelectorProps) {
  const cardBg = isDark
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-zinc-200 shadow-sm";
  const innerCardBg = isDark
    ? "bg-zinc-950 border-zinc-850"
    : "bg-zinc-50 border-zinc-200";
  const textTitle = isDark ? "text-zinc-200" : "text-zinc-850";
  const btnPrimary = isDark
    ? "bg-zinc-100 hover:bg-white text-zinc-950"
    : "bg-zinc-900 hover:bg-zinc-800 text-white";

  if (!parsedVideo) return null;

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
            "text-[9px] sm:text-[10px] font-mono tracking-wider truncate",
            isDark ? "text-zinc-400" : "text-zinc-600"
          )}
        >
          Resolved node author:{" "}
          <span className={cn(isDark ? "text-zinc-200" : "text-zinc-800", "font-semibold")}>
            {parsedVideo.author}
          </span>
        </span>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-5 space-y-3">
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
            <div className="absolute bottom-2 right-2 bg-zinc-950/90 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 shadow-sm">
              {parsedVideo.duration}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <h3
            className={cn(
              "text-[11px] sm:text-xs font-mono uppercase tracking-widest",
              isDark ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            Select Available Quality:
          </h3>

          <div className="space-y-2.5">
            {parsedVideo.formats.map((format, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition border",
                  isDark
                    ? "bg-zinc-950 border-zinc-850 hover:border-zinc-800"
                    : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 shadow-sm"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={cn("text-xs sm:text-sm font-bold truncate", textTitle)}
                  >
                    {format.quality}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    No Watermark CDN Link
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0">
                  <span
                    className={cn(
                      "text-[9px] font-mono px-2 py-1 rounded border",
                      isDark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                        : "bg-white border-zinc-200 text-zinc-500 shadow-sm"
                    )}
                  >
                    {format.size}
                  </span>
                  <button
                    onClick={() => onDownload(format, parsedVideo.formats[idx].formatId, parsedVideo.formats[idx].isAudioAvailable)}
                    className={cn(
                      "text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer",
                      btnPrimary
                    )}
                    title="Download to system"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}