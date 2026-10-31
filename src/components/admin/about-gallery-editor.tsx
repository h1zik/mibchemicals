"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { updateSiteConfigAboutGallery } from "@/actions/admin";
import { uploadAboutGalleryImage } from "@/actions/admin-content-media";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { AdminSettingsFormFooter } from "@/components/admin/admin-settings-form-footer";
import { adminInput, adminLabel, adminPrimaryBtn } from "@/lib/admin-ui";
import type { AboutGalleryImage } from "@/types/database";

type Props = {
  initial: AboutGalleryImage[];
};

export function AboutGalleryEditor({ initial }: Props) {
  const [items, setItems] = useState<AboutGalleryImage[]>(() => initial.map((x) => ({ ...x })));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function runUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Pilih file gambar terlebih dahulu.");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const res = await uploadAboutGalleryImage(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setItems((prev) => [...prev, { url: res.url, alt: "" }]);
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-admin-muted">
        Foto fasilitas/tim yang tampil sebagai galeri di halaman Tentang. Unggah foto lalu simpan bagian ini.
      </p>

      <div className="rounded-xl border-2 border-dashed border-mib/20 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="about-gallery-file" className={adminLabel}>Unggah foto</label>
            <input
              ref={fileRef}
              id="about-gallery-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
              className="mt-1 block w-full text-sm text-admin-muted file:mr-3 file:rounded-lg file:border-0 file:bg-mib/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-mib hover:file:bg-mib/15"
              disabled={pending}
            />
          </div>
          <button type="button" className={`${adminPrimaryBtn} shrink-0 justify-center`} disabled={pending} onClick={runUpload}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Mengunggah…
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" aria-hidden /> Tambah ke galeri
              </>
            )}
          </button>
        </div>
        {error ? (
          <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item, i) => (
            <li key={`${i}-${item.url}`} className="rounded-xl border border-admin-line bg-admin-canvas/60 p-3 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <input
                className={`${adminInput} text-xs`}
                value={item.alt ?? ""}
                placeholder="Alt/caption (opsional)"
                onChange={(e) => setItems((prev) => prev.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
              />
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden /> Hapus
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-admin-muted">Belum ada foto galeri.</p>
      )}

      <AdminSaveForm id="settings-about-gallery" action={updateSiteConfigAboutGallery} successMessage="Galeri disimpan.">
        <input type="hidden" name="about_gallery_json" value={JSON.stringify(items)} />
      </AdminSaveForm>
      <AdminSettingsFormFooter formId="settings-about-gallery" section="about_gallery" />
    </div>
  );
}
