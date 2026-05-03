import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { ProductGallery } from "@/components/product-gallery";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getMsdsPublicUrl, getProductBySlug, getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return buildPageMetadata(await getSiteConfig(), {
      title: "Produk",
      path: `/products/${params.slug}`,
    });
  }
  return buildPageMetadata(await getSiteConfig(), {
    title: product.seo_title || product.name,
    description: product.seo_description || product.description_md.slice(0, 160),
    path: `/products/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const msdsUrl = getMsdsPublicUrl(product.msds_bucket_path);
  const specs = Object.entries(product.specs_json ?? {});

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <ScrollReveal>
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/products" className="hover:text-mib">
                Produk
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>
        <header className="mt-6">
          <p className="text-sm font-semibold uppercase text-mib">{product.category}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>
        </header>
      </ScrollReveal>

      {product.gallery_images.length > 0 ? (
        <ScrollReveal delay={0.06} className="mt-10">
          <ProductGallery images={product.gallery_images} productName={product.name} />
        </ScrollReveal>
      ) : null}

      {specs.length > 0 ? (
        <ScrollReveal delay={0.08} className="mt-10">
          <section aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="text-lg font-bold text-foreground">
              Spesifikasi
            </h2>
            <dl className="mt-4 divide-y divide-neutral-200 rounded border border-neutral-200">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3">
                  <dt className="text-sm font-medium text-neutral-500">{k}</dt>
                  <dd className="text-sm text-foreground sm:col-span-2">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </ScrollReveal>
      ) : null}

      <ScrollReveal delay={0.1} className="mt-10 border-t border-neutral-200 pt-10">
        <MarkdownBody content={product.description_md} />
      </ScrollReveal>

      <ScrollReveal delay={0.12} className="mt-10 flex flex-wrap gap-4">
        {msdsUrl ? (
          <a
            href={msdsUrl}
            className="inline-flex rounded border-2 border-mib px-5 py-2.5 font-semibold text-mib hover:bg-mib/5"
            target="_blank"
            rel="noopener noreferrer"
            download={product.msds_original_filename ?? true}
          >
            Unduh MSDS
            {product.msds_original_filename ? ` (${product.msds_original_filename})` : ""}
          </a>
        ) : (
          <p className="text-sm text-neutral-500">MSDS akan tersedia setelah admin mengunggah file.</p>
        )}
        <Link
          href="/contact"
          className="inline-flex rounded border-2 border-mib bg-mib px-5 py-2.5 font-semibold text-white hover:bg-mib-dark"
        >
          Minta penawaran
        </Link>
      </ScrollReveal>
    </article>
  );
}
