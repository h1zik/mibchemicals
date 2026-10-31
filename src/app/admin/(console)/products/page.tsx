import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { deleteProductForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEntityList, AdminEntityRow, AdminTag } from "@/components/admin/admin-entity-list";
import { adminPrimaryBtn } from "@/lib/admin-ui";

export default async function AdminProductsPage() {
  const supabase = createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, published, sort_order, msds_bucket_path, product_categories ( name )")
    .order("sort_order", { ascending: true });

  const list = products ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Produk"
        description="Katalog kimia, galeri gambar, dan lampiran MSDS. Slug membangun URL publik /products/[slug]."
        actions={
          <Link href="/admin/products/new" className={adminPrimaryBtn}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah produk
          </Link>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          icon={Package}
          title="Belum ada produk"
          description="Tambahkan produk pertama untuk halaman katalog. Pastikan sudah ada minimal satu kategori produk."
          action={{ href: "/admin/products/new", label: "Tambah produk" }}
        />
      ) : (
        <AdminEntityList count={list.length} noun="produk">
          {list.map((p) => {
            const categoryName =
              (p as { product_categories?: { name?: string | null } | null }).product_categories?.name
                ?.trim() || null;
            return (
              <AdminEntityRow
                key={p.id}
                id={p.id}
                title={p.name}
                editHref={`/admin/products/${p.id}/edit`}
                publicPath={`/products/${p.slug}`}
                published={Boolean(p.published)}
                tags={
                  <>
                    {categoryName ? <AdminTag>{categoryName}</AdminTag> : null}
                    {p.msds_bucket_path ? <AdminTag tone="brand">MSDS</AdminTag> : null}
                  </>
                }
                meta={<span className="font-mono">/products/{p.slug}</span>}
                deleteAction={deleteProductForm}
              />
            );
          })}
        </AdminEntityList>
      )}
    </div>
  );
}
