import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { ContentImageUpload } from "@/components/admin/content-image-upload";
import { deleteTestimonialForm, upsertTestimonial } from "@/actions/admin";
import {
  adminDangerZoneButton,
  adminGhostLink,
  adminInput,
  adminLabel,
  adminMutedLink,
  adminPrimaryBtn,
} from "@/lib/admin-ui";
import type { Industry, Testimonial } from "@/types/database";

type Props = {
  testimonial?: Testimonial | null;
  industries: Pick<Industry, "id" | "name">[];
};

export function TestimonialEditorForm({ testimonial, industries }: Props) {
  const isEdit = Boolean(testimonial);
  const s = testimonial ?? undefined;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/testimonials" className={`${adminMutedLink} inline-flex items-center gap-1.5`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke daftar testimoni
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {isEdit ? "Edit testimoni" : "Testimoni baru"}
        </h1>
        {!isEdit ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
            Kutipan pelanggan tampil di beranda. Simpan dulu untuk mengunggah foto/avatar.
          </p>
        ) : null}
      </div>

      <AdminSaveForm action={upsertTestimonial} className="space-y-8" successMessage="Testimoni berhasil disimpan.">
        {isEdit && s ? <input type="hidden" name="id" value={s.id} /> : null}

        <AdminFormSection title="Kutipan" description="Isi kutipan dan identitas penulis.">
          <div>
            <label htmlFor="tst-quote" className={adminLabel}>Kutipan</label>
            <textarea id="tst-quote" name="quote" rows={4} required defaultValue={s?.quote} className={adminInput} placeholder="Kualitas produk dan dukungan teknisnya sangat membantu operasional kami…" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="tst-author" className={adminLabel}>Nama penulis</label>
              <input id="tst-author" name="author_name" required defaultValue={s?.author_name} className={adminInput} placeholder="Budi Santoso" />
            </div>
            <div>
              <label htmlFor="tst-role" className={adminLabel}>Jabatan / perusahaan</label>
              <input id="tst-role" name="author_role" defaultValue={s?.author_role ?? ""} className={adminInput} placeholder="Plant Manager, PT Contoh" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="tst-industry" className={adminLabel}>Industri (opsional)</label>
              <select id="tst-industry" name="industry_id" defaultValue={s?.industry_id ?? ""} className={adminInput}>
                <option value="">— Tanpa industri —</option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>{ind.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tst-rating" className={adminLabel}>Rating (opsional)</label>
              <select id="tst-rating" name="rating" defaultValue={s?.rating != null ? String(s.rating) : ""} className={adminInput}>
                <option value="">— Tanpa rating —</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} bintang</option>
                ))}
              </select>
            </div>
          </div>
        </AdminFormSection>

        {isEdit && s ? (
          <AdminFormSection title="Foto / avatar" description="Foto penulis atau logo perusahaan (opsional).">
            <ContentImageUpload
              entity="testimonial"
              field="avatar_url"
              id={s.id}
              currentUrl={s.avatar_url}
              label="Avatar / logo"
              hint="Foto persegi ideal (opsional)."
            />
          </AdminFormSection>
        ) : null}

        <AdminFormSection title="Urutan & publikasi" description="Urutan menentukan posisi tampil.">
          <div>
            <label htmlFor="tst-sort" className={adminLabel}>Urutan</label>
            <input id="tst-sort" name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} className={adminInput} />
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input type="checkbox" name="published" defaultChecked={s?.published ?? true} className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-neutral-600">Tampilkan testimoni di situs publik.</span>
            </span>
          </label>
        </AdminFormSection>

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/testimonials" className={`${adminGhostLink} py-2 sm:py-0`}>Batal</Link>
          <button type="submit" className={`${adminPrimaryBtn} w-full justify-center sm:w-auto`}>
            {isEdit ? "Simpan perubahan" : "Simpan & lanjut unggah foto"}
          </button>
        </div>
      </AdminSaveForm>

      {isEdit && s ? (
        <aside className="mt-8 rounded-2xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-red-900">Zona bahaya</h2>
          <p className="mt-1 text-sm text-red-800/90">Menghapus testimoni tidak dapat dibatalkan.</p>
          <form action={deleteTestimonialForm} className="mt-4">
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className={adminDangerZoneButton}>Hapus testimoni</button>
          </form>
        </aside>
      ) : null}
    </div>
  );
}
