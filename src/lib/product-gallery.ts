export type ProductGalleryImage = {
  /** Path relatif di bucket `product-gallery` */
  path?: string;
  /** URL absolut (eksternal atau publik Supabase) */
  url?: string;
  alt?: string;
};

export function parseGalleryImages(raw: unknown): ProductGalleryImage[] {
  if (!Array.isArray(raw)) return [];
  const out: ProductGalleryImage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const path = typeof o.path === "string" ? o.path.trim() : undefined;
    const url = typeof o.url === "string" ? o.url.trim() : undefined;
    const alt = typeof o.alt === "string" ? o.alt : undefined;
    if (path || url) out.push({ ...(path ? { path } : {}), ...(url ? { url } : {}), alt });
  }
  return out;
}

export function resolveGalleryImageSrc(item: ProductGalleryImage): string | null {
  if (item.url) return item.url;
  if (item.path) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    if (!base) return null;
    const p = item.path.replace(/^\//, "");
    return `${base}/storage/v1/object/public/product-gallery/${p}`;
  }
  return null;
}

/** Gambar pertama untuk kartu produk / daftar */
export function getProductCardImageUrl(product: {
  gallery_images?: ProductGalleryImage[] | unknown;
}): string | null {
  const gallery = parseGalleryImages(product.gallery_images);
  for (const img of gallery) {
    const src = resolveGalleryImageSrc(img);
    if (src) return src;
  }
  return null;
}
