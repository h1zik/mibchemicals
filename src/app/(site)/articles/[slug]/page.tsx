import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { getPostBySlug, getSiteConfig } from "@/lib/data/queries";
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/articles" className="hover:text-mib">
              Artikel
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{post.title}</li>
        </ol>
      </nav>
      <header className="mt-6">
        <p className="text-xs font-semibold uppercase text-mib">
          {post.post_type === "case_study" ? "Studi kasus" : "Berita"}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>
        <p className="mt-4 text-lg text-neutral-600">{post.excerpt}</p>
        <p className="mt-4 text-sm text-neutral-500">
          {post.author_name}
          {post.published_at
            ? ` · ${new Date(post.published_at).toLocaleDateString("id-ID", {
                dateStyle: "long",
              })}`
            : ""}
        </p>
      </header>
      {post.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt=""
          className="mt-10 w-full rounded-lg border border-neutral-200 object-cover"
        />
      ) : null}
      <div className="mt-10 border-t border-neutral-200 pt-10">
        <MarkdownBody content={post.body_md} />
      </div>
    </article>
  );
}
