"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { adminDangerZoneButton } from "@/lib/admin-ui";

type Props = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  /** Nama entri untuk label aksesibel, mis. "solusi Pickling". */
  itemLabel?: string;
  /** `inline` untuk baris daftar, `block` untuk zona bahaya. */
  variant?: "inline" | "block";
  label?: string;
};

const CONFIRM_TIMEOUT_MS = 5000;

function ConfirmButton({ variant }: { variant: "inline" | "block" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        variant === "block"
          ? "inline-flex items-center justify-center gap-2 rounded-lg bg-admin-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-60"
          : "inline-flex items-center gap-1.5 rounded-md bg-admin-danger px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-60"
      }
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
      {pending ? "Menghapus…" : "Ya, hapus"}
    </button>
  );
}

/** Tombol hapus dua langkah: klik pertama meminta konfirmasi, tanpa dialog browser. */
export function AdminDeleteButton({
  action,
  id,
  itemLabel,
  variant = "inline",
  label = "Hapus",
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!confirming) return;
    cancelRef.current?.focus();
    const timer = setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT_MS);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirming(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [confirming]);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={itemLabel ? `${label} ${itemLabel}` : undefined}
        className={
          variant === "block"
            ? adminDangerZoneButton + " gap-2"
            : "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-admin-muted transition hover:bg-red-50 hover:text-admin-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
        }
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        <span className={variant === "inline" ? "sr-only sm:not-sr-only" : undefined}>{label}</span>
      </button>
    );
  }

  return (
    <form
      action={action}
      className={
        "flex items-center gap-2 " + (variant === "block" ? "flex-wrap" : "animate-fade-in")
      }
      role="group"
      aria-label="Konfirmasi hapus"
    >
      <input type="hidden" name="id" value={id} />
      <span className={variant === "block" ? "text-sm font-medium text-red-900" : "text-xs font-medium text-admin-danger"}>
        Hapus permanen?
      </span>
      <ConfirmButton variant={variant} />
      <button
        ref={cancelRef}
        type="button"
        onClick={() => setConfirming(false)}
        className={
          variant === "block"
            ? "rounded-lg px-3 py-2.5 text-sm font-medium text-admin-muted transition hover:bg-white hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
            : "rounded-md px-2 py-1.5 text-xs font-medium text-admin-muted transition hover:bg-admin-canvas hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
        }
      >
        Batal
      </button>
    </form>
  );
}
