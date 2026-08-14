"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/dice";

export default function SabCounter() {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(COLORS.map((c) => [c, 0]))
  );

  useEffect(() => {
    function toggle() {
      setOpen((v) => !v);
    }
    function onRoll(e: Event) {
      const colors = (e as CustomEvent<string[]>).detail || [];
      setCounts((prev) => {
        const next = { ...prev };
        for (const c of colors) next[c] = (next[c] || 0) + 1;
        return next;
      });
    }
    window.addEventListener("rd-toggle-sab", toggle);
    window.addEventListener("rd-roll", onRoll as EventListener);
    return () => {
      window.removeEventListener("rd-toggle-sab", toggle);
      window.removeEventListener("rd-roll", onRoll as EventListener);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="sab-panel">
      <div className="section-head">
        <span className="section-eyebrow">Tracker</span>
        <h2 className="section-title" style={{ margin: 0 }}>SabCounter</h2>
      </div>
      <div className="sab-grid">
        {COLORS.map((c) => (
          <div key={c} className="sab-cell">
            <span className="die mini-die" data-color={c} />
            <strong>{counts[c]}</strong>
            <span>{c}</span>
          </div>
        ))}
      </div>
      <button type="button" className="roll-go" style={{ fontSize: 16, marginTop: 12 }} onClick={() => setCounts(Object.fromEntries(COLORS.map((c) => [c, 0])))}>
        Reset
      </button>
    </div>
  );
}
