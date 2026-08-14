export const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"] as const;
export type DiceColor = (typeof COLORS)[number];

export const COLOR_HEX: Record<DiceColor, string> = {
  red: "#ff4d4d",
  orange: "#ff8c00",
  yellow: "#ffd700",
  green: "#16b316",
  blue: "#3b6bff",
  purple: "#b020b0",
};

export function binomialChance(n: number, k: number) {
  const p = 1 / 6;
  const q = 5 / 6;
  return combinations(n, k) * Math.pow(p, k) * Math.pow(q, n - k);
}

function combinations(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

export function formatPct(n: number) {
  const v = n * 100;
  if (v >= 10) return `${v.toFixed(3)}%`;
  if (v >= 1) return `${v.toFixed(3)}%`;
  return `${v.toFixed(4)}%`;
}
