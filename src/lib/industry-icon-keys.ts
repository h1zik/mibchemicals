import type { IndustryItem } from "@/types/database";

/** Kunci yang didukung komponen `IndustryIcon` (SVG). */
export const INDUSTRY_ICON_KEYS = [
  "oil-gas",
  "manufacturing",
  "mining",
  "water",
  "flask",
  "droplet",
  "support",
  "household",
  "autocare",
  // Legacy gabungan — prefer `household` atau `autocare` untuk sektor baru
  "household-autocare",
] as const;

export type IndustryIconKey = (typeof INDUSTRY_ICON_KEYS)[number];

export const INDUSTRY_ICON_KEY_SET = new Set<string>(INDUSTRY_ICON_KEYS);

/** Label untuk dropdown admin (Bahasa Indonesia). */
export const INDUSTRY_ICON_OPTIONS: ReadonlyArray<readonly [IndustryIconKey, string]> = [
  ["oil-gas", "Oil & Gas"],
  ["manufacturing", "Manufaktur"],
  ["mining", "Pertambangan"],
  ["water", "Pengolahan air"],
  ["flask", "Lab / kimia"],
  ["droplet", "Cair / tetes"],
  ["support", "Dukungan / konsultasi"],
  ["household", "Rumah tangga (household)"],
  ["autocare", "Autocare / kendaraan"],
  ["household-autocare", "Household & Autocare (gabungan, lama)"],
];

/** Kunci yang dipakai `IndustryIcon` di halaman publik (ikon kustom atau fallback ke `key`). */
export function resolveIndustryIconKey(item: { key: string; icon_key?: string }): string {
  if (item.icon_key && INDUSTRY_ICON_KEY_SET.has(item.icon_key)) return item.icon_key;
  return item.key;
}

/** Nilai default untuk dropdown admin bila belum ada `icon_key` dan `key` bukan kunci ikon. */
export function effectiveIconKeyForEditor(item: { key: string; icon_key?: string }): IndustryIconKey {
  if (item.icon_key && INDUSTRY_ICON_KEY_SET.has(item.icon_key)) return item.icon_key as IndustryIconKey;
  if (INDUSTRY_ICON_KEY_SET.has(item.key)) return item.key as IndustryIconKey;
  return "flask";
}

export function normalizeIndustryItemsForEditor(items: IndustryItem[]): IndustryItem[] {
  if (items.length === 0) return items;
  return items.map((x) => ({
    ...x,
    icon_key: effectiveIconKeyForEditor(x),
  }));
}
