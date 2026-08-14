"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DiceColor } from "@/lib/dice";

const HISTORY_KEY = "royal-dice-recent";
const COLORS: DiceColor[] = ["red", "orange", "yellow", "green", "blue", "purple"];

type Roll = { publicId: string; colors: DiceColor[]; nonce?: number };

export default function DiceRoller() {
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState<"count" | "fx" | "mute" | null>(null);
  const [fx, setFx] = useState("Flash");
  const [muted, setMuted] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [colors, setColors] = useState<DiceColor[]>(["blue"]);
  const [result, setResult] = useState<Roll | null>(null);
  const [history, setHistory] = useState<Roll[]>([]);
  const [creators, setCreators] = useState(true);
  const [antiBan, setAntiBan] = useState(false);
  const [fade, setFade] = useState(100);

  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      try {
        const list = JSON.parse(raw) as Roll[];
        setHistory(list);
        if (list[0]?.colors) {
          setColors(list[0].colors);
          setCount(list[0].colors.length);
          setResult(list[0]);
        }
      } catch {}
    }
    const t = localStorage.getItem("royal-dice-ui-transparency");
    if (t) setFade(Number(t));
  }, []);

  useEffect(() => {
    const n = Math.min(100, Math.max(0, fade));
    document.documentElement.style.setProperty("--ui-fade", `${100 - n}%`);
    document.documentElement.style.setProperty("--ui-blur-mult", String(n / 100));
    localStorage.setItem("royal-dice-ui-transparency", String(n));
  }, [fade]);

  useEffect(() => {
    document.body.classList.toggle("hide-creators", !creators);
  }, [creators]);

  async function roll() {
    setRolling(true);
    const spin = muted ? 280 : 1100;
    await new Promise((r) => setTimeout(r, spin));
    const res = await fetch("/api/roll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diceCount: count }),
    });
    const data = await res.json();
    setColors(data.colors);
    setResult(data);
    setRolling(false);
    window.dispatchEvent(new CustomEvent("rd-roll", { detail: data.colors }));
    const next = [data, ...history].slice(0, 20);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }

  return (
    <>
      <div className={`panel play-panel ${antiBan ? "anti-ban" : ""}`}>
        <div className="play-toolbar">
          <div className="count-dropdown">
            <button type="button" className="count-trigger" onClick={() => setOpen(open === "count" ? null : "count")}>
              <span>{count} {count === 1 ? "DIE" : "DICE"}</span>
              <svg className="count-arrow" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
            </button>
            {open === "count" && (
              <div className="count-menu">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                  <button key={v} type="button" onClick={() => { setCount(v); setOpen(null); }}>{v} {v === 1 ? "die" : "dice"}</button>
                ))}
              </div>
            )}
          </div>
          <div className="count-dropdown">
            <button type="button" className="count-trigger" onClick={() => setOpen(open === "fx" ? null : "fx")}>
              <span>{fx.toUpperCase()}</span>
              <span className="new-badge">NEW!</span>
            </button>
            {open === "fx" && (
              <div className="count-menu">
                {["Flash", "Royal Knight", "Classic"].map((v) => (
                  <button key={v} type="button" onClick={() => { setFx(v); setOpen(null); }}>{v}</button>
                ))}
              </div>
            )}
          </div>
          <div className="count-dropdown">
            <button type="button" className="count-trigger" onClick={() => setOpen(open === "mute" ? null : "mute")}>
              <span>{muted ? "MUTED" : "SOUND ON"}</span>
            </button>
            {open === "mute" && (
              <div className="count-menu">
                <button type="button" onClick={() => { setMuted(false); setOpen(null); }}>Sound on</button>
                <button type="button" onClick={() => { setMuted(true); setOpen(null); }}>Muted</button>
              </div>
            )}
          </div>
        </div>

        <div className="dice-tray">
          {(rolling ? Array.from({ length: count }, () => "blue") : colors).map((c, i) => (
            <span
              key={i}
              className={`die glow-die ${rolling ? "rolling flash-roll" : "idle-float"}`}
              data-color={rolling ? COLORS[(i + Math.floor(Date.now() / 80)) % 6] : c}
            />
          ))}
        </div>

        {result && (
          <div className="result-inline">
            Result ID <span className="code">{result.publicId}</span>
            <Link className="verify-chip" href={`/verify/${result.publicId}`}>Verify</Link>
          </div>
        )}

        <button className="roll-go flash-btn pulse-glow" type="button" onClick={roll} disabled={rolling}>
          {rolling ? "Rolling..." : result ? "Roll again !" : "Roll !"}
        </button>

        <p className="color-legend">
          {COLORS.map((c, i) => (
            <span key={c}>
              <span style={{ color: { red: "#ff4d4d", orange: "#ff8c00", yellow: "#ffd54a", green: "#22c55e", blue: "#60a5fa", purple: "#c084fc" }[c] }}>
                {c[0].toUpperCase() + c.slice(1)}
              </span>
              {i < COLORS.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>

        <div className="play-toggles">
          <label className="toggle">
            <span>Creators</span>
            <input type="checkbox" checked={creators} onChange={(e) => setCreators(e.target.checked)} />
            <i />
          </label>
          <label className="toggle">
            <span>Anti-ban mode</span>
            <input type="checkbox" checked={antiBan} onChange={(e) => setAntiBan(e.target.checked)} />
            <i />
          </label>
          <label className="fade-slider">
            <span>Transparency</span>
            <input type="range" min={20} max={100} value={fade} onChange={(e) => setFade(Number(e.target.value))} />
          </label>
        </div>
      </div>

      {history.length > 0 && (
        <div className="panel last-rolls">
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span className="section-eyebrow">Stats</span>
              <h2 className="section-title" style={{ margin: 0 }}>Your last 20 rolls</h2>
            </div>
          </div>
          <div className="last-rolls-list">
            {history.map((h) => (
              <Link key={h.publicId} href={`/verify/${h.publicId}`} className="last-roll-row">
                <span className="mini-row">
                  {h.colors.map((c, i) => <span key={i} className="die mini-die" data-color={c} />)}
                </span>
                <span className="code">{h.publicId}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
