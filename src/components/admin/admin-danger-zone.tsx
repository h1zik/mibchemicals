import { AdminDeleteButton } from "@/components/admin/admin-delete-button";

type Props = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  /** Kata benda entri, mis. "solusi". */
  noun: string;
  /** Kalimat tambahan tentang dampak penghapusan. */
  note?: string;
};

export function AdminDangerZone({ action, id, noun, note }: Props) {
  return (
    <aside className="mt-10 flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0">
        <h2 className="font-display text-base font-semibold text-red-900">Hapus {noun}</h2>
        <p className="mt-0.5 text-sm leading-relaxed text-red-800/85">
          {note ?? `Menghapus ${noun} tidak dapat dibatalkan.`}
        </p>
      </div>
      <AdminDeleteButton action={action} id={id} variant="block" label={`Hapus ${noun}`} />
    </aside>
  );
}
