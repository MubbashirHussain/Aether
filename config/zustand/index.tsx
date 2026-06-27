import { create } from "zustand";

interface AdConfigState {
  adsenseClientId: string;
  topBannerSlotId: string;
  bottomAnchorSlotId: string;
  setAdConfig: (
    adsenseClientId: string,
    topBannerSlotId: string,
    bottomAnchorSlotId: string,
  ) => void;
}

export const useAdConfig = create<AdConfigState>((set) => ({
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_ID!,
  topBannerSlotId: process.env.NEXT_PUBLIC_TOP_BANNER_SLOT_ID!,
  bottomAnchorSlotId: process.env.NEXT_PUBLIC_BOTTOM_ANCHOR_SLOT_ID!,
  setAdConfig: (
    adsenseClientId: string,
    topBannerSlotId: string,
    bottomAnchorSlotId: string,
  ) => set({ adsenseClientId, topBannerSlotId, bottomAnchorSlotId }),
}));
