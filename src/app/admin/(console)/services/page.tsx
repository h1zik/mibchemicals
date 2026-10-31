import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import { deleteServiceForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEntityList, AdminEntityRow } from "@/components/admin/admin-entity-list";
import { adminPrimaryBtn } from "@/lib/admin-ui";

export default async function AdminServicesPage() {
  const supabase = createSupabaseServerClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  const list = services ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Layanan"
        description="Halaman layanan yang muncul di situs publik. Urutan diatur lewat kolom urutan di formulir edit."
        actions={
          <Link href="/admin/services/new" className={adminPrimaryBtn}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah layanan
          </Link>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          icon={Briefcase}
          title="Belum ada layanan"
          description="Tambahkan layanan pertama agar tampil di /services."
          action={{ href: "/admin/services/new", label: "Tambah layanan" }}
        />
      ) : (
        <AdminEntityList count={list.length} noun="layanan">
          {list.map((s) => (
            <AdminEntityRow
              key={s.id}
              id={s.id}
              title={s.title}
              editHref={`/admin/services/${s.id}/edit`}
              publicPath={`/services/${s.slug}`}
              published={Boolean(s.published)}
              meta={<span className="font-mono">/services/{s.slug}</span>}
              deleteAction={deleteServiceForm}
            />
          ))}
        </AdminEntityList>
      )}
    </div>
  );
}
