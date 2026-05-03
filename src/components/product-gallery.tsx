import type { ProductGalleryImage } from "@/lib/product-gallery";
import { resolveGalleryImageSrc } from "@/lib/product-gallery";

type Props = {
  images: ProductGalleryImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: Props) {
  const resolved = images
    .map((img, i) => ({ img, src: resolveGalleryImageSrc(img), key: `${i}-${img.path ?? img.url ?? ""}` }))
    .filter((x): x is { img: ProductGalleryImage; src: string; key: string } => Boolean(x.src));

  if (resolved.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-lg font-bold text-foreground">
        Galeri
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resolved.map(({ img, src, key }) => (
          <li
            key={key}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={img.alt || `${productName} — gambar produk`}
              className="aspect-[4/3] w-full object-cover transition hover:scale-[1.02]"
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
