import { notFound } from "next/navigation";
import { PostEditorForm } from "@/components/admin/post-editor-form";
import { getPostCategories, mapPostRow, POST_LIST_SELECT } from "@/lib/data/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = { params: { id: string } };

export default async function EditPostPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const [{ data }, categories] = await Promise.all([
    supabase.from("posts").select(POST_LIST_SELECT).eq("id", params.id).maybeSingle(),
    getPostCategories(),
  ]);
  if (!data) notFound();
  return <PostEditorForm post={mapPostRow(data as Record<string, unknown>)} categories={categories} />;
}
