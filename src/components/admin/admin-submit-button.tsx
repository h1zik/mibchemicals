"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { useOptionalAdminFeedback } from "@/components/admin/admin-feedback-context";
import { adminPrimaryBtn } from "@/lib/admin-ui";

type Props = {
  children: React.ReactNode;
  pendingLabel?: string;
  /** Id form bila tombol diletakkan di luar elemen `<form>`. */
  form?: string;
  className?: string;
  /** Status pending manual (form yang tidak memakai server action). */
  pending?: boolean;
  title?: string;
};

export function AdminSubmitButton({
  children,
  pendingLabel = "Menyimpan…",
  form,
  className = adminPrimaryBtn,
  pending: pendingProp,
  title,
}: Props) {
  const status = useFormStatus();
  const feedback = useOptionalAdminFeedback();
  const pending =
    pendingProp ?? (form ? Boolean(feedback?.pendingForms.has(form)) : status.pending);

  return (
    <button
      type="submit"
      form={form}
      disabled={pending}
      aria-disabled={pending}
      title={title}
      className={className}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      <span>{pending ? pendingLabel : children}</span>
    </button>
  );
}
