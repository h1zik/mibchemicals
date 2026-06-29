import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PageHero } from "@/components/page-hero";
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
    <>
      <PageHero
        eyebrow="Insight"
        title="Artikel &amp; studi kasus"
        subtitle="Berita industri, studi kasus, dan insight teknis dari tim MIB Chemicals."
      />

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid gap-6 lg:grid-cols-3">
            {posts.length === 0 ? (
              <li className="lg:col-span-3 rounded-2xl border border-dashed border-neutral-300 p-8 text-neutral-600">
                Belum ada artikel publikasi.
              </li>
            ) : (
              posts.map((post, i) => (
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
                        <div className="flex aspect-[16/10] w-full shrink-0 items-center justify-center bg-mib/5 font-display text-2xl font-bold text-mib/40">
                          MIB
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                          {post.post_category?.name ??
                            (post.post_type === "case_study" ? "Studi kasus" : "Berita")}
                        </p>
                        <h2 className="mt-2 text-lg font-bold leading-snug text-mib-ink">{post.title}</h2>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
                        <p className="mt-4 text-xs text-neutral-500">
                          {post.author_name}
                          {post.published_at
                            ? ` · ${new Date(post.published_at).toLocaleDateString("id-ID")}`
                            : ""}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                          Baca selengkapnya
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
