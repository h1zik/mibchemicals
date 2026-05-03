import { notFound } from "next/navigation";
import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { parseGalleryImages } from "@/lib/product-gallery";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

type Props = { params: { id: string } };

export default async function EditProductPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("products").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const raw = data as Record<string, unknown>;
  const product = {
    ...data,
    gallery_images: parseGalleryImages(raw.gallery_images),
  } as Product;
  return <ProductEditorForm product={product} />;
}
