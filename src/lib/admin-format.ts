const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });

/** "2 jam yang lalu", "kemarin"; lebih dari seminggu jatuh ke tanggal biasa. */
export function formatRelativeId(iso: string, now = Date.now()): string {
  const diffSec = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return "baru saja";
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 7 * 86400) return rtf.format(Math.round(diffSec / 86400), "day");
  return dateFmt.format(new Date(iso));
}

/** Nomor telepon Indonesia → tautan wa.me (0812… → 62812…). */
export function whatsappHref(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  return `https://wa.me/${digits}`;
}
