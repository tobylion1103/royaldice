import { createHmac, createHash, randomBytes } from "crypto";
import { COLORS, type DiceColor } from "./dice";

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function randomHex(bytes = 8) {
  return randomBytes(bytes).toString("hex");
}

export function randomId(len = 10) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const buf = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[buf[i] % alphabet.length];
  return out;
}

function byteToColor(byte: number): DiceColor {
  return COLORS[byte % 6];
}

export function rollColors(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  diceCount: number
): { colors: DiceColor[]; hashes: string[] } {
  const colors: DiceColor[] = [];
  const hashes: string[] = [];
  for (let i = 0; i < diceCount; i++) {
    const hmac = createHmac("sha256", serverSeed)
      .update(`${clientSeed}:${nonce}:${i}`)
      .digest("hex");
    hashes.push(hmac);
    colors.push(byteToColor(parseInt(hmac.slice(0, 8), 16)));
  }
  return { colors, hashes };
}

export function flipCoin(serverSeed: string, clientSeed: string, nonce: number): { side: "heads" | "tails"; hash: string } {
  const hmac = createHmac("sha256", serverSeed)
    .update(`${clientSeed}:${nonce}:flip`)
    .digest("hex");
  const side: "heads" | "tails" = parseInt(hmac.slice(0, 8), 16) % 2 === 0 ? "heads" : "tails";
  return { side, hash: hmac };
}
