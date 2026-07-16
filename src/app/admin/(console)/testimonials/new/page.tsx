import { TestimonialEditorForm } from "@/components/admin/testimonial-editor-form";
import { getIndustries } from "@/lib/data/queries";

export default async function NewTestimonialPage() {
  const industries = await getIndustries();
  return <TestimonialEditorForm industries={industries.map((i) => ({ id: i.id, name: i.name }))} />;
}
