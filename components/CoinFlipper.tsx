"use client";

import Link from "next/link";
import { useState } from "react";

export default function CoinFlipper() {
  const [side, setSide] = useState<"heads" | "tails">("heads");
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<{ publicId: string } | null>(null);

  async function flip() {
    setFlipping(true);
    await new Promise((r) => setTimeout(r, 500));
    const res = await fetch("/api/flip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setSide(data.side);
    setResult(data);
    setFlipping(false);
  }

  return (
    <div className="panel">
      <div className="section-head">
        <span className="section-eyebrow">Games</span>
        <h2 className="section-title">Coin Flip</h2>
      </div>
      <div className={`coin ${flipping ? "flip" : ""}`}>{flipping ? "..." : side}</div>
      <button className="roll-go" type="button" onClick={flip} disabled={flipping}>
        {flipping ? "Flipping..." : "Flip"}
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
