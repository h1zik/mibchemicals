import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SimilarArticlesSection } from "@/components/similar-articles";
import { getPostBySlug, getSimilarPosts, getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return buildPageMetadata(await getSiteConfig(), {
      title: "Artikel",
      path: `/articles/${params.slug}`,
    });
  }
  return buildPageMetadata(await getSiteConfig(), {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    path: `/articles/${post.slug}`,
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const similarPosts = await getSimilarPosts(post.category_id, post.id, 3);
  const category =
    post.post_category?.name ?? (post.post_type === "case_study" ? "Studi kasus" : "Berita");

  return (
    <>
      <PageHero
        narrow
        eyebrow={category}
        title={post.title}
        subtitle={post.excerpt}
        top={
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/articles" className="hover:text-mib">
                  Artikel
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-mib-ink">{post.title}</li>
            </ol>
          </nav>
        }
      >
        <p className="mt-5 text-sm text-neutral-500">
          {post.author_name}
          {post.published_at
            ? ` · ${new Date(post.published_at).toLocaleDateString("id-ID", { dateStyle: "long" })}`
            : ""}
        </p>
      </PageHero>

      <article className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {post.cover_image_url ? (
            <ScrollReveal from="up" scale>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image_url}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </ScrollReveal>
          ) : null}

          <ScrollReveal delay={0.06} from="up" className={post.cover_image_url ? "mt-12" : ""}>
            <MarkdownBody content={post.body_md} />
          </ScrollReveal>
        </div>
      </article>

      <SimilarArticlesSection posts={similarPosts} />
    </>
  );
}
