import { notFound } from "next/navigation";
import { TestimonialEditorForm } from "@/components/admin/testimonial-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIndustries } from "@/lib/data/queries";
import type { Testimonial } from "@/types/database";

type Props = { params: { id: string } };

export default async function EditTestimonialPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const [{ data }, industries] = await Promise.all([
    supabase.from("testimonials").select("*").eq("id", params.id).maybeSingle(),
    getIndustries(),
  ]);
  if (!data) notFound();
  return (
    <TestimonialEditorForm
      testimonial={data as Testimonial}
      industries={industries.map((i) => ({ id: i.id, name: i.name }))}
    />
  );
}
