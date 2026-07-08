"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import {
  Notification,
  AdBanner,
  VideoDownloader,
  FormatSelector,
  VideoPlayer,
  PlatformSelector,
  AdSenseSlot,
} from "@/components/ui";
import { useAdConfig } from "@/config/zustand";
import { cn } from "@/lib/utils";
import {
  analyzeUrl,
  startSession,
  unlockSession,
  getStreamUrl,
} from "@/lib/api";
import {
  initDownload,
  waitForDownload,
  downloadFile,
  triggerDownload,
  saveResumeState,
  removeResumeState,
  getResumeDownloads,
  getResumeEntry,
} from "@/lib/download-manager";

// Lazy-load AdInspector in the same wrapper if needed, or define/import it
import { useTheme } from "@/context/AppContext";

interface Format {
  quality: string;
  size: string;
  label: string;
}

interface VideoPreview {
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  likes: string;
  formats: Format[];
}

interface ParsedVideo extends VideoPreview {
  id: string;
  platform: string;
  originalUrl: string;
  formats: {
    quality: string;
    size: string;
    label: string;
    formatId: string;
    isAudioAvailable: boolean;
  }[];
}

interface DownloadHistoryItem {
  id: string;
  title: string;
  platform: string;
  url: string;
  thumbnail: string;
  timestamp: string;
  formatId: string;
  isAudioAvailable: boolean;
}

export default function DownloaderWrapper() {
  const { isDark } = useTheme();
  const {
    adsenseClientId,
    topBannerSlotId,
    sidebarSlotId,
    bottomAnchorSlotId,
  } = useAdConfig();

  useEffect(() => {
    if (typeof window !== "undefined" && adsenseClientId) {
      const existingScript = document.querySelector(
        'script[src*="pagead2.googlesyndication.com"]',
      );
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, [adsenseClientId]);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [parsedVideo, setParsedVideo] = useState<ParsedVideo | null>(null);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>(
    [],
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);

  const [showAdInspector, setShowAdInspector] = useState<boolean>(true);
  const [highlightAds, setHighlightAds] = useState<boolean>(true);
  const [activeInspectorTab, setActiveInspectorTab] = useState<
    "overview" | "adsense_code"
  >("overview");
  const [selectedAdForCode, setSelectedAdForCode] =
    useState<string>("leaderboard");
  const [showStickyBottomAd, setShowStickyBottomAd] = useState<boolean>(true);

  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
  const [pendingDownloadItem, setPendingDownloadItem] = useState<
    | (ParsedVideo & {
        chosenQuality: string;
        chosenSize: string;
        formatId: string;
        isAudioAvailable: boolean;
      })
    | null
  >(null);

  const [streamToken, setStreamToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [unlockAfter, setUnlockAfter] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);

  // Download progress tracking
  const [downloadProgress, setDownloadProgress] = useState<{
    phase: "idle" | "ytdlp" | "file" | "completed" | "error";
    downloadId: string | null;
    ytdlpPercent: number;
    filePercent: number;
    speed: string;
    eta: string;
    transferred: string;
    totalSize: string;
    error?: string;
  }>({
    phase: "idle",
    downloadId: null,
    ytdlpPercent: 0,
    filePercent: 0,
    speed: "",
    eta: "",
    transferred: "0 B",
    totalSize: "",
  });

  // Abort controller for cancelling file download
  const [downloadAbortController, setDownloadAbortController] =
    useState<AbortController | null>(null);

  // Check for resume-able downloads on mount
  const [resumeEntries, setResumeEntries] = useState<
    { downloadId: string; url: string; platform: string; startedAt: number }[]
  >([]);

  useEffect(() => {
    const entries = getResumeDownloads();
    const valid: typeof resumeEntries = [];

    const checks = entries.map(async (entry) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_BACKEND_PUBLIC_API_URL}/api/download/format/status/${entry.downloadId}`,
        );
        const json = await res.json();
        if (json.success && json.data.status === "completed") {
          valid.push({
            downloadId: entry.downloadId,
            url: entry.url,
            platform: entry.platform || "video",
            startedAt: entry.startedAt,
          });
        } else {
          removeResumeState(entry.downloadId);
        }
      } catch {
        removeResumeState(entry.downloadId);
      }
    });

    Promise.all(checks).then(() => {
      setResumeEntries(valid);
      if (valid.length > 0) {
        triggerNotification(
          `${valid.length} incomplete download${valid.length > 1 ? "s" : ""} available to resume.`,
          "info",
        );
      }
    });
  }, []);

  const handleResume = async (downloadId: string) => {
    try {
      const entry = getResumeEntry(downloadId);
      if (!entry) {
        triggerNotification("Download data not found.", "info");
        return;
      }

      setIsLoading(true);
      setDownloadProgress({
        phase: "file",
        downloadId,
        ytdlpPercent: 100,
        filePercent: 0,
        speed: "",
        eta: "",
        transferred: "0 B",
        totalSize: formatBytes(entry.totalSize),
      });

      const abortController = new AbortController();
      setDownloadAbortController(abortController);

      const blob = await downloadFile(
        downloadId,
        (fileProgress) => {
          setDownloadProgress((prev) => ({
            ...prev,
            filePercent: fileProgress.percent,
            transferred: formatBytes(fileProgress.transferred),
            totalSize: formatBytes(fileProgress.total),
          }));

          if (fileProgress.percent % 5 === 0 && fileProgress.percent > 0) {
            saveResumeState({
              ...entry,
              downloadedBytes: fileProgress.transferred,
              startedAt: Date.now(),
            });
          }
        },
        abortController.signal,
        entry.downloadedBytes || 0,
      );

      setDownloadProgress((prev) => ({ ...prev, phase: "completed" }));

      const ext = blob.type.includes("mp4")
        ? "mp4"
        : blob.type.includes("webm")
          ? "webm"
          : "mp4";
      triggerDownload(blob, `resumed_video_${Date.now()}.${ext}`);

      removeResumeState(downloadId);
      setResumeEntries((prev) =>
        prev.filter((e) => e.downloadId !== downloadId),
      );

      triggerNotification("Download resumed successfully!", "success");
    } catch (error: any) {
      if (
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        removeResumeState(downloadId);
        setResumeEntries((prev) =>
          prev.filter((e) => e.downloadId !== downloadId),
        );
        triggerNotification(
          "Download expired on server. Please start again.",
          "info",
        );
      } else {
        setDownloadProgress((prev) => ({
          ...prev,
          phase: "error",
          error: error.error,
        }));
      }
    } finally {
      setIsLoading(false);
      setDownloadAbortController(null);
    }
  };

  const triggerNotification = (
    message: string,
    type: "success" | "info" = "success",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setVideoUrl(val);
    setErrorMessage("");

    if (!val) {
      setDetectedPlatform(null);
      return;
    }

    if (val.includes("instagram.com")) {
      setDetectedPlatform("instagram");
    } else if (val.includes("tiktok.com")) {
      setDetectedPlatform("tiktok");
    } else if (val.includes("youtube.com") || val.includes("youtu.be")) {
      setDetectedPlatform("youtube");
    } else if (val.includes("facebook.com") || val.includes("fb.watch")) {
      setDetectedPlatform("facebook");
    } else {
      setDetectedPlatform(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!videoUrl) {
      setErrorMessage("Please input a valid media link first.");
      return;
    }

    const matchedPlatform = detectedPlatform || getFallbackPlatform(videoUrl);

    if (!matchedPlatform) {
      setErrorMessage(
        "Provide a valid Instagram, TikTok, YouTube, or Facebook link.",
      );
      return;
    }

    setIsLoading(true);
    setProgress(15);
    setErrorMessage("");
    setParsedVideo(null);
    setStreamToken(null);

    try {
      const result = await analyzeUrl(videoUrl);
      setProgress(100);
      setIsLoading(false);

      setParsedVideo({
        title: result.title,
        thumbnail: result.thumbnail,
        duration: `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, "0")}`,
        author: result.author,
        likes: "N/A",
        formats: result.formats.map((f, idx) => ({
          quality: f.quality || f.resolution,
          size: f.filesize
            ? `${(f.filesize / 1024 / 1024).toFixed(2)} MB`
            : `${(f.filesize || 0).toLocaleString()} bytes`,
          label: idx === 0 ? "Best Quality" : "Alternative",
          formatId: f.formatId,
          isAudioAvailable: f.isAudioAvailable,
        })),
        id: result.id,
        platform: result.platform,
        originalUrl: videoUrl,
      });

      triggerNotification(
        "CDN stream decrypted and formats loaded successfully!",
        "success",
      );
    } catch (error: any) {
      setIsLoading(false);
      setProgress(0);
      setErrorMessage(error.message || "Failed to analyze video URL");
    }
  };

  const getFallbackPlatform = (url: string): string | null => {
    const lower = url.toLowerCase();
    if (lower.includes("insta")) return "instagram";
    if (lower.includes("tik") || lower.includes("tok")) return "tiktok";
    if (lower.includes("you") || lower.includes("yt")) return "youtube";
    if (lower.includes("face") || lower.includes("fb")) return "facebook";
    return null;
  };

  const handleStartSession = async (
    format: Format,
    formatId: string,
    isAudioAvailable: boolean,
  ) => {
    if (!parsedVideo) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      setPendingDownloadItem({
        ...parsedVideo,
        chosenQuality: format.quality,
        chosenSize: format.size,
        formatId,
        isAudioAvailable,
      });

      const session = await startSession(videoUrl);
      setSessionId(session.sessionId);
      setUnlockAfter(session.unlockAfter);
      setCountdown(session.unlockAfter);
      setShowInterstitial(true);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(async () => {
        try {
          const unlocked = await unlockSession(session.sessionId);
          setStreamToken(unlocked.streamToken);
          clearInterval(interval);
          triggerNotification("Download unlocked successfully!", "success");
        } catch (error: any) {
          setErrorMessage(error.message || "Failed to unlock download");
          clearInterval(interval);
        }
      }, session.unlockAfter * 1000);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || "Failed to start download session");
    }
  };

  const handleDownload = async () => {
    if (!pendingDownloadItem) return;
    setShowInterstitial(false);

    try {
      setIsLoading(true);

      setDownloadProgress({
        phase: "ytdlp",
        downloadId: null,
        ytdlpPercent: 0,
        filePercent: 0,
        speed: "",
        eta: "",
        transferred: "0 B",
        totalSize: "",
      });

      const downloadId = await initDownload(
        pendingDownloadItem.originalUrl,
        pendingDownloadItem.formatId,
        pendingDownloadItem.isAudioAvailable,
      );

      setDownloadProgress((prev) => ({ ...prev, downloadId }));

      await waitForDownload(downloadId, (progress) => {
        setDownloadProgress((prev) => ({
          ...prev,
          phase:
            progress.status === "error"
              ? "error"
              : progress.status === "completed"
                ? "file"
                : "ytdlp",
          ytdlpPercent: progress.percent,
          speed: progress.speed,
          eta: progress.eta,
          totalSize: formatBytes(progress.totalSize),
          error: progress.error,
        }));
      });

      const abortController = new AbortController();
      setDownloadAbortController(abortController);

      setDownloadProgress((prev) => ({
        ...prev,
        phase: "file",
        filePercent: 0,
      }));

      const blob = await downloadFile(
        downloadId,
        (fileProgress) => {
          setDownloadProgress((prev) => ({
            ...prev,
            filePercent: fileProgress.percent,
            transferred: formatBytes(fileProgress.transferred),
            totalSize: formatBytes(fileProgress.total),
            speed: fileProgress.percent > 0 ? `${fileProgress.percent}%` : "",
          }));

          if (fileProgress.percent % 5 === 0 && fileProgress.percent > 0) {
            saveResumeState({
              downloadId,
              downloadedBytes: fileProgress.transferred,
              totalSize: fileProgress.total,
              url: pendingDownloadItem.originalUrl,
              formatId: pendingDownloadItem.formatId,
              isAudioAvailable: pendingDownloadItem.isAudioAvailable,
              platform: pendingDownloadItem.platform,
              startedAt: Date.now(),
            });
          }
        },
        abortController.signal,
        0,
      );

      setDownloadProgress((prev) => ({ ...prev, phase: "completed" }));

      const ext = blob.type.includes("mp4")
        ? "mp4"
        : blob.type.includes("webm")
          ? "webm"
          : "mp4";
      triggerDownload(
        blob,
        `${pendingDownloadItem.platform}_video_${Date.now()}.${ext}`,
      );

      removeResumeState(downloadId);

      const updatedHistory: DownloadHistoryItem[] = [
        {
          id: pendingDownloadItem.id,
          title: pendingDownloadItem.title,
          platform: pendingDownloadItem.platform,
          url: pendingDownloadItem.originalUrl,
          thumbnail: pendingDownloadItem.thumbnail,
          timestamp: "Just now",
          formatId: pendingDownloadItem.formatId,
          isAudioAvailable: pendingDownloadItem.isAudioAvailable,
        },
        ...downloadHistory.filter(
          (item) => item.url !== pendingDownloadItem.originalUrl,
        ),
      ].slice(0, 6);

      setDownloadHistory(updatedHistory);
      localStorage.setItem(
        "vdl_premium_history",
        JSON.stringify(updatedHistory),
      );

      setShowInterstitial(false);
      setPendingDownloadItem(null);
      setStreamToken(null);
      setSessionId(null);
      triggerNotification(
        `Successfully downloaded: ${pendingDownloadItem.chosenQuality}`,
        "success",
      );
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to download video");
      setDownloadProgress((prev) => ({
        ...prev,
        phase: "error",
        error: error.message,
      }));
    } finally {
      setIsLoading(false);
      setDownloadAbortController(null);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleCopyHistory = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    triggerNotification("Copied link back to clipboard", "success");
  };

  const handleReFetch = (url: string, platform: string) => {
    setVideoUrl(url);
    setDetectedPlatform(platform);
    triggerNotification(
      "Transferred stream link back into query field.",
      "info",
    );
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const clearHistory = () => {
    setDownloadHistory([]);
    localStorage.removeItem("vdl_premium_history");
    triggerNotification("Cache purged successfully", "info");
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "info"}
          isDark={isDark}
          onClose={() => setNotification(null)}
        />
      )}

      <AdBanner
        isDark={isDark}
        highlightAds={highlightAds}
        onHighlightToggle={() => setHighlightAds(!highlightAds)}
        clientId={adsenseClientId}
        slotId={topBannerSlotId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Main Downloader Field */}
        <div className="lg:col-span-8">
          <VideoDownloader
            isDark={isDark}
            videoUrl={videoUrl}
            detectedPlatform={detectedPlatform}
            isLoading={isLoading}
            progress={progress}
            errorMessage={errorMessage}
            onUrlChange={handleUrlChange}
            onAnalyze={handleAnalyze}
          />
        </div>

        {/* Sidebar Banner Ad */}
        <div className="lg:col-span-4 border border-neutral-900 rounded-2xl p-4 sm:p-6 bg-zinc-950/40 backdrop-blur-sm min-h-[300px] flex items-center justify-center">
          <AdSenseSlot
            slotId={sidebarSlotId}
            format="auto"
            responsive={true}
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>

      {/* Resume incomplete downloads banner */}
      {resumeEntries.length > 0 && (
        <section
          className={cn(
            "rounded-2xl p-4 border mt-6",
            isDark
              ? "bg-amber-950/20 border-amber-500/30"
              : "bg-amber-50 border-amber-400/60",
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className={cn(
                "text-xs font-bold font-mono",
                isDark ? "text-amber-300" : "text-amber-800",
              )}
            >
              ⚡ Resume Incomplete Downloads
            </h3>
            <button
              onClick={() => {
                resumeEntries.forEach((e) => removeResumeState(e.downloadId));
                setResumeEntries([]);
                triggerNotification("Cleared resume entries.", "info");
              }}
              className={cn(
                "text-[9px] font-mono px-2 py-1 rounded border transition",
                isDark
                  ? "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  : "border-zinc-200 text-zinc-550 hover:text-zinc-700",
              )}
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {resumeEntries.map((entry) => (
              <div
                key={entry.downloadId}
                className={cn(
                  "flex items-center justify-between gap-3 p-3 rounded-xl border text-[11px]",
                  isDark
                    ? "bg-zinc-900/40 border-neutral-900"
                    : "bg-white border-zinc-200",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate font-medium",
                      isDark ? "text-zinc-200" : "text-zinc-800",
                    )}
                  >
                    {entry.url.split("/").pop()?.slice(0, 40) || "Video"}
                  </p>
                  <p
                    className={cn(
                      "text-[9px] font-mono mt-0.5",
                      isDark ? "text-zinc-500" : "text-zinc-400",
                    )}
                  >
                    {entry.platform} •{" "}
                    {new Date(entry.startedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleResume(entry.downloadId)}
                  disabled={isLoading}
                  className="shrink-0 text-[10px] font-bold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <span className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" />
                  ) : (
                    "Resume"
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Format Selector Overlay */}
      {parsedVideo && !streamToken && (
        <div className="mt-6">
          <FormatSelector
            isDark={isDark}
            parsedVideo={parsedVideo}
            onDownload={handleStartSession}
          />
        </div>
      )}

      {/* Player and Progress Panel */}
      {streamToken && (
        <div className="mt-6">
          <VideoPlayer
            isDark={isDark}
            parsedVideo={parsedVideo}
            streamToken={streamToken}
            onOpenInNewTab={() => {
              const element = document.createElement("a");
              element.href = getStreamUrl(streamToken);
              element.target = "_blank";
              element.rel = "noopener noreferrer";
              element.click();
            }}
            onDownload={handleDownload}
            isLoading={isLoading}
            downloadProgress={downloadProgress}
            onCancelDownload={() => {
              downloadAbortController?.abort();
              setDownloadProgress({
                phase: "idle",
                downloadId: null,
                ytdlpPercent: 0,
                filePercent: 0,
                speed: "",
                eta: "",
                transferred: "0 B",
                totalSize: "",
              });
              triggerNotification("Download cancelled", "info");
            }}
          />
        </div>
      )}

      {/* Platform quick list selector */}
      <div className="mt-6">
        <PlatformSelector
          isDark={isDark}
          activePlatform={activePlatform}
          onPlatformChange={setActivePlatform}
        />
      </div>

      {/* Sticky Bottom anchor banner */}
      {showStickyBottomAd && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40 border-t py-3.5 backdrop-blur-md transition-colors duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]",
            isDark
              ? "bg-black/95 border-neutral-900"
              : "bg-white/95 border-zinc-200",
          )}
        >
          <div className="max-w-5xl mx-auto px-4 relative flex flex-col items-center">
            <button
              onClick={() => {
                setShowStickyBottomAd(false);
                triggerNotification("Bottom anchor ad dismissed.", "info");
              }}
              className={cn(
                "absolute -top-7.5 right-4 border text-[9px] font-mono flex items-center gap-1 cursor-pointer p-1 rounded-full shadow-md z-50",
                isDark
                  ? "bg-zinc-900 border-neutral-800 text-neutral-400 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-550 hover:text-zinc-800",
              )}
              title="Close Sponsor"
            >
              <X className="w-3 h-3" /> Close Ad
            </button>

            <div className="w-full flex justify-center border border-neutral-900 rounded-lg overflow-hidden transition-all bg-neutral-950/20">
              <AdSenseSlot
                clientId={adsenseClientId}
                slotId={bottomAnchorSlotId || "5678901234"}
                format="horizontal"
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "90px",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
