import React from "react";

export default function FeatureGrid() {
  const features = [
    {
      title: "10Gbps Extraction Pipe",
      desc: "Direct high-bandwidth extraction pipelines connect to social media content delivery nodes, maximizing transfer speed for instantaneous video acquisition.",
      svg: (
        <svg
          className="w-5 h-5 text-neutral-350"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      title: "Stateless Streaming Engine",
      desc: "We process the platform's API signals and hand direct CDN stream links directly back to your browser client. No media is stored on our servers.",
      svg: (
        <svg
          className="w-5 h-5 text-neutral-350"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: "Zero Local Logs Policy",
      desc: "All session keys, parsed query files, or visitor link histories are stored locally in your browser sandbox, not on remote database repositories.",
      svg: (
        <svg
          className="w-5 h-5 text-neutral-350"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: "SSL Inspected Tunneling",
      desc: "Secure end-to-end socket connections protect data transit pathways between the CDN source endpoints, our caching nodes, and your browser.",
      svg: (
        <svg
          className="w-5 h-5 text-neutral-350"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="feature-grid" className="py-12 border-t border-neutral-900/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            System Features
          </h2>
          <h3
            className="text-2xl sm:text-3xl font-light tracking-tight mt-2 text-neutral-900 dark:text-neutral-100"
          >
            Performance & Safety Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between bg-white border-zinc-200 hover:border-zinc-350 dark:bg-zinc-950/40 dark:border-neutral-900 dark:hover:border-neutral-800 shadow-sm"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 bg-neutral-900 border border-neutral-850 rounded-xl flex items-center justify-center">
                  {f.svg}
                </div>
                <h4
                  className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
                >
                  {f.title}
                </h4>
                <p
                  className="text-xs leading-relaxed font-light text-neutral-500 dark:text-neutral-450"
                >
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

