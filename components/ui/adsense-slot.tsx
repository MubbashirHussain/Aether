"use client";

import React, { useEffect, useRef } from "react";

export type AdSenseSlotProps = {
  clientId: string;
  slotId: string;
  format?: string;
  responsive?: boolean;
  layout?: string;
  style?: React.CSSProperties;
};

export function AdSenseSlot({
  clientId,
  slotId,
  format = "auto",
  responsive = true,
  layout,
  style = { display: "block" },
}: AdSenseSlotProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // Avoid double initialization (particularly in React StrictMode)
    if (initialized.current) return;

    if (typeof window !== "undefined") {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        initialized.current = true;
      } catch (err) {
        console.error("AdSense slot initialization error:", err);
      }
    }
  }, [clientId, slotId]); // Remounting triggers this if client or slot changes

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
