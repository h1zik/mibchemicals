import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminDangerZone } from "@/components/admin/admin-danger-zone";
import { AdminEditorHeader } from "@/components/admin/admin-editor-header";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { deleteProductCategoryForm, upsertProductCategory } from "@/actions/admin";
import {
  adminInput,
  adminLabel,
} from "@/lib/admin-ui";
import type { ProductCategory } from "@/types/database";

type Props = {
  category?: ProductCategory | null;
};

export function ProductCategoryEditorForm({ category }: Props) {
  const isEdit = Boolean(category);
  const c = category ?? undefined;

  return (
    <div className="max-w-4xl">
      <AdminEditorHeader
        backHref="/admin/product-categories"
        backLabel="Kategori produk"
        title={isEdit ? "Edit kategori" : "Kategori baru"}
        description={isEdit ? undefined : "Nama tampil di kartu produk; slug untuk URL internal (unik). Kosongkan slug untuk dibuat dari nama."}
      />

      <AdminSaveForm
        action={upsertProductCategory}
        className="space-y-8"
        successMessage="Kategori berhasil disimpan."
      >
        {isEdit && c ? <input type="hidden" name="id" value={c.id} /> : null}

        <AdminFormSection
          title="Kategori"
          description="Urutan menentukan tampilan di dropdown saat mengedit produk."
        >
          <div>
            <label htmlFor="pc-name" className={adminLabel}>
              Nama
            </label>
            <input id="pc-name" name="name" required defaultValue={c?.name} className={adminInput} />
          </div>
          <div>
            <label htmlFor="pc-slug" className={adminLabel}>
              Slug {isEdit ? "" : "(opsional)"}
            </label>
            <input
              id="pc-slug"
              name="slug"
              required={isEdit}
              defaultValue={c?.slug}
              className={`${adminInput} font-mono text-sm`}
              placeholder="water-treatment"
            />
            <p className="mt-1.5 text-xs text-admin-muted">Huruf kecil, angka, dan tanda hubung; harus unik.</p>
          </div>
          <div className="max-w-xs">
            <label htmlFor="pc-sort" className={adminLabel}>
              Urutan
            </label>
            <input
              id="pc-sort"
              name="sort_order"
              type="number"
              defaultValue={c?.sort_order ?? 0}
              className={adminInput}
            />
          </div>
        </AdminFormSection>

        <AdminFormActions cancelHref="/admin/product-categories" submitLabel={isEdit ? "Simpan perubahan" : "Simpan kategori"} />
      </AdminSaveForm>

      {isEdit && c ? <AdminDangerZone action={deleteProductCategoryForm} id={c.id} noun="kategori" /> : null}
    </div>
  );
}
