import { notFound } from "next/navigation";
import { SolutionEditorForm } from "@/components/admin/solution-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIndustries } from "@/lib/data/queries";
import type { Solution } from "@/types/database";

type Props = { params: { id: string } };

export default async function EditSolutionPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const [{ data }, industries] = await Promise.all([
    supabase.from("solutions").select("*").eq("id", params.id).maybeSingle(),
    getIndustries(),
  ]);
  if (!data) notFound();
  return (
    <SolutionEditorForm
      solution={data as Solution}
      industries={industries.map((i) => ({ id: i.id, name: i.name }))}
    />
  );
}
