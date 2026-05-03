import { notFound } from "next/navigation";
import { ServiceEditorForm } from "@/components/admin/service-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Service } from "@/types/database";

type Props = { params: { id: string } };

export default async function EditServicePage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("services").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  return <ServiceEditorForm service={data as Service} />;
}
