"use client";

import { useRef, useState, useTransition } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { uploadPostCoverImage } from "@/actions/admin-post-cover";
import { adminPrimaryBtn } from "@/lib/admin-ui";

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
    <div className="rounded-xl border-2 border-dashed border-mib/20 bg-white p-4 transition hover:border-mib/35 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 justify-center sm:justify-start">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt=""
              className="h-28 w-28 rounded-lg border border-neutral-200 object-cover shadow-sm sm:h-32 sm:w-32"
            />
          ) : (
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-center sm:h-32 sm:w-32">
              <ImageUp className="h-8 w-8 text-neutral-400" aria-hidden />
              <span className="mt-1 px-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                Belum ada
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900">
            <ImageUp className="h-4 w-4 text-mib" aria-hidden />
            Unggah gambar sampul
          </p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            JPG, PNG, WebP, atau GIF — maks. 5 MB. Disimpan di bucket Supabase{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-[11px] text-mib">post-covers</code>
            ; URL publik otomatis terpasang.
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
            <button
              type="button"
              className={`${adminPrimaryBtn} shrink-0 justify-center`}
              disabled={pending}
              onClick={runUpload}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Mengunggah…
                </>
              ) : (
                <>
                  <ImageUp className="h-4 w-4" aria-hidden />
                  Terapkan sampul
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
