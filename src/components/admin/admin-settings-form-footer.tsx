import { resetSiteConfigSection } from "@/actions/admin";
import { adminPrimaryBtn, adminSecondaryBtn } from "@/lib/admin-ui";

export type SiteConfigSectionKey =
  | "seo"
  | "company"
  | "hero"
  | "solutions"
  | "industries"
  | "branding";

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
      <form action={resetSiteConfigSection} className="w-full sm:w-auto">
        <input type="hidden" name="section" value={section} />
        <button type="submit" className={`${adminSecondaryBtn} w-full sm:w-auto`} title="Menimpa bagian ini dengan nilai template bawaan aplikasi">
          Reset ke default
        </button>
      </form>
    </div>
  );
}
