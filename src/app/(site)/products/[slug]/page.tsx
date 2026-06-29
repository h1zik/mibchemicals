import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { ProductGallery } from "@/components/product-gallery";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getMsdsPublicUrl, getProductBySlug, getSimilarProducts, getSiteConfig } from "@/lib/data/queries";
import { SimilarProductsSection } from "@/components/similar-products";
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
  const similarProducts = await getSimilarProducts(product.category_id, product.id, 4);

  return (
    <>
      <PageHero
        narrow
        eyebrow={product.product_category?.name ?? "Produk"}
        title={product.name}
        top={
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/products" className="hover:text-mib">
                  Produk
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-mib-ink">{product.name}</li>
            </ol>
          </nav>
        }
      />

      <article className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {product.gallery_images.length > 0 ? (
            <ScrollReveal from="up">
              <ProductGallery images={product.gallery_images} productName={product.name} />
            </ScrollReveal>
          ) : null}

          {specs.length > 0 ? (
            <ScrollReveal delay={0.06} from="up" className={product.gallery_images.length > 0 ? "mt-12" : ""}>
              <section aria-labelledby="specs-heading">
                <h2 id="specs-heading" className="font-display text-lg font-bold text-mib-ink">
                  Spesifikasi
                </h2>
                <dl className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
                  {specs.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3 odd:bg-neutral-50/60">
                      <dt className="text-sm font-semibold text-neutral-500">{k}</dt>
                      <dd className="text-sm text-mib-ink sm:col-span-2">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </ScrollReveal>
          ) : null}

          <ScrollReveal delay={0.08} from="up" className="mt-12 border-t border-neutral-200 pt-10">
            <MarkdownBody content={product.description_md} />
          </ScrollReveal>

          <ScrollReveal delay={0.1} from="up" className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="shine-hover group inline-flex items-center justify-center gap-2 rounded-lg bg-mib-gradient px-6 py-3 font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
            >
              Minta penawaran
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            {msdsUrl ? (
              <a
                href={msdsUrl}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-mib/30 bg-white/60 px-6 py-3 font-semibold text-mib-dark backdrop-blur transition-all duration-300 hover:border-mib hover:bg-mib/5"
                target="_blank"
                rel="noopener noreferrer"
                download={product.msds_original_filename ?? true}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M10 2a1 1 0 0 1 1 1v7.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4l2.3 2.3V3a1 1 0 0 1 1-1Zm-6 13a1 1 0 0 1 1 1h10a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2 1 1 0 0 1 1-1Z" />
                </svg>
                Unduh MSDS
              </a>
            ) : (
              <p className="text-sm text-neutral-500">MSDS akan tersedia setelah admin mengunggah file.</p>
            )}
          </ScrollReveal>
        </div>
      </article>

      <SimilarProductsSection
        products={similarProducts}
        categoryName={product.product_category?.name}
      />
    </>
  );
}
