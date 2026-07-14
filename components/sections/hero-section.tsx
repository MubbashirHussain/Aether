
export default function HeroSection() {
  return (
    <section className="text-center py-10 sm:py-16 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border 
                     bg-zinc-50 dark:bg-neutral-950/80 border-zinc-200 dark:border-neutral-900 text-zinc-650 dark:text-neutral-400 shadow-sm"
        >
          {/* Crisp Inline SVG badge icon */}
          <svg
            className="w-3.5 h-3.5 animate-pulse text-neutral-450"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          High-Speed CDN Interface
        </div>

        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight mt-6 mb-4 leading-tight sm:leading-none 
                     text-neutral-900 dark:text-neutral-100"
        >
          Decentralized Media Stream Extraction
        </h1>

        <p
          className="text-xs sm:text-base leading-relaxed max-w-xl mx-auto font-light 
                     text-neutral-500 dark:text-neutral-450"
        >
          Retrieve uncompressed source media files directly from social platform
          delivery nodes. Bypass compression pipelines on Instagram, TikTok,
          YouTube, and Facebook instantly.
        </p>
      </div>
    </section>
  );
}

