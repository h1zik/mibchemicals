import { AdminMarkdownEditor } from "@/components/admin-markdown-editor";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminDangerZone } from "@/components/admin/admin-danger-zone";
import { AdminEditorHeader } from "@/components/admin/admin-editor-header";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { deleteServiceForm, upsertService } from "@/actions/admin";
import {
  adminInput,
  adminLabel,
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
      <AdminEditorHeader
        backHref="/admin/services"
        backLabel="Daftar layanan"
        title={isEdit ? "Edit layanan" : "Layanan baru"}
        published={s?.published}
        publicPath={s?.published ? publicPath : null}
        description={isEdit ? undefined : "Halaman layanan di situs memakai ikon, ringkasan, dan isi Markdown. Slug opsional saat baru."}
      />

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
            <p className="mt-1.5 text-xs text-admin-muted">
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
          <div className="!mt-6 border-t border-admin-line pt-6">
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
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-admin-line bg-admin-canvas/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input
              type="checkbox"
              name="published"
              defaultChecked={s?.published ?? true}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-admin-ink">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-admin-muted">
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

        <AdminFormActions cancelHref="/admin/services" submitLabel={isEdit ? "Simpan perubahan" : "Simpan layanan"} />
      </AdminSaveForm>

      {isEdit && s ? <AdminDangerZone action={deleteServiceForm} id={s.id} noun="layanan" /> : null}
    </div>
  );
}
