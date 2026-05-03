import Link from "next/link";
import { deletePostForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminPrimaryBtn, adminMutedLink, adminDangerLink } from "@/lib/admin-ui";

export default async function AdminPostsPage() {
  const supabase = createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  const list = posts ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Artikel"
        description="Berita, studi kasus, dan konten editorial. Editor mendukung Markdown dengan pratinjau."
        actions={
          <Link href="/admin/posts/new" className={adminPrimaryBtn}>
            Tulis artikel
          </Link>
        }
      />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-neutral-700">Belum ada artikel</p>
          <p className="mt-1 text-sm text-neutral-500">Publikasikan konten pertama di /articles.</p>
          <Link href="/admin/posts/new" className={`${adminPrimaryBtn} mt-6 inline-flex`}>
            Tulis artikel
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
          {list.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-4 p-4 transition hover:bg-neutral-50/80 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-neutral-900">{p.title}</p>
                  <AdminStatusBadge published={Boolean(p.published)} />
                  <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-800 ring-1 ring-inset ring-violet-600/15">
                    {p.post_type}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-neutral-500">/articles/{p.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 border-t border-neutral-100 pt-3 sm:border-t-0 sm:pt-0">
                <Link href={`/admin/posts/${p.id}/edit`} className={adminMutedLink}>
                  Edit
                </Link>
                <form action={deletePostForm}>
                  <input type="hidden" name="id" value={p.id} />
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
