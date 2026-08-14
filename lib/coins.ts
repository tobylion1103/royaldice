export const COIN_THEMES = [
  { id: "classic-gold", name: "Classic Gold", hint: "Warm mint finish", a: "#fff3b0", b: "#d4a017", c: "#8a5a00" },
  { id: "obsidian-onyx", name: "Obsidian Onyx", hint: "Matte black edge", a: "#9aa3b2", b: "#2b2f38", c: "#0b0c0f" },
  { id: "amethyst-dusk", name: "Amethyst Dusk", hint: "Royal violet", a: "#e9d5ff", b: "#7c3aed", c: "#4c1d95" },
  { id: "cyber-neon", name: "Cyber Neon", hint: "Electric night", a: "#a5f3fc", b: "#22d3ee", c: "#db2777" },
  { id: "emerald-crest", name: "Emerald Crest", hint: "House green", a: "#bbf7d0", b: "#16a34a", c: "#14532d" },
  { id: "sapphire-royal", name: "Sapphire Royal", hint: "Deep navy", a: "#bfdbfe", b: "#2563eb", c: "#1e3a8a" },
  { id: "ruby-inferno", name: "Ruby Inferno", hint: "Ember glow", a: "#fdba74", b: "#ea580c", c: "#7f1d1d" },
  { id: "platinum-mirror", name: "Platinum Mirror", hint: "Cold steel", a: "#f8fafc", b: "#94a3b8", c: "#334155" },
  { id: "rose-gold", name: "Rose Gold", hint: "Soft blush", a: "#ffe4e6", b: "#fb7185", c: "#9f1239" },
  { id: "molten-lava", name: "Molten Lava", hint: "Liquid fire", a: "#fde68a", b: "#f97316", c: "#7c2d12" },
] as const;

export type CoinThemeId = (typeof COIN_THEMES)[number]["id"];
