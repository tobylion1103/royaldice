"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Entry = { id: string; label: string; color: string };
type Result = { id: string; label: string; color: string; at: number };

const PALETTE = ["#e11d2a", "#2563eb", "#16a34a", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4", "#f97316"];

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

export default function RoyalWheel() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: "r", label: "Red", color: "#e11d2a" },
    { id: "b", label: "Blue", color: "#2563eb" },
  ]);
  const [results, setResults] = useState<Result[]>([]);
  const [tab, setTab] = useState<"entries" | "results">("entries");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Entry | null>(null);
  const [panel, setPanel] = useState({ x: 24, y: 24 });

  const wheelRef = useRef<HTMLDivElement>(null);
  const rot = useRef(0);
  const spinRef = useRef(false);
  const tween = useRef<{ start: number; from: number; to: number; dur: number; done?: Entry } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const slice = 360 / Math.max(entries.length, 1);
  const gradient = useMemo(() => {
    if (!entries.length) return "#22102f";
    return entries
      .map((e, i) => {
        const a = i * slice;
        const b = (i + 1) * slice;
        return `${e.color} ${a}deg ${b}deg`;
      })
      .join(", ");
  }, [entries, slice]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      const t = tween.current;
      if (t) {
        const p = Math.min(1, (now - t.start) / t.dur);
        const ease = 1 - Math.pow(1 - p, 3);
        rot.current = t.from + (t.to - t.from) * ease;
        if (p >= 1) {
          tween.current = null;
          spinRef.current = false;
          setSpinning(false);
          if (t.done) {
            setWinner(t.done);
            setResults((prev) => [{ id: uid(), label: t.done!.label, color: t.done!.color, at: Date.now() }, ...prev].slice(0, 20));
            const n = Number(localStorage.getItem("royal-dice-spin-count") || 0) + 1;
            localStorage.setItem("royal-dice-spin-count", String(n));
          }
        }
      } else if (!spinRef.current) {
        rot.current += dt * 0.012;
      }
      if (wheelRef.current) wheelRef.current.style.transform = `rotate(${rot.current}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  function spin() {
    if (spinRef.current || entries.length < 1) return;
    const idx = Math.floor(Math.random() * entries.length);
    const pick = entries[idx];
    const middle = idx * slice + slice / 2;
    const current = ((rot.current % 360) + 360) % 360;
    const want = (360 - middle + 360) % 360;
    let delta = (want - current + 360) % 360;
    delta += 360 * (6 + Math.floor(Math.random() * 3));
    spinRef.current = true;
    setSpinning(true);
    setWinner(null);
    tween.current = {
      start: performance.now(),
      from: rot.current,
      to: rot.current + delta,
      dur: 4200,
      done: pick,
    };
  }

  function addEntry() {
    const color = PALETTE[entries.length % PALETTE.length];
    setEntries((e) => [...e, { id: uid(), label: `Entry ${e.length + 1}`, color }]);
  }

  function shuffle() {
    setEntries((list) => {
      const next = [...list];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  }

  function move(id: string, dir: -1 | 1) {
    setEntries((list) => {
      const i = list.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function onDragStart(e: React.PointerEvent) {
    drag.current = { dx: e.clientX - panel.x, dy: e.clientY - panel.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onDrag(e: React.PointerEvent) {
    if (!drag.current) return;
    setPanel({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
  }
  function onDragEnd() {
    drag.current = null;
  }

  return (
    <div className="wheel-stage">
      <aside
        className="wheel-dock"
        style={{ left: panel.x, top: panel.y }}
        onPointerMove={onDrag}
        onPointerUp={onDragEnd}
      >
        <div className="wheel-dock-head" onPointerDown={onDragStart}>
          Drag me
        </div>
        <div className="wheel-tabs">
          <button type="button" className={tab === "entries" ? "on" : ""} onClick={() => setTab("entries")}>
            Entries {entries.length}
          </button>
          <button type="button" className={tab === "results" ? "on" : ""} onClick={() => setTab("results")}>
            Results {results.length}
          </button>
        </div>
        {tab === "entries" && (
          <>
            <button type="button" className="wheel-shuffle" onClick={shuffle}>
              Shuffle
            </button>
            <div className="wheel-entries">
              {entries.map((e) => (
                <div className="wheel-entry" key={e.id}>
                  <span className="wheel-swatch" style={{ background: e.color }} />
                  <input
                    value={e.label}
                    onChange={(ev) =>
                      setEntries((list) => list.map((x) => (x.id === e.id ? { ...x, label: ev.target.value } : x)))
                    }
                  />
                  <button type="button" aria-label="Move up" onClick={() => move(e.id, -1)}>
                    ↑
                  </button>
                  <button type="button" aria-label="Move down" onClick={() => move(e.id, 1)}>
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => setEntries((list) => (list.length <= 2 ? list : list.filter((x) => x.id !== e.id)))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="wheel-add flash-btn" onClick={addEntry}>
              + Add entry
            </button>
          </>
        )}
        {tab === "results" && (
          <div className="wheel-entries">
            {results.length === 0 && <p className="muted">No spins yet.</p>}
            {results.map((r) => (
              <div className="wheel-entry" key={r.id}>
                <span className="wheel-swatch" style={{ background: r.color }} />
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      <div className="wheel-hero">
        <h1 className="wheel-title">
          Royal <span>Wheel</span>
        </h1>
        <div className="wheel-wrap">
          <div className="wheel-glow" />
          <div
            ref={wheelRef}
            className="wheel-disk"
            style={{ background: `conic-gradient(${gradient})` }}
          >
            {entries.map((e, i) => {
              const angle = i * slice + slice / 2;
              return (
                <span key={e.id} className="wheel-label" style={{ transform: `rotate(${angle}deg)` }}>
                  {e.label}
                </span>
              );
            })}
          </div>
          <button type="button" className="wheel-spin" onClick={spin} disabled={spinning} aria-label="Spin">
            Spin
          </button>
          <div className="wheel-pointer" />
        </div>
        {winner && !spinning && (
          <p className="wheel-win">
            Landed on <b style={{ color: winner.color }}>{winner.label}</b>
          </p>
        )}
      </div>
    </div>
  );
}
