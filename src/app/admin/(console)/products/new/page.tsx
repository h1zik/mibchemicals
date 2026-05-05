import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { getProductCategories } from "@/lib/data/queries";

export default async function NewProductPage() {
  const categories = await getProductCategories();
  return <ProductEditorForm categories={categories} />;
}
