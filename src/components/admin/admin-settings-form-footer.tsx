"use client";

import { useState } from "react";
import { resetSiteConfigSection } from "@/actions/admin";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { adminPrimaryBtn } from "@/lib/admin-ui";

export type SiteConfigSectionKey =
  | "seo"
  | "company"
  | "hero"
  | "solutions"
  | "industries"
  | "branding"
  | "about"
  | "analytics"
  | "credibility"
  | "about_gallery";

type Props = {
  formId: string;
  section: SiteConfigSectionKey;
};

export function AdminSettingsFormFooter({ formId, section }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-admin-line pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      {confirmReset ? (
        <AdminSaveForm
          action={async (fd) => {
            await resetSiteConfigSection(fd);
            setConfirmReset(false);
          }}
          className="flex flex-wrap items-center gap-2"
          successMessage="Bagian ini dikembalikan ke nilai default."
        >
          <input type="hidden" name="section" value={section} />
          <span className="text-sm text-admin-ink">Timpa isi bagian ini dengan nilai default?</span>
          <AdminSubmitButton
            pendingLabel="Mereset…"
            className="inline-flex items-center gap-1.5 rounded-lg bg-admin-danger px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Ya, reset
          </AdminSubmitButton>
          <button
            type="button"
            onClick={() => setConfirmReset(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-admin-muted transition hover:bg-admin-canvas hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
          >
            Batal
          </button>
        </AdminSaveForm>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="rounded-lg px-1 py-2 text-left text-sm font-medium text-admin-muted underline decoration-admin-line underline-offset-4 transition hover:text-admin-ink hover:decoration-admin-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
          title="Menimpa bagian ini dengan nilai template bawaan aplikasi"
        >
          Reset ke default
        </button>
      )}
      <AdminSubmitButton form={formId} className={`${adminPrimaryBtn} w-full sm:w-auto`}>
        Simpan bagian ini
      </AdminSubmitButton>
    </div>
  );
}
