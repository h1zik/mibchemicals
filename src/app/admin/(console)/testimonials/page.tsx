import Link from "next/link";
import { MessageSquareQuote, Plus } from "lucide-react";
import { deleteTestimonialForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEntityList, AdminEntityRow } from "@/components/admin/admin-entity-list";
import { adminPrimaryBtn } from "@/lib/admin-ui";

export default async function AdminTestimonialsPage() {
  const supabase = createSupabaseServerClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  const list = testimonials ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Testimoni"
        description="Kutipan pelanggan yang tampil di beranda."
        actions={
          <Link href="/admin/testimonials/new" className={adminPrimaryBtn}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah testimoni
          </Link>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          icon={MessageSquareQuote}
          title="Belum ada testimoni"
          description="Tambahkan kutipan pelanggan pertama untuk ditampilkan di beranda."
          action={{ href: "/admin/testimonials/new", label: "Tambah testimoni" }}
        />
      ) : (
        <AdminEntityList count={list.length} noun="testimoni">
          {list.map((s) => (
            <AdminEntityRow
              key={s.id}
              id={s.id}
              title={s.author_name}
              editHref={`/admin/testimonials/${s.id}/edit`}
              published={Boolean(s.published)}
              imageUrl={s.avatar_url ?? null}
              meta={<>&ldquo;{s.quote}&rdquo;</>}
              deleteAction={deleteTestimonialForm}
            />
          ))}
        </AdminEntityList>
      )}
    </div>
  );
}
