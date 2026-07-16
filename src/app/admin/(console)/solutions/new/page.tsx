import { SolutionEditorForm } from "@/components/admin/solution-editor-form";
import { getIndustries } from "@/lib/data/queries";

export default async function NewSolutionPage() {
  const industries = await getIndustries();
  return <SolutionEditorForm industries={industries.map((i) => ({ id: i.id, name: i.name }))} />;
}
