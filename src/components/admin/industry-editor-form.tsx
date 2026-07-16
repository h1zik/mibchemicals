import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminMarkdownEditor } from "@/components/admin-markdown-editor";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { ContentImageUpload } from "@/components/admin/content-image-upload";
import { deleteIndustryForm, upsertIndustry } from "@/actions/admin";
import {
  adminDangerZoneButton,
  adminGhostLink,
  adminInput,
  adminLabel,
  adminMutedLink,
  adminPrimaryBtn,
} from "@/lib/admin-ui";
import type { Industry } from "@/types/database";

const ICON_OPTIONS = [
  ["flask", "Flask"],
  ["droplet", "Droplet"],
  ["support", "Support"],
  ["oil-gas", "Oil & gas"],
  ["manufacturing", "Manufacturing"],
  ["mining", "Mining"],
  ["water", "Water"],
  ["household", "Household"],
  ["autocare", "Autocare"],
] as const;

type Props = { industry?: Industry | null };

export function IndustryEditorForm({ industry }: Props) {
  const isEdit = Boolean(industry);
  const s = industry ?? undefined;
  const publicPath = s?.slug ? `/industries/${s.slug}` : null;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/industries" className={`${adminMutedLink} inline-flex items-center gap-1.5`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke daftar industri
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {isEdit ? "Edit industri" : "Industri baru"}
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
            Halaman /industries/[slug] menampilkan foto, konteks masalah, dan tabel Masalah–Solusi dari solusi yang
            bertaut ke industri ini. Simpan dulu untuk mengunggah foto.
          </p>
        )}
      </div>

      <AdminSaveForm action={upsertIndustry} className="space-y-8" successMessage="Industri berhasil disimpan.">
        {isEdit && s ? <input type="hidden" name="id" value={s.id} /> : null}

        <AdminFormSection
          title="Konten"
          description="Nama sektor, ringkasan kartu, dan konteks masalah industri (tampil di atas tabel Masalah–Solusi)."
        >
          <div>
            <label htmlFor="ind-name" className={adminLabel}>Nama industri</label>
            <input id="ind-name" name="name" required defaultValue={s?.name} className={adminInput} placeholder="Contoh: Baja" />
          </div>
          <div>
            <label htmlFor="ind-slug" className={adminLabel}>Slug {isEdit ? "" : "(opsional)"}</label>
            <input
              id="ind-slug"
              name="slug"
              required={isEdit}
              defaultValue={s?.slug}
              className={`${adminInput} font-mono text-sm`}
              placeholder="baja"
            />
            <p className="mt-1.5 text-xs text-neutral-500">Kosongkan untuk dibuat otomatis dari nama.</p>
          </div>
          <div>
            <label htmlFor="ind-summary" className={adminLabel}>Ringkasan</label>
            <textarea id="ind-summary" name="summary" rows={2} defaultValue={s?.summary} className={adminInput} placeholder="Tampil di kartu industri." />
          </div>
          <div className="!mt-6 border-t border-neutral-100 pt-6">
            <AdminMarkdownEditor
              label="Konteks masalah industri (Markdown)"
              name="intro_md"
              defaultValue={s?.intro_md ?? ""}
              height={340}
              helpText="Paragraf pengantar/masalah di halaman industri, di atas tabel Masalah–Solusi."
            />
          </div>
        </AdminFormSection>

        {isEdit && s ? (
          <AdminFormSection title="Foto" description="Foto hero industri dan ilustrasi proses (opsional).">
            <ContentImageUpload
              entity="industry"
              field="hero_image_url"
              id={s.id}
              currentUrl={s.hero_image_url}
              label="Foto hero industri"
              hint="Foto lebar untuk header halaman industri. JPG/PNG/WebP — maks. 6 MB."
            />
            <ContentImageUpload
              entity="industry"
              field="process_image_url"
              id={s.id}
              currentUrl={s.process_image_url}
              label="Ilustrasi proses"
              hint="Diagram/foto proses industri (opsional)."
            />
          </AdminFormSection>
        ) : null}

        <AdminFormSection title="Ikon & urutan" description="Ikon dipakai kartu; urutan menentukan posisi.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ind-icon" className={adminLabel}>Ikon</label>
              <select id="ind-icon" name="icon_key" defaultValue={s?.icon_key ?? "flask"} className={adminInput}>
                {ICON_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ind-sort" className={adminLabel}>Urutan</label>
              <input id="ind-sort" name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} className={adminInput} />
            </div>
          </div>
        </AdminFormSection>

        <AdminFormSection title="Publikasi" description="Industri draft tidak tampil di situs publik.">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input type="checkbox" name="published" defaultChecked={s?.published ?? true} className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-neutral-600">Tampilkan halaman industri di situs publik.</span>
            </span>
          </label>
        </AdminFormSection>

        <AdminFormSection title="SEO" description="Kosongkan untuk fallback dari nama industri.">
          <div>
            <label htmlFor="ind-seo-title" className={adminLabel}>SEO title</label>
            <input id="ind-seo-title" name="seo_title" defaultValue={s?.seo_title ?? ""} placeholder="Biarkan kosong untuk memakai nama" className={adminInput} />
          </div>
          <div>
            <label htmlFor="ind-seo-desc" className={adminLabel}>SEO description</label>
            <textarea id="ind-seo-desc" name="seo_description" rows={3} defaultValue={s?.seo_description ?? ""} className={adminInput} />
          </div>
        </AdminFormSection>

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/industries" className={`${adminGhostLink} py-2 sm:py-0`}>Batal</Link>
          <button type="submit" className={`${adminPrimaryBtn} w-full justify-center sm:w-auto`}>
            {isEdit ? "Simpan perubahan" : "Simpan & lanjut unggah foto"}
          </button>
        </div>
      </AdminSaveForm>

      {isEdit && s ? (
        <aside className="mt-8 rounded-2xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-red-900">Zona bahaya</h2>
          <p className="mt-1 text-sm text-red-800/90">
            Menghapus industri tidak dapat dibatalkan. Solusi yang bertaut akan kehilangan relasi industri.
          </p>
          <form action={deleteIndustryForm} className="mt-4">
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className={adminDangerZoneButton}>Hapus industri</button>
          </form>
        </aside>
      ) : null}
    </div>
  );
}
