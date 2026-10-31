import Link from "next/link";
import { BookMarked, Plus } from "lucide-react";
import { deletePostCategoryForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEntityList, AdminEntityRow } from "@/components/admin/admin-entity-list";
import { adminPrimaryBtn } from "@/lib/admin-ui";

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
            <Plus className="h-4 w-4" aria-hidden />
            Tambah kategori
          </Link>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          icon={BookMarked}
          title="Belum ada kategori"
          description="Buat kategori sebelum menulis artikel."
          action={{ href: "/admin/post-categories/new", label: "Tambah kategori" }}
        />
      ) : (
        <AdminEntityList count={list.length} noun="kategori">
          {list.map((row) => (
            <AdminEntityRow
              key={row.id}
              id={row.id}
              title={row.name}
              editHref={`/admin/post-categories/${row.id}/edit`}
              meta={
                <>
                  <span className="font-mono">{row.slug}</span>, urutan {row.sort_order}
                </>
              }
              deleteAction={deletePostCategoryForm}
            />
          ))}
        </AdminEntityList>
      )}
    </div>
  );
}
