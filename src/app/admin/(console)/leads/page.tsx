import { ChevronDown, Inbox, Mail, MessageCircle, Phone } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/database";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatRelativeId, whatsappHref } from "@/lib/admin-format";

const LIMIT = 100;
const fullDate = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" });

const actionBtn =
  "inline-flex items-center gap-1.5 rounded-lg border border-admin-line bg-white px-3 py-2 text-sm font-medium text-admin-ink transition hover:border-mib/40 hover:text-mib-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib";

export default async function AdminLeadsPage() {
  const supabase = createSupabaseServerClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(LIMIT);

  const rows = (leads as Lead[] | null) ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Leads"
        description={
          rows.length === 0
            ? "Permintaan dari formulir kontak situs."
            : `${rows.length}${rows.length === LIMIT ? "+" : ""} permintaan dari formulir kontak, terbaru di atas. Klik baris untuk membaca pesan lengkap.`
        }
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          icon={Inbox}
          title="Belum ada lead"
          description="Saat pengunjung mengirim formulir kontak, permintaannya muncul di sini lengkap dengan pesan dan kontaknya."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-admin-line bg-white">
          <div className="hidden grid-cols-[8rem_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_1.25rem] gap-4 border-b border-admin-line bg-admin-soft/60 px-5 py-2.5 text-xs font-medium text-admin-muted md:grid">
            <span>Masuk</span>
            <span>Nama & perusahaan</span>
            <span>Email</span>
            <span>Sektor</span>
            <span className="sr-only">Buka</span>
          </div>
          <ul className="divide-y divide-admin-line">
            {rows.map((l) => {
              const wa = whatsappHref(l.phone);
              return (
                <li key={l.id}>
                  <details className="group">
                    <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_1.25rem] items-center gap-x-4 gap-y-1 px-5 py-3.5 transition-colors hover:bg-admin-canvas/60 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mib md:grid-cols-[8rem_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_1.25rem] [&::-webkit-details-marker]:hidden">
                      <time
                        dateTime={l.created_at}
                        title={fullDate.format(new Date(l.created_at))}
                        className="order-2 col-span-1 text-xs tabular-nums text-admin-muted md:order-none md:text-sm"
                      >
                        {formatRelativeId(l.created_at)}
                      </time>
                      <span className="order-1 min-w-0 md:order-none">
                        <span className="block truncate font-medium text-admin-ink">{l.name}</span>
                        <span className="block truncate text-xs text-admin-muted">{l.company || "—"}</span>
                      </span>
                      <span className="hidden truncate text-sm text-admin-muted md:block">{l.email}</span>
                      <span className="hidden truncate text-sm text-admin-muted md:block">{l.industry ?? "—"}</span>
                      <ChevronDown
                        className="order-1 row-span-2 h-4 w-4 text-admin-muted transition-transform group-open:rotate-180 md:order-none md:row-span-1"
                        aria-hidden
                      />
                    </summary>
                    <div className="border-t border-dashed border-admin-line bg-admin-canvas/50 px-5 py-4 md:pl-[calc(8rem+2.25rem)]">
                      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 md:hidden">
                        <div>
                          <dt className="text-xs text-admin-muted">Email</dt>
                          <dd className="break-all text-admin-ink">{l.email}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-admin-muted">Sektor</dt>
                          <dd className="text-admin-ink">{l.industry ?? "—"}</dd>
                        </div>
                      </dl>
                      <p className="mt-3 text-xs text-admin-muted md:mt-0">
                        Pesan, {fullDate.format(new Date(l.created_at))}
                      </p>
                      <p className="mt-1 max-w-prose whitespace-pre-line text-sm leading-relaxed text-admin-ink">
                        {l.message || "Tidak ada pesan."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a href={`mailto:${l.email}`} className={actionBtn}>
                          <Mail className="h-4 w-4" aria-hidden />
                          Balas via email
                        </a>
                        {wa ? (
                          <a href={wa} target="_blank" rel="noopener noreferrer" className={actionBtn}>
                            <MessageCircle className="h-4 w-4" aria-hidden />
                            WhatsApp
                          </a>
                        ) : null}
                        {l.phone ? (
                          <a href={`tel:${l.phone}`} className={actionBtn}>
                            <Phone className="h-4 w-4" aria-hidden />
                            {l.phone}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
