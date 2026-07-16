// Konversi & optimasi foto klien dari assets/ → public/photos/ (WebP).
// - HEIC dikonversi ke JPEG dulu (heic-convert), lalu dioptimasi sharp.
// - Auto-rotate berdasarkan EXIF, resize lebar maks, ekspor WebP.
// Jalankan sekali: `node scripts/optimize-photos.mjs`
//
// Opsi env:
//   MAX_WIDTH (default 1600)  — lebar maksimum output
//   QUALITY   (default 72)    — kualitas WebP
//   SRC       (default assets)
//   OUT       (default public/photos)

import { readdir, mkdir, writeFile, readFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";
import heicConvert from "heic-convert";

const SRC = process.env.SRC || "assets";
const OUT = process.env.OUT || join("public", "photos");
const MAX_WIDTH = Number(process.env.MAX_WIDTH || 1600);
const QUALITY = Number(process.env.QUALITY || 72);

function slugifyName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 80);
}

async function toJpegBufferIfHeic(filePath, ext) {
  const input = await readFile(filePath);
  if (ext === ".heic" || ext === ".heif") {
    const out = await heicConvert({ buffer: input, format: "JPEG", quality: 0.92 });
    return Buffer.from(out);
  }
  return input;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const files = await readdir(SRC);
  const images = files.filter((f) => /\.(jpe?g|png|heic|heif|webp)$/i.test(f));
  if (images.length === 0) {
    console.log(`Tidak ada gambar di ${SRC}/`);
    return;
  }

  const manifest = [];
  let ok = 0;
  let fail = 0;

  for (const file of images) {
    const ext = extname(file).toLowerCase();
    const outName = `${slugifyName(basename(file, ext))}.webp`;
    const outPath = join(OUT, outName);
    try {
      const jpegOrRaw = await toJpegBufferIfHeic(join(SRC, file), ext);
      const img = sharp(jpegOrRaw).rotate(); // auto-orient dari EXIF
      const meta = await img.metadata();
      const pipeline = img.resize({
        width: Math.min(MAX_WIDTH, meta.width || MAX_WIDTH),
        withoutEnlargement: true,
      });
      const buf = await pipeline.webp({ quality: QUALITY }).toBuffer();
      await writeFile(outPath, buf);
      const finalMeta = await sharp(buf).metadata();
      manifest.push({
        src: file,
        out: `/photos/${outName}`,
        width: finalMeta.width,
        height: finalMeta.height,
        kb: Math.round(buf.length / 1024),
      });
      ok++;
      console.log(`✓ ${file} → ${outName} (${Math.round(buf.length / 1024)} KB)`);
    } catch (e) {
      fail++;
      console.warn(`✗ ${file}: ${e.message}`);
    }
  }

  await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nSelesai: ${ok} berhasil, ${fail} gagal. Manifest: ${join(OUT, "manifest.json")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
