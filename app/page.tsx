"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Video,
  History,
  Settings,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  X,
  Flame,
  TrendingUp,
  Sliders,
  Smartphone,
  Laptop,
  Sun,
  Moon,
  ShieldCheck,
} from "lucide-react";

import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";

import { ThemeToggle, Notification, AdBanner, AdInspector, InterstitialAd, VideoDownloader, FormatSelector, VideoPlayer, DownloadHistory, PlatformSelector, FAQSection, HowToUseSection } from "@/components/ui";
import { PLATFORMS, FAQS, ADSENSE_CODE_TEMPLATES } from "@/lib/constants";
import {
  analyzeUrl,
  startSession,
  unlockSession,
  getStreamUrl,
  downloadFormat,
} from "@/lib/api";

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
  const [pendingDownloadItem, setPendingDownloadItem] =
    useState<ParsedVideo & { chosenQuality: string; chosenSize: string; formatId: string; isAudioAvailable: boolean } | null>(null);

  const [streamToken, setStreamToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [unlockAfter, setUnlockAfter] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem("vdl_premium_history");
    if (stored) {
      try {
        setDownloadHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Local storage download history empty or read mismatch");
      }
    } else {
      const initialSeed: DownloadHistoryItem[] = [
        {
          id: "seed-1",
          title: "Premium luxury layout designs & minimalist spatial concepts",
          platform: "instagram",
          url: "https://instagram.com/reel/C8_sunset_bali/",
          thumbnail:
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=150&q=80",
          timestamp: "Just now",
          formatId: "0",
          isAudioAvailable: true,
        },
      ];
      setDownloadHistory(initialSeed);
      localStorage.setItem("vdl_premium_history", JSON.stringify(initialSeed));
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("vdl_theme", nextTheme);
    triggerNotification(
      `Switched to ${nextTheme === "dark" ? "Dark Mode" : "Light Mode"}`,
      "info",
    );
  };

  const triggerNotification = (message: string, type: "success" | "info" = "success") => {
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
        duration: `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}`,
        author: result.author,
        likes: "N/A",
        formats: result.formats.map((f, idx) => ({
          quality: f.quality || f.resolution,
          size: f.filesize ? `${(f.filesize / 1024 / 1024).toFixed(2)} MB` : `${(f.filesize || 0).toLocaleString()} bytes`,
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

  const handleStartSession = async (format: Format, formatId: string, isAudioAvailable: boolean) => {
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
    if (!pendingDownloadItem || !streamToken) return;

    try {
      setIsLoading(true);

      if (!pendingDownloadItem.isAudioAvailable) {
        await downloadFormat(
          pendingDownloadItem.originalUrl,
          pendingDownloadItem.formatId,
          false
        );
      } else {
        const blob = await downloadFormat(
          pendingDownloadItem.originalUrl,
          pendingDownloadItem.formatId,
          true
        );
        const url = URL.createObjectURL(blob);
        const element = document.createElement("a");
        element.href = url;
        element.download = `${pendingDownloadItem.platform}_video_${Date.now()}.mp4`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }

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
      localStorage.setItem("vdl_premium_history", JSON.stringify(updatedHistory));

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
    } finally {
      setIsLoading(false);
    }
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
    navigator.clipboard.writeText(ADSENSE_CODE_TEMPLATES[selectedAdForCode]);
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
      className={`min-h-screen ${rootBg} font-sans antialiased relative pb-32 sm:pb-28 transition-colors duration-300`}
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

      {showInterstitial && (
        <InterstitialAd
          isDark={isDark}
          showInterstitial={showInterstitial}
          onClose={() => {
            setShowInterstitial(false);
            setPendingDownloadItem(null);
            triggerNotification("Download process canceled.", "info" as const);
          }}
          pendingDownloadItem={pendingDownloadItem}
          countdown={countdown}
          onDownload={handleDownload}
        />
      )}

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
            <button
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
            </button>
          </div>
        </div>
      </header>

      <AdBanner
        isDark={isDark}
        highlightAds={highlightAds}
        onHighlightToggle={() => setHighlightAds(!highlightAds)}
      />

      <main
        id="downloader-section"
        className="max-w-6xl mx-auto px-4 py-6 sm:py-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
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

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <DownloadHistory
              isDark={isDark}
              downloadHistory={downloadHistory}
              onCopyHistory={handleCopyHistory}
              onReFetch={handleReFetch}
              onClearHistory={clearHistory}
              copiedIndex={copiedIndex}
            />
          </div>
        </div>

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
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-4 relative">
            <button
              onClick={() => {
                setShowStickyBottomAd(false);
                triggerNotification("Bottom anchor ad dismissed.", "info");
              }}
              className={`absolute -top-3.5 right-4 border text-[9px] font-mono flex items-center gap-1 cursor-pointer p-1 rounded-full shadow-md ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800"
              }`}
              title="Close Sponsor"
            >
              <X className="w-3 h-3" /> Close Ad
            </button>

            <div
              className={`w-full rounded-lg p-2.5 flex flex-col md:flex-row items-center justify-between gap-3 ${
                highlightAds
                  ? isDark
                    ? "bg-amber-950/15 border border-dashed border-amber-500/50"
                    : "bg-amber-50/70 border border-dashed border-amber-400/55"
                  : isDark
                    ? "bg-zinc-900"
                    : "bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    isDark
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  AdSense Anchor
                </span>
                <p
                  className={`text-[11px] truncate font-mono ${isDark ? "text-zinc-300" : "text-zinc-600"}`}
                >
                  {highlightAds
                    ? "👉 Sticky Bottom Ad Zone (Universal mobile layout anchor - highly conversion efficient)"
                    : "Sponsor: Clean Postgres storage, user auth, and real-time APIs using Supabase."}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[9px] font-mono text-zinc-550 hidden md:inline">
                  Ideal mobile placement
                </span>
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noreferrer"
                  className={`font-bold px-3 py-1 text-[10px] rounded-lg transition uppercase tracking-wider shadow-sm ${
                    isDark
                      ? "bg-zinc-100 hover:bg-white text-zinc-950"
                      : "bg-zinc-900 hover:bg-zinc-855 text-white"
                  }`}
                >
                  Visit site
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdInspector && (
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
          adTemplates={ADSENSE_CODE_TEMPLATES}
          onCopyCode={handleCopyCode}
        />
      )}

      <footer
        className={`border-t py-8 relative z-10 ${isDark ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-200"}`}
      >
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b ${
              isDark ? "border-zinc-900" : "border-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                  isDark
                    ? "bg-zinc-100 text-zinc-950"
                    : "bg-zinc-900 text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <span
                className={`text-xs font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
              >
                Aether Downloader Studio
              </span>
            </div>

            <p className="text-[10px] text-zinc-550 max-w-sm text-center sm:text-right leading-relaxed font-mono">
              Independent utility platform. Not affiliated with Instagram,
              TikTok, YouTube, or Facebook. No media assets are hosted locally
              on our nodes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-[10px] text-zinc-500 font-mono">
            <a href="#" className="hover:text-zinc-300 transition">
              Terms & Service
            </a>
            <a href="#" className="hover:text-zinc-300 transition">
              Privacy Settings
            </a>
            <a href="#" className="hover:text-zinc-300 transition">
              Cookie Settings
            </a>
            <a href="#" className="hover:text-zinc-300 transition">
              Contact Webmaster
            </a>
          </div>

          <div className="text-[9px] text-zinc-500 font-mono">
            <p>
              © {new Date().getFullYear()} Aether Downloader. Engineered for
              hyper-speed downloads and clean monetization.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}