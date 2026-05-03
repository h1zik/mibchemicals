import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/database";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Inbox } from "lucide-react";

export default async function AdminLeadsPage() {
  const supabase = createSupabaseServerClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (leads as Lead[] | null) ?? [];
  const empty = rows.length === 0;

  return (
    <div>
      <AdminPageHeader
        title="Leads"
        description="Permintaan dari formulir kontak situs. Data dibaca lewat kebijakan RLS khusus admin."
      />

      {empty ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <Inbox className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-4 text-sm font-medium text-neutral-700">Belum ada lead</p>
          <p className="mt-1 max-w-sm text-sm text-neutral-500">
            Saat pengunjung mengirim formulir kontak, entri akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/90">
                  <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Tanggal
                  </th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Nama
                  </th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Perusahaan
                  </th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Email
                  </th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Sektor
                  </th>
                  <th className="min-w-[12rem] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Pesan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((l) => (
                  <tr key={l.id} className="transition hover:bg-neutral-50/80">
                    <td className="whitespace-nowrap px-4 py-3.5 text-neutral-600 tabular-nums">
                      {new Date(l.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-neutral-900">{l.name}</td>
                    <td className="px-4 py-3.5 text-neutral-700">{l.company}</td>
                    <td className="px-4 py-3.5">
                      <a
                        className="font-medium text-mib underline-offset-2 hover:underline"
                        href={`mailto:${l.email}`}
                      >
                        {l.email}
                      </a>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600">{l.industry ?? "—"}</td>
                    <td className="max-w-xs px-4 py-3.5 text-neutral-600" title={l.message ?? undefined}>
                      <span className="line-clamp-2">{l.message || "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
