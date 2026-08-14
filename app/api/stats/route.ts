import { NextResponse } from "next/server";
import { getSession } from "@/lib/store";

export async function GET() {
  const s = getSession();
  return NextResponse.json({ ok: true, stats: { rollCount: s.rollCount } });
}
