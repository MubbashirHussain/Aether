import Script from "next/script";

export default function AdsenseScript({ adId }: { adId: string }) {
  return (
    
    <Script
      id="adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
