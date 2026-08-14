"use client";

import { useEffect, useState } from "react";

const THEME_LOGOS: Record<string, string> = {
  blood: "/themes/blood/logo.png",
  ice: "/themes/ice/logo.png",
  toxic: "/themes/toxic/logo.png",
  "royal-knight": "/themes/royal-knight/logo.png",
  "sakura-temple": "/themes/sakura-temple/logo.png",
  "unyielding-duo": "/themes/unyielding-duo/logo.png",
  "mossy-skylands": "/themes/mossy-skylands/logo.png",
  "god-of-thunder": "/themes/god-of-thunder/logo.png",
  "cozy-rainfall": "/themes/cozy-rainfall/logo.png",
  "lonely-lake": "/themes/lonely-lake/logo.png",
  "shadow-ninja": "/themes/shadow-ninja/logo.png",
};

export default function ThemeLogo({ alt, className, height }: { alt: string; className?: string; height?: number }) {
  const [src, setSrc] = useState("/logo.png");
  useEffect(() => {
    function sync() {
      const t = document.documentElement.getAttribute("data-theme") || "";
      setSrc(THEME_LOGOS[t] || "/logo.png");
    }
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return <img className={className} src={src} alt={alt} style={{ height: height || undefined, width: "auto" }} />;
}
