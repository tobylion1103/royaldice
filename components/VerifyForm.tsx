"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DiceColor } from "@/lib/dice";

type VerifyPayload = {
  ok: boolean;
  kind?: "dice" | "flip";
  publicId?: string;
  colors?: DiceColor[];
  side?: "heads" | "tails";
  clientSeed?: string;
  nonce?: number;
  seedHash?: string;
  matchesProof?: boolean;
  error?: string;
};

export default function VerifyForm({ initialId = "", initial }: { initialId?: string; initial?: VerifyPayload | null }) {
  const [id, setId] = useState(initialId);
  const [data, setData] = useState<VerifyPayload | null>(initial || null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = id.trim();
    if (!next) return;
    router.push(`/verify/${next}`);
    setLoading(true);
    const r = await fetch(`/api/verify/${next}`);
    setData(await r.json());
    setLoading(false);
  }

  return (
    <>
      <div className="page-hero">
        <h1>Verify a Result</h1>
        <p>Enter a Result ID to load the exact dice outcome that was generated for that roll.</p>
      </div>
      <div className="panel">
        <form className="verify-search" onSubmit={onSubmit}>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter Result ID" aria-label="Result ID" autoComplete="off" />
          <button type="submit">{loading ? "..." : "Verify"}</button>
        </form>
        {data && !data.ok && <p className="muted" style={{ marginTop: 16 }}>No result found for that ID.</p>}
        {data?.ok && (
          <div style={{ marginTop: 22 }}>
            <div className="section-eyebrow">Result {data.publicId}</div>
            {data.kind === "dice" && (
              <div className="dice-tray">
                {data.colors?.map((c, i) => (
                  <span key={i} className="die" data-color={c} />
                ))}
              </div>
            )}
            {data.kind === "flip" && <div className="coin">{data.side}</div>}
            <p className="muted">
              Client seed <span className="code">{data.clientSeed}</span> · nonce {data.nonce}
            </p>
            <p className="muted">
              Server seed hash <span className="code">{data.seedHash}</span>
            </p>
            <p className="muted">{data.matchesProof ? "Proof matches the stored outcome." : "Proof mismatch."}</p>
          </div>
        )}
      </div>
    </>
  );
}
