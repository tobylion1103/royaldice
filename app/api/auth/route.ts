import { NextResponse } from "next/server";
import { createUser, findUser, updateUser } from "@/lib/users";

export async function GET(req: Request) {
  const name = new URL(req.url).searchParams.get("name") || "";
  const user = findUser(name);
  if (!user) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, user });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "");
  const avatar = body.avatar ? String(body.avatar) : null;
  if (avatar && avatar.length > 400_000) {
    return NextResponse.json({ ok: false, error: "Image is too large." }, { status: 400 });
  }
  const result = createUser(name, avatar);
  if (!result.ok) return NextResponse.json(result, { status: 409 });
  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "");
  const user = findUser(name);
  if (!user) return NextResponse.json({ ok: false, error: "No account with that name." }, { status: 404 });
  return NextResponse.json({ ok: true, user });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "");
  if (body.avatar && String(body.avatar).length > 400_000) {
    return NextResponse.json({ ok: false, error: "Image is too large." }, { status: 400 });
  }
  const user = updateUser(name, {
    displayName: body.displayName != null ? String(body.displayName).slice(0, 24) : undefined,
    bio: body.bio != null ? String(body.bio).slice(0, 280) : undefined,
    avatar: body.avatar === undefined ? undefined : body.avatar ? String(body.avatar) : null,
  });
  if (!user) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, user });
}
