import Link from "next/link";
import { getPosts, getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata(await getSiteConfig(), {
    title: "Artikel & Studi Kasus",
    description:
      "Berita industri, studi kasus, dan insight specialty chemicals dari MIB Chemicals.",
    path: "/articles",
    keywords: ["specialty chemicals", "industri kimia", "case study"],
  });
}

export default async function ArticlesPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Artikel & studi kasus</h1>
        <p className="mt-4 text-lg text-neutral-600">
          Modul konten SEO-ready: judul, excerpt, slug, meta, dan konten Markdown dari Supabase.
        </p>
      </header>
      <ul className="mt-12 space-y-8">
        {posts.length === 0 ? (
          <li className="rounded border border-dashed border-neutral-300 p-8 text-neutral-600">
            Belum ada artikel publikasi.
          </li>
        ) : (
          posts.map((post) => (
            <li key={post.id}>
              <article className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:flex-row">
                {post.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="h-40 w-full rounded object-cover sm:h-32 sm:w-48 sm:shrink-0"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded bg-neutral-100 text-neutral-400 sm:h-32 sm:w-48 sm:shrink-0">
                    MIB
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase text-mib">
                    {post.post_type === "case_study" ? "Studi kasus" : "Berita"}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    <Link href={`/articles/${post.slug}`} className="hover:text-mib">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-neutral-600">{post.excerpt}</p>
                  <p className="mt-3 text-xs text-neutral-500">
                    {post.author_name}
                    {post.published_at
                      ? ` · ${new Date(post.published_at).toLocaleDateString("id-ID")}`
                      : ""}
                  </p>
                  <Link
                    href={`/articles/${post.slug}`}
                    className="mt-4 inline-block text-sm font-semibold text-mib hover:underline"
                  >
                    Baca selengkapnya →
                  </Link>
                </div>
              </article>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
