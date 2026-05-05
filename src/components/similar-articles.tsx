import Link from "next/link";
import type { Post } from "@/types/database";

type Props = {
  posts: Post[];
};

export function SimilarArticlesSection({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section
      className="border-t border-neutral-200 bg-neutral-50 py-14 sm:py-16"
      aria-labelledby="similar-articles-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="similar-articles-heading"
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Artikel serupa
        </h2>
        <p className="mt-2 text-neutral-600">Artikel lain dalam kategori yang sama.</p>
        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/articles/${post.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:border-mib hover:shadow-md"
              >
                {post.cover_image_url ? (
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-neutral-100 text-sm font-semibold text-neutral-400">
                    MIB
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase text-mib">
                    {post.post_category?.name ??
                      (post.post_type === "case_study" ? "Studi kasus" : "Berita")}
                  </p>
                  <p className="mt-2 text-lg font-bold leading-snug text-foreground">{post.title}</p>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-neutral-600">{post.excerpt}</p>
                  <span className="mt-4 text-sm font-semibold text-mib">Baca →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
