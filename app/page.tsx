"use client";

import NavBar from "@/components/sections/nav-bar";
import HeroSection from "@/components/sections/hero-section";
import DownloaderWrapper from "@/components/sections/downloader-wrapper";
import PlatformGrid from "@/components/sections/platform-grid";
import StepGuide from "@/components/sections/step-guide";
import FeatureGrid from "@/components/sections/feature-grid";
import FAQAccordion from "@/components/sections/faq-accordion";
import Footer from "@/components/sections/footer";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/AppContext";

export default function App() {
  const { isDark } = useTheme();

  const rootBg = isDark
    ? "bg-black text-neutral-400 selection:bg-neutral-800 selection:text-white"
    : "bg-zinc-50 text-zinc-800 selection:bg-zinc-200 selection:text-zinc-900";

  return (
    <div
      className={cn(
        "min-h-screen font-light tracking-tight antialiased relative transition-all duration-300",
        rootBg,
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b via-transparent to-transparent pointer-events-none z-0",
          isDark ? "from-neutral-950/40" : "from-zinc-100/40",
        )}
      />
      <NavBar />
      <main className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Background glow vector */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center z-1">
          <div className="mooving_blob w-[300px] h-[300px] bg-gradient-to-r from-neutral-950/30 to-zinc-900/30 blur-[120px] rounded-full" />
        </div>

        <HeroSection />
        <div id="downloader-section" className="mb-12">
          <DownloaderWrapper />
        </div>
        <PlatformGrid />
        <StepGuide />
        <FeatureGrid />
        <FAQAccordion />
      </main>

      <Footer />
    </div>
  );
}
