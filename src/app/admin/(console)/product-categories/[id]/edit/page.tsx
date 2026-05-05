import { notFound } from "next/navigation";
import { ProductCategoryEditorForm } from "@/components/admin/product-category-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/types/database";

type Props = { params: { id: string } };

export default async function EditProductCategoryPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("product_categories")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  return <ProductCategoryEditorForm category={data as ProductCategory} />;
}
