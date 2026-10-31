import { redirect } from "next/navigation";
import { AdminConsoleProviders } from "@/components/admin/admin-console-providers";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminSidebar } from "@/components/admin-sidebar";
import { signOut } from "@/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminDraftCounts, AdminDraftKey } from "@/lib/admin-nav";
import { LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

const DRAFT_TABLES: AdminDraftKey[] = [
  "industries",
  "solutions",
  "services",
  "testimonials",
  "products",
  "posts",
];

function initialsFromEmail(email: string | undefined) {
  if (!email) return "?";
  const part = email.split("@")[0] ?? email;
  const letters = part.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2);
  return (letters || part.slice(0, 2)).toUpperCase();
}

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) {
    redirect("/admin/login?no_access=1");
  }

  const draftResults = await Promise.all(
    DRAFT_TABLES.map((t) =>
      supabase.from(t).select("id", { count: "exact", head: true }).eq("published", false),
    ),
  );
  const draftCounts: AdminDraftCounts = Object.fromEntries(
    DRAFT_TABLES.map((t, i) => [t, draftResults[i].count ?? 0]),
  );

  const email = user.email ?? "";
  const initials = initialsFromEmail(email);

  return (
    <div className="min-h-screen bg-admin-canvas text-admin-ink md:flex" data-color-mode="light">
      <AdminSidebar draftCounts={draftCounts} />
      <AdminConsoleProviders>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-14 z-20 border-b border-admin-line bg-white/85 backdrop-blur-md md:top-0">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <AdminBreadcrumb />
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-mib/10 text-[11px] font-bold text-mib-dark"
                  title={email || "Admin"}
                  aria-hidden
                >
                  {initials}
                </span>
                <span className="hidden max-w-[14rem] truncate text-sm text-admin-muted lg:inline">
                  {email || "Admin"}
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-admin-muted transition hover:bg-admin-canvas hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </form>
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </AdminConsoleProviders>
    </div>
  );
}
