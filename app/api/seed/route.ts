import { NextResponse } from "next/server";
import { getSession } from "@/lib/store";

export async function GET() {
  const s = getSession();
  return NextResponse.json({
    ok: true,
    clientSeed: s.clientSeed,
    seedHash: s.seedHash,
    nextNonce: s.nextNonce,
    rollCount: s.rollCount,
  });
}
