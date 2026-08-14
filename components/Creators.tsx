"use client";

import { CREATORS, DISCORD } from "@/lib/site";

export default function Creators({ side }: { side: "left" | "right" | "mobile" }) {
  const list =
    side === "left"
      ? CREATORS.slice(0, 3)
      : side === "right"
        ? CREATORS.slice(3)
        : CREATORS;

  return (
    <div className={side === "mobile" ? "creators-mobile-slot" : `creators-slot creators-slot-${side}`}>
      <div className="panel creators-panel">
        <h2 className="creators-title">Our Content Creators</h2>
        <div className={`creators-list ${side === "mobile" ? "creators-list-scroll" : ""}`}>
          {list.map((c) => (
            <a
              key={c.username}
              className={`creator-row ${c.isVerified ? "is-verified" : ""}`}
              href={`https://www.tiktok.com/@${c.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={`chat-avatar-wrap ${c.isLive ? "is-live" : ""}`} style={{ width: 44, height: 44 }}>
                <span className="rd-av" style={{ width: 44, height: 44, borderRadius: 999, display: "grid", placeItems: "center", background: "var(--panel-2-bg)" }}>
                  {c.displayName.slice(0, 1)}
                </span>
                {c.isLive && <span className="avatar-live-tag">Live</span>}
              </span>
              <span className="creator-info">
                <span className="creator-name">{c.displayName}</span>
                <span className="creator-handle">@{c.username}</span>
              </span>
            </a>
          ))}
        </div>
        <a className="creator-cta" href={DISCORD} target="_blank" rel="noopener noreferrer">
          + Get Listed Here
        </a>
      </div>
    </div>
  );
}
