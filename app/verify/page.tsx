import VerifyForm from "@/components/VerifyForm";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <main className="shell">
      <VerifyForm />
      <p className="muted">
        <Link href="/">Back to the game</Link>
      </p>
      <div style={{ marginTop: 40 }}>
        <div className="panel">
          <div className="section-head public-rolls-head">
            <div>
              <span className="section-eyebrow">Community</span>
              <h2 className="section-title">Public Rolls</h2>
              <p className="section-sub">Live feed of rolls from signed-in players, every result stays verifiable.</p>
            </div>
          </div>
          <p className="public-rolls-caution">
            Be cautious: names and photos shown here are self-chosen and not verified identities. Only the Result ID is
            provably fair.
          </p>
          <p className="muted">No public rolls yet, be the first to roll.</p>
        </div>
      </div>
    </main>
  );
}
