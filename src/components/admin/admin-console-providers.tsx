"use client";

import type { ReactNode } from "react";
import { AdminFeedbackProvider } from "@/components/admin/admin-feedback-context";

export function AdminConsoleProviders({ children }: { children: ReactNode }) {
  return <AdminFeedbackProvider>{children}</AdminFeedbackProvider>;
}
