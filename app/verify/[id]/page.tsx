import VerifyForm from "@/components/VerifyForm";
import Link from "next/link";
import { getResult } from "@/lib/store";
import { flipCoin, rollColors } from "@/lib/fair";

export default function VerifyIdPage({ params }: { params: { id: string } }) {
  const result = getResult(params.id);
  let initial = result
    ? result.kind === "dice"
      ? {
          ok: true as const,
          kind: "dice" as const,
          publicId: result.publicId,
          colors: result.colors,
          clientSeed: result.clientSeed,
          nonce: result.nonce,
          seedHash: result.seedHash,
          matchesProof:
            rollColors(result.serverSeed, result.clientSeed, result.nonce, result.diceCount).colors.join() ===
            result.colors.join(),
        }
      : {
          ok: true as const,
          kind: "flip" as const,
          publicId: result.publicId,
          side: result.side,
          clientSeed: result.clientSeed,
          nonce: result.nonce,
          seedHash: result.seedHash,
          matchesProof: flipCoin(result.serverSeed, result.clientSeed, result.nonce).side === result.side,
        }
    : { ok: false as const, error: "Not found" };

  return (
    <main className="shell">
      <VerifyForm initialId={params.id} initial={initial} />
      <p className="muted">
        <Link href="/">Back to the game</Link>
      </p>
    </main>
  );
}
