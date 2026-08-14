import fs from "fs";
import path from "path";

export type User = {
  name: string;
  displayName?: string;
  bio?: string;
  avatar: string | null;
  createdAt: number;
  rolls?: number;
  flips?: number;
  spins?: number;
};

const file = path.join(process.cwd(), "data", "users.json");

function readAll(): Record<string, User> {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, User>) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data));
}

function key(name: string) {
  return name.trim().toLowerCase();
}

export function findUser(name: string) {
  return readAll()[key(name)] || null;
}

export function createUser(name: string, avatar: string | null) {
  const clean = name.trim();
  if (clean.length < 2 || clean.length > 20) return { ok: false as const, error: "Name must be 2–20 characters." };
  if (!/^[a-zA-Z0-9_]+$/.test(clean)) return { ok: false as const, error: "Only letters, numbers and underscores." };
  const all = readAll();
  if (all[key(clean)]) return { ok: false as const, error: "That name is already taken." };
  const user: User = { name: clean, avatar, createdAt: Date.now() };
  all[key(clean)] = user;
  writeAll(all);
  return { ok: true as const, user };
}

export function updateUser(
  name: string,
  patch: Partial<Pick<User, "displayName" | "bio" | "avatar" | "rolls" | "flips" | "spins">>
) {
  const all = readAll();
  const k = key(name);
  if (!all[k]) return null;
  const next = { ...all[k] };
  (Object.keys(patch) as (keyof typeof patch)[]).forEach((keyName) => {
    const value = patch[keyName];
    if (value !== undefined) (next as User)[keyName] = value as never;
  });
  all[k] = next;
  writeAll(all);
  return all[k];
}
