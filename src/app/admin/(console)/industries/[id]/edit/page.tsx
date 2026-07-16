import { notFound } from "next/navigation";
import { IndustryEditorForm } from "@/components/admin/industry-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Industry } from "@/types/database";

type Props = { params: { id: string } };

export default async function EditIndustryPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("industries").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  return <IndustryEditorForm industry={data as Industry} />;
}
