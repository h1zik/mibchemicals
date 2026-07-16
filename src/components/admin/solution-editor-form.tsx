import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminMarkdownEditor } from "@/components/admin-markdown-editor";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { ContentImageUpload } from "@/components/admin/content-image-upload";
import { deleteSolutionForm, upsertSolution } from "@/actions/admin";
import {
  adminDangerZoneButton,
  adminGhostLink,
  adminInput,
  adminLabel,
  adminMutedLink,
  adminPrimaryBtn,
} from "@/lib/admin-ui";
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
      <div className="mb-6">
        <Link href="/admin/solutions" className={`${adminMutedLink} inline-flex items-center gap-1.5`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke daftar solusi
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {isEdit ? "Edit solusi" : "Solusi baru"}
        </h1>
        {isEdit && s && publicPath ? (
          <Link
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-mib"
          >
            Pratinjau publik
            <ExternalLink className="h-3 w-3" aria-hidden />
          </Link>
        ) : (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
            Solusi (problem → solution) tampil di /solutions dan sebagai baris tabel di halaman industri terkait.
            Simpan dulu untuk mengunggah foto.
          </p>
        )}
      </div>

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
          <div className="!mt-6 border-t border-neutral-100 pt-6">
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
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input type="checkbox" name="published" defaultChecked={s?.published ?? true} className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-neutral-600">Tampilkan solusi di situs publik.</span>
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

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/solutions" className={`${adminGhostLink} py-2 sm:py-0`}>Batal</Link>
          <button type="submit" className={`${adminPrimaryBtn} w-full justify-center sm:w-auto`}>
            {isEdit ? "Simpan perubahan" : "Simpan & lanjut unggah foto"}
          </button>
        </div>
      </AdminSaveForm>

      {isEdit && s ? (
        <aside className="mt-8 rounded-2xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-red-900">Zona bahaya</h2>
          <p className="mt-1 text-sm text-red-800/90">Menghapus solusi tidak dapat dibatalkan.</p>
          <form action={deleteSolutionForm} className="mt-4">
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className={adminDangerZoneButton}>Hapus solusi</button>
          </form>
        </aside>
      ) : null}
    </div>
  );
}
