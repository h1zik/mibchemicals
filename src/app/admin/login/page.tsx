import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { signOut } from "@/actions/auth";
import { LoginForm } from "@/components/login-form";
import { FlaskConical } from "lucide-react";

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
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      <div className="relative flex flex-1 flex-col justify-center bg-zinc-950 px-6 py-12 text-white lg:max-w-md lg:px-10 xl:max-w-lg">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #588425 0%, transparent 45%),
              radial-gradient(circle at 80% 60%, #6a9a2e 0%, transparent 40%)`,
          }}
        />
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mib/20 ring-1 ring-mib/40">
            <FlaskConical className="h-6 w-6 text-mib-light" aria-hidden />
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-mib-light/90">
            MIB Chemicals
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Console admin</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
            Masuk dengan akun yang terdaftar di Supabase Auth dan memiliki baris di{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-zinc-200">admin_users</code>.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#eef1f4] px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-xl shadow-neutral-900/5 sm:p-10">
            <h2 className="text-center text-lg font-bold text-neutral-900">Masuk</h2>
            <p className="mt-1 text-center text-sm text-neutral-500">Dashboard internal — tidak diindeks.</p>

            {noAccess ? (
              <div
                className="mt-6 rounded-xl border border-amber-200/90 bg-amber-50 p-4 text-sm text-amber-950 shadow-sm"
                role="alert"
              >
                <p className="font-semibold">Akun ini belum punya akses admin</p>
                <p className="mt-2 text-amber-900/90">
                  Login berhasil, tetapi email Anda belum didaftarkan di tabel{" "}
                  <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-xs font-mono text-amber-950">
                    admin_users
                  </code>{" "}
                  di Supabase. Minta pemilik project menjalankan SQL berikut (ganti UUID dengan id user dari
                  Authentication → Users):
                </p>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-amber-200/80 bg-white p-3 text-xs leading-relaxed text-neutral-800 shadow-inner">
                  {`insert into public.admin_users (user_id)
values ('<uuid-dari-auth.users>');`}
                </pre>
                <p className="mt-3 text-xs text-amber-900/80">
                  Setelah itu, buka lagi <span className="font-semibold">/admin</span> atau keluar lalu masuk lagi.
                </p>
                <form action={signOut} className="mt-4">
                  <button
                    type="submit"
                    className="text-sm font-semibold text-amber-900 underline decoration-amber-700/50 underline-offset-2 hover:no-underline"
                  >
                    Keluar dari akun ini
                  </button>
                </form>
              </div>
            ) : null}

            <div className="mt-8">
              <Suspense fallback={<p className="text-center text-sm text-neutral-500">Memuat…</p>}>
                <LoginForm />
              </Suspense>
            </div>

            <p className="mt-8 text-center text-sm text-neutral-500">
              <Link href="/" className="font-medium text-mib hover:text-mib-dark hover:underline">
                ← Kembali ke situs
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
