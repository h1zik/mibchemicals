import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signOut } from "@/actions/auth";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: { no_access?: string };
};

export default function AdminLoginPage({ searchParams }: Props) {
  const noAccess = searchParams?.no_access === "1";

  return (
    <div className="flex min-h-screen flex-col bg-admin-canvas text-admin-ink lg:flex-row">
      <div className="relative overflow-hidden bg-mib-deep px-6 py-10 text-white sm:px-10 lg:flex lg:w-[26rem] lg:flex-col lg:justify-between lg:py-12 xl:w-[30rem]">
        <div className="bg-grid-dark pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
        <div className="relative flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-mib font-display text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
            aria-hidden
          >
            M
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold">MIB Chemicals</span>
            <span className="block text-xs text-white/50">Console konten</span>
          </span>
        </div>
        <div className="relative mt-10 hidden lg:block">
          <p className="max-w-xs font-display text-[28px] font-semibold leading-tight tracking-tight">
            Kelola industri, solusi, produk, dan artikel situs MIB dari satu tempat.
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Perubahan yang disimpan langsung memperbarui halaman publik.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-[28px] font-semibold tracking-tight">Masuk ke console</h1>
          <p className="mt-1.5 text-sm text-admin-muted">Gunakan akun admin yang terdaftar.</p>

          {noAccess ? (
            <div
              className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
              role="alert"
            >
              <p className="font-semibold">Akun ini belum punya akses admin</p>
              <p className="mt-2 text-amber-900/90">
                Login berhasil, tetapi akun Anda belum terdaftar di tabel{" "}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">admin_users</code>. Minta
                pemilik project menjalankan SQL berikut (ganti UUID dengan id user dari Authentication → Users):
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-amber-200 bg-white p-3 text-xs leading-relaxed text-admin-ink">
                {`insert into public.admin_users (user_id)
values ('<uuid-dari-auth.users>');`}
              </pre>
              <p className="mt-3 text-xs text-amber-900/80">
                Setelah itu, buka lagi <span className="font-semibold">/admin</span> atau keluar lalu masuk lagi.
              </p>
              <form action={signOut} className="mt-4">
                <button
                  type="submit"
                  className="rounded text-sm font-semibold text-amber-900 underline decoration-amber-700/50 underline-offset-2 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
                >
                  Keluar dari akun ini
                </button>
              </form>
            </div>
          ) : null}

          <div className="mt-8">
            <Suspense fallback={<p className="text-sm text-admin-muted">Memuat…</p>}>
              <LoginForm />
            </Suspense>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-1.5 rounded text-sm font-medium text-admin-muted transition hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Kembali ke situs
          </Link>
        </div>
      </div>
    </div>
  );
}
