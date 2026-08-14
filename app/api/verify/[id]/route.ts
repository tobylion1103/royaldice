import { NextResponse } from "next/server";
import { getResult } from "@/lib/store";
import { flipCoin, rollColors } from "@/lib/fair";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const result = getResult(params.id);
  if (!result) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  if (result.kind === "dice") {
    const check = rollColors(result.serverSeed, result.clientSeed, result.nonce, result.diceCount);
    return NextResponse.json({
      ok: true,
      publicId: result.publicId,
      kind: "dice",
      diceCount: result.diceCount,
      colors: result.colors,
      clientSeed: result.clientSeed,
      nonce: result.nonce,
      seedHash: result.seedHash,
      matchesProof: check.colors.join() === result.colors.join(),
    });
  }

  const check = flipCoin(result.serverSeed, result.clientSeed, result.nonce);
  return NextResponse.json({
    ok: true,
    publicId: result.publicId,
    kind: "flip",
    side: result.side,
    clientSeed: result.clientSeed,
    nonce: result.nonce,
    seedHash: result.seedHash,
    matchesProof: check.side === result.side,
  });
}
