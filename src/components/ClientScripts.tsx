"use client";

import Script from "next/script";

export default function ClientScripts() {
  return (
    <Script
      src="/german-slides-embed.js"
      strategy="afterInteractive"
      id="german-slides-script"
    />
  );
} 