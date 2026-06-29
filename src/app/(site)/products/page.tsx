import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PageHero } from "@/components/page-hero";
import { getProducts, getSiteConfig } from "@/lib/data/queries";
import { getProductCardImageUrl } from "@/lib/product-gallery";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata(await getSiteConfig(), {
    title: "Katalog Produk",
    description:
      "Katalog specialty chemicals MIB Chemicals: spesifikasi teknis dan unduhan MSDS.",
    path: "/products",
    keywords: ["specialty chemicals", "MSDS", "kimia industri"],
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        eyebrow="Katalog"
        title="Produk specialty chemicals"
        subtitle="Lini specialty chemicals dengan spesifikasi teknis, galeri, dan dokumen keselamatan (MSDS) — siap untuk kebutuhan operasional lintas industri."
      />

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {products.length === 0 ? (
              <li className="col-span-full rounded-2xl border border-dashed border-neutral-300 p-8 text-neutral-600">
                Belum ada produk. Hubungkan database atau tambahkan dari admin.
              </li>
            ) : (
              products.map((p, i) => {
                const thumb = getProductCardImageUrl(p);
                return (
                  <li key={p.id}>
                    <ScrollReveal delay={i * 0.05} from="up" scale className="h-full">
                      <Link
                        href={`/products/${p.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                      >
                        <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-neutral-100">
                          {thumb ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={thumb}
                                alt=""
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                              />
                              <div
                                aria-hidden
                                className="absolute inset-0 bg-gradient-to-t from-mib-ink/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                              />
                            </>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-mib/40">
                              MIB
                            </div>
                          )}
                          {p.featured ? (
                            <span className="absolute left-3 top-3 rounded-full bg-mib-gradient px-2.5 py-1 text-xs font-semibold text-white shadow-glow">
                              Unggulan
                            </span>
                          ) : null}
                        </div>
                        <div className="p-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                            {p.product_category?.name ?? "—"}
                          </p>
                          <h2 className="mt-2 text-xl font-bold text-mib-ink">{p.name}</h2>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{p.description_md}</p>
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                            Lihat detail
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </span>
                        </div>
                      </Link>
                    </ScrollReveal>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
