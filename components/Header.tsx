"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { THEMES } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const currentGame = pathname.startsWith("/coinflip") ? "coinflip" : "dice";
  const [gamesOpen, setGamesOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const [theme, setTheme] = useState("black-purple");

  useEffect(() => {
    const t = localStorage.getItem("royal-dice-theme") || "black-purple";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    fetch("/api/online")
      .then((r) => r.json())
      .then((d) => setOnline(d.online))
      .catch(() => {});
  }, []);

  function applyTheme(id: string) {
    setTheme(id);
    localStorage.setItem("royal-dice-theme", id);
    document.documentElement.setAttribute("data-theme", id);
    setThemeOpen(false);
  }

  function openSab() {
    window.dispatchEvent(new Event("rd-toggle-sab"));
  }

  const nav = (
    <>
      <Link href="/">Play</Link>
      <div style={{ position: "relative" }}>
        <button type="button" onClick={() => { setGamesOpen((v) => !v); setThemeOpen(false); }}>
          Games ▾
        </button>
        {gamesOpen && (
          <div className="menu-pop">
            <Link href="/" onClick={() => setGamesOpen(false)}>Color Dice {currentGame === "dice" ? "•" : ""}</Link>
            <Link href="/coinflip" onClick={() => setGamesOpen(false)}>Coin Flip {currentGame === "coinflip" ? "•" : ""}</Link>
          </div>
        )}
      </div>
      <Link href="/verify">Verify</Link>
      <button type="button" onClick={openSab}>SabCounter</button>
      <div style={{ position: "relative" }}>
        <button type="button" onClick={() => { setThemeOpen((v) => !v); setGamesOpen(false); }}>
          Theme ▾
        </button>
        {themeOpen && (
          <div className="menu-pop">
            <div className="theme-grid">
              {THEMES.map((t) => (
                <button key={t.id} type="button" onClick={() => applyTheme(t.id)}>
                  {t.id === theme ? "✓ " : ""}
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 500 }}>
      <header
        style={{
          position: "relative",
          width: "100%",
          background: "var(--ov-1)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--panel-border)",
        }}
      >
        <div className="rdtb-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }} aria-label="RoyalDice home">
            <img src="/logo.png" alt="RoyalDice" style={{ height: 34, width: "auto", display: "block" }} />
          </Link>
          <nav className="rdtb-desktopnav" style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }} aria-label="Primary">
            {nav}
          </nav>
          <div className="rdtb-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="online-pill rdtb-online-label">
              <span className="online-dot" />
              {online ?? "—"} online
            </span>
            <button
              className="rdtb-burger"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, border: "1px solid var(--panel-border)", background: "var(--panel-bg)", color: "var(--text)", cursor: "pointer" }}
            >
              ☰
            </button>
          </div>
        </div>
        <div className={`rdtb-mobile ${menuOpen ? "open" : ""}`} style={{ display: menuOpen ? "block" : undefined }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>{nav}</nav>
        </div>
      </header>
    </div>
  );
}
