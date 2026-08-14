import { NextResponse } from "next/server";
import { randomId, rollColors } from "@/lib/fair";
import { getSession, saveResult, saveSession } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const diceCount = Math.min(10, Math.max(1, Number(body.diceCount || body.count || body.dice || 1)));
  const session = getSession();
  const clientSeed = String(body.clientSeed || session.clientSeed);
  const nonce = session.nextNonce;
  const { colors } = rollColors(session.serverSeed, clientSeed, nonce, diceCount);
  const publicId = randomId();
  saveResult({
    kind: "dice",
    publicId,
    diceCount,
    colors,
    clientSeed,
    nonce,
    seedHash: session.seedHash,
    serverSeed: session.serverSeed,
    createdAt: Date.now(),
  });
  session.nextNonce += 1;
  session.rollCount += 1;
  saveSession(session);
  return NextResponse.json({
    ok: true,
    publicId,
    colors,
    nonce,
    clientSeed,
    seedHash: session.seedHash,
    verifyUrl: `/verify/${publicId}`,
  });
}
