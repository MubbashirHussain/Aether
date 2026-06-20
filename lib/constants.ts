import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import { Flame, Sliders } from "lucide-react";

export const PLATFORMS = [
  { id: "all", name: "All Links", icon: Sliders },
  { id: "instagram", name: "Instagram", icon: FaInstagram },
  { id: "tiktok", name: "TikTok", icon: Flame },
  { id: "youtube", name: "YouTube", icon: FaYoutube },
  { id: "facebook", name: "Facebook", icon: FaFacebook },
] as const;

export const FAQS = [
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

export const ADSENSE_CODE_TEMPLATES: Record<string, string> = {
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