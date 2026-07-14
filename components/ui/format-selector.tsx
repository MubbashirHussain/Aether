"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormatSelectorProps = {
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
  onDownload: (
    format: any,
    formatId: string,
    isAudioAvailable: boolean,
  ) => void;
};

export function FormatSelector({
  parsedVideo,
  onDownload,
}: FormatSelectorProps) {
  if (!parsedVideo) return null;

  // console.log("thumpnail in format selector", parsedVideo.thumbnail);

  return (
    <section
      className="border rounded-2xl overflow-hidden animate-fade-in bg-white border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
    >
      <div
        className="px-4 py-3 border-b flex items-center justify-between gap-2 bg-zinc-50 border-zinc-200 dark:bg-zinc-950 dark:border-zinc-850"
      >
        <span
          className="text-[9px] sm:text-[10px] font-mono tracking-wider truncate text-zinc-600 dark:text-zinc-400"
        >
          Resolved node author:{" "}
          <span
            className="font-semibold text-zinc-800 dark:text-zinc-200"
          >
            {parsedVideo.author}
          </span>
        </span>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-5 space-y-3">
          <div
            className="relative aspect-video rounded-xl overflow-hidden border bg-zinc-100 border-zinc-250 shadow-sm dark:bg-zinc-950 dark:border-zinc-850"
          >
            <img
              src={
                "https://instagram.fkhi28-1.fna.fbcdn.net/v/t51.71878-15/724320524_1669965580932698_5446939667017423434_n.jpg?stp=dst-jpg_e15_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi42NDAuc2RyLnZpZGVvX25mcmFtZV9jb3Zlcl9mcmFtZS5jMiJ9&_nc_ht=instagram.fkhi28-1.fna.fbcdn.net&_nc_cat=102&_nc_oc=Q6cZ2gF4_vwbj6ic8iH1GFVxjP87C5htqxkEm3G7lVMDueME81kSnovWK2wlpwhXeQQ4ELk&_nc_ohc=Nc1-GvBhXxwQ7kNvwGcp1Wi&_nc_gid=9SDemH3nHaq3IbnH0N0iUg&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_Af_WDhzW0JE1MJpDyn0XQbZNIX_mV4SjhR2dGtN9A5YOpw&oe=6A3CC0A4&_nc_sid=d885a2"
              }
              alt="video preview"
              // // crossOrigin="use-credentials"
              // fetchPriority="high"
              // referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-zinc-950/90 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 shadow-sm">
              {Number(parsedVideo.duration).toFixed(3)}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <h3
            className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            Select Available Quality:
          </h3>

          <div className="space-y-2.5">
            {parsedVideo.formats.map((format, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition border bg-zinc-50 border-zinc-200 hover:border-zinc-300 shadow-sm dark:bg-zinc-950 dark:border-zinc-850 dark:hover:border-zinc-800"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs sm:text-sm font-bold truncate text-zinc-850 dark:text-zinc-200"
                  >
                    {format.quality}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    No Watermark CDN Link
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0">
                  <span
                    className="text-[9px] font-mono px-2 py-1 rounded border bg-white border-zinc-200 text-zinc-500 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                  >
                    {format.size}
                  </span>
                  <button
                    onClick={() =>
                      onDownload(
                        format,
                        parsedVideo.formats[idx].formatId,
                        parsedVideo.formats[idx].isAudioAvailable,
                      )
                    }
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950"
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


