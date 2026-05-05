import Link from "next/link";
import { deleteProductForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminPrimaryBtn, adminMutedLink, adminDangerLink } from "@/lib/admin-ui";

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
            Tambah produk
          </Link>
        }
      />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-neutral-700">Belum ada produk</p>
          <p className="mt-1 text-sm text-neutral-500">Tambahkan produk untuk halaman katalog.</p>
          <Link href="/admin/products/new" className={`${adminPrimaryBtn} mt-6 inline-flex`}>
            Tambah produk
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
          {list.map((p) => {
            const categoryName =
              (p as { product_categories?: { name?: string | null } | null }).product_categories?.name
                ?.trim() || null;
            return (
            <li
              key={p.id}
              className="flex flex-col gap-4 p-4 transition hover:bg-neutral-50/80 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-neutral-900">{p.name}</p>
                  {categoryName ? (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                      {categoryName}
                    </span>
                  ) : null}
                  <AdminStatusBadge published={Boolean(p.published)} />
                  {p.msds_bucket_path ? (
                    <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800 ring-1 ring-inset ring-sky-600/15">
                      MSDS
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-mono text-xs text-neutral-500">/products/{p.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 border-t border-neutral-100 pt-3 sm:border-t-0 sm:pt-0">
                <Link href={`/admin/products/${p.id}/edit`} className={adminMutedLink}>
                  Edit
                </Link>
                <form action={deleteProductForm}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className={adminDangerLink}>
                    Hapus
                  </button>
                </form>
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
