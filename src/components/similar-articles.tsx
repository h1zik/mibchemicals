import Link from "next/link";
import type { Post } from "@/types/database";
import { ScrollReveal } from "@/components/scroll-reveal";

type Props = {
  posts: Post[];
};

export function SimilarArticlesSection({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section
      className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20"
      aria-labelledby="similar-articles-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal from="up">
          <p className="text-sm font-semibold uppercase tracking-wider text-mib">Insight</p>
          <h2
            id="similar-articles-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-mib-ink sm:text-3xl"
          >
            Artikel serupa
          </h2>
          <p className="mt-2 text-neutral-600">Artikel lain dalam kategori yang sama.</p>
        </ScrollReveal>
        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {posts.map((post, i) => (
            <li key={post.id}>
              <ScrollReveal delay={i * 0.06} from="up" scale className="h-full">
                <Link
                  href={`/articles/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                >
                  {post.cover_image_url ? (
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image_url}
                        alt=""
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] w-full items-center justify-center bg-mib/5 font-display text-xl font-bold text-mib/40">
                      MIB
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                      {post.post_category?.name ??
                        (post.post_type === "case_study" ? "Studi kasus" : "Berita")}
                    </p>
                    <p className="mt-2 text-lg font-bold leading-snug text-mib-ink">{post.title}</p>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                      Baca
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
