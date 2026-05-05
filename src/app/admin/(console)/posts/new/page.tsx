import { PostEditorForm } from "@/components/admin/post-editor-form";
import { getPostCategories } from "@/lib/data/queries";

export default async function NewPostPage() {
  const categories = await getPostCategories();
  return <PostEditorForm categories={categories} />;
}
