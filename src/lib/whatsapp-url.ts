import type { SiteConfig } from "@/types/database";

const MIN_WA_DIGITS = 8;
const MAX_WA_DIGITS = 15;

function digitsOnly(input: string): string {
  return input.replace(/\D/g, "");
}

function isPlausibleWaDigits(d: string | null): d is string {
  if (!d) return false;
  return d.length >= MIN_WA_DIGITS && d.length <= MAX_WA_DIGITS;
}

/** Normalisasi ke digit untuk wa.me (fokus format Indonesia umum). */
function normalizePhoneToWaDigits(phone: string): string | null {
  const d = digitsOnly(phone);
  if (!d) return null;
  if (d.startsWith("62")) return d;
  if (d.startsWith("0")) return `62${d.slice(1)}`;
  if (d.startsWith("8") && d.length >= 10 && d.length <= 12) return `62${d}`;
  return d;
}

/**
 * Digit untuk URL `https://wa.me/{digits}`.
 * Prioritas: `NEXT_PUBLIC_WHATSAPP_NUMBER`, lalu `contact_phone` dari site config.
 */
export function getWhatsAppWaMeDigits(config: SiteConfig): string | null {
  const envRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (envRaw) {
    const d = digitsOnly(envRaw);
    if (isPlausibleWaDigits(d)) return d;
  }
  const fromPhone = normalizePhoneToWaDigits(config.contact_phone);
  if (isPlausibleWaDigits(fromPhone)) return fromPhone;
  return null;
}
