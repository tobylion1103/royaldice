import { NextResponse } from "next/server";

export async function GET() {
  const online = 18 + Math.floor(Math.random() * 22);
  return NextResponse.json({ ok: true, online });
}
