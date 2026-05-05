import Link from "next/link";
import { deletePostCategoryForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminPrimaryBtn, adminMutedLink, adminDangerLink } from "@/lib/admin-ui";

export default async function AdminPostCategoriesPage() {
  const supabase = createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("post_categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true });

  const list = categories ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Kategori artikel"
        description="Label kategori untuk artikel. Setiap artikel memilih satu kategori; artikel serupa memakai kategori yang sama."
        actions={
          <Link href="/admin/post-categories/new" className={adminPrimaryBtn}>
            Tambah kategori
          </Link>
        }
      />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-neutral-700">Belum ada kategori</p>
          <p className="mt-1 text-sm text-neutral-500">Buat kategori sebelum menambah artikel.</p>
          <Link href="/admin/post-categories/new" className={`${adminPrimaryBtn} mt-6 inline-flex`}>
            Tambah kategori
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
          {list.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-4 p-4 transition hover:bg-neutral-50/80 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900">{row.name}</p>
                <p className="mt-1 font-mono text-xs text-neutral-500">slug: {row.slug}</p>
                <p className="mt-0.5 text-xs text-neutral-400">Urutan: {row.sort_order}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 border-t border-neutral-100 pt-3 sm:border-t-0 sm:pt-0">
                <Link href={`/admin/post-categories/${row.id}/edit`} className={adminMutedLink}>
                  Edit
                </Link>
                <form action={deletePostCategoryForm}>
                  <input type="hidden" name="id" value={row.id} />
                  <button type="submit" className={adminDangerLink}>
                    Hapus
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
