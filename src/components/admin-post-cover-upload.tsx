"use client";

import { useRef, useState, useTransition } from "react";
import { uploadPostCoverImage } from "@/actions/admin-post-cover";
import { adminLabel, adminPrimaryBtn } from "@/lib/admin-ui";

type Props = {
  postId: string;
  currentUrl: string | null | undefined;
};

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

export function AdminPostCoverUpload({ postId, currentUrl }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runUpload() {
    const input = fileRef.current;
    const file = input?.files?.[0];
    if (!file) {
      setError("Pilih file gambar terlebih dahulu.");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.set("post_id", postId);
    fd.set("file", file);

    startTransition(async () => {
      try {
        await uploadPostCoverImage(fd);
      } catch (e) {
        if (isNextRedirectError(e)) throw e;
        setError(e instanceof Error ? e.message : "Unggah gagal.");
      }
    });
  }

  return (
    <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
      <p className={adminLabel}>Unggah gambar sampul</p>
      <p className="mt-1 text-xs text-neutral-500">
        JPG, PNG, WebP, atau GIF — maks. 5 MB. File disimpan di bucket Supabase{" "}
        <code className="rounded bg-white px-1 font-mono text-[11px] text-mib">post-covers</code> dan URL publik
        otomatis diisi ke field sampul.
      </p>
      {error ? (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor={`post-cover-file-${postId}`} className="sr-only">
            File gambar sampul
          </label>
          <input
            ref={fileRef}
            id={`post-cover-file-${postId}`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            className={fileInputClass}
            disabled={pending}
          />
        </div>
        <button type="button" className={`${adminPrimaryBtn} shrink-0`} disabled={pending} onClick={runUpload}>
          {pending ? "Mengunggah…" : "Unggah & terapkan"}
        </button>
      </div>
      {currentUrl ? (
        <p className="mt-3 text-xs text-neutral-600">
          URL saat ini:{" "}
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-mono text-mib hover:underline"
          >
            {currentUrl}
          </a>
        </p>
      ) : null}
    </div>
  );
}
