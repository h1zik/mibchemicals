import Link from "next/link";
import { ArrowUpRight, Inbox, Mail, Plus, Settings } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminNavGroups, type AdminDraftKey } from "@/lib/admin-nav";
import { formatRelativeId } from "@/lib/admin-format";
import type { Lead } from "@/types/database";

/** Urutan baris ledger mengikuti urutan sidebar. */
const LEDGER = adminNavGroups
  .flatMap((g) => g.links)
  .filter((l): l is typeof l & { draftKey: AdminDraftKey } => Boolean(l.draftKey));

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();

  const [counts, leadsRes, leadTotal] = await Promise.all([
    Promise.all(
      LEDGER.map(async (l) => {
        const [all, drafts] = await Promise.all([
          supabase.from(l.draftKey).select("id", { count: "exact", head: true }),
          supabase
            .from(l.draftKey)
            .select("id", { count: "exact", head: true })
            .eq("published", false),
        ]);
        const total = all.count ?? 0;
        const draft = drafts.count ?? 0;
        return { ...l, total, draft, live: Math.max(total - draft, 0) };
      }),
    ),
    supabase
      .from("leads")
      .select("id, name, company, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);

  const leads = (leadsRes.data as Pick<Lead, "id" | "name" | "company" | "email" | "created_at">[] | null) ?? [];
  const totalDrafts = counts.reduce((n, c) => n + c.draft, 0);
  const totalLive = counts.reduce((n, c) => n + c.live, 0);

  return (
    <div>
      <AdminPageHeader
        title="Ringkasan"
        description={
          totalDrafts > 0
            ? `${totalLive} entri published di situs, ${totalDrafts} masih draft.`
            : `${totalLive} entri published di situs. Tidak ada draft yang tertunda.`
        }
        actions={
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-admin-muted transition hover:bg-white hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
          >
            Buka situs
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Ledger status konten */}
        <section aria-labelledby="ledger-title" className="overflow-hidden rounded-xl border border-admin-line bg-white">
          <header className="flex items-baseline justify-between gap-4 border-b border-admin-line px-5 py-4">
            <h2 id="ledger-title" className="font-display text-base font-semibold text-admin-ink">
              Status konten
            </h2>
            <p className="flex items-center gap-3 text-xs text-admin-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-mib" aria-hidden />
                Published
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-amber-400" aria-hidden />
                Draft
              </span>
            </p>
          </header>
          <ul className="divide-y divide-admin-line">
            {counts.map((c) => {
              const Icon = c.icon;
              const livePct = c.total ? (c.live / c.total) * 100 : 0;
              return (
                <li key={c.href} className="group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-admin-canvas/60">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-admin-soft text-admin-muted transition-colors group-hover:bg-mib/10 group-hover:text-mib">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <Link
                        href={c.href}
                        className="font-medium text-admin-ink after:absolute after:inset-0 hover:underline decoration-mib/40 underline-offset-4 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-mib"
                      >
                        {c.label}
                      </Link>
                      <p className="shrink-0 text-sm tabular-nums text-admin-muted">
                        <span className="font-semibold text-admin-ink">{c.live}</span> published
                        {c.draft > 0 ? (
                          <>
                            {", "}
                            <span className="font-semibold text-admin-draft">{c.draft}</span> draft
                          </>
                        ) : null}
                      </p>
                    </div>
                    <div
                      className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-admin-soft"
                      role="img"
                      aria-label={`${c.live} dari ${c.total} ${c.label.toLowerCase()} published`}
                    >
                      {c.total > 0 ? (
                        <>
                          <span className="h-full bg-mib" style={{ width: `${livePct}%` }} />
                          <span className="h-full bg-amber-400" style={{ width: `${100 - livePct}%` }} />
                        </>
                      ) : null}
                    </div>
                  </div>
                  <Link
                    href={`${c.href}/new`}
                    className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-admin-muted transition hover:bg-white hover:text-mib focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
                    title={`Tambah ${c.label.toLowerCase()}`}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Tambah {c.label.toLowerCase()}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          {/* Lead terbaru */}
          <section aria-labelledby="leads-title" className="overflow-hidden rounded-xl border border-admin-line bg-white">
            <header className="flex items-baseline justify-between gap-4 border-b border-admin-line px-5 py-4">
              <h2 id="leads-title" className="font-display text-base font-semibold text-admin-ink">
                Lead terbaru
              </h2>
              <Link
                href="/admin/leads"
                className="rounded text-sm font-medium text-mib transition hover:text-mib-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
              >
                Semua ({leadTotal.count ?? 0})
              </Link>
            </header>
            {leads.length === 0 ? (
              <div className="flex items-start gap-3 px-5 py-6">
                <Inbox className="mt-0.5 h-5 w-5 shrink-0 text-admin-muted/60" aria-hidden />
                <p className="text-sm leading-relaxed text-admin-muted">
                  Belum ada lead. Kiriman formulir kontak situs akan muncul di sini.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-admin-line">
                {leads.map((l) => (
                  <li key={l.id} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-admin-ink">{l.name}</p>
                      <p className="truncate text-xs text-admin-muted">
                        {l.company ? `${l.company}, ` : ""}
                        <time dateTime={l.created_at}>{formatRelativeId(l.created_at)}</time>
                      </p>
                    </div>
                    <a
                      href={`mailto:${l.email}`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-admin-muted transition hover:bg-mib/10 hover:text-mib focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
                      title={`Email ${l.email}`}
                    >
                      <Mail className="h-4 w-4" aria-hidden />
                      <span className="sr-only">Email {l.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Link
            href="/admin/settings"
            className="group flex items-start gap-3 rounded-xl border border-admin-line bg-white px-5 py-4 transition hover:border-mib/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
          >
            <Settings className="mt-0.5 h-5 w-5 shrink-0 text-admin-muted transition group-hover:text-mib" aria-hidden />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-admin-ink">Pengaturan situs</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-admin-muted">
                SEO default, kontak perusahaan, hero beranda, logo, dan Google Analytics.
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
