"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { parseGalleryImages, type ProductGalleryImage } from "@/lib/product-gallery";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { throwIfMissingGalleryColumn } from "@/lib/supabase-errors";

async function requireAdminSupabase() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
  return supabase;
}

export async function appendProductGalleryImage(formData: FormData): Promise<void> {
  const supabase = await requireAdminSupabase();
  const productId = String(formData.get("product_id") ?? "");
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim() || undefined;

  if (!productId || !(file instanceof File) || file.size === 0) {
    throw new Error("Produk dan file wajib diisi");
  }

  const { data: product, error: fetchErr } = await supabase
    .from("products")
    .select("slug, gallery_images")
    .eq("id", productId)
    .maybeSingle();

  throwIfMissingGalleryColumn(fetchErr);
  if (fetchErr) throw new Error(fetchErr.message);
  if (!product?.slug) throw new Error("Produk tidak ditemukan");

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${product.slug}/${Date.now()}-${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  const { error: upErr } = await supabase.storage.from("product-gallery").upload(path, buf, {
    contentType,
    upsert: false,
  });
  if (upErr) throw new Error(upErr.message);

  const current = parseGalleryImages(product.gallery_images);
  const next: ProductGalleryImage[] = [...current, { path, alt }];

  const { error: updErr } = await supabase
    .from("products")
    .update({ gallery_images: next })
    .eq("id", productId);
  if (updErr) {
    throwIfMissingGalleryColumn(updErr);
    throw new Error(updErr.message);
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${productId}/edit`);
}

export async function removeProductGalleryImage(formData: FormData): Promise<void> {
  const supabase = await requireAdminSupabase();
  const productId = String(formData.get("product_id") ?? "");
  const indexRaw = formData.get("index");
  const index = typeof indexRaw === "string" ? parseInt(indexRaw, 10) : Number(indexRaw);

  if (!productId || !Number.isInteger(index) || index < 0) {
    throw new Error("Permintaan tidak valid");
  }

  const { data: product, error: fetchErr } = await supabase
    .from("products")
    .select("gallery_images")
    .eq("id", productId)
    .maybeSingle();

  throwIfMissingGalleryColumn(fetchErr);
  if (fetchErr) throw new Error(fetchErr.message);
  if (!product) throw new Error("Produk tidak ditemukan");

  const current = parseGalleryImages(product.gallery_images);
  if (index >= current.length) throw new Error("Index tidak valid");

  const removed = current[index];
  const next = current.filter((_, i) => i !== index);

  if (removed.path && z.string().min(1).safeParse(removed.path).success) {
    await supabase.storage.from("product-gallery").remove([removed.path]);
  }

  const { error: updErr } = await supabase
    .from("products")
    .update({ gallery_images: next })
    .eq("id", productId);
  if (updErr) {
    throwIfMissingGalleryColumn(updErr);
    throw new Error(updErr.message);
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${productId}/edit`);
}
