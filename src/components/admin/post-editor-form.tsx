import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminPostCoverUpload } from "@/components/admin-post-cover-upload";
import { AdminMarkdownEditor } from "@/components/admin-markdown-editor";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { deletePostForm, upsertPost } from "@/actions/admin";
import {
  adminDangerZoneButton,
  adminGhostLink,
  adminInput,
  adminLabel,
  adminMutedLink,
  adminPrimaryBtn,
} from "@/lib/admin-ui";
import type { Post, PostCategory } from "@/types/database";

const adminSelect = adminInput;

function defaultPostCategoryId(categories: PostCategory[], post?: Post | null): string {
  if (categories.length === 0) return "";
  if (post?.category_id) return post.category_id;
  const bySlug = (s: string) => categories.find((c) => c.slug === s)?.id;
  if (post?.post_type === "case_study") return bySlug("studi-kasus") ?? categories[0]!.id;
  return bySlug("berita") ?? categories[0]!.id;
}

type Props = {
  post?: Post | null;
  categories: PostCategory[];
};

function publishedAtLocal(post: Post | null | undefined): string {
  if (!post?.published_at) return "";
  return new Date(post.published_at).toISOString().slice(0, 16);
}

export function PostEditorForm({ post, categories }: Props) {
  const isEdit = Boolean(post);
  const p = post ?? undefined;
  const defaultPublishedAt = isEdit
    ? publishedAtLocal(p)
    : new Date().toISOString().slice(0, 16);

  const publicPath = p?.slug ? `/articles/${p.slug}` : null;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div>
          <Link
            href="/admin/posts"
            className={`${adminMutedLink} inline-flex items-center gap-1.5`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Kembali ke daftar artikel
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {isEdit ? "Edit artikel" : "Artikel baru"}
          </h1>
          {isEdit && p ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-800 ring-1 ring-inset ring-violet-600/15">
                {p.post_type === "case_study" ? "Studi kasus" : "Berita"}
              </span>
              {publicPath ? (
                <Link
                  href={publicPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-mib"
                >
                  Pratinjau publik
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
              Isi judul dan isi artikel; slug bisa dikosongkan lalu disesuaikan sebelum tayang.
            </p>
          )}
        </div>
        {categories.length === 0 ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
            <p className="font-semibold">Belum ada kategori artikel</p>
            <p className="mt-1 text-amber-900/90">
              Buat minimal satu kategori di{" "}
              <Link href="/admin/post-categories" className="font-semibold underline hover:no-underline">
                Kategori artikel
              </Link>{" "}
              sebelum menyimpan.
            </p>
          </div>
        ) : null}
      </div>

      <AdminSaveForm action={upsertPost} className="space-y-8" successMessage="Artikel berhasil disimpan.">
        {isEdit && p ? <input type="hidden" name="id" value={p.id} /> : null}

        <AdminFormSection
          title="Konten"
          description="Judul dan isi utama tampil di halaman artikel. Slug membentuk URL permanen /articles/[slug]."
        >
          <div>
            <label htmlFor="post-title" className={adminLabel}>
              Judul
            </label>
            <input
              id="post-title"
              name="title"
              required
              defaultValue={p?.title}
              placeholder="Contoh: Peluncuran lini produk baru"
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="post-slug" className={adminLabel}>
              Slug {isEdit ? "" : "(opsional)"}
            </label>
            <input
              id="post-slug"
              name="slug"
              required={isEdit}
              defaultValue={p?.slug}
              placeholder="contoh-artikel-tanpa-spasi"
              className={`${adminInput} font-mono text-sm`}
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Huruf kecil, angka, dan tanda hubung. Ubah slug hanya jika perlu; tautan lama bisa putus.
            </p>
          </div>
          <div>
            <label htmlFor="post-excerpt" className={adminLabel}>
              Ringkasan
            </label>
            <textarea
              id="post-excerpt"
              name="excerpt"
              rows={3}
              defaultValue={p?.excerpt}
              placeholder="1–2 kalimat untuk daftar artikel dan pratinjau sosial."
              className={adminInput}
            />
          </div>
          <div className="!mt-6 border-t border-neutral-100 pt-6">
            <AdminMarkdownEditor
              postId={p?.id ?? null}
              label="Isi artikel"
              defaultValue={p?.body_md ?? ""}
              height={isEdit ? 520 : 480}
              preview="live"
              helpText="Pratinjau live di samping teks. Gambar di dalam artikel: unggah dari komputer (disarankan) atau sisipkan URL lewat opsi lipatan."
            />
          </div>
          <div className="rounded-2xl border border-neutral-200/90 bg-gradient-to-b from-neutral-50/80 to-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-neutral-900">Gambar sampul</p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              Tampil di daftar artikel dan kartu di beranda. Unggah file — tidak perlu mencari URL.
            </p>
            {isEdit && p ? (
              <div className="mt-4">
                <AdminPostCoverUpload postId={p.id} currentUrl={p.cover_image_url} />
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-mib/25 bg-mib/[0.04] px-4 py-3 text-sm text-neutral-700">
                <span className="font-semibold text-mib">Langkah mudah:</span> simpan artikel dulu, lalu di halaman edit ini Anda bisa{" "}
                <span className="font-semibold">unggah sampul</span> seperti gambar di isi artikel.
              </p>
            )}
            <details className="mt-5 rounded-xl border border-neutral-200 bg-white px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-neutral-700 hover:text-mib">
                Lanjutan: set URL sampul manual
              </summary>
              <p className="mt-2 text-xs text-neutral-500">
                Hanya jika gambar sudah di-host di luar (CDN, dll.). Kosongkan bila memakai unggah.
              </p>
              <div className="mt-3">
                <label htmlFor="post-cover" className={adminLabel}>
                  URL gambar sampul
                </label>
                <input
                  id="post-cover"
                  name="cover_image_url"
                  type="url"
                  defaultValue={p?.cover_image_url ?? ""}
                  placeholder="https://…"
                  className={`${adminInput} font-mono text-sm`}
                />
              </div>
            </details>
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Publikasi"
          description="Kategori mengelompokkan artikel serupa di situs; tipe membedakan format konten. Jadwal dan status tayang."
        >
          <div>
            <label htmlFor="post-category" className={adminLabel}>
              Kategori
            </label>
            <select
              id="post-category"
              name="category_id"
              required
              defaultValue={defaultPostCategoryId(categories, p)}
              className={adminSelect}
            >
              {categories.length === 0 ? (
                <option value="" disabled>
                  — Belum ada kategori —
                </option>
              ) : (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
            <p className="mt-1.5 text-xs text-neutral-500">
              Kelola daftar di{" "}
              <Link href="/admin/post-categories" className="font-semibold text-mib hover:underline">
                Kategori artikel
              </Link>
              .
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="post-type" className={adminLabel}>
                Tipe
              </label>
              <select id="post-type" name="post_type" defaultValue={p?.post_type ?? "news"} className={adminSelect}>
                <option value="news">Berita</option>
                <option value="case_study">Studi kasus</option>
              </select>
            </div>
            <div>
              <label htmlFor="post-published-at" className={adminLabel}>
                Tanggal & jam tayang
              </label>
              <input
                id="post-published-at"
                name="published_at"
                type="datetime-local"
                defaultValue={defaultPublishedAt}
                className={adminInput}
              />
              <p className="mt-1.5 text-xs text-neutral-500">Digunakan untuk urutan dan tampilan tanggal di artikel.</p>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition has-[:checked]:border-mib/35 has-[:checked]:bg-mib/[0.06]">
            <input
              type="checkbox"
              name="published"
              defaultChecked={p?.published}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-mib focus:ring-mib focus:ring-offset-0"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">Published</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-neutral-600">
                Jika tidak dicentang, artikel disimpan sebagai draf dan tidak tampil di situs publik.
              </span>
            </span>
          </label>
        </AdminFormSection>

        <AdminFormSection
          title="SEO & atribusi"
          description="Judul dan deskripsi khusus mesin pencari; kosongkan untuk fallback dari judul artikel."
        >
          <div>
            <label htmlFor="post-author" className={adminLabel}>
              Nama penulis
            </label>
            <input
              id="post-author"
              name="author_name"
              defaultValue={p?.author_name ?? "MIB Chemicals"}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="post-seo-title" className={adminLabel}>
              SEO title
            </label>
            <input
              id="post-seo-title"
              name="seo_title"
              defaultValue={p?.seo_title ?? ""}
              placeholder="Biarkan kosong untuk memakai judul artikel"
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="post-seo-desc" className={adminLabel}>
              SEO description
            </label>
            <textarea
              id="post-seo-desc"
              name="seo_description"
              rows={3}
              defaultValue={p?.seo_description ?? ""}
              placeholder="Ringkasan 150–160 karakter untuk hasil pencarian"
              className={adminInput}
            />
          </div>
        </AdminFormSection>

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/posts" className={`${adminGhostLink} py-2 sm:py-0`}>
            Batal
          </Link>
          <button type="submit" className={`${adminPrimaryBtn} w-full justify-center sm:w-auto`}>
            {isEdit ? "Simpan perubahan" : "Simpan artikel"}
          </button>
        </div>
      </AdminSaveForm>

      {isEdit && p ? (
        <aside className="mt-8 rounded-2xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-red-900">Zona bahaya</h2>
          <p className="mt-1 text-sm text-red-800/90">
            Menghapus artikel tidak dapat dibatalkan. Pastikan tidak ada tautan eksternal ke halaman ini.
          </p>
          <form action={deletePostForm} className="mt-4">
            <input type="hidden" name="id" value={p.id} />
            <button type="submit" className={adminDangerZoneButton}>
              Hapus artikel
            </button>
          </form>
        </aside>
      ) : null}
    </div>
  );
}
