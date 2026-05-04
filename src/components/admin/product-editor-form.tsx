import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminMarkdownEditor } from "@/components/admin-markdown-editor";
import { AdminProductGallery } from "@/components/admin-product-gallery";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { deleteProductForm, uploadProductMsds, upsertProduct } from "@/actions/admin";
import {
  adminCard,
  adminDangerZoneButton,
  adminGhostLink,
  adminInput,
  adminLabel,
  adminMutedLink,
  adminPrimaryBtn,
} from "@/lib/admin-ui";
import type { Product } from "@/types/database";

const DEFAULT_SPECS = '{\n  "appearance": "",\n  "pH": ""\n}';

type Props = {
  product?: Product | null;
};

export function ProductEditorForm({ product }: Props) {
  const isEdit = Boolean(product);
  const p = product ?? undefined;
  const publicPath = p?.slug ? `/products/${p.slug}` : null;
  const specsStr = JSON.stringify(p?.specs_json ?? {}, null, 2);
  const galleryStr = JSON.stringify(p?.gallery_images ?? [], null, 2);

  const outlineBtn =
    "inline-flex items-center justify-center rounded-lg border-2 border-mib bg-white px-4 py-2 text-sm font-semibold text-mib shadow-sm transition hover:bg-mib/5";

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/products" className={`${adminMutedLink} inline-flex items-center gap-1.5`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke daftar produk
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {isEdit ? "Edit produk" : "Produk baru"}
        </h1>
        {isEdit && p ? (
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
            Nama, kategori, deskripsi Markdown, spesifikasi JSON, dan galeri. Slug opsional saat baru.
          </p>
        )}
      </div>

      <AdminSaveForm action={upsertProduct} className="space-y-8" successMessage="Produk berhasil disimpan.">
        {isEdit && p ? <input type="hidden" name="id" value={p.id} /> : null}

        <AdminFormSection
          title="Konten"
          description="Informasi utama katalog: nama, URL slug, kategori, dan deskripsi produk di halaman detail."
        >
          <div>
            <label htmlFor="prd-name" className={adminLabel}>
              Nama
            </label>
            <input id="prd-name" name="name" required defaultValue={p?.name} className={adminInput} />
          </div>
          <div>
            <label htmlFor="prd-slug" className={adminLabel}>
              Slug {isEdit ? "" : "(opsional)"}
            </label>
            <input
              id="prd-slug"
              name="slug"
              required={isEdit}
              defaultValue={p?.slug}
              className={`${adminInput} font-mono text-sm`}
              placeholder="nama-produk"
            />
            <p className="mt-1.5 text-xs text-neutral-500">URL publik: /products/[slug]. Kosongkan untuk dibuat dari nama.</p>
          </div>
          <div>
            <label htmlFor="prd-cat" className={adminLabel}>
              Kategori
            </label>
            <input
              id="prd-cat"
              name="category"
              required
              defaultValue={p?.category}
              className={adminInput}
              placeholder="Contoh: Solvent"
            />
          </div>
          <div className="!mt-6 border-t border-neutral-100 pt-6">
            <AdminMarkdownEditor
              label="Deskripsi (Markdown)"
              name="description_md"
              defaultValue={p?.description_md ?? ""}
              height={400}
              helpText="Teks deskripsi produk. Gunakan toolbar untuk format; disimpan sebagai Markdown."
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Data teknis & galeri"
          description="Spesifikasi sebagai object JSON. Galeri juga bisa diatur lewat unggah di bawah (mode edit) atau menyunting array JSON."
        >
          <div>
            <label htmlFor="prd-specs" className={adminLabel}>
              Spesifikasi (JSON object)
            </label>
            <textarea
              id="prd-specs"
              name="specs_json"
              rows={6}
              defaultValue={isEdit ? specsStr : DEFAULT_SPECS}
              className={`${adminInput} font-mono text-xs leading-relaxed`}
            />
            <p className="mt-1.5 text-xs text-neutral-500">Pasangan key/string, mis. appearance, pH, packaging.</p>
          </div>
          <div>
            <label htmlFor="prd-gallery-json" className={adminLabel}>
              Galeri (JSON array)
            </label>
            <textarea
              id="prd-gallery-json"
              name="gallery_images_json"
              rows={isEdit ? 6 : 4}
              defaultValue={galleryStr}
              className={`${adminInput} font-mono text-xs leading-relaxed`}
              placeholder="[]"
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Array objek dengan path (bucket product-gallery) atau url absolut, opsional alt. Sinkron dengan
              unggah galeri bila tersedia.
            </p>
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Urutan & tampilan"
          description="Urutan di katalog, sorotan featured, dan status tayang."
        >
          <div className="max-w-xs">
            <label htmlFor="prd-sort" className={adminLabel}>
              Urutan
            </label>
            <input
              id="prd-sort"
              name="sort_order"
              type="number"
              defaultValue={p?.sort_order ?? 0}
              className={adminInput}
            />
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={p?.featured}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">Featured</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-neutral-600">
                Tampilkan produk sebagai sorotan di blok katalog (jika didukung tema).
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input
              type="checkbox"
              name="published"
              defaultChecked={p?.published ?? true}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-neutral-600">
                Produk tampil di situs publik dan halaman katalog.
              </span>
            </span>
          </label>
        </AdminFormSection>

        <AdminFormSection
          title="SEO"
          description="Meta khusus halaman produk; kosongkan untuk fallback dari nama."
        >
          <div>
            <label htmlFor="prd-seo-title" className={adminLabel}>
              SEO title
            </label>
            <input
              id="prd-seo-title"
              name="seo_title"
              defaultValue={p?.seo_title ?? ""}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="prd-seo-desc" className={adminLabel}>
              SEO description
            </label>
            <textarea
              id="prd-seo-desc"
              name="seo_description"
              rows={3}
              defaultValue={p?.seo_description ?? ""}
              className={adminInput}
            />
          </div>
        </AdminFormSection>

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/products" className={`${adminGhostLink} py-2 sm:py-0`}>
            Batal
          </Link>
          <button type="submit" className={`${adminPrimaryBtn} w-full justify-center sm:w-auto`}>
            {isEdit ? "Simpan perubahan" : "Simpan produk"}
          </button>
        </div>
      </AdminSaveForm>

      {isEdit && p ? (
        <>
          <section className="mt-10 space-y-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">Galeri gambar</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                Unggah ke bucket <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-mib">product-gallery</code>
                . Anda juga bisa menyunting array JSON di bagian{" "}
                <span className="font-semibold text-neutral-800">Data teknis & galeri</span>{" "}
                di atas.
              </p>
            </div>
            <div className={adminCard}>
              <AdminProductGallery productId={p.id} images={p.gallery_images ?? []} />
            </div>
          </section>

          <section className="mt-10 space-y-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">MSDS</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                Unggah PDF ke bucket Supabase <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-mib">msds</code>
                . File dapat diunduh dari halaman produk.
              </p>
            </div>
            <div className={adminCard}>
              {p.msds_original_filename ? (
                <p className="text-sm text-neutral-700">
                  File saat ini: <span className="font-semibold">{p.msds_original_filename}</span>
                </p>
              ) : (
                <p className="text-sm text-neutral-500">Belum ada file MSDS.</p>
              )}
              <AdminSaveForm
                action={uploadProductMsds}
                className="mt-4 flex flex-wrap items-end gap-4 border-t border-neutral-100 pt-4"
                successMessage="MSDS berhasil diunggah."
              >
                <input type="hidden" name="product_id" value={p.id} />
                <div>
                  <label htmlFor="msds-file" className={adminLabel}>
                    File PDF
                  </label>
                  <input
                    id="msds-file"
                    type="file"
                    name="file"
                    required
                    accept="application/pdf,.pdf"
                    className="mt-1 block w-full max-w-xs text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-mib/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-mib hover:file:bg-mib/15"
                  />
                </div>
                <button type="submit" className={outlineBtn}>
                  Upload / ganti MSDS
                </button>
              </AdminSaveForm>
            </div>
          </section>

          <aside className="mt-10 rounded-2xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
            <h2 className="text-sm font-bold text-red-900">Zona bahaya</h2>
            <p className="mt-1 text-sm text-red-800/90">
              Menghapus produk tidak dapat dibatalkan. Tautan /products/{p.slug} dan berkas terkait perlu dibersihkan
              manual di storage bila perlu.
            </p>
            <form action={deleteProductForm} className="mt-4">
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className={adminDangerZoneButton}>
                Hapus produk
              </button>
            </form>
          </aside>
        </>
      ) : null}
    </div>
  );
}
