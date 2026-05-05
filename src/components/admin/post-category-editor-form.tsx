import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { deletePostCategoryForm, upsertPostCategory } from "@/actions/admin";
import {
  adminDangerZoneButton,
  adminGhostLink,
  adminInput,
  adminLabel,
  adminMutedLink,
  adminPrimaryBtn,
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
      <div className="mb-6">
        <Link href="/admin/post-categories" className={`${adminMutedLink} inline-flex items-center gap-1.5`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke kategori artikel
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {isEdit ? "Edit kategori" : "Kategori baru"}
        </h1>
        {!isEdit ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
            Nama tampil di daftar artikel; slug unik. Kosongkan slug untuk dibuat dari nama.
          </p>
        ) : null}
      </div>

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
            <p className="mt-1.5 text-xs text-neutral-500">Huruf kecil, angka, dan tanda hubung; harus unik.</p>
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

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/post-categories" className={`${adminGhostLink} py-2 sm:py-0`}>
            Batal
          </Link>
          <button type="submit" className={`${adminPrimaryBtn} w-full justify-center sm:w-auto`}>
            {isEdit ? "Simpan perubahan" : "Simpan kategori"}
          </button>
        </div>
      </AdminSaveForm>

      {isEdit && c ? (
        <aside className="mt-10 rounded-2xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-red-900">Zona bahaya</h2>
          <p className="mt-1 text-sm text-red-800/90">
            Hanya bisa dihapus jika tidak ada artikel yang memakai kategori ini.
          </p>
          <form action={deletePostCategoryForm} className="mt-4">
            <input type="hidden" name="id" value={c.id} />
            <button type="submit" className={adminDangerZoneButton}>
              Hapus kategori
            </button>
          </form>
        </aside>
      ) : null}
    </div>
  );
}
