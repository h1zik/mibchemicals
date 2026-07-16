import Link from "next/link";
import { deleteIndustryForm } from "@/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminPrimaryBtn, adminMutedLink, adminDangerLink } from "@/lib/admin-ui";

export default async function AdminIndustriesPage() {
  const supabase = createSupabaseServerClient();
  const { data: industries } = await supabase
    .from("industries")
    .select("*")
    .order("sort_order", { ascending: true });

  const list = industries ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Industri"
        description="Sektor industri yang dilayani. Setiap industri punya halaman sendiri dengan tabel Masalah–Solusi."
        actions={
          <Link href="/admin/industries/new" className={adminPrimaryBtn}>
            Tambah industri
          </Link>
        }
      />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-neutral-700">Belum ada industri</p>
          <p className="mt-1 text-sm text-neutral-500">Buat entri pertama untuk ditampilkan di situs.</p>
          <Link href="/admin/industries/new" className={`${adminPrimaryBtn} mt-6 inline-flex`}>
            Tambah industri
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
          {list.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-4 p-4 transition hover:bg-neutral-50/80 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-neutral-900">{s.name}</p>
                  <AdminStatusBadge published={Boolean(s.published)} />
                </div>
                <p className="mt-1 font-mono text-xs text-neutral-500">/industries/{s.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 border-t border-neutral-100 pt-3 sm:border-t-0 sm:pt-0">
                <Link href={`/admin/industries/${s.id}/edit`} className={adminMutedLink}>
                  Edit
                </Link>
                <form action={deleteIndustryForm}>
                  <input type="hidden" name="id" value={s.id} />
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
