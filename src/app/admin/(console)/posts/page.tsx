import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { deletePostForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEntityList, AdminEntityRow, AdminTag } from "@/components/admin/admin-entity-list";
import { adminPrimaryBtn } from "@/lib/admin-ui";

const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default async function AdminPostsPage() {
  const supabase = createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, published, post_type, updated_at, cover_image_url, post_categories ( name )")
    .order("updated_at", { ascending: false });

  const list = posts ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Artikel"
        description="Berita, studi kasus, dan konten editorial. Editor mendukung Markdown dengan pratinjau."
        actions={
          <Link href="/admin/posts/new" className={adminPrimaryBtn}>
            <Plus className="h-4 w-4" aria-hidden />
            Tulis artikel
          </Link>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          icon={Newspaper}
          title="Belum ada artikel"
          description="Tulis artikel pertama agar tampil di /articles."
          action={{ href: "/admin/posts/new", label: "Tulis artikel" }}
        />
      ) : (
        <AdminEntityList count={list.length} noun="artikel, terakhir diubah paling atas">
          {list.map((p) => {
            const categoryName =
              (p as { post_categories?: { name?: string | null } | null }).post_categories?.name
                ?.trim() || null;
            return (
              <AdminEntityRow
                key={p.id}
                id={p.id}
                title={p.title}
                editHref={`/admin/posts/${p.id}/edit`}
                publicPath={`/articles/${p.slug}`}
                published={Boolean(p.published)}
                imageUrl={p.cover_image_url ?? null}
                tags={
                  <>
                    <AdminTag>{p.post_type === "case_study" ? "Studi kasus" : "Berita"}</AdminTag>
                    {categoryName ? <AdminTag>{categoryName}</AdminTag> : null}
                  </>
                }
                meta={`Diubah ${dateFmt.format(new Date(p.updated_at))}`}
                deleteAction={deletePostForm}
              />
            );
          })}
        </AdminEntityList>
      )}
    </div>
  );
}
