import { notFound } from "next/navigation";
import { PostEditorForm } from "@/components/admin/post-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Post } from "@/types/database";

type Props = { params: { id: string } };

export default async function EditPostPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("posts").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  return <PostEditorForm post={data as Post} />;
}
