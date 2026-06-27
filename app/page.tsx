"use client";

import React, { useState, useEffect } from "react";
import { Video, X } from "lucide-react";

import {
  ThemeToggle,
  Notification,
  AdBanner,
  InterstitialAd,
  VideoDownloader,
  FormatSelector,
  VideoPlayer,
  DownloadHistory,
  PlatformSelector,
  FAQSection,
  HowToUseSection,
  AdSenseSlot,
} from "@/components/ui";
import { PLATFORMS, FAQS, ADSENSE_CODE_TEMPLATES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  analyzeUrl,
  startSession,
  unlockSession,
  getStreamUrl,
  downloadFormat,
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
import { useAdConfig } from "@/config/zustand";
import Footer from "@/components/ui/Footer";

type PlatformId = "all" | "instagram" | "tiktok" | "youtube" | "facebook";

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

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const { adsenseClientId, topBannerSlotId, sidebarSlotId, bottomAnchorSlotId } =
    useAdConfig();
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

  const computedAdTemplates = React.useMemo(() => {
    const templates: Record<string, string> = {};
    for (const [key, value] of Object.entries(ADSENSE_CODE_TEMPLATES)) {
      templates[key] = value.replaceAll(
        "ca-pub-XXXXXXXXXXXXX",
        adsenseClientId,
      );
    }
    return templates;
  }, [adsenseClientId]);

  useEffect(() => {
    const saved = localStorage.getItem("vdl_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    }
  }, []);

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
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
  const [interstitialTimer, setInterstitialTimer] = useState<number>(5);
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
      // If the file expired on the server, remove resume state
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
          error: error.message,
        }));
      }
    } finally {
      setIsLoading(false);
      setDownloadAbortController(null);
    }
  };

  // useEffect(() => {
  //   const stored = localStorage.getItem("vdl_premium_history");
  //   if (stored) {
  //     try {
  //       setDownloadHistory(JSON.parse(stored));
  //     } catch (e) {
  //       console.error("Local storage download history empty or read mismatch");
  //     }
  //   } else {
  //     const initialSeed: DownloadHistoryItem[] = [
  //       {
  //         id: "seed-1",
  //         title: "Premium luxury layout designs & minimalist spatial concepts",
  //         platform: "instagram",
  //         url: "https://instagram.com/reel/C8_sunset_bali/",
  //         thumbnail:
  //           "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=150&q=80",
  //         timestamp: "Just now",
  //         formatId: "0",
  //         isAudioAvailable: true,
  //       },
  //     ];
  //     // setDownloadHistory(initialSeed);
  //     // localStorage.setItem("vdl_premium_history", JSON.stringify(initialSeed));
  //   }
  // }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("vdl_theme", nextTheme);
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

      console.log(result.thumbnail);
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
          console.log("i am saving the stream Token", unlocked.streamToken);
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

  useEffect(() => {
    let ticker: NodeJS.Timeout;
    if (showInterstitial && interstitialTimer > 0) {
      ticker = setInterval(() => {
        setInterstitialTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(ticker);
  }, [showInterstitial, interstitialTimer]);

  const handleDownload = async () => {
    console.log("on download clicked", pendingDownloadItem, streamToken);
    if (!pendingDownloadItem) return;

    // Close InterstitialAd immediately so user can see the progress bar
    setShowInterstitial(false);

    try {
      setIsLoading(true);

      // ── Phase 1: Initiate yt-dlp download on server ──
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

      // ── Phase 2: Subscribe to yt-dlp progress via SSE ──
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

      // ── Phase 3: Download the file from server with byte progress ──
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

          // Save resume state periodically (every 5%)
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

      // ── Phase 4: Done — save file and update history ──
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

      // Clear resume state since download succeeded
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

  /** Helper: format bytes to human-readable string */
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleCopyHistory = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    triggerNotification("Copied link back to clipboard", "success" as const);
    setTimeout(() => setCopiedIndex(null), 2000);
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(computedAdTemplates[selectedAdForCode]);
    triggerNotification("AdSense responsive code copied!", "success");
  };

  const isDark = theme === "dark";

  const rootBg = isDark
    ? "bg-zinc-950 text-zinc-200 selection:bg-zinc-800 selection:text-white"
    : "bg-zinc-50 text-zinc-800 selection:bg-zinc-200 selection:text-zinc-900";
  const headerBg = isDark
    ? "bg-zinc-950/90 border-zinc-900/60"
    : "bg-white/85 border-zinc-200/80";
  const headerText = isDark ? "text-white" : "text-zinc-900";
  const headerLinks = isDark
    ? "text-zinc-400 hover:text-zinc-100"
    : "text-zinc-600 hover:text-zinc-900";
  const glowGradient = isDark ? "from-zinc-900/45" : "from-zinc-200/40";
  const cardBg = isDark
    ? "bg-zinc-900 border-zinc-850"
    : "bg-white border-zinc-200 shadow-sm";
  const innerCardBg = isDark
    ? "bg-zinc-950 border-zinc-850"
    : "bg-zinc-50 border-zinc-200";
  const badgeBg = isDark
    ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
    : "bg-white border-zinc-200 text-zinc-500 shadow-sm";
  const textTitle = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-400" : "text-zinc-500";
  const inputBg = isDark
    ? "bg-zinc-950 text-zinc-200 placeholder:text-zinc-600 border-zinc-800 focus:border-zinc-700"
    : "bg-zinc-50 text-zinc-800 placeholder:text-zinc-400 border-zinc-200 focus:border-zinc-300";
  const btnPrimary = isDark
    ? "bg-zinc-100 hover:bg-white text-zinc-950"
    : "bg-zinc-900 hover:bg-zinc-850 text-white";
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";

  return (
    <div
      className={cn(`min-h-screen ${rootBg} font-sans antialiased relative transition-all duration-300`,
        showStickyBottomAd
          ? "pb-32 sm:pb-36"
          : "pb-12 sm:pb-16"
      )}
    >
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b ${glowGradient} via-transparent to-transparent pointer-events-none z-0`}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "info"}
          isDark={isDark}
          onClose={() => setNotification(null)}
        />
      )}

     {/* {showInterstitial && (
        <InterstitialAd
          isDark={isDark}
          showInterstitial={true}
          onClose={() => {
            setShowInterstitial(false);
            setPendingDownloadItem(null);
            triggerNotification("Download process canceled.", "info" as const);
          }}
          pendingDownloadItem={pendingDownloadItem}
          countdown={countdown}
          onDownload={handleDownload}
          clientId={adsenseClientId}
        />
      )}}*/}

      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b ${headerBg} transition-colors duration-300`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-white"}`}
            >
              <Video className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-sm font-extrabold tracking-tight leading-none truncate ${headerText}`}
              >
                Aether Downloader
              </span>
              <span className="text-[9px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                No-Watermark Extraction Live
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono">
            <a
              href="#downloader-section"
              className={`${headerLinks} transition`}
            >
              Parser
            </a>
            <a href="#how-to-use" className={`${headerLinks} transition`}>
              Workflow
            </a>
            <a href="#faq-section" className={`${headerLinks} transition`}>
              FAQs
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            {/* <button
              onClick={() => {
                setShowAdInspector(!showAdInspector);
                triggerNotification(
                  showAdInspector
                    ? "Ad inspector closed"
                    : "Ad inspector opened",
                );
              }}
              className={`flex items-center gap-1.5 border text-xs px-3 py-1.5 rounded-lg transition ${
                isDark
                  ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-850"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 shadow-sm"
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Ad Settings</span>
            </button> */}
          </div>
        </div>
      </header>

      <AdBanner
        isDark={isDark}
        highlightAds={highlightAds}
        onHighlightToggle={() => setHighlightAds(!highlightAds)}
        clientId={adsenseClientId}
        slotId={topBannerSlotId}
      />

      <main
        id="downloader-section"
        className="flex flex-col gap-4 max-w-6xl mx-auto px-4 py-6 sm:py-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-4">
          <VideoDownloader
            isDark={isDark}
            videoUrl={videoUrl} // TODO remove this after test
            detectedPlatform={detectedPlatform}
            isLoading={isLoading}
            progress={progress}
            errorMessage={errorMessage}
            onUrlChange={handleUrlChange}
            onAnalyze={handleAnalyze}
          />

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 flex flex-1 border rounded-2xl p-4 sm:p-6 lg:p-4 xl:p-6 transition-colors duration-300">
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
            {/* <DownloadHistory
              isDark={isDark}
              downloadHistory={downloadHistory}
              onCopyHistory={handleCopyHistory}
              onReFetch={handleReFetch}
              onClearHistory={clearHistory}
              copiedIndex={copiedIndex}
            /> */}
          </div>
        </div>

        {/* Resume banner for interrupted downloads */}
        {resumeEntries.length > 0 && (
          <section
            className={cn(
              "rounded-2xl p-4 border",
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
                    : "border-zinc-200 text-zinc-500 hover:text-zinc-700",
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
                      ? "bg-zinc-900 border-zinc-800"
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
                    className={cn(
                      "shrink-0 text-[10px] font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5",
                      isDark
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white",
                    )}
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

        {parsedVideo && !streamToken && (
          <FormatSelector
            isDark={isDark}
            parsedVideo={parsedVideo}
            onDownload={handleStartSession}
          />
        )}

        {streamToken && (
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
        )}

        <PlatformSelector
          isDark={isDark}
          activePlatform={activePlatform}
          onPlatformChange={setActivePlatform}
        />

        <HowToUseSection isDark={isDark} />
        <FAQSection isDark={isDark} faqs={FAQS} />
      </main>

      {showStickyBottomAd && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 border-t py-3.5 backdrop-blur-md transition-colors duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] ${
            isDark
              ? "bg-zinc-950/95 border-zinc-850"
              : "bg-white/95 border-zinc-200"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 relative flex flex-col items-center">
            <button
              onClick={() => {
                setShowStickyBottomAd(false);
                triggerNotification("Bottom anchor ad dismissed.", "info");
              }}
              className={`absolute -top-3.5 right-4 border text-[9px] font-mono flex items-center gap-1 cursor-pointer p-1 rounded-full shadow-md z-50 ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800"
              }`}
              title="Close Sponsor"
            >
              <X className="w-3 h-3" /> Close Ad
            </button>

            <div
              className={cn(
                "w-full rounded-lg p-2 flex flex-col items-center justify-center relative overflow-hidden transition-all",
                highlightAds
                  ? isDark
                    ? "bg-amber-950/15 border border-dashed border-amber-500/50 pt-6"
                    : "bg-amber-50/70 border border-dashed border-amber-400/55 pt-6"
                  : "min-h-[90px]",
              )}
            >
              {highlightAds && (
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 border-b px-3 py-1 flex items-center justify-between text-[8px] sm:text-[9px] font-mono",
                    isDark
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                      : "bg-amber-50 border-amber-200 text-amber-800",
                  )}
                >
                  <span className="flex items-center gap-1 truncate">
                    <strong>
                      Google AdSense Spot: Bottom Anchor banner [5678901234]
                    </strong>
                  </span>
                  <span className="bg-amber-500 text-zinc-950 px-1 rounded font-bold uppercase text-[7px] tracking-wider shrink-0">
                    Anchor Unit
                  </span>
                </div>
              )}

              <div className="w-full flex justify-center">
                <AdSenseSlot
                  clientId={adsenseClientId}
                  slotId="5678901234"
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
        </div>
      )}

      {/* {showAdInspector && (
        <AdInspector
          isDark={isDark}
          showAdInspector={showAdInspector}
          onToggle={() => setShowAdInspector(!showAdInspector)}
          highlightAds={highlightAds}
          onHighlightToggle={setHighlightAds}
          activeInspectorTab={activeInspectorTab}
          onTabChange={setActiveInspectorTab}
          selectedAdForCode={selectedAdForCode}
          onAdSelect={setSelectedAdForCode}
          adTemplates={computedAdTemplates}
          onCopyCode={handleCopyCode}
          clientId={adsenseClientId}
          onClientIdChange={setAdConfig}
        />
      )} */}

      <Footer isDark={isDark} />
    </div>
  );
}
