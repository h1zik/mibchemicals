import {
  createSiteConfigRow,
  updateSiteConfigBranding,
  updateSiteConfigCompany,
  updateSiteConfigHero,
  updateSiteConfigSeo,
  updateSiteConfigSolutions,
} from "@/actions/admin";
import { AdminBrandingUploads } from "@/components/admin-branding-uploads";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSettingsFormFooter } from "@/components/admin/admin-settings-form-footer";
import { AdminSettingsSection } from "@/components/admin/admin-settings-section";
import { IndustriesSectionEditor } from "@/components/admin/industries-section-editor";
import { FALLBACK_SITE_CONFIG } from "@/lib/constants";
import { getSiteConfig } from "@/lib/data/queries";
import { adminControl, adminInput, adminLabel, adminPrimaryBtn } from "@/lib/admin-ui";

export default async function AdminSettingsPage() {
  const dbConfig = await getSiteConfig();
  const cfg = dbConfig ?? FALLBACK_SITE_CONFIG;
  const hasDbRow = Boolean(dbConfig);

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Pengaturan situs"
        description="Setiap bagian punya simpan sendiri (update) dan reset ke template (hapus kustomisasi bagian itu). Industri: tambah/hapus baris lalu simpan."
      />

      {!hasDbRow ? (
        <div className="mb-10 rounded-2xl border border-amber-200/90 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-amber-950">Belum ada baris konfigurasi di database</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
            Tabel <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">site_config</code> belum berisi
            baris <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">singleton_key = main</code>, atau
            query gagal. Buat satu baris penuh dari template agar tombol simpan per bagian berfungsi.
          </p>
          <form action={createSiteConfigRow} className="mt-4">
            <button type="submit" className={adminPrimaryBtn}>
              Buat konfigurasi dari template
            </button>
          </form>
        </div>
      ) : null}

      {hasDbRow ? (
      <div className="space-y-10">
        <AdminSettingsSection
          title="SEO"
          description="Nilai default meta untuk halaman yang tidak menimpa title/description sendiri."
        >
          <form id="settings-seo" action={updateSiteConfigSeo} className="space-y-4">
            <div>
              <label className={adminLabel}>Meta title default</label>
              <input name="meta_title_default" defaultValue={cfg.meta_title_default} className={adminInput} />
            </div>
            <div>
              <label className={adminLabel}>Meta description default</label>
              <textarea
                name="meta_description_default"
                rows={3}
                defaultValue={cfg.meta_description_default}
                className={adminInput}
              />
            </div>
            <div>
              <label className={adminLabel}>Keywords (koma)</label>
              <textarea name="site_keywords" rows={2} defaultValue={cfg.site_keywords} className={adminInput} />
            </div>
          </form>
          <AdminSettingsFormFooter formId="settings-seo" section="seo" />
        </AdminSettingsSection>

        <AdminSettingsSection
          title="Perusahaan & kontak"
          description="Identitas perusahaan dan kontak yang ditampilkan di footer, kontak, dan blok teks terkait."
        >
          <form id="settings-company" action={updateSiteConfigCompany} className="space-y-4">
            <div>
              <label className={adminLabel}>Nama perusahaan</label>
              <input name="company_name" defaultValue={cfg.company_name} className={adminInput} />
            </div>
            <div>
              <label className={adminLabel}>Tagline / purpose</label>
              <textarea name="company_tagline" rows={2} defaultValue={cfg.company_tagline} className={adminInput} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={adminLabel}>Email</label>
                <input
                  name="contact_email"
                  type="email"
                  defaultValue={cfg.contact_email}
                  className={adminInput}
                />
              </div>
              <div>
                <label className={adminLabel}>Telepon</label>
                <input name="contact_phone" defaultValue={cfg.contact_phone} className={adminInput} />
              </div>
            </div>
            <div>
              <label className={adminLabel}>Alamat</label>
              <textarea name="contact_address" rows={2} defaultValue={cfg.contact_address} className={adminInput} />
            </div>
          </form>
          <AdminSettingsFormFooter formId="settings-company" section="company" />
        </AdminSettingsSection>

        <AdminSettingsSection
          title="Logo & favicon"
          description="Logo di navbar dan ikon tab browser. Bisa isi URL manual atau unggah ke bucket site-assets."
        >
          <form id="settings-branding" action={updateSiteConfigBranding} className="space-y-4">
            <div>
              <label className={adminLabel}>URL logo navbar</label>
              <input
                name="nav_logo_url"
                type="url"
                defaultValue={cfg.nav_logo_url ?? ""}
                placeholder="https://…/logo.png"
                className={`${adminInput} font-mono text-sm`}
              />
              <p className="mt-1.5 text-xs text-neutral-500">Kosongkan untuk hanya menampilkan nama perusahaan sebagai teks.</p>
            </div>
            <div>
              <label className={adminLabel}>URL favicon</label>
              <input
                name="favicon_url"
                type="url"
                defaultValue={cfg.favicon_url ?? ""}
                placeholder="https://…/favicon.ico"
                className={`${adminInput} font-mono text-sm`}
              />
              <p className="mt-1.5 text-xs text-neutral-500">Harus URL absolut (https). Setelah simpan, hard refresh jika ikon tab tidak berubah.</p>
            </div>
          </form>
          <AdminBrandingUploads />
          <AdminSettingsFormFooter formId="settings-branding" section="branding" />
        </AdminSettingsSection>

        <AdminSettingsSection
          title="Hero"
          description="Judul besar beranda, subjudul, dan tombol ajakan utama / sekunder."
        >
          <form id="settings-hero" action={updateSiteConfigHero} className="space-y-4">
            <div>
              <label className={adminLabel}>Judul</label>
              <input name="hero_title" defaultValue={cfg.hero_title} className={adminInput} />
            </div>
            <div>
              <label className={adminLabel}>Subjudul</label>
              <textarea name="hero_subtitle" rows={2} defaultValue={cfg.hero_subtitle} className={adminInput} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={adminLabel}>CTA utama — label</label>
                <input
                  name="hero_primary_cta_label"
                  defaultValue={cfg.hero_primary_cta_label}
                  className={adminInput}
                />
              </div>
              <div>
                <label className={adminLabel}>CTA utama — URL</label>
                <input name="hero_primary_cta_url" defaultValue={cfg.hero_primary_cta_url} className={adminInput} />
              </div>
              <div>
                <label className={adminLabel}>CTA sekunder — label</label>
                <input
                  name="hero_secondary_cta_label"
                  defaultValue={cfg.hero_secondary_cta_label}
                  className={adminInput}
                />
              </div>
              <div>
                <label className={adminLabel}>CTA sekunder — URL</label>
                <input
                  name="hero_secondary_cta_url"
                  defaultValue={cfg.hero_secondary_cta_url}
                  className={adminInput}
                />
              </div>
            </div>
          </form>
          <AdminSettingsFormFooter formId="settings-hero" section="hero" />
        </AdminSettingsSection>

        <AdminSettingsSection
          title="Solusi (Problem → Inovasi → MIB)"
          description="Tiga blok narasi beranda. Judul singkat dan paragraf isi untuk masing-masing blok."
        >
          <form id="settings-solutions" action={updateSiteConfigSolutions} className="space-y-4">
            {(
              [
                [
                  "solution_problem_title",
                  "solution_problem_body",
                  cfg.solution_problem_title,
                  cfg.solution_problem_body,
                ],
                [
                  "solution_innovation_title",
                  "solution_innovation_body",
                  cfg.solution_innovation_title,
                  cfg.solution_innovation_body,
                ],
                ["solution_mib_title", "solution_mib_body", cfg.solution_mib_title, cfg.solution_mib_body],
              ] as const
            ).map(([tk, bk, tv, bv]) => (
              <div key={tk} className="grid gap-2 border-t border-neutral-100 pt-4 first:border-t-0 first:pt-0">
                <input name={tk} defaultValue={tv} className={`${adminControl} font-semibold`} />
                <textarea name={bk} rows={3} defaultValue={bv} className={adminControl} />
              </div>
            ))}
          </form>
          <AdminSettingsFormFooter formId="settings-solutions" section="solutions" />
        </AdminSettingsSection>

        <AdminSettingsSection
          title="Industri"
          description="Daftar sektor untuk halaman industri & ikon. CRUD baris di bawah; simpan mengirim JSON ke server."
        >
          <IndustriesSectionEditor initial={cfg.industries_json} />
        </AdminSettingsSection>
      </div>
      ) : null}
    </div>
  );
}
