import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import type { DiceColor } from "./dice";
import { sha256 } from "./fair";

export type DiceResult = {
  kind: "dice";
  publicId: string;
  diceCount: number;
  colors: DiceColor[];
  clientSeed: string;
  nonce: number;
  seedHash: string;
  serverSeed: string;
  createdAt: number;
};

export type FlipResult = {
  kind: "flip";
  publicId: string;
  side: "heads" | "tails";
  clientSeed: string;
  nonce: number;
  seedHash: string;
  serverSeed: string;
  createdAt: number;
};

export type StoredResult = DiceResult | FlipResult;

type Session = {
  serverSeed: string;
  seedHash: string;
  clientSeed: string;
  nextNonce: number;
  rollCount: number;
};

const dataDir = path.join(process.cwd(), "data");
const resultsFile = path.join(dataDir, "results.json");
const sessionFile = path.join(dataDir, "session.json");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, value: unknown) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(value));
}

export function getSession(): Session {
  const existing = readJson<Session | null>(sessionFile, null);
  if (existing?.serverSeed) return existing;
  const serverSeed = randomBytes(32).toString("hex");
  const session: Session = {
    serverSeed,
    seedHash: sha256(serverSeed),
    clientSeed: randomBytes(8).toString("hex"),
    nextNonce: 1,
    rollCount: 0,
  };
  writeJson(sessionFile, session);
  return session;
}

export function saveSession(session: Session) {
  writeJson(sessionFile, session);
}

export function saveResult(result: StoredResult) {
  const all = readJson<Record<string, StoredResult>>(resultsFile, {});
  all[result.publicId] = result;
  writeJson(resultsFile, all);
}

export function getResult(id: string) {
  const all = readJson<Record<string, StoredResult>>(resultsFile, {});
  return all[id] || null;
}

const chatFile = path.join(dataDir, "chat.json");

export type ChatMessage = { id: string; name: string; text: string; at: number };

export function getChat(): ChatMessage[] {
  return readJson<ChatMessage[]>(chatFile, []);
}

export function addChat(name: string, text: string) {
  const list = getChat();
  const msg: ChatMessage = {
    id: randomBytes(4).toString("hex"),
    name: name.slice(0, 24) || "Guest",
    text: text.slice(0, 240),
    at: Date.now(),
  };
  list.push(msg);
  writeJson(chatFile, list.slice(-80));
  return msg;
}
