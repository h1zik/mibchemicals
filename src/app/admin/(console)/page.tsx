import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LayoutDashboard, Briefcase, Package, Newspaper, Inbox, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();
  const [services, products, posts, leads] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      label: "Layanan",
      count: services.count ?? 0,
      href: "/admin/services",
      icon: Briefcase,
      hint: "Halaman solusi & kapabilitas",
    },
    {
      label: "Produk",
      count: products.count ?? 0,
      href: "/admin/products",
      icon: Package,
      hint: "Katalog & MSDS",
    },
    {
      label: "Artikel",
      count: posts.count ?? 0,
      href: "/admin/posts",
      icon: Newspaper,
      hint: "Berita & insight",
    },
    {
      label: "Leads",
      count: leads.count ?? 0,
      href: "/admin/leads",
      icon: Inbox,
      hint: "Formulir kontak",
    },
  ] as const;

  return (
    <div>
      <AdminPageHeader
        title="Ringkasan"
        description="Konten situs bersumber dari Supabase. Perubahan di sini memperbarui halaman publik setelah cache di-revalidasi."
      />

      <section className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mib/10 text-mib">
            <LayoutDashboard className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Mulai cepat</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Pilih area di bawah untuk mengedit konten. Gunakan <strong>Pengaturan</strong> untuk
              SEO default, kontak, dan blok hero.
            </p>
          </div>
        </div>
      </section>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm transition hover:border-mib/40 hover:shadow-md"
              >
                <span className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-mib/[0.06] transition group-hover:bg-mib/[0.1]" />
                <div className="relative flex items-start justify-between gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition group-hover:bg-mib/10 group-hover:text-mib">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-mib" />
                </div>
                <p className="relative mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {c.label}
                </p>
                <p className="relative mt-1 text-3xl font-bold tabular-nums tracking-tight text-neutral-900">
                  {c.count}
                </p>
                <p className="relative mt-2 text-xs leading-relaxed text-neutral-500">{c.hint}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
