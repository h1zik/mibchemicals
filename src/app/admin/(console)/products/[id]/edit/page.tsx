import { notFound } from "next/navigation";
import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { getProductCategories, mapProductRow, PRODUCT_LIST_SELECT } from "@/lib/data/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = { params: { id: string } };

export default async function EditProductPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const [{ data }, categories] = await Promise.all([
    supabase.from("products").select(PRODUCT_LIST_SELECT).eq("id", params.id).maybeSingle(),
    getProductCategories(),
  ]);
  if (!data) notFound();
  const product = mapProductRow(data as Record<string, unknown>);
  return <ProductEditorForm product={product} categories={categories} />;
}
