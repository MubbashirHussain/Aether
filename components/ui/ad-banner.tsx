"use client";

import { cn } from "@/lib/utils";
import { AdSenseSlot } from "./adsense-slot";

export type AdBannerProps = {
  highlightAds: boolean;
  onHighlightToggle?: (highlight: boolean) => void;
  clientId: string;
  slotId?: string;
};

export function AdBanner({
  highlightAds,
  onHighlightToggle,
  clientId,
  slotId = "9876543210",
}: AdBannerProps) {
  return (
    <div
      className="max-w-6xl mx-auto px-4 my-4 rounded-lg overflow-hidden skeleton-shimmer-light dark:skeleton-shimmer-dark"
    >
      <div className="w-full max-w-4xl flex justify-center">
        <AdSenseSlot clientId={clientId} slotId={slotId} format="auto" />
      </div>
    </div>
  );
}
