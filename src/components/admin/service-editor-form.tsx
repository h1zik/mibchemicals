import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminMarkdownEditor } from "@/components/admin-markdown-editor";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { deleteServiceForm, upsertService } from "@/actions/admin";
import {
  adminDangerZoneButton,
  adminGhostLink,
  adminInput,
  adminLabel,
  adminMutedLink,
  adminPrimaryBtn,
} from "@/lib/admin-ui";
import type { Service } from "@/types/database";

const adminSelect = adminInput;

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
  ["household-autocare", "Household & Autocare (legacy)"],
] as const;

type Props = {
  service?: Service | null;
};

export function ServiceEditorForm({ service }: Props) {
  const isEdit = Boolean(service);
  const s = service ?? undefined;
  const publicPath = s?.slug ? `/services/${s.slug}` : null;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/services" className={`${adminMutedLink} inline-flex items-center gap-1.5`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke daftar layanan
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {isEdit ? "Edit layanan" : "Layanan baru"}
        </h1>
        {isEdit && s ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {publicPath ? (
              <Link
                href={publicPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-mib"
              >
                Pratinjau publik
                <ExternalLink className="h-3 w-3" aria-hidden />
              </Link>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
            Halaman layanan di situs memakai ikon, ringkasan, dan isi Markdown. Slug opsional saat baru.
          </p>
        )}
      </div>

      <AdminSaveForm action={upsertService} className="space-y-8" successMessage="Layanan berhasil disimpan.">
        {isEdit && s ? <input type="hidden" name="id" value={s.id} /> : null}

        <AdminFormSection
          title="Konten"
          description="Judul, ringkasan di kartu layanan, dan isi halaman detail. Slug membentuk URL /services/[slug]."
        >
          <div>
            <label htmlFor="svc-title" className={adminLabel}>
              Judul
            </label>
            <input
              id="svc-title"
              name="title"
              required
              defaultValue={s?.title}
              className={adminInput}
              placeholder="Contoh: Treatment air industri"
            />
          </div>
          <div>
            <label htmlFor="svc-slug" className={adminLabel}>
              Slug {isEdit ? "" : "(opsional)"}
            </label>
            <input
              id="svc-slug"
              name="slug"
              required={isEdit}
              defaultValue={s?.slug}
              className={`${adminInput} font-mono text-sm`}
              placeholder="treatment-air"
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Huruf kecil, angka, tanda hubung. Kosongkan untuk dibuat otomatis dari judul.
            </p>
          </div>
          <div>
            <label htmlFor="svc-summary" className={adminLabel}>
              Ringkasan
            </label>
            <textarea
              id="svc-summary"
              name="summary"
              rows={3}
              defaultValue={s?.summary}
              className={adminInput}
              placeholder="Tampil di kartu & daftar layanan."
            />
          </div>
          <div className="!mt-6 border-t border-neutral-100 pt-6">
            <AdminMarkdownEditor
              label="Isi halaman (Markdown)"
              defaultValue={s?.body_md ?? ""}
              height={440}
              helpText="Isi utama halaman layanan. Gunakan toolbar untuk format; disimpan sebagai Markdown."
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Ikon & urutan"
          description="Ikon dipakai komponen publik; urutan menentukan posisi di daftar."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="svc-icon" className={adminLabel}>
                Ikon
              </label>
              <select id="svc-icon" name="icon_key" defaultValue={s?.icon_key ?? "flask"} className={adminSelect}>
                {ICON_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="svc-sort" className={adminLabel}>
                Urutan
              </label>
              <input
                id="svc-sort"
                name="sort_order"
                type="number"
                defaultValue={s?.sort_order ?? 0}
                className={adminInput}
              />
            </div>
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Publikasi"
          description="Layanan draft tidak tampil di navigasi publik hingga dicentang published."
        >
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input
              type="checkbox"
              name="published"
              defaultChecked={s?.published ?? true}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-neutral-600">
                Tampilkan halaman layanan di situs publik.
              </span>
            </span>
          </label>
        </AdminFormSection>

        <AdminFormSection
          title="SEO"
          description="Judul dan deskripsi khusus mesin pencari; kosongkan untuk fallback dari judul layanan."
        >
          <div>
            <label htmlFor="svc-seo-title" className={adminLabel}>
              SEO title
            </label>
            <input
              id="svc-seo-title"
              name="seo_title"
              defaultValue={s?.seo_title ?? ""}
              placeholder="Biarkan kosong untuk memakai judul"
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="svc-seo-desc" className={adminLabel}>
              SEO description
            </label>
            <textarea
              id="svc-seo-desc"
              name="seo_description"
              rows={3}
              defaultValue={s?.seo_description ?? ""}
              className={adminInput}
            />
          </div>
        </AdminFormSection>

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/services" className={`${adminGhostLink} py-2 sm:py-0`}>
            Batal
          </Link>
          <button type="submit" className={`${adminPrimaryBtn} w-full justify-center sm:w-auto`}>
            {isEdit ? "Simpan perubahan" : "Simpan layanan"}
          </button>
        </div>
      </AdminSaveForm>

      {isEdit && s ? (
        <aside className="mt-8 rounded-2xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-red-900">Zona bahaya</h2>
          <p className="mt-1 text-sm text-red-800/90">
            Menghapus layanan tidak dapat dibatalkan. Tautan /services/{s.slug} akan hilang.
          </p>
          <form action={deleteServiceForm} className="mt-4">
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className={adminDangerZoneButton}>
              Hapus layanan
            </button>
          </form>
        </aside>
      ) : null}
    </div>
  );
}
