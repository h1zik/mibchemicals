/** Shared Tailwind class strings for admin console — keep visual language consistent. */

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mib";

const adminControlBase =
  "w-full rounded-lg border border-admin-line bg-white px-3 py-2.5 text-sm text-admin-ink outline-none transition placeholder:text-neutral-400 hover:border-[#c8cfbd] focus:border-mib focus:ring-[3px] focus:ring-mib/15";

/** Form control without top margin (use inside stacks with `gap`). */
export const adminControl = adminControlBase;

export const adminInput = "mt-1.5 " + adminControlBase;

export const adminLabel = "block text-[13px] font-medium text-admin-ink";

export const adminHelpText = "mt-1.5 text-xs leading-relaxed text-admin-muted";

export const adminFieldset =
  "space-y-4 rounded-xl border border-admin-line bg-white p-5 sm:p-6";

/** Isi panel saja; judul section letakkan di luar card (mis. pengaturan situs). */
export const adminCard = "space-y-4 rounded-xl border border-admin-line bg-white p-5 sm:p-6";

export const adminDangerZoneButton =
  "inline-flex w-full items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-admin-danger transition hover:border-red-300 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:w-auto";

export const adminLegend = "px-1 font-display text-base font-semibold tracking-tight text-admin-ink";

export const adminPrimaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-mib px-4 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_2px_rgba(22,36,12,0.25)] transition hover:bg-mib-dark disabled:pointer-events-none disabled:opacity-60 " +
  focusRing;

/** Aksi sekunder: reset / batal tanpa hapus permanen. */
export const adminSecondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-admin-line bg-white px-4 py-2.5 text-sm font-semibold text-admin-ink transition hover:border-[#c8cfbd] hover:bg-admin-canvas disabled:pointer-events-none disabled:opacity-60 " +
  focusRing;

export const adminPrimaryBtnWide = `${adminPrimaryBtn} w-full py-3`;

export const adminGhostLink =
  "rounded text-sm font-medium text-admin-muted transition hover:text-admin-ink " + focusRing;

export const adminDangerLink =
  "rounded text-sm font-medium text-admin-danger transition hover:text-red-800 " + focusRing;

export const adminMutedLink =
  "rounded text-sm font-semibold text-mib transition hover:text-mib-dark " + focusRing;
