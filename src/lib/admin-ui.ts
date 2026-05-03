/** Shared Tailwind class strings for admin console — keep visual language consistent. */

const adminControlBase =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-mib focus:ring-2 focus:ring-mib/15";

/** Form control without top margin (use inside stacks with `gap`). */
export const adminControl = adminControlBase;

export const adminInput = "mt-1 " + adminControlBase;

export const adminLabel =
  "block text-xs font-semibold uppercase tracking-wide text-neutral-500";

export const adminFieldset =
  "space-y-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm sm:p-6";

/** Isi panel saja; judul section letakkan di luar card (mis. pengaturan situs). */
export const adminCard = "space-y-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm sm:p-6";

export const adminDangerZoneButton =
  "inline-flex w-full items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 sm:w-auto";

export const adminLegend = "px-1 text-sm font-bold tracking-tight text-neutral-900";

export const adminPrimaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-mib px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-mib/20 transition hover:bg-mib-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mib disabled:pointer-events-none disabled:opacity-50";

/** Aksi sekunder: reset / batal tanpa hapus permanen. */
export const adminSecondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 disabled:pointer-events-none disabled:opacity-50";

export const adminPrimaryBtnWide =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-mib px-4 py-3 text-sm font-semibold text-white shadow-md shadow-mib/20 transition hover:bg-mib-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mib disabled:pointer-events-none disabled:opacity-50";

export const adminGhostLink =
  "text-sm font-medium text-neutral-600 transition hover:text-neutral-900";

export const adminDangerLink =
  "text-sm font-medium text-red-600 transition hover:text-red-700";

export const adminMutedLink =
  "text-sm font-semibold text-mib transition hover:text-mib-dark";
