import Link from "next/link";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { adminPrimaryBtn } from "@/lib/admin-ui";

type Props = {
  cancelHref: string;
  submitLabel: string;
  /** Teks bantu di kiri, mis. pengingat unggah foto setelah simpan. */
  hint?: string;
};

/** Bilah aksi lengket di bawah layar untuk formulir editor (harus berada di dalam `<form>`). */
export function AdminFormActions({ cancelHref, submitLabel, hint }: Props) {
  return (
    <div className="sticky bottom-3 z-10 rounded-xl border border-admin-line bg-white/90 px-3 py-2.5 shadow-[0_10px_30px_-12px_rgba(22,36,12,0.3)] backdrop-blur-md sm:bottom-4 sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <p className="hidden min-w-0 truncate text-xs text-admin-muted sm:block">{hint}</p>
        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
          <Link
            href={cancelHref}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-admin-muted transition hover:bg-admin-canvas hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
          >
            Batal
          </Link>
          <AdminSubmitButton className={`${adminPrimaryBtn} flex-1 sm:flex-none`}>
            {submitLabel}
          </AdminSubmitButton>
        </div>
      </div>
    </div>
  );
}
