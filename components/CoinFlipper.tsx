"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { COIN_THEMES, type CoinThemeId } from "@/lib/coins";

type Side = "heads" | "tails";
type FlipRec = { publicId: string; side: Side; at: number };
type Petal = { id: number; x: number; delay: number; dur: number; rot: number; kind: string; size: number };

const THEME_KEY = "royal-dice-coin-theme";
const HIST_KEY = "royal-dice-flip-history";
const SOUND_KEY = "royal-dice-coin-sound";
const FLOWERS = ["🌸", "🌺", "💮", "🏵️", "🌼", "💐"];

export default function CoinFlipper() {
  const [side, setSide] = useState<Side>("heads");
  const [phase, setPhase] = useState<"idle" | "toss" | "celebrate">("idle");
  const [burst, setBurst] = useState(false);
  const [turns, setTurns] = useState(0);
  const [theme, setTheme] = useState<CoinThemeId>("ruby-inferno");
  const [themeOpen, setThemeOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [history, setHistory] = useState<FlipRec[]>([]);
  const [result, setResult] = useState<FlipRec | null>(null);
  const [petals, setPetals] = useState<Petal[]>([]);
  const flipping = phase !== "idle";

  useEffect(() => {
    const t = localStorage.getItem(THEME_KEY) as CoinThemeId | null;
    if (t && COIN_THEMES.some((x) => x.id === t)) setTheme(t);
    const s = localStorage.getItem(SOUND_KEY);
    if (s === "0") setSound(false);
    try {
      const h = JSON.parse(localStorage.getItem(HIST_KEY) || "[]") as FlipRec[];
      setHistory(h.slice(0, 10));
    } catch {}
  }, []);

  const flip = useCallback(async () => {
    if (phase !== "idle") return;
    setPhase("toss");
    setBurst(false);
    setResult(null);
    setPetals([]);
    const extra = 7 + Math.floor(Math.random() * 3);
    const res = await fetch("/api/flip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const next: Side = data.side === "tails" ? "tails" : "heads";
    setTurns((n) => {
      const base = n + extra * 2;
      return next === "heads" ? (base % 2 === 0 ? base : base + 1) : base % 2 === 0 ? base + 1 : base;
    });
    await new Promise((r) => setTimeout(r, 980));
    setSide(next);
    const rec: FlipRec = { publicId: data.publicId, side: next, at: Date.now() };
    setResult(rec);
    setPetals(
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.55,
        dur: 1.6 + Math.random() * 1.4,
        rot: Math.random() * 720 - 360,
        kind: FLOWERS[i % FLOWERS.length],
        size: 18 + Math.random() * 16,
      }))
    );
    setBurst(true);
    setHistory((prev) => {
      const list = [rec, ...prev].slice(0, 10);
      localStorage.setItem(HIST_KEY, JSON.stringify(list));
      return list;
    });
    localStorage.setItem("royal-dice-flip-count", String(Number(localStorage.getItem("royal-dice-flip-count") || 0) + 1));
    await new Promise((r) => setTimeout(r, 700));
    setPhase("celebrate");
    await new Promise((r) => setTimeout(r, 1800));
    setPhase("idle");
    setBurst(false);
    setPetals([]);
  }, [phase]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        flip();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flip]);

  function equip(id: CoinThemeId) {
    setTheme(id);
    localStorage.setItem(THEME_KEY, id);
    setThemeOpen(false);
  }

  const equipped = COIN_THEMES.find((t) => t.id === theme) || COIN_THEMES[6];

  return (
    <div className={`flip-card ${burst ? "is-celebrate" : ""}`}>
      <div className="flip-flash" aria-hidden="true" />
      <div className="flip-toolbar">
        <div className="count-dropdown">
          <button type="button" className="coin-theme-btn flash-hover" onClick={() => setThemeOpen((v) => !v)}>
            <span className="coin-mini" data-coin={theme} />
            Coin Themes
            <span className="count-arrow">▾</span>
          </button>
          {themeOpen && (
            <div className="menu-pop coin-theme-pop">
              {COIN_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`coin-theme-row ${t.id === theme ? "is-on" : ""}`}
                  onClick={() => equip(t.id)}
                >
                  <span className="coin-mini" data-coin={t.id} />
                  <span>
                    <b>{t.name}</b>
                    <small>{t.id === theme ? "Equipped" : "Equip"}</small>
                  </span>
                  {t.id === theme && <span className="coin-check">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flip-tools">
          <button
            type="button"
            className="icon-btn flash-hover"
            aria-label={sound ? "Mute" : "Unmute"}
            onClick={() => {
              const next = !sound;
              setSound(next);
              localStorage.setItem(SOUND_KEY, next ? "1" : "0");
            }}
          >
            {sound ? "🔊" : "🔇"}
          </button>
        </div>
      </div>

      <div className={`coin-stage ${phase}`}>
        <div className="flower-shower" aria-hidden="true">
          {petals.map((p) => (
            <span
              key={p.id}
              className="petal"
              style={{
                left: `${p.x}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
                fontSize: p.size,
                ["--spin" as string]: `${p.rot}deg`,
              }}
            >
              {p.kind}
            </span>
          ))}
        </div>
        <button type="button" className="coin3d-wrap" onClick={flip} disabled={flipping} aria-label="Flip coin">
          <div className={`coin-toss ${phase === "toss" ? "is-toss" : ""}`}>
            <div
              className={`coin3d ${phase === "toss" ? "is-flipping" : ""}`}
              data-coin={theme}
              style={{ transform: `rotateY(${turns * 180}deg)` }}
            >
              <div className="coin-face coin-heads">
                <span className="coin-letter">H</span>
                <span className="coin-word">Heads</span>
              </div>
              <div className="coin-face coin-tails">
                <span className="coin-letter">T</span>
                <span className="coin-word">Tails</span>
              </div>
              <div className="coin-rim" />
            </div>
          </div>
        </button>
        {result && (
          <div className={`flip-status ${result.side} ${burst ? "pop" : ""}`} key={result.publicId}>
            {result.side}
          </div>
        )}
      </div>

      <button className="flip-cta flash-hover" type="button" onClick={flip} disabled={flipping}>
        {phase === "toss" ? "Flipping..." : "Flip coin"}
      </button>
      <p className="flip-tip">
        Tip: press <kbd>Space</kbd> to flip.
      </p>
      {result && (
        <p className="flip-id">
          Result ID <span className="code">{result.publicId}</span>{" "}
          <Link href={`/verify/${result.publicId}`}>Verify</Link>
        </p>
      )}

      <section className="recent-flips">
        <div className="recent-head">
          <span>🕒 Recent flips</span>
          <span>Last 10</span>
        </div>
        {history.length === 0 ? (
          <p className="muted">No flips yet. Tap the coin to begin.</p>
        ) : (
          <div className="recent-list">
            {history.map((h) => (
              <Link key={h.publicId} href={`/verify/${h.publicId}`} className="recent-chip flash-hover">
                <span className="coin-mini" data-coin={theme} />
                {h.side}
              </Link>
            ))}
          </div>
        )}
      </section>
      <p className="muted" style={{ textAlign: "center", marginTop: 10 }}>
        Equipped: {equipped.name}
      </p>
    </div>
  );
}
