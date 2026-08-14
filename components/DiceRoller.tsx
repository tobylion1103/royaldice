"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DiceColor } from "@/lib/dice";

const HISTORY_KEY = "royal-dice-recent";

export default function DiceRoller() {
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [colors, setColors] = useState<DiceColor[]>(["red"]);
  const [result, setResult] = useState<{ publicId: string; seedHash: string; nonce: number } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return;
    try {
      const last = JSON.parse(raw)[0];
      if (last?.colors) {
        setColors(last.colors);
        setCount(last.colors.length);
        setResult(last);
      }
    } catch {}
  }, []);

  async function roll() {
    setRolling(true);
    await new Promise((r) => setTimeout(r, 420));
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
    const prev = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    localStorage.setItem(HISTORY_KEY, JSON.stringify([data, ...prev].slice(0, 20)));
  }

  return (
    <div className="panel">
      <div className="section-head">
        <span className="section-eyebrow">Play</span>
        <h2 className="section-title">Roll Color Dice</h2>
      </div>
      <div className="dice-tray">
        {(rolling ? Array.from({ length: count }, () => "red") : colors).map((c, i) => (
          <span key={i} className={`die ${rolling ? "rolling" : ""}`} data-color={rolling ? ["red", "orange", "yellow", "green", "blue", "purple"][i % 6] : c} />
        ))}
      </div>
      <div className="count-dropdown">
        <button type="button" className="count-trigger" onClick={() => setOpen((v) => !v)}>
          <span>
            {count} {count === 1 ? "die" : "dice"}
          </span>
          <svg className="count-arrow" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>
        {open && (
          <div className="count-menu">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setCount(v);
                  setOpen(false);
                }}
              >
                {v} {v === 1 ? "die" : "dice"}
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="roll-go" type="button" onClick={roll} disabled={rolling}>
        {rolling ? "Rolling..." : "Roll"}
      </button>
      {result && (
        <div className="result-box">
          <div>
            <div className="section-eyebrow">Result ID</div>
            <div className="code">{result.publicId}</div>
          </div>
          <Link href={`/verify/${result.publicId}`}>Verify</Link>
        </div>
      )}
    </div>
  );
}
