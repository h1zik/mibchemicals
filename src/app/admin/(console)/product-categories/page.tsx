import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { deleteProductCategoryForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEntityList, AdminEntityRow } from "@/components/admin/admin-entity-list";
import { adminPrimaryBtn } from "@/lib/admin-ui";

export default async function AdminProductCategoriesPage() {
  const supabase = createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true });

  const list = categories ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Kategori produk"
        description="Label kategori untuk katalog. Produk memilih salah satu kategori lewat dropdown di formulir edit."
        actions={
          <Link href="/admin/product-categories/new" className={adminPrimaryBtn}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah kategori
          </Link>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          icon={Tags}
          title="Belum ada kategori"
          description="Buat kategori sebelum menambah produk."
          action={{ href: "/admin/product-categories/new", label: "Tambah kategori" }}
        />
      ) : (
        <AdminEntityList count={list.length} noun="kategori">
          {list.map((row) => (
            <AdminEntityRow
              key={row.id}
              id={row.id}
              title={row.name}
              editHref={`/admin/product-categories/${row.id}/edit`}
              meta={
                <>
                  <span className="font-mono">{row.slug}</span>, urutan {row.sort_order}
                </>
              }
              deleteAction={deleteProductCategoryForm}
            />
          ))}
        </AdminEntityList>
      )}
    </div>
  );
}
