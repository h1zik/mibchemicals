import { AdminMarkdownEditor } from "@/components/admin-markdown-editor";
import { AdminDangerZone } from "@/components/admin/admin-danger-zone";
import { AdminEditorHeader } from "@/components/admin/admin-editor-header";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { ContentImageUpload } from "@/components/admin/content-image-upload";
import { deleteSolutionForm, upsertSolution } from "@/actions/admin";
import { adminInput, adminLabel } from "@/lib/admin-ui";
import type { Industry, Solution } from "@/types/database";

type Props = {
  solution?: Solution | null;
  industries: Pick<Industry, "id" | "name">[];
};

export function SolutionEditorForm({ solution, industries }: Props) {
  const isEdit = Boolean(solution);
  const s = solution ?? undefined;
  const publicPath = s?.slug ? `/solutions/${s.slug}` : null;

  return (
    <div className="max-w-4xl">
      <AdminEditorHeader
        backHref="/admin/solutions"
        backLabel="Daftar solusi"
        title={isEdit ? "Edit solusi" : "Solusi baru"}
        published={s?.published}
        publicPath={s?.published ? publicPath : null}
        description={
          isEdit
            ? undefined
            : "Solusi (problem → solution) tampil di /solutions dan sebagai baris tabel di halaman industri terkait. Simpan dulu untuk mengunggah foto."
        }
      />

      <AdminSaveForm action={upsertSolution} className="space-y-8" successMessage="Solusi berhasil disimpan.">
        {isEdit && s ? <input type="hidden" name="id" value={s.id} /> : null}

        <AdminFormSection
          title="Konten"
          description="Judul solusi, industri terkait, dan isi halaman detail."
        >
          <div>
            <label htmlFor="sol-title" className={adminLabel}>Judul solusi</label>
            <input id="sol-title" name="title" required defaultValue={s?.title} className={adminInput} placeholder="Contoh: Pengikisan Proses Pickling" />
          </div>
          <div>
            <label htmlFor="sol-slug" className={adminLabel}>Slug {isEdit ? "" : "(opsional)"}</label>
            <input id="sol-slug" name="slug" required={isEdit} defaultValue={s?.slug} className={`${adminInput} font-mono text-sm`} placeholder="pengikisan-proses-pickling" />
          </div>
          <div>
            <label htmlFor="sol-industry" className={adminLabel}>Industri terkait</label>
            <select id="sol-industry" name="industry_id" defaultValue={s?.industry_id ?? ""} className={adminInput}>
              <option value="">— Tanpa industri —</option>
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>{ind.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sol-summary" className={adminLabel}>Ringkasan</label>
            <textarea id="sol-summary" name="summary" rows={2} defaultValue={s?.summary} className={adminInput} placeholder="Tampil di kartu solusi." />
          </div>
          <div className="!mt-6 border-t border-admin-line pt-6">
            <AdminMarkdownEditor
              label="Isi halaman solusi (Markdown)"
              name="body_md"
              defaultValue={s?.body_md ?? ""}
              height={420}
              helpText="Penjelasan lengkap masalah & solusi. Disimpan sebagai Markdown."
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Baris tabel industri"
          description="Kolom-kolom ini muncul di tabel Masalah–Solusi pada halaman industri terkait."
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="sol-equipment" className={adminLabel}>Equipment</label>
              <input id="sol-equipment" name="equipment" defaultValue={s?.equipment ?? ""} className={adminInput} placeholder="Pickling Line" />
            </div>
            <div>
              <label htmlFor="sol-problem" className={adminLabel}>Masalah</label>
              <input id="sol-problem" name="problem" defaultValue={s?.problem} className={adminInput} placeholder="Over Pickle" />
            </div>
            <div>
              <label htmlFor="sol-label" className={adminLabel}>Solusi (ringkas)</label>
              <input id="sol-label" name="solution_label" defaultValue={s?.solution_label} className={adminInput} placeholder="Acid Corrosion Inhibitor" />
            </div>
          </div>
        </AdminFormSection>

        {isEdit && s ? (
          <AdminFormSection title="Foto" description="Foto ilustrasi solusi (opsional).">
            <ContentImageUpload
              entity="solution"
              field="image_url"
              id={s.id}
              currentUrl={s.image_url}
              label="Foto solusi"
              hint="Foto untuk kartu & header halaman solusi (opsional)."
            />
          </AdminFormSection>
        ) : null}

        <AdminFormSection title="Urutan & publikasi" description="Urutan menentukan posisi di daftar & tabel.">
          <div>
            <label htmlFor="sol-sort" className={adminLabel}>Urutan</label>
            <input id="sol-sort" name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} className={adminInput} />
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-admin-line bg-admin-canvas/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input type="checkbox" name="published" defaultChecked={s?.published ?? true} className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-admin-ink">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-admin-muted">Tampilkan solusi di situs publik.</span>
            </span>
          </label>
        </AdminFormSection>

        <AdminFormSection title="SEO" description="Kosongkan untuk fallback dari judul solusi.">
          <div>
            <label htmlFor="sol-seo-title" className={adminLabel}>SEO title</label>
            <input id="sol-seo-title" name="seo_title" defaultValue={s?.seo_title ?? ""} className={adminInput} placeholder="Biarkan kosong untuk memakai judul" />
          </div>
          <div>
            <label htmlFor="sol-seo-desc" className={adminLabel}>SEO description</label>
            <textarea id="sol-seo-desc" name="seo_description" rows={3} defaultValue={s?.seo_description ?? ""} className={adminInput} />
          </div>
        </AdminFormSection>

        <AdminFormActions
          cancelHref="/admin/solutions"
          submitLabel={isEdit ? "Simpan perubahan" : "Simpan & lanjut unggah foto"}
        />
      </AdminSaveForm>

      {isEdit && s ? <AdminDangerZone action={deleteSolutionForm} id={s.id} noun="solusi" /> : null}
    </div>
  );
}
