import Link from "next/link";
import type { Product } from "@/types/database";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getProductCardImageUrl } from "@/lib/product-gallery";

type Props = {
  products: Product[];
  categoryName?: string | null;
};

export function SimilarProductsSection({ products, categoryName }: Props) {
  if (products.length === 0) return null;

  return (
    <section
      className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20"
      aria-labelledby="similar-products-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal from="up">
          <p className="text-sm font-semibold uppercase tracking-wider text-mib">Katalog</p>
          <h2
            id="similar-products-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-mib-ink sm:text-3xl"
          >
            Produk serupa
          </h2>
          {categoryName ? (
            <p className="mt-2 text-neutral-600">Dalam kategori yang sama: {categoryName}</p>
          ) : null}
        </ScrollReveal>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => {
            const thumb = getProductCardImageUrl(p);
            return (
              <li key={p.id}>
                <ScrollReveal delay={i * 0.06} from="up" scale className="h-full">
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
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold text-mib/40">
                          MIB
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                        {p.product_category?.name ?? "—"}
                      </p>
                      <p className="mt-2 text-lg font-bold leading-snug text-mib-ink">{p.name}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                        Detail
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
