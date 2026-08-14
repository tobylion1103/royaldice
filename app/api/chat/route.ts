import { NextResponse } from "next/server";
import { addChat, getChat } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ ok: true, messages: getChat() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "Guest");
  const text = String(body.text || "").trim();
  if (!text) return NextResponse.json({ ok: false }, { status: 400 });
  const msg = addChat(name, text);
  return NextResponse.json({ ok: true, message: msg });
}
