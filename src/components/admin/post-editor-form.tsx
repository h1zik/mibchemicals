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
import type { Post } from "@/types/database";

const adminSelect = adminInput;

type Props = {
  post?: Post | null;
};

function publishedAtLocal(post: Post | null | undefined): string {
  if (!post?.published_at) return "";
  return new Date(post.published_at).toISOString().slice(0, 16);
}

export function PostEditorForm({ post }: Props) {
  const isEdit = Boolean(post);
  const p = post ?? undefined;
  const defaultPublishedAt = isEdit
    ? publishedAtLocal(p)
    : new Date().toISOString().slice(0, 16);

  const publicPath = p?.slug ? `/articles/${p.slug}` : null;

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
              label="Isi artikel"
              defaultValue={p?.body_md ?? ""}
              height={isEdit ? 480 : 440}
              helpText="Gunakan toolbar untuk tebal, judul, daftar, dan tautan. Konten disimpan sebagai Markdown."
            />
          </div>
          <div>
            <label htmlFor="post-cover" className={adminLabel}>
              URL gambar sampul (opsional)
            </label>
            <input
              id="post-cover"
              name="cover_image_url"
              type="url"
              defaultValue={p?.cover_image_url ?? ""}
              placeholder="https://…"
              className={`${adminInput} font-mono text-sm`}
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              URL absolut manual, atau kosongkan lalu gunakan unggah di bawah (setelah artikel disimpan).
            </p>
            {isEdit && p ? (
              <AdminPostCoverUpload postId={p.id} currentUrl={p.cover_image_url} />
            ) : (
              <p className="mt-3 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                Simpan artikel dulu; Anda akan diarahkan ke halaman edit tempat gambar sampul bisa diunggah.
              </p>
            )}
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Publikasi"
          description="Tipe artikel, jadwal tampil di daftar, dan status tayang di situs publik."
        >
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
