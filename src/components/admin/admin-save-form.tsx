"use client";

import { useAdminFeedback } from "@/components/admin/admin-feedback-context";
import type { FormHTMLAttributes, ReactNode } from "react";

export function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

type AdminSaveFormProps = {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
  successMessage?: string;
} & Pick<FormHTMLAttributes<HTMLFormElement>, "id" | "className">;

export function AdminSaveForm({
  action,
  children,
  successMessage = "Perubahan berhasil disimpan.",
  id,
  className,
}: AdminSaveFormProps) {
  const { showToast } = useAdminFeedback();

  async function wrappedAction(formData: FormData) {
    try {
      await action(formData);
      showToast({ variant: "success", message: successMessage });
    } catch (e) {
      if (isNextRedirectError(e)) throw e;
      const message = e instanceof Error ? e.message : "Terjadi kesalahan. Silakan coba lagi.";
      showToast({ variant: "error", message });
    }
  }

  return (
    <form action={wrappedAction} id={id} className={className}>
      {children}
    </form>
  );
}
