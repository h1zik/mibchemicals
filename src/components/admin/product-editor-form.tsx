import Link from "next/link";
import { AdminMarkdownEditor } from "@/components/admin-markdown-editor";
import { AdminProductGallery } from "@/components/admin-product-gallery";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminDangerZone } from "@/components/admin/admin-danger-zone";
import { AdminEditorHeader } from "@/components/admin/admin-editor-header";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { deleteProductForm, uploadProductMsds, upsertProduct } from "@/actions/admin";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { adminInput, adminLabel, adminSecondaryBtn } from "@/lib/admin-ui";
import type { Product, ProductCategory } from "@/types/database";

const DEFAULT_SPECS = '{\n  "appearance": "",\n  "pH": ""\n}';

type Props = {
  product?: Product | null;
  categories: ProductCategory[];
};

export function ProductEditorForm({ product, categories }: Props) {
  const isEdit = Boolean(product);
  const p = product ?? undefined;
  const publicPath = p?.slug ? `/products/${p.slug}` : null;
  const specsStr = JSON.stringify(p?.specs_json ?? {}, null, 2);
  const galleryStr = JSON.stringify(p?.gallery_images ?? [], null, 2);


  return (
    <div className="max-w-4xl">
      <AdminEditorHeader
        backHref="/admin/products"
        backLabel="Daftar produk"
        title={isEdit ? "Edit produk" : "Produk baru"}
        published={p?.published}
        publicPath={p?.published ? publicPath : null}
        description={isEdit ? undefined : "Nama, kategori, deskripsi Markdown, spesifikasi JSON, dan galeri. Slug opsional saat baru."}
      />

      {categories.length === 0 ? (
        <div className="-mt-2 mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold">Belum ada kategori produk</p>
          <p className="mt-1 text-amber-900/90">
            Buat minimal satu kategori di{" "}
            <Link href="/admin/product-categories" className="font-semibold underline hover:no-underline">
              Kategori produk
            </Link>{" "}
            sebelum menyimpan produk.
          </p>
        </div>
      ) : null}

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
            <p className="mt-1.5 text-xs text-admin-muted">URL publik: /products/[slug]. Kosongkan untuk dibuat dari nama.</p>
          </div>
          <div>
            <label htmlFor="prd-cat" className={adminLabel}>
              Kategori
            </label>
            <select
              id="prd-cat"
              name="category_id"
              required
              defaultValue={p?.category_id ?? categories[0]?.id ?? ""}
              className={adminInput}
            >
              {categories.length === 0 ? (
                <option value="" disabled>
                  — Belum ada kategori —
                </option>
              ) : (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
            <p className="mt-1.5 text-xs text-admin-muted">
              Kelola daftar di{" "}
              <Link href="/admin/product-categories" className="font-semibold text-mib hover:underline">
                Kategori produk
              </Link>
              .
            </p>
          </div>
          <div className="!mt-6 border-t border-admin-line pt-6">
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
            <p className="mt-1.5 text-xs text-admin-muted">Pasangan key/string, mis. appearance, pH, packaging.</p>
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
            <p className="mt-1.5 text-xs text-admin-muted">
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
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-admin-line bg-admin-canvas/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={p?.featured}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-admin-ink">Featured</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-admin-muted">
                Tampilkan produk sebagai sorotan di blok katalog (jika didukung tema).
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-admin-line bg-admin-canvas/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input
              type="checkbox"
              name="published"
              defaultChecked={p?.published ?? true}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-admin-ink">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-admin-muted">
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

        <AdminFormActions cancelHref="/admin/products" submitLabel={isEdit ? "Simpan perubahan" : "Simpan produk"} />
      </AdminSaveForm>

      {isEdit && p ? (
        <>
          <div className="mt-8 space-y-8">
            <AdminFormSection
              title="Galeri gambar"
              description={
                <>
                  Unggah ke bucket <code className="rounded bg-admin-soft px-1 font-mono text-xs">product-gallery</code>.
                  Array JSON juga bisa disunting di bagian Data teknis & galeri di atas.
                </>
              }
            >
              <AdminProductGallery productId={p.id} images={p.gallery_images ?? []} />
            </AdminFormSection>

            <AdminFormSection
              title="MSDS"
              description={
                <>
                  PDF disimpan di bucket <code className="rounded bg-admin-soft px-1 font-mono text-xs">msds</code> dan bisa
                  diunduh dari halaman produk.
                </>
              }
            >
              {p.msds_original_filename ? (
                <p className="text-sm text-admin-ink">
                  File saat ini: <span className="font-semibold">{p.msds_original_filename}</span>
                </p>
              ) : (
                <p className="text-sm text-admin-muted">Belum ada file MSDS.</p>
              )}
              <AdminSaveForm
                action={uploadProductMsds}
                className="flex flex-wrap items-end gap-4 border-t border-admin-line pt-4"
                successMessage="MSDS diunggah."
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
                    className="mt-1.5 block w-full max-w-xs text-sm text-admin-muted file:mr-3 file:rounded-lg file:border-0 file:bg-mib/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-mib-dark hover:file:bg-mib/15"
                  />
                </div>
                <AdminSubmitButton className={adminSecondaryBtn} pendingLabel="Mengunggah…">
                  Unggah MSDS
                </AdminSubmitButton>
              </AdminSaveForm>
            </AdminFormSection>
          </div>

          <AdminDangerZone action={deleteProductForm} id={p.id} noun="produk" note="Menghapus produk tidak dapat dibatalkan. Berkas galeri & MSDS di storage perlu dibersihkan manual bila perlu." />
        </>
      ) : null}
    </div>
  );
}
