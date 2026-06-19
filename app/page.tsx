"use client";
import React, { useState, useEffect } from "react";
import {
  Download,
  Video,
  History,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  X,
  Flame,
  TrendingUp,
  Sliders,
  Maximize2,
  Lock,
  DollarSign,
  Settings,
  Sparkles,
  Info,
  Smartphone,
  Laptop,
  Sun,
  Moon,
} from "lucide-react";

import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";

type PlatformId = "all" | "instagram" | "tiktok" | "youtube" | "facebook";

interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PLATFORMS: Platform[] = [
  { id: "all", name: "All Links", icon: Sliders },
  { id: "instagram", name: "Instagram", icon: FaInstagram },
  { id: "tiktok", name: "TikTok", icon: Flame },
  { id: "youtube", name: "YouTube", icon: FaYoutube },
  { id: "facebook", name: "Facebook", icon: FaFacebook },
];

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
}

interface PendingDownloadItem extends ParsedVideo {
  chosenQuality: string;
  chosenSize: string;
}

interface DownloadHistoryItem {
  id: string;
  title: string;
  platform: string;
  url: string;
  thumbnail: string;
  timestamp: string;
}

interface FAQ {
  q: string;
  a: string;
}

const MOCK_PREVIEWS: Record<string, VideoPreview> = {
  instagram: {
    title: "Cinematic architecture exploration in Tokyo, Japan",
    thumbnail:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    duration: "0:24",
    author: "@tokyo.spaces",
    likes: "84.2K",
    formats: [
      {
        quality: "1080p Ultra HD (MP4)",
        size: "12.8 MB",
        label: "Source Quality",
      },
      { quality: "720p HD (MP4)", size: "6.4 MB", label: "Compressed" },
      { quality: "Audio (MP3)", size: "410 KB", label: "Original Audio" },
    ],
  },
  tiktok: {
    title: "Satisfying visual arts and minimalist ceramic crafting ASMR",
    thumbnail:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    duration: "0:59",
    author: "@minimalist.kiln",
    likes: "1.4M",
    formats: [
      {
        quality: "Original HD No Watermark (MP4)",
        size: "18.1 MB",
        label: "Clean Stream",
      },
      {
        quality: "Original with Watermark (MP4)",
        size: "14.2 MB",
        label: "Standard",
      },
      {
        quality: "Studio Audio Track (MP3)",
        size: "1.1 MB",
        label: "Hi-Res Audio",
      },
    ],
  },
  youtube: {
    title: "A simple guide to productivity and spatial design frameworks",
    thumbnail:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    duration: "1:00",
    author: "Design Theory Studio",
    likes: "92K",
    formats: [
      { quality: "1080p Full HD (MP4)", size: "22.5 MB", label: "Ultra Crisp" },
      { quality: "720p HD (MP4)", size: "11.8 MB", label: "Standard" },
      { quality: "M4A Audio stream", size: "1.8 MB", label: "Audio Only" },
    ],
  },
  facebook: {
    title: "Artisanal bakery techniques - Preparing slow fermented sourdough",
    thumbnail:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    duration: "2:15",
    author: "@sourdough.artisans",
    likes: "18K",
    formats: [
      {
        quality: "720p Premium HD (MP4)",
        size: "28.4 MB",
        label: "High Quality",
      },
      { quality: "480p SD (MP4)", size: "12.1 MB", label: "Standard" },
    ],
  },
};

const FAQS: FAQ[] = [
  {
    q: "How does the downloader extract source files in original quality?",
    a: "Our core parser analyzes CDN nodes to grab raw uncompressed media files directly before any social application layers compress them.",
  },
  {
    q: "Is this media downloader utility optimized for mobile web layouts?",
    a: "Absolutely. The layout adapts dynamically for iOS Safaris, Android Chromes, iPad tablets, and widescreen desktop screens without layout shifts.",
  },
  {
    q: "Are the native banner ads and sponsor placements secure?",
    a: "Yes. All ad spots follow strict sandboxed protocols. They conform to high-security guidelines to keep your browsing experience clean.",
  },
];

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vdl_theme");
      return saved === "light" || saved === "dark" ? saved : "dark";
    }
    return "dark";
  });

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
    useState<PendingDownloadItem | null>(null);

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

  const triggerNotification = (message: string, type: string = "success") => {
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

  const handleAnalyze = (e: React.FormEvent<HTMLFormElement>) => {
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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setIsLoading(false);
        const matchedData = MOCK_PREVIEWS[matchedPlatform];

        setParsedVideo({
          ...matchedData,
          platform: matchedPlatform,
          originalUrl: videoUrl,
          id: "vid-" + Date.now(),
        });

        triggerNotification(
          "CDN stream decrypted and formats loaded successfully!",
          "success",
        );
      }, 250);
    }, 1200);
  };

  const getFallbackPlatform = (url: string): string | null => {
    const lower = url.toLowerCase();
    if (lower.includes("insta")) return "instagram";
    if (lower.includes("tik") || lower.includes("tok")) return "tiktok";
    if (lower.includes("you") || lower.includes("yt")) return "youtube";
    if (lower.includes("face") || lower.includes("fb")) return "facebook";
    return null;
  };

  const startSecureDownload = (format: Format) => {
    if (!parsedVideo) return;
    setPendingDownloadItem({
      ...parsedVideo,
      chosenQuality: format.quality,
      chosenSize: format.size,
    });
    setInterstitialTimer(5);
    setShowInterstitial(true);
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

  const proceedWithActualDownload = () => {
    if (!pendingDownloadItem) return;

    const element = document.createElement("a");
    const file = new Blob(["Simulated Raw Media Binaries"], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${pendingDownloadItem.platform}_video_${Date.now()}.mp4`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    const updatedHistory: DownloadHistoryItem[] = [
      {
        id: pendingDownloadItem.id,
        title: pendingDownloadItem.title,
        platform: pendingDownloadItem.platform,
        url: pendingDownloadItem.originalUrl,
        thumbnail: pendingDownloadItem.thumbnail,
        timestamp: "Just now",
      },
      ...downloadHistory.filter(
        (item) => item.url !== pendingDownloadItem.originalUrl,
      ),
    ].slice(0, 6);

    setDownloadHistory(updatedHistory);
    localStorage.setItem("vdl_premium_history", JSON.stringify(updatedHistory));

    setShowInterstitial(false);
    triggerNotification(
      `Successfully downloaded: ${pendingDownloadItem.chosenQuality}`,
      "success",
    );
    setPendingDownloadItem(null);
  };

  const handleCopyHistory = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    triggerNotification("Copied link back to clipboard", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearHistory = () => {
    setDownloadHistory([]);
    localStorage.removeItem("vdl_premium_history");
    triggerNotification("Cache purged successfully", "info");
  };

  const ADSENSE_CODE_TEMPLATES: Record<string, string> = {
    leaderboard: `<!-- Google AdSense - Responsive Leaderboard (Header Unit) -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXX"
     data-ad-slot="9876543210"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
    sidebar: `<!-- Google AdSense - Smart Sidebar Skyscraper (Adapts to Square on mobile screens) -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
    infeed: `<!-- Google AdSense - Fluid Native In-Feed Placement -->
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-XXXXXXXXXXXXX"
     data-ad-slot="3456789012"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
    anchor: `<!-- Google AdSense - Sticky Bottom Anchor banner -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXX"
     data-ad-slot="5678901234"
     data-ad-format="horizontal"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
    interstitial: `<!-- Google AdSense - Vignette Ads / High yield Interstitial -->
<!-- Best set via the AdSense Dashboard > Auto Ads settings. Toggle Vignette Ads on. -->`,
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
      {/* Background Soft Lighting Glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b ${glowGradient} via-transparent to-transparent pointer-events-none z-0`}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-[60] animate-fade-in shadow-2xl rounded-xl p-3.5 border backdrop-blur-md flex items-center gap-3 max-w-[calc(100vw-2rem)] sm:max-w-sm ${
            isDark
              ? "bg-zinc-900/98 border-zinc-800/80 text-zinc-300"
              : "bg-white border-zinc-200 text-zinc-800"
          }`}
        >
          <div
            className={`p-1 rounded-lg shrink-0 ${isDark ? "bg-zinc-800 text-emerald-400" : "bg-zinc-100 text-emerald-600"}`}
          >
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold line-clamp-2">
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="text-zinc-400 hover:text-zinc-600 ml-auto pl-2 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {}
      {showInterstitial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-zinc-950/95 backdrop-blur-md">
          <div
            className={`w-full max-w-lg rounded-2xl p-5 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[95vh] border ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            <button
              onClick={() => {
                setShowInterstitial(false);
                setPendingDownloadItem(null);
                triggerNotification("Download process canceled.", "info");
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-zinc-500 hover:text-zinc-300 p-2 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5 sm:mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full tracking-wider uppercase font-semibold">
                <Sparkles className="w-3 h-3" /> Secure Node Handshake
              </span>
              <h4
                className={`text-base sm:text-lg font-bold mt-2 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
              >
                Generating Secure Raw Stream Connection
              </h4>
              <p
                className={`text-[11px] mt-1 max-w-sm mx-auto ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                Please wait a few moments for our decentralized cache system.
                Your download remains completely free thanks to our sponsor.
              </p>
            </div>

            {/* Premium AdSense Sponsor Visualized Unit */}
            <div
              className={`rounded-xl p-4 sm:p-5 border transition-all ${
                highlightAds
                  ? "bg-amber-500/5 border-amber-500/30"
                  : innerCardBg
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mb-2.5">
                <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">
                  AdSense Vignette Placement
                </span>
                <span>id: ca-pub-adsense-interstitial</span>
              </div>

              <div
                className={`min-h-[140px] border rounded-lg flex flex-col items-center justify-center p-4 text-center ${
                  isDark
                    ? "bg-zinc-950/80 border-zinc-800"
                    : "bg-white border-zinc-200"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-zinc-50/10 flex items-center justify-center text-amber-400 mb-2 border border-zinc-200/10">
                  <DollarSign className="w-5 h-5 animate-pulse" />
                </div>
                <p
                  className={`text-xs font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                >
                  Scale Globally with Supabase Database Services
                </p>
                <p
                  className={`text-[10px] mt-1.5 max-w-xs leading-normal ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  Host user profiles, save global media histories, and sync
                  cross-platform structures inside standard PostgreSQL nodes.
                </p>
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    triggerNotification(
                      "Redirecting safely to secure advertiser site...",
                    )
                  }
                  className={`mt-3.5 text-[10px] px-3 py-1.5 rounded-lg border transition inline-flex items-center gap-1.5 font-semibold ${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-755 border-zinc-700 text-zinc-300"
                      : "bg-zinc-100 hover:bg-zinc-200 border-zinc-250 text-zinc-700"
                  }`}
                >
                  Visit Sponsor Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Interstitial Action Trigger */}
            <div
              className={`mt-5 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? "border-zinc-850" : "border-zinc-100"
              }`}
            >
              <div className="text-center sm:text-left">
                <p
                  className={`text-xs font-semibold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                >
                  Payload Format:{" "}
                  <span
                    className={`${isDark ? "text-zinc-100" : "text-zinc-900"} font-extrabold`}
                  >
                    {pendingDownloadItem?.chosenQuality}
                  </span>
                </p>
                <p
                  className={`text-[10px] font-mono mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  Stream packet size: {pendingDownloadItem?.chosenSize}
                </p>
              </div>

              {interstitialTimer > 0 ? (
                <button
                  disabled
                  className={`w-full sm:w-auto text-xs font-semibold px-4 py-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-not-allowed ${
                    isDark
                      ? "bg-zinc-950 text-zinc-500 border-zinc-850"
                      : "bg-zinc-100 text-zinc-400 border-zinc-200"
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-t-amber-400 animate-spin" />
                  Generating links ({interstitialTimer}s)
                </button>
              ) : (
                <button
                  onClick={proceedWithActualDownload}
                  className={`w-full sm:w-auto text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-150 animate-pulse shadow-md ${
                    isDark
                      ? "bg-zinc-100 hover:bg-white text-zinc-950 shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white"
                  }`}
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  Secure Raw Stream File
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {}
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
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? "border-zinc-800 bg-zinc-900 text-amber-400 hover:bg-zinc-850"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 shadow-sm"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

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

      {}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div
          className={`relative rounded-xl border transition-all overflow-hidden ${
            highlightAds
              ? isDark
                ? "bg-amber-950/10 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
                : "bg-amber-50/50 border-amber-400/60 shadow-sm"
              : isDark
                ? "bg-zinc-900/60 border-zinc-900/50"
                : "bg-white border-zinc-200 shadow-sm"
          }`}
        >
          {highlightAds && (
            <div
              className={`absolute top-0 left-0 right-0 border-b px-3 py-1 flex items-center justify-between text-[8px] sm:text-[9px] font-mono ${
                isDark
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <span className="flex items-center gap-1 truncate">
                <DollarSign className="w-3 h-3" /> **Google AdSense Spot: Top
                Responsive Leaderboard [728x90]**
              </span>
              <span className="bg-amber-500 text-zinc-950 px-1 rounded font-bold uppercase text-[7px] tracking-wider shrink-0">
                MAX RPM
              </span>
            </div>
          )}

          <div
            className={`flex flex-col items-center justify-center p-4 min-h-[90px] ${highlightAds ? "pt-8" : ""}`}
          >
            <span
              className={`text-[9px] font-mono tracking-widest uppercase mb-2 ${textMuted}`}
            >
              Advertisement
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left max-w-2xl w-full">
              <div
                className={`w-12 h-10 rounded border flex items-center justify-center font-mono text-[9px] shrink-0 ${
                  isDark
                    ? "bg-zinc-800/80 border-zinc-700 text-zinc-400"
                    : "bg-zinc-100 border-zinc-200 text-zinc-500"
                }`}
              >
                Banner
              </div>
              <div className="min-w-0 flex-1">
                <h5
                  className={`text-[11px] sm:text-xs font-semibold truncate ${isDark ? "text-zinc-300" : "text-zinc-800"}`}
                >
                  Create Interactive Web App Mockups with Tailwind Blocks
                </h5>
                <p className="text-[10px] text-zinc-500 leading-normal truncate">
                  Prototype UI views in minutes instead of manually writing long
                  css selectors. Export ready-to-run codes.
                </p>
              </div>
              <a
                href="https://google.com"
                target="_blank"
                rel="noreferrer"
                className={`text-[10px] px-3 py-1 rounded transition shrink-0 border ${
                  isDark
                    ? "bg-zinc-950 hover:bg-zinc-850 border-zinc-800 text-zinc-350"
                    : "bg-white hover:bg-zinc-50 border-zinc-250 text-zinc-700 shadow-sm"
                }`}
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>

      {}
      <main
        id="downloader-section"
        className="max-w-6xl mx-auto px-4 py-6 sm:py-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Area (8 cols): Main Tool Area */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Elegant Minimal Header */}
            <section className="text-left py-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-wider uppercase border ${badgeBg}`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />{" "}
                Decentralized Fast Link Parser
              </div>

              <h1
                className={`text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2 leading-snug ${textTitle}`}
              >
                Extract Social Media Streams with Zero Compression
              </h1>

              <p
                className={`text-xs sm:text-sm leading-relaxed max-w-xl ${textSub}`}
              >
                Paste Instagram Reels, TikTok, YouTube Shorts, or Facebook URLs
                directly. We connect straight to uncompressed CDNs to extract
                clean raw formats.
              </p>
            </section>

            {/* Input Box Area */}
            <section className={`rounded-2xl p-4 sm:p-5 ${cardBg}`}>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={handleUrlChange}
                      placeholder="Paste your video, short, or reel link..."
                      className={`w-full text-xs sm:text-sm px-4 py-3.5 rounded-xl outline-none transition pr-28 ${inputBg}`}
                    />
                    {detectedPlatform && (
                      <div
                        className={`absolute right-2 top-2.5 text-[8px] uppercase font-mono tracking-wider px-2 py-1 rounded border ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                            : "bg-white border-zinc-250 text-zinc-500 shadow-sm"
                        }`}
                      >
                        {detectedPlatform}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-150 disabled:opacity-50 shrink-0 shadow-sm ${btnPrimary}`}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className={`w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ${isDark ? "border-zinc-950" : "border-white"}`}
                        />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        Fetch Stream
                      </>
                    )}
                  </button>
                </div>

                {errorMessage && (
                  <div
                    className={`flex items-center gap-2 text-xs p-3 rounded-lg border ${
                      isDark
                        ? "bg-zinc-950 text-zinc-400 border-zinc-850"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{errorMessage}</span>
                  </div>
                )}
              </form>

              {/* Parsing Progress Area */}
              {isLoading && (
                <div className={`mt-4 p-4 rounded-xl border ${innerCardBg}`}>
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-2 font-mono">
                    <span className="text-zinc-500 flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping" />
                      Connecting with Edge Delivery CDN Nodes...
                    </span>
                    <span
                      className={`font-bold shrink-0 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div
                    className={`w-full h-[3px] rounded-full overflow-hidden ${isDark ? "bg-zinc-900" : "bg-zinc-200"}`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${isDark ? "bg-zinc-300" : "bg-zinc-650"}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Security Badges */}
              <div
                className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 text-[9px] sm:text-[10px] font-mono pt-3 border-t ${
                  isDark
                    ? "border-zinc-850/60 text-zinc-550"
                    : "border-zinc-100 text-zinc-500"
                }`}
              >
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SSL
                  Inspected Node
                </span>
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" /> High-Res CDN
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Client Sandbox
                </span>
              </div>
            </section>

            {/* In-feed Ad Zone */}
            <div
              className={`relative rounded-xl border transition-all overflow-hidden ${
                highlightAds
                  ? isDark
                    ? "bg-amber-950/10 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
                    : "bg-amber-50/50 border-amber-400/60 shadow-sm"
                  : isDark
                    ? "bg-zinc-900/60 border-zinc-900/50"
                    : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              {highlightAds && (
                <div
                  className={`absolute top-0 left-0 right-0 border-b px-3 py-1 flex items-center justify-between text-[8px] sm:text-[9px] font-mono ${
                    isDark
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> **Google AdSense Unit:
                    In-Feed Fluid / Native Display Ad [300x250 format]**
                  </span>
                  <span className="bg-amber-500 text-zinc-950 px-1 rounded font-bold uppercase text-[7px] tracking-wider">
                    In-Feed Native
                  </span>
                </div>
              )}

              <div
                className={`flex flex-col items-center justify-center p-4 sm:p-5 min-h-[120px] ${highlightAds ? "pt-8" : ""}`}
              >
                <span
                  className={`text-[9px] font-mono tracking-widest uppercase mb-2 ${textMuted}`}
                >
                  Advertisement
                </span>

                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded border flex items-center justify-center font-mono text-[9px] shrink-0 ${
                        isDark
                          ? "bg-zinc-850 border-zinc-700 text-zinc-500"
                          : "bg-zinc-50 border-zinc-200 text-zinc-400"
                      }`}
                    >
                      Ad
                    </div>
                    <div>
                      <h6
                        className={`text-[11px] sm:text-xs font-semibold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}
                      >
                        Scale high-traffic user tables globally with CockroachDB
                      </h6>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                        Say goodbye to painful manual database failover
                        configurations. Build reliable SQL instances that sync
                        automatically.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://google.com"
                    target="_blank"
                    rel="noreferrer"
                    className={`text-[9px] sm:text-[10px] whitespace-nowrap px-4 py-2 rounded transition font-mono uppercase tracking-wider font-semibold w-full md:w-auto text-center border ${
                      isDark
                        ? "bg-zinc-950 hover:bg-zinc-850 border-zinc-800 text-zinc-300"
                        : "bg-white hover:bg-zinc-50 border-zinc-250 text-zinc-700 shadow-sm"
                    }`}
                  >
                    Deploy Free Instance
                  </a>
                </div>
              </div>
            </div>

            {}
            {parsedVideo && (
              <section
                className={`border rounded-2xl overflow-hidden animate-fade-in ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between gap-2 ${
                    isDark
                      ? "bg-zinc-950 border-zinc-850"
                      : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono tracking-wider truncate ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
                  >
                    Resolved node author:{" "}
                    <span
                      className={`${isDark ? "text-zinc-200" : "text-zinc-800"} font-semibold`}
                    >
                      {parsedVideo.author}
                    </span>
                  </span>
                  <button
                    onClick={() => setParsedVideo(null)}
                    className={`text-[10px] font-mono uppercase tracking-wider shrink-0 ${isDark ? "text-zinc-500 hover:text-zinc-350" : "text-zinc-400 hover:text-zinc-700"}`}
                  >
                    Clear Result
                  </button>
                </div>

                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Thumbnail View */}
                  <div className="md:col-span-5 space-y-3">
                    <div
                      className={`relative aspect-video rounded-xl overflow-hidden border ${
                        isDark
                          ? "bg-zinc-950 border-zinc-850"
                          : "bg-zinc-100 border-zinc-250 shadow-sm"
                      }`}
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

                    <div
                      className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono ${
                        isDark
                          ? "bg-zinc-950/85 border-zinc-850 text-zinc-400"
                          : "bg-zinc-50 border-zinc-200 text-zinc-500 shadow-inner"
                      }`}
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="text-[9px] text-zinc-600 dark:text-zinc-500">
                          CREATOR
                        </p>
                        <p
                          className={`font-semibold truncate ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                        >
                          {parsedVideo.author}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] text-zinc-600 dark:text-zinc-500">
                          LIKES
                        </p>
                        <p
                          className={`font-semibold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                        >
                          {parsedVideo.likes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* High Quality Video Formats & Responsive CTA Layout */}
                  <div className="md:col-span-7 space-y-4">
                    <h3
                      className={`text-[11px] sm:text-xs font-mono uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                    >
                      Select Available Quality:
                    </h3>

                    <div className="space-y-2.5">
                      {parsedVideo.formats.map((format, idx) => (
                        <div
                          key={idx}
                          className={`p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition border ${
                            isDark
                              ? "bg-zinc-950 border-zinc-850 hover:border-zinc-800"
                              : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 shadow-sm"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs sm:text-sm font-bold truncate ${isDark ? "text-zinc-200" : "text-zinc-850"}`}
                            >
                              {format.quality}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-mono">
                              No Watermark CDN Link
                            </p>
                          </div>

                          <div
                            className={`flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 ${
                              isDark ? "border-zinc-900" : "border-zinc-200"
                            }`}
                          >
                            <span
                              className={`text-[9px] font-mono px-2 py-1 rounded border ${
                                isDark
                                  ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                                  : "bg-white border-zinc-200 text-zinc-500 shadow-sm"
                              }`}
                            >
                              {format.size}
                            </span>
                            <button
                              onClick={() => startSecureDownload(format)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                                isDark
                                  ? "bg-zinc-100 hover:bg-white text-zinc-950"
                                  : "bg-zinc-900 hover:bg-zinc-800 text-white"
                              }`}
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
            )}

            {/* Platform Schema Hub - Scrollable Row on Mobile, Static Grid on Desktop */}
            <section
              className={`rounded-xl p-4 sm:p-5 border ${
                isDark
                  ? "bg-zinc-900/30 border-zinc-900"
                  : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <div className="text-center mb-4 sm:mb-5">
                <h3
                  className={`text-xs font-mono uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  API Compatibility Hub
                </h3>
              </div>

              {/* Swipeable bar on mobile, crisp responsive columns on desktop */}
              <div className="flex md:grid md:grid-cols-5 gap-2.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent snap-x">
                {PLATFORMS.map((plat) => {
                  const IconComp = plat.icon;
                  const isSelected = activePlatform === plat.id;

                  return (
                    <button
                      key={plat.id}
                      onClick={() => {
                        setActivePlatform(plat.id);
                        triggerNotification(
                          `Switched platform filter to ${plat.name}`,
                        );
                      }}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 min-w-[110px] md:min-w-0 snap-align-start shrink-0 flex-1 cursor-pointer ${
                        isSelected
                          ? isDark
                            ? "bg-zinc-900 border-zinc-750 text-zinc-100 shadow-sm"
                            : "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                          : isDark
                            ? "bg-zinc-900/10 border-zinc-950 hover:border-zinc-850 text-zinc-500 hover:text-zinc-300"
                            : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-semibold">{plat.name}</span>
                    </button>
                  );
                })}
              </div>

              <div
                className={`p-4 mt-4 rounded-xl border text-[10px] sm:text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark
                    ? "bg-zinc-950 border-zinc-850/60 text-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-500 shadow-inner"
                }`}
              >
                <div className="min-w-0">
                  <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                    Target Extraction Node:
                  </span>{" "}
                  {activePlatform === "all"
                    ? "Unified multi-tenant endpoint active."
                    : `Direct query active on ${activePlatform.toUpperCase()} CDN.`}
                </div>
                <div className="flex gap-2 shrink-0">
                  <span
                    className={`border px-1.5 py-0.5 rounded text-[10px] ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500 shadow-sm"}`}
                  >
                    Unlimited
                  </span>
                  <span
                    className={`border px-1.5 py-0.5 rounded text-[10px] ${isDark ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-500" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
                  >
                    High Speed
                  </span>
                </div>
              </div>
            </section>

            {/* Recent Download Cache Container */}
            <section className={`rounded-2xl p-4 sm:p-5 border ${cardBg}`}>
              <div
                className={`flex items-center justify-between mb-4 pb-3 border-b gap-2 ${isDark ? "border-zinc-850" : "border-zinc-200"}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <History className="w-4 h-4 text-zinc-400 shrink-0" />
                  <h3
                    className={`text-sm font-semibold truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                  >
                    Local Download Cache
                  </h3>
                </div>
                {downloadHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className={`text-xs font-semibold transition shrink-0 cursor-pointer ${isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}
                  >
                    Purge Storage
                  </button>
                )}
              </div>

              {downloadHistory.length === 0 ? (
                <div
                  className={`text-center py-6 rounded-xl border ${innerCardBg}`}
                >
                  <p className="text-xs text-zinc-500 font-mono">
                    No downloaded files in local cache yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {downloadHistory.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl flex items-center gap-3 border transition ${
                        isDark
                          ? "bg-zinc-950 border-zinc-850 hover:border-zinc-800"
                          : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 shadow-sm"
                      }`}
                    >
                      <img
                        src={item.thumbnail}
                        alt="history item preview"
                        className={`w-10 h-10 rounded object-cover shrink-0 opacity-70 border ${isDark ? "border-zinc-800" : "border-zinc-250 shadow-sm"}`}
                      />

                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                          {item.platform}
                        </span>
                        <h4
                          className={`text-xs font-semibold truncate mt-0.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                        >
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyHistory(item.url, idx)}
                          className={`p-1.5 rounded border transition cursor-pointer ${
                            isDark
                              ? "bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-450"
                              : "bg-white hover:bg-zinc-100 border-zinc-250 text-zinc-500 shadow-sm"
                          }`}
                          title="Copy Link"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setVideoUrl(item.url);
                            setDetectedPlatform(item.platform);
                            triggerNotification(
                              "Transferred stream link back into query field.",
                              "info",
                            );
                            window.scrollTo({ top: 120, behavior: "smooth" });
                          }}
                          className={`p-1.5 rounded border transition cursor-pointer ${
                            isDark
                              ? "bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300 hover:text-white"
                              : "bg-white hover:bg-zinc-100 border-zinc-250 text-zinc-650 shadow-sm"
                          }`}
                          title="Re-fetch Video Stream"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div
              className={`relative rounded-xl border transition-all overflow-hidden ${
                highlightAds
                  ? isDark
                    ? "bg-amber-950/10 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
                    : "bg-amber-50/50 border-amber-400/60 shadow-sm"
                  : isDark
                    ? "bg-zinc-900/60 border-zinc-900/50"
                    : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              {highlightAds && (
                <div
                  className={`absolute top-0 left-0 right-0 border-b px-3 py-1 flex items-center justify-between text-[8px] sm:text-[9px] font-mono ${
                    isDark
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                    <strong>AdSense Fluid: Sidebar Skyscraper [300x600]</strong>
                  </span>
                </div>
              )}

              <div
                className={`flex flex-col items-center justify-start p-4 sm:p-5 min-h-[300px] lg:min-h-[520px] ${highlightAds ? "pt-8" : ""}`}
              >
                <span
                  className={`text-[9px] font-mono tracking-widest uppercase mb-4 shrink-0 ${textMuted}`}
                >
                  Advertisement
                </span>

                {/* Visual Representation of Sidebar Billboard Ad */}
                <div
                  className={`w-full h-full lg:h-[380px] border rounded-lg p-4 flex flex-col justify-between text-center relative overflow-hidden min-h-[180px] shadow-sm ${
                    isDark
                      ? "bg-zinc-950 border-zinc-850"
                      : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500" />

                  <div className="space-y-3 pt-2">
                    <span
                      className={`inline-block text-[8px] font-mono border px-2 py-0.5 rounded uppercase ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                          : "bg-white border-zinc-250 text-zinc-500"
                      }`}
                    >
                      Premium Sponsor
                    </span>
                    <h5
                      className={`text-xs sm:text-sm font-semibold ${isDark ? "text-zinc-100" : "text-zinc-800"}`}
                    >
                      Deploy Premium SSR Web Apps to Vercel Instantly
                    </h5>
                    <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
                      Optimize your core web vitals and scale to millions of
                      active media downloads flawlessly with our enterprise
                      hosting partner.
                    </p>
                  </div>

                  <div className="space-y-3 pb-2 pt-4">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs">
                      <span
                        className={`font-bold ${isDark ? "text-zinc-200" : "text-zinc-700"}`}
                      >
                        $0 / Month
                      </span>
                      <span className="text-zinc-455">| No Setup Fee</span>
                    </div>
                    <a
                      href="https://google.com"
                      target="_blank"
                      rel="noreferrer"
                      className={`block text-center w-full text-xs font-bold py-2.5 rounded-lg transition border shadow-sm ${
                        isDark
                          ? "bg-zinc-100 hover:bg-white text-zinc-950 border-zinc-200"
                          : "bg-zinc-900 hover:bg-zinc-850 text-white border-zinc-800"
                      }`}
                    >
                      Configure Free Project
                    </a>
                  </div>
                </div>

                {/* Info Note below */}
                <div
                  className={`mt-4 w-full p-3 rounded border text-left ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-white border-zinc-250 shadow-sm"}`}
                >
                  <p
                    className={`text-[9px] font-mono leading-normal ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                  >
                    💡 **Responsiveness Note:** This container is strictly
                    responsive. On mobile screens, it renders compact to
                    preserve vertical viewspace. On widescreen systems, it
                    shifts back to a tall skyscraper layouts to occupy space
                    comfortably and capture maximum click value.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Informative Info Block */}
            <div
              className={`p-4 rounded-xl text-xs space-y-3 border ${
                isDark
                  ? "bg-zinc-900/45 border-zinc-850/80"
                  : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <h4
                className={`font-semibold flex items-center gap-1.5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Clean
                Safe-Area Handshake
              </h4>
              <p
                className={`text-[11px] leading-relaxed ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                Our code utilizes native browser API query fetch systems instead
                of relying on outdated extension wrappers. Clean, minimal, and
                fully compliant with device system safe standards.
              </p>
            </div>
          </div>
        </div>

        {}
        <section
          id="how-to-use"
          className={`mt-16 pt-10 border-t ${isDark ? "border-zinc-900" : "border-zinc-200"}`}
        >
          <div className="text-center mb-10">
            <h2
              className={`text-xs font-mono uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              Decent Mechanics
            </h2>
            <p
              className={`text-xl font-bold mt-1 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
            >
              Get your media files in three basic steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-5 rounded-xl border ${isDark ? "bg-zinc-900/20 border-zinc-900/60" : "bg-white border-zinc-200 shadow-sm"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center border shadow-sm ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                    : "bg-zinc-50 border-zinc-200 text-zinc-650"
                }`}
              >
                01
              </div>
              <h4
                className={`text-sm font-semibold mt-3 mb-1.5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                Extract Target URL
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Visit the platform app, browse the chosen reel or short video,
                and select Copy Stream URL to your device.
              </p>
            </div>

            <div
              className={`p-5 rounded-xl border ${isDark ? "bg-zinc-900/20 border-zinc-900/60" : "bg-white border-zinc-200 shadow-sm"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center border shadow-sm ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                    : "bg-zinc-50 border-zinc-200 text-zinc-650"
                }`}
              >
                02
              </div>
              <h4
                className={`text-sm font-semibold mt-3 mb-1.5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                Trigger Analyze Query
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Input your saved stream address into our minimal search bar and
                let our servers isolate direct CDN download nodes.
              </p>
            </div>

            <div
              className={`p-5 rounded-xl border ${isDark ? "bg-zinc-900/20 border-zinc-900/60" : "bg-white border-zinc-200 shadow-sm"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center border shadow-sm ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                    : "bg-zinc-50 border-zinc-200 text-zinc-650"
                }`}
              >
                03
              </div>
              <h4
                className={`text-sm font-semibold mt-3 mb-1.5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                Save Local Media
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Select your preferred size configuration and trigger our secure
                download mechanism to download straight to your drive.
              </p>
            </div>
          </div>
        </section>

        {}
        <section
          id="faq-section"
          className={`mt-16 pt-10 border-t max-w-3xl mx-auto ${isDark ? "border-zinc-900" : "border-zinc-200"}`}
        >
          <div className="text-center mb-10">
            <h2
              className={`text-xs font-mono uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              In-Depth Details
            </h2>
            <p
              className={`text-xl font-bold mt-1 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
            >
              Frequently Answered Framework Inquiries
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-xl border ${
                  isDark
                    ? "bg-zinc-900/20 border-zinc-900/60"
                    : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <h4
                  className={`text-xs sm:text-sm font-semibold mb-2 flex items-start gap-2 ${isDark ? "text-zinc-200" : "text-zinc-850"}`}
                >
                  <span className="text-zinc-500 font-mono">Q.</span>
                  {faq.q}
                </h4>
                <p
                  className={`text-[11px] sm:text-xs pl-5 leading-relaxed ${isDark ? "text-zinc-550" : "text-zinc-500"}`}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {}
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

            {/* AD DETAILS WRAPPER */}
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

      {}
      {showAdInspector && (
        <div
          className={`fixed bottom-14 right-2 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-1rem)] sm:max-w-md w-full p-4 border rounded-2xl shadow-2xl backdrop-blur-md font-sans ${
            isDark
              ? "bg-zinc-900 border-amber-500/30 text-zinc-200"
              : "bg-white border-zinc-250 text-zinc-800 shadow-2xl"
          }`}
        >
          <div
            className={`flex items-center justify-between pb-2.5 border-b ${isDark ? "border-zinc-850" : "border-zinc-150"}`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-amber-500/10 text-amber-500 animate-pulse">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4
                  className={`text-xs font-bold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
                >
                  Ad Revenue Control Hub
                </h4>
                <p className="text-[9px] text-zinc-550 font-mono">
                  Configure responsive Google AdSense placements
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAdInspector(false)}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`flex gap-2.5 my-3 border-b pb-2 overflow-x-auto ${isDark ? "border-zinc-850" : "border-zinc-150"}`}
          >
            <button
              onClick={() => setActiveInspectorTab("overview")}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded transition shrink-0 ${
                activeInspectorTab === "overview"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-zinc-450 hover:text-zinc-200"
              }`}
            >
              Responsive Setup
            </button>
            <button
              onClick={() => setActiveInspectorTab("adsense_code")}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded transition shrink-0 ${
                activeInspectorTab === "adsense_code"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-zinc-455 hover:text-zinc-200"
              }`}
            >
              Get Code Code Snippet
            </button>
          </div>

          {activeInspectorTab === "overview" ? (
            <div className="space-y-3">
              <p
                className={`text-[10px] sm:text-[11px] leading-normal ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                Google AdSense automatically detects screen dimensions to adjust
                layout. Set your parent container's width, and the ad codes will
                handle the rest beautifully!
              </p>

              {/* Toggle Highlight */}
              <div
                className={`flex items-center justify-between p-2.5 rounded-lg border ${
                  isDark
                    ? "bg-zinc-950 border-zinc-850"
                    : "bg-zinc-50 border-zinc-200 shadow-inner"
                }`}
              >
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold ${isDark ? "text-zinc-350" : "text-zinc-650"}`}
                >
                  Highlight Active Ad Slots:
                </span>
                <button
                  onClick={() => {
                    setHighlightAds(!highlightAds);
                    triggerNotification(
                      highlightAds
                        ? "Ad borders disabled"
                        : "Ad zones highlighted in gold!",
                    );
                  }}
                  className={`text-[10px] font-mono px-3 py-1 rounded transition-all font-bold ${
                    highlightAds
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-zinc-850 text-zinc-400"
                  }`}
                >
                  {highlightAds ? "ON" : "OFF"}
                </button>
              </div>

              {/* Device Test Indicators */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between text-[9px] font-mono ${
                  isDark
                    ? "bg-zinc-950 border-zinc-850 text-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-450"
                }`}
              >
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-zinc-500" /> Mobile
                  Ready
                </span>
                <span className="flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-zinc-500" /> Desktop Fluid
                </span>
                <span className="text-emerald-500 font-bold">
                  100% Responsive
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label
                className={`text-[10px] font-mono block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                Select Placement Unit:
              </label>
              <select
                value={selectedAdForCode}
                onChange={(e) => setSelectedAdForCode(e.target.value)}
                className={`w-full text-xs px-2 py-1.5 rounded border outline-none ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 text-zinc-300"
                    : "bg-zinc-50 border-zinc-250 text-zinc-750"
                }`}
              >
                <option value="leaderboard">Header Leaderboard (728x90)</option>
                <option value="sidebar">Smart Sidebar (Adapting format)</option>
                <option value="infeed">In-Feed Native Ad (Fluid)</option>
                <option value="anchor">Sticky bottom Anchor Ad</option>
                <option value="interstitial">
                  Secure Interstitial (Vignette)
                </option>
              </select>

              <div className="relative">
                <textarea
                  readOnly
                  value={ADSENSE_CODE_TEMPLATES[selectedAdForCode]}
                  className={`w-full h-24 text-[9px] sm:text-[10px] font-mono p-2 rounded border focus:outline-none resize-none leading-relaxed ${
                    isDark
                      ? "bg-zinc-950 border-zinc-850 text-zinc-400"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600"
                  }`}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      ADSENSE_CODE_TEMPLATES[selectedAdForCode],
                    );
                    triggerNotification(
                      "AdSense responsive code copied!",
                      "success",
                    );
                  }}
                  className={`absolute bottom-2 right-2 text-[9px] px-2 py-1 rounded border transition flex items-center gap-1 font-semibold shadow-sm ${
                    isDark
                      ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300"
                      : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-650"
                  }`}
                >
                  <Copy className="w-3 h-3" /> Copy Code
                </button>
              </div>

              <p
                className={`text-[9px] leading-normal font-mono flex items-start gap-1 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                <Info className="w-3.5 h-3.5 shrink-0 text-zinc-500 mt-0.5" />
                <span>
                  Substitute{" "}
                  <code className="text-amber-500">ca-pub-XXXXXXXXXXXXX</code>{" "}
                  with your real AdSense Publisher ID.
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer Block */}
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
