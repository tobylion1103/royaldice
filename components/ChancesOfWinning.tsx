"use client";

import { useState } from "react";
import { binomialChance, formatPct } from "@/lib/dice";

export default function ChancesOfWinning() {
  const [n, setN] = useState(1);
  const [open, setOpen] = useState(false);
  return (
    <div className="panel">
      <div className="section-head">
        <span className="section-eyebrow">Reference</span>
        <h2 className="section-title">Chances of Winning</h2>
      </div>
      <div className="field" style={{ marginBottom: 18 }}>
        <div className="count-dropdown">
          <button type="button" className="count-trigger" onClick={() => setOpen((v) => !v)}>
            <span>
              {n} {n === 1 ? "die" : "dice"}
            </span>
            <svg className="count-arrow" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </button>
          {open && (
            <div className="count-menu">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setN(v);
                    setOpen(false);
                  }}
                >
                  {v} {v === 1 ? "die" : "dice"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="payout-table" role="table" aria-label="Chances of winning">
        <div className="payout-row head" role="row">
          <span role="columnheader">Matching dice</span>
          <span className="payout-example-head" role="columnheader">Example</span>
          <span className="multiplier" role="columnheader">Chance</span>
        </div>
        {Array.from({ length: n }, (_, i) => i + 1).map((k) => (
          <div className="payout-row" role="row" key={k}>
            <span>
              {k} {k === 1 ? "die" : "dice"}
            </span>
            <span className="payout-example">
              {Array.from({ length: k }, (_, i) => (
                <span key={i} className="die mini-die" data-color="red" />
              ))}
            </span>
            <span className="multiplier">{formatPct(binomialChance(n, k))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
