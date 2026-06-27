"use client";

import React, { useEffect, useRef } from "react";

// 1. CONFIGURATION: Set your global client ID here or via environment variable.
// Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your actual publisher ID.
const DEFAULT_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX";

export type AdSenseSlotProps = {
  slotId: string;
  clientId?: string; // Optional: Defaults to the global ID if not provided
  format?: string;
  responsive?: boolean;
  layout?: string;
  style?: React.CSSProperties;
};

/**
 * AdSenseSlot component
 * Usage: <AdSenseSlot slotId="1234567890" />
 */
export function AdSenseSlot({
  slotId,
  clientId = DEFAULT_CLIENT_ID,
  format = "auto",
  responsive = true,
  layout,
  style = { display: "block", minHeight: "100px", width: "100%" },
}: AdSenseSlotProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // Only attempt to push if the script is loaded
    if (initialized.current) return;

    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
        initialized.current = true;
      }
    } catch (err) {
      console.error("AdSense slot initialization error:", err);
    }
  }, []);

  return (
    <ins
      key={`${clientId}-${slotId}`}
      className="adsbygoogle"
      style={style}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
      {...(layout ? { "data-ad-layout": layout } : {})}
    />
  );
}
