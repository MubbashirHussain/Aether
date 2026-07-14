import React from "react";

export default function PlatformGrid() {
  const platforms = [
    {
      name: "Instagram Reels & Posts",
      copy: "Extract and save short-form reels, multi-image carousel posts, and structural videos in high-fidelity 1080p resolution. No layout shifts.",
      // Custom sharp inline SVG for Instagram logo outline
      svg: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "TikTok No-Watermark",
      copy: "Retrieve the pure, uncompressed MP4 source file directly from CDN streams without native interface overlays or watermarks.",
      // Custom sharp inline SVG for TikTok logo outline
      svg: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
    },
    {
      name: "YouTube Shorts & Videos",
      copy: "Direct high-bandwidth extraction pipelines for quick micro-content archiving. Optimized for high frame rates and standard audio channels.",
      // Custom sharp inline SVG for YouTube logo outline
      svg: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.54a29 29 0 0 0 .46 5.12 2.78 2.78 0 0 0 1.95 1.96c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.12 29 29 0 0 0-.46-5.12z" />
          <polygon points="9.75 15.02 15.5 11.54 9.75 8.06 9.75 15.02" />
        </svg>
      ),
    },
    {
      name: "Facebook Watch",
      copy: "Unlock secure stream addresses for public reels, timeline posts, and community videos seamlessly.",
      // Custom sharp inline SVG for Facebook logo outline
      svg: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="platform-grid"
      className="py-12 border-t border-neutral-900/60 mt-12"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Platform Nodes
          </h2>
          <h3
            className="text-2xl sm:text-3xl font-light tracking-tight mt-2 text-neutral-900 dark:text-neutral-100"
          >
            Compatibility Network
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((p, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border transition-all duration-300 flex items-start gap-4 bg-white border-zinc-200 hover:border-zinc-350 dark:bg-zinc-950/40 dark:border-neutral-900 dark:hover:border-neutral-800 shadow-sm"
            >
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 shrink-0">
                {p.svg}
              </div>
              <div className="space-y-1">
                <h4
                  className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
                >
                  {p.name}
                </h4>
                <p
                  className="text-xs leading-relaxed font-light text-neutral-500 dark:text-neutral-450"
                >
                  {p.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

