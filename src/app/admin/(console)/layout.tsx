import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { signOut } from "@/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

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

  const email = user.email ?? "";
  const initials = initialsFromEmail(email);

  return (
    <div
      className="flex min-h-screen flex-col bg-[#eef1f4] md:flex-row"
      data-color-mode="light"
    >
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-neutral-200/90 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mib/10 text-xs font-bold text-mib"
                aria-hidden
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-900">{email || "Admin"}</p>
                <p className="text-xs text-neutral-500">Administrator</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 sm:inline-block"
              >
                Situs
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <LogOut className="h-4 w-4 text-neutral-500" aria-hidden />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
