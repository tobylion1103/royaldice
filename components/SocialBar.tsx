"use client";

import { DISCORD, TIKTOK } from "@/lib/site";
import { useState } from "react";

export default function SocialBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="social-bar">
      <div className="social-bar-links">
        <a className="social-bar-btn social-bar-tiktok" href={TIKTOK} target="_blank" rel="noopener noreferrer">
          <span>Follow us</span>
        </a>
        <a className="social-bar-btn social-bar-discord" href={DISCORD} target="_blank" rel="noopener noreferrer">
          <span>Join server</span>
        </a>
      </div>
      <button type="button" className="social-bar-close" aria-label="Close" onClick={() => setOpen(false)}>
        ×
      </button>
    </div>
  );
}
