"use client";

import { useState } from "react";
import { resetSiteConfigSection, updateSiteConfigIndustries } from "@/actions/admin";
import { adminDangerLink, adminInput, adminLabel, adminPrimaryBtn, adminSecondaryBtn } from "@/lib/admin-ui";
import type { IndustryItem } from "@/types/database";

function blankItem(): IndustryItem {
  return { key: `sector-${Date.now()}`, name: "Sektor baru", summary: "" };
}

type Props = {
  initial: IndustryItem[];
};

export function IndustriesSectionEditor({ initial }: Props) {
  const [items, setItems] = useState<IndustryItem[]>(() =>
    initial.length > 0 ? initial.map((x) => ({ ...x })) : [blankItem()],
  );

  function updateAt(index: number, patch: Partial<IndustryItem>) {
    setItems((prev) => {
      const next = [...prev];
      const cur = next[index];
      if (!cur) return prev;
      next[index] = { ...cur, ...patch };
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        Tambah, ubah, atau hapus sektor. Key dipakai untuk URL/ikon — gunakan huruf kecil dan tanda hubung.
      </p>

      <ul className="space-y-4">
        {items.map((row, i) => (
          <li key={`${i}-${row.key}`} className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">#{i + 1}</span>
              <button
                type="button"
                className={adminDangerLink}
                disabled={items.length <= 1}
                title={items.length <= 1 ? "Minimal satu sektor" : "Hapus dari daftar (simpan untuk menerapkan)"}
                onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              >
                Hapus
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className={adminLabel}>Key</label>
                <input
                  className={adminInput}
                  value={row.key}
                  onChange={(e) => updateAt(i, { key: e.target.value })}
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-1">
                <label className={adminLabel}>Nama</label>
                <input
                  className={adminInput}
                  value={row.name}
                  onChange={(e) => updateAt(i, { name: e.target.value })}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={adminLabel}>Ringkasan</label>
                <textarea
                  className={adminInput}
                  rows={2}
                  value={row.summary}
                  onChange={(e) => updateAt(i, { summary: e.target.value })}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`${adminSecondaryBtn} w-full sm:w-auto`}
        onClick={() => setItems((prev) => [...prev, blankItem()])}
      >
        + Tambah industri
      </button>

      <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <form action={updateSiteConfigIndustries} className="w-full sm:w-auto">
          <input type="hidden" name="industries_json" value={JSON.stringify(items)} />
          <button type="submit" className={`${adminPrimaryBtn} w-full sm:w-auto`}>
            Simpan bagian ini
          </button>
        </form>
        <form action={resetSiteConfigSection} className="w-full sm:w-auto">
          <input type="hidden" name="section" value="industries" />
          <button type="submit" className={`${adminSecondaryBtn} w-full sm:w-auto`} title="Kembalikan daftar ke template bawaan">
            Reset ke default
          </button>
        </form>
      </div>
    </div>
  );
}
