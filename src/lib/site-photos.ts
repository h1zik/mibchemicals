/**
 * Foto statis terkurasi dari aset klien (hasil scripts/optimize-photos.mjs → public/photos).
 * Dipakai untuk dekorasi hero/section yang tidak dikelola CMS. Ganti path bila
 * ingin memakai foto lain dari /public/photos.
 */
export const SITE_PHOTOS = {
  /** Hero beranda — gudang drum kimia (landscape). */
  heroWarehouse: "/photos/20260602-123435.webp",
  /** R&D / laboratorium — teknisi memformulasi. */
  lab: "/photos/20260630-090045.webp",
  /** Formulasi lab (potret). */
  formulation: "/photos/screenshot-20260630-155523-gallery.webp",
  /** IBC tote / kemasan produk. */
  packaging: "/photos/20260518-110006.webp",
} as const;
