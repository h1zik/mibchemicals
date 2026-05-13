"use client";

import { resetSiteConfigSection } from "@/actions/admin";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { adminPrimaryBtn, adminSecondaryBtn } from "@/lib/admin-ui";

export type SiteConfigSectionKey =
  | "seo"
  | "company"
  | "hero"
  | "solutions"
  | "industries"
  | "branding"
  | "about";

type Props = {
  formId: string;
  section: SiteConfigSectionKey;
};

export function AdminSettingsFormFooter({ formId, section }: Props) {
  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <button type="submit" form={formId} className={`${adminPrimaryBtn} w-full sm:w-auto`}>
        Simpan bagian ini
      </button>
      <AdminSaveForm
        action={resetSiteConfigSection}
        className="w-full sm:w-auto"
        successMessage="Bagian ini dikembalikan ke nilai bawaan."
      >
        <input type="hidden" name="section" value={section} />
        <button type="submit" className={`${adminSecondaryBtn} w-full sm:w-auto`} title="Menimpa bagian ini dengan nilai template bawaan aplikasi">
          Reset ke default
        </button>
      </AdminSaveForm>
    </div>
  );
}
