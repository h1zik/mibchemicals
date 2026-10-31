import Link from "next/link";
import { Factory, Plus } from "lucide-react";
import { deleteIndustryForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEntityList, AdminEntityRow } from "@/components/admin/admin-entity-list";
import { adminPrimaryBtn } from "@/lib/admin-ui";

export default async function AdminIndustriesPage() {
  const supabase = createSupabaseServerClient();
  const { data: industries } = await supabase
    .from("industries")
    .select("id, name, slug, published, hero_image_url, sort_order")
    .order("sort_order", { ascending: true });

  const list = industries ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Industri"
        description="Sektor industri yang dilayani. Setiap industri punya halaman sendiri dengan tabel Masalah–Solusi."
        actions={
          <Link href="/admin/industries/new" className={adminPrimaryBtn}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah industri
          </Link>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          icon={Factory}
          title="Belum ada industri"
          description="Tambahkan industri pertama agar tampil di /industries dan bisa ditautkan ke solusi."
          action={{ href: "/admin/industries/new", label: "Tambah industri" }}
        />
      ) : (
        <AdminEntityList count={list.length} noun="industri">
          {list.map((s) => (
            <AdminEntityRow
              key={s.id}
              id={s.id}
              title={s.name}
              editHref={`/admin/industries/${s.id}/edit`}
              publicPath={`/industries/${s.slug}`}
              published={Boolean(s.published)}
              imageUrl={s.hero_image_url ?? null}
              meta={<span className="font-mono">/industries/{s.slug}</span>}
              deleteAction={deleteIndustryForm}
            />
          ))}
        </AdminEntityList>
      )}
    </div>
  );
}
