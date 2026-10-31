import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminDangerZone } from "@/components/admin/admin-danger-zone";
import { AdminEditorHeader } from "@/components/admin/admin-editor-header";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { deletePostCategoryForm, upsertPostCategory } from "@/actions/admin";
import {
  adminInput,
  adminLabel,
} from "@/lib/admin-ui";
import type { PostCategory } from "@/types/database";

type Props = {
  category?: PostCategory | null;
};

export function PostCategoryEditorForm({ category }: Props) {
  const isEdit = Boolean(category);
  const c = category ?? undefined;

  return (
    <div className="max-w-4xl">
      <AdminEditorHeader
        backHref="/admin/post-categories"
        backLabel="Kategori artikel"
        title={isEdit ? "Edit kategori" : "Kategori baru"}
        description={isEdit ? undefined : "Nama tampil di daftar artikel; slug unik. Kosongkan slug untuk dibuat dari nama."}
      />

      <AdminSaveForm
        action={upsertPostCategory}
        className="space-y-8"
        successMessage="Kategori berhasil disimpan."
      >
        {isEdit && c ? <input type="hidden" name="id" value={c.id} /> : null}

        <AdminFormSection
          title="Kategori"
          description="Urutan menentukan tampilan di dropdown saat mengedit artikel."
        >
          <div>
            <label htmlFor="poc-name" className={adminLabel}>
              Nama
            </label>
            <input id="poc-name" name="name" required defaultValue={c?.name} className={adminInput} />
          </div>
          <div>
            <label htmlFor="poc-slug" className={adminLabel}>
              Slug {isEdit ? "" : "(opsional)"}
            </label>
            <input
              id="poc-slug"
              name="slug"
              required={isEdit}
              defaultValue={c?.slug}
              className={`${adminInput} font-mono text-sm`}
              placeholder="berita"
            />
            <p className="mt-1.5 text-xs text-admin-muted">Huruf kecil, angka, dan tanda hubung; harus unik.</p>
          </div>
          <div className="max-w-xs">
            <label htmlFor="poc-sort" className={adminLabel}>
              Urutan
            </label>
            <input
              id="poc-sort"
              name="sort_order"
              type="number"
              defaultValue={c?.sort_order ?? 0}
              className={adminInput}
            />
          </div>
        </AdminFormSection>

        <AdminFormActions cancelHref="/admin/post-categories" submitLabel={isEdit ? "Simpan perubahan" : "Simpan kategori"} />
      </AdminSaveForm>

      {isEdit && c ? <AdminDangerZone action={deletePostCategoryForm} id={c.id} noun="kategori" /> : null}
    </div>
  );
}
