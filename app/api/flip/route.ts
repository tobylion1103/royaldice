import { NextResponse } from "next/server";
import { randomId, flipCoin } from "@/lib/fair";
import { getSession, saveResult, saveSession } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const session = getSession();
  const clientSeed = String(body.clientSeed || session.clientSeed);
  const nonce = session.nextNonce;
  const { side } = flipCoin(session.serverSeed, clientSeed, nonce);
  const publicId = randomId();
  saveResult({
    kind: "flip",
    publicId,
    side,
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
    side,
    nonce,
    clientSeed,
    seedHash: session.seedHash,
    verifyUrl: `/verify/${publicId}`,
  });
}
