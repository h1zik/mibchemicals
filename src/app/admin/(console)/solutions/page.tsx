import Link from "next/link";
import { Lightbulb, Plus } from "lucide-react";
import { deleteSolutionForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEntityList, AdminEntityRow, AdminTag } from "@/components/admin/admin-entity-list";
import { adminPrimaryBtn } from "@/lib/admin-ui";

export default async function AdminSolutionsPage() {
  const supabase = createSupabaseServerClient();
  const { data: solutions } = await supabase
    .from("solutions")
    .select("*, industries ( name )")
    .order("sort_order", { ascending: true });

  const list = solutions ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Solusi"
        description="Konten problem → solution per industri. Tampil di /solutions dan sebagai baris tabel di halaman industri."
        actions={
          <Link href="/admin/solutions/new" className={adminPrimaryBtn}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah solusi
          </Link>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          icon={Lightbulb}
          title="Belum ada solusi"
          description="Tambahkan solusi pertama agar tampil di /solutions dan di tabel halaman industri."
          action={{ href: "/admin/solutions/new", label: "Tambah solusi" }}
        />
      ) : (
        <AdminEntityList count={list.length} noun="solusi">
          {list.map((s) => {
            const industryName =
              s.industries && typeof s.industries === "object" && !Array.isArray(s.industries)
                ? (s.industries as { name?: string }).name
                : null;
            return (
              <AdminEntityRow
                key={s.id}
                id={s.id}
                title={s.title}
                editHref={`/admin/solutions/${s.id}/edit`}
                publicPath={`/solutions/${s.slug}`}
                published={Boolean(s.published)}
                imageUrl={s.image_url ?? null}
                tags={industryName ? <AdminTag tone="brand">{industryName}</AdminTag> : null}
                meta={
                  s.problem || s.solution_label ? (
                    `${s.problem || "—"} → ${s.solution_label || "—"}`
                  ) : (
                    <span className="font-mono">/solutions/{s.slug}</span>
                  )
                }
                deleteAction={deleteSolutionForm}
              />
            );
          })}
        </AdminEntityList>
      )}
    </div>
  );
}
