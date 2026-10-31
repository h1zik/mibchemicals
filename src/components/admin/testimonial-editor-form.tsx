import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminDangerZone } from "@/components/admin/admin-danger-zone";
import { AdminEditorHeader } from "@/components/admin/admin-editor-header";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { ContentImageUpload } from "@/components/admin/content-image-upload";
import { deleteTestimonialForm, upsertTestimonial } from "@/actions/admin";
import {
  adminInput,
  adminLabel,
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
      <AdminEditorHeader
        backHref="/admin/testimonials"
        backLabel="Daftar testimoni"
        title={isEdit ? "Edit testimoni" : "Testimoni baru"}
        published={s?.published}
        description={isEdit ? undefined : "Kutipan pelanggan tampil di beranda. Simpan dulu untuk mengunggah foto/avatar."}
      />

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
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-admin-line bg-admin-canvas/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input type="checkbox" name="published" defaultChecked={s?.published ?? true} className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-admin-ink">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-admin-muted">Tampilkan testimoni di situs publik.</span>
            </span>
          </label>
        </AdminFormSection>

        <AdminFormActions cancelHref="/admin/testimonials" submitLabel={isEdit ? "Simpan perubahan" : "Simpan & lanjut unggah foto"} />
      </AdminSaveForm>

      {isEdit && s ? <AdminDangerZone action={deleteTestimonialForm} id={s.id} noun="testimoni" /> : null}
    </div>
  );
}
