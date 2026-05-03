import { appendProductGalleryImage, removeProductGalleryImage } from "@/actions/admin-product-gallery";
import type { ProductGalleryImage } from "@/lib/product-gallery";
import { resolveGalleryImageSrc } from "@/lib/product-gallery";
import { adminInput, adminLabel } from "@/lib/admin-ui";

type Props = {
  productId: string;
  images: ProductGalleryImage[];
};

export function AdminProductGallery({ productId, images }: Props) {
  const uploadBtn =
    "inline-flex items-center justify-center rounded-lg border-2 border-mib bg-white px-4 py-2 text-sm font-semibold text-mib shadow-sm transition hover:bg-mib/5";

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, index) => {
            const src = resolveGalleryImageSrc(img);
            return (
              <li
                key={`${index}-${img.path ?? img.url ?? ""}`}
                className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm"
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-neutral-100 text-xs text-neutral-500">
                    URL tidak valid
                  </div>
                )}
                <form action={removeProductGalleryImage} className="absolute right-1.5 top-1.5">
                  <input type="hidden" name="product_id" value={productId} />
                  <input type="hidden" name="index" value={String(index)} />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-md hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-neutral-500">Belum ada gambar.</p>
      )}

      <form action={appendProductGalleryImage} className="flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:flex-wrap sm:items-end">
        <input type="hidden" name="product_id" value={productId} />
        <div className="min-w-0 flex-1 sm:max-w-xs">
          <label htmlFor={`gallery-file-${productId}`} className={adminLabel}>
            File gambar
          </label>
          <input
            id={`gallery-file-${productId}`}
            type="file"
            name="file"
            required
            accept="image/*"
            className="mt-1 block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-mib/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-mib hover:file:bg-mib/15"
          />
        </div>
        <div className="min-w-0 flex-1 sm:max-w-xs">
          <label htmlFor={`gallery-alt-${productId}`} className={adminLabel}>
            Teks alternatif (opsional)
          </label>
          <input
            id={`gallery-alt-${productId}`}
            name="alt"
            placeholder="Deskripsi singkat"
            className={adminInput}
          />
        </div>
        <button type="submit" className={uploadBtn}>
          Tambah gambar
        </button>
      </form>
    </div>
  );
}
