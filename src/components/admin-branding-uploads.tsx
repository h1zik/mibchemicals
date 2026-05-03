"use client";

import { useRef, useState, useTransition } from "react";
import { uploadSiteBrandingAsset } from "@/actions/admin-branding-upload";
import { adminLabel, adminPrimaryBtn } from "@/lib/admin-ui";

const fileInputClass =
  "mt-1 block w-full max-w-md text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-mib/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-mib hover:file:bg-mib/15";

function isNextRedirectError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "digest" in e &&
    typeof (e as { digest?: unknown }).digest === "string" &&
    String((e as { digest: string }).digest).includes("NEXT_REDIRECT")
  );
}

function UploadRow({
  label,
  help,
  asset,
  accept,
}: {
  label: string;
  help: string;
  asset: "nav_logo" | "favicon";
  accept: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    const file = ref.current?.files?.[0];
    if (!file) {
      setError("Pilih file.");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.set("asset", asset);
    fd.set("file", file);
    startTransition(async () => {
      try {
        await uploadSiteBrandingAsset(fd);
      } catch (e) {
        if (isNextRedirectError(e)) throw e;
        setError(e instanceof Error ? e.message : "Unggah gagal.");
      }
    });
  }

  return (
    <div className="rounded-lg border border-neutral-100 bg-white/80 p-4">
      <p className={adminLabel}>{label}</p>
      <p className="mt-1 text-xs text-neutral-500">{help}</p>
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
        <input ref={ref} type="file" name="file" accept={accept} disabled={pending} className={fileInputClass} />
        <button type="button" className={`${adminPrimaryBtn} shrink-0`} disabled={pending} onClick={run}>
          {pending ? "Mengunggah…" : "Unggah & terapkan"}
        </button>
      </div>
    </div>
  );
}

export function AdminBrandingUploads() {
  return (
    <div className="mt-4 space-y-4">
      <UploadRow
        asset="nav_logo"
        label="Unggah logo navbar"
        help="Disarankan transparan PNG atau SVG, tinggi ~40px pada file sumber; maks. 3 MB."
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg"
      />
      <UploadRow
        asset="favicon"
        label="Unggah favicon"
        help="ICO 32×32 / PNG / SVG; maks. 512 KB. Setelah unggah, tab browser perlu di-refresh keras (Ctrl+F5) untuk melihat ikon baru."
        accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml,image/webp,.ico,.png,.svg,.webp"
      />
    </div>
  );
}
