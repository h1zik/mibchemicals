import { notFound } from "next/navigation";
import { PostCategoryEditorForm } from "@/components/admin/post-category-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PostCategory } from "@/types/database";

type Props = { params: { id: string } };

export default async function EditPostCategoryPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("post_categories")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  return <PostCategoryEditorForm category={data as PostCategory} />;
}
