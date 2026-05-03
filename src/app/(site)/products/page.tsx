import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
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
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <ScrollReveal className="max-w-3xl">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Katalog produk</h1>
          <p className="mt-4 text-lg text-neutral-600">
            Spesifikasi, galeri gambar, dan dokumen keselamatan dikelola dari Supabase; perubahan data
            langsung terlihat di situs.
          </p>
        </header>
      </ScrollReveal>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {products.length === 0 ? (
          <li className="col-span-full rounded border border-dashed border-neutral-300 p-8 text-neutral-600">
            Belum ada produk. Hubungkan database atau tambahkan dari admin.
          </li>
        ) : (
          products.map((p, i) => {
            const thumb = getProductCardImageUrl(p);
            return (
              <li key={p.id}>
                <ScrollReveal delay={i * 0.05}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:border-mib"
                  >
                    {thumb ? (
                      <div className="aspect-[16/9] w-full shrink-0 bg-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold uppercase text-mib">{p.category}</p>
                        {p.featured ? (
                          <span className="rounded bg-mib/10 px-2 py-0.5 text-xs font-semibold text-mib">
                            Featured
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-2 text-xl font-bold text-foreground">{p.name}</h2>
                      <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{p.description_md}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
