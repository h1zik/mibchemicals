"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const leadSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  company: z.string().min(1, "Perusahaan wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().min(1, "Pesan wajib diisi"),
});

export type LeadActionState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitLead(
  _prev: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    industry: formData.get("industry") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { error: "Konfigurasi database belum tersedia." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    company: parsed.data.company,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    industry: parsed.data.industry ?? null,
    message: parsed.data.message,
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
