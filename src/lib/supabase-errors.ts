/** PostgREST / Supabase saat kolom `gallery_images` belum di-migrate */
export function throwIfMissingGalleryColumn(error: { message?: string } | null) {
  const msg = error?.message ?? "";
  if (msg.includes("gallery_images") || msg.includes("schema cache")) {
    throw new Error(
      "Kolom gallery_images belum ada di database. Buka Supabase → SQL Editor, jalankan seluruh isi file `supabase/migrations/002_product_gallery.sql` dari project ini, lalu tunggu ±1 menit dan coba lagi."
    );
  }
}
