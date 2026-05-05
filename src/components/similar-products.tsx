import Link from "next/link";
import type { Product } from "@/types/database";
import { getProductCardImageUrl } from "@/lib/product-gallery";

type Props = {
  products: Product[];
  categoryName?: string | null;
};

export function SimilarProductsSection({ products, categoryName }: Props) {
  if (products.length === 0) return null;

  return (
    <section
      className="border-t border-neutral-200 bg-neutral-50 py-14 sm:py-16"
      aria-labelledby="similar-products-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="similar-products-heading"
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Produk serupa
        </h2>
        {categoryName ? (
          <p className="mt-2 text-neutral-600">Dalam kategori yang sama: {categoryName}</p>
        ) : null}
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
            const thumb = getProductCardImageUrl(p);
            return (
              <li key={p.id}>
                <Link
                  href={`/products/${p.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:border-mib hover:shadow-md"
                >
                  <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-neutral-100">
                    {thumb ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-neutral-400">
                        MIB
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase text-mib">
                      {p.product_category?.name ?? "—"}
                    </p>
                    <p className="mt-2 text-lg font-bold leading-snug text-foreground">{p.name}</p>
                    <span className="mt-3 text-sm font-semibold text-mib">Detail →</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
