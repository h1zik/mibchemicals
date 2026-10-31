"use client";

import { useState } from "react";
import { updateSiteConfigCredibility } from "@/actions/admin";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { AdminSettingsFormFooter } from "@/components/admin/admin-settings-form-footer";
import { adminDangerLink, adminInput, adminLabel, adminSecondaryBtn } from "@/lib/admin-ui";
import type { Certification, CompanyStat } from "@/types/database";

type Props = {
  initialStats: CompanyStat[];
  initialCerts: Certification[];
};

export function CredibilitySectionEditor({ initialStats, initialCerts }: Props) {
  const [stats, setStats] = useState<CompanyStat[]>(() => initialStats.map((x) => ({ ...x })));
  const [certs, setCerts] = useState<Certification[]>(() => initialCerts.map((x) => ({ ...x })));

  function updateStat(i: number, patch: Partial<CompanyStat>) {
    setStats((prev) => prev.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  }
  function updateCert(i: number, patch: Partial<Certification>) {
    setCerts((prev) => prev.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-admin-muted">
        Angka statistik dan sertifikasi tampil di blok kredibilitas beranda &amp; halaman Tentang. Biarkan kosong jika
        belum ada data resmi — blok akan otomatis disembunyikan. <strong>Jangan isi angka/sertifikat yang tidak nyata.</strong>
      </p>

      {/* Statistik */}
      <div>
        <h4 className="font-display text-sm font-semibold text-admin-ink">Statistik perusahaan</h4>
        <ul className="mt-3 space-y-3">
          {stats.map((row, i) => (
            <li key={i} className="rounded-xl border border-admin-line bg-admin-canvas/60 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-admin-muted">#{i + 1}</span>
                <button type="button" className={adminDangerLink} onClick={() => setStats((p) => p.filter((_, j) => j !== i))}>
                  Hapus
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <div>
                  <label className={adminLabel}>Angka</label>
                  <input
                    type="number"
                    className={adminInput}
                    value={row.value}
                    onChange={(e) => updateStat(i, { value: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={adminLabel}>Suffix</label>
                  <input className={adminInput} value={row.suffix} placeholder="+  / %  / /7" onChange={(e) => updateStat(i, { suffix: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={adminLabel}>Label</label>
                  <input className={adminInput} value={row.label} placeholder="Tahun berpengalaman" onChange={(e) => updateStat(i, { label: e.target.value })} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${adminSecondaryBtn} mt-3 w-full sm:w-auto`}
          onClick={() => setStats((p) => [...p, { value: 0, suffix: "+", label: "" }])}
        >
          + Tambah statistik
        </button>
      </div>

      {/* Sertifikasi */}
      <div className="border-t border-admin-line pt-6">
        <h4 className="font-display text-sm font-semibold text-admin-ink">Sertifikasi / akreditasi</h4>
        <ul className="mt-3 space-y-3">
          {certs.map((row, i) => (
            <li key={i} className="rounded-xl border border-admin-line bg-admin-canvas/60 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-admin-muted">#{i + 1}</span>
                <button type="button" className={adminDangerLink} onClick={() => setCerts((p) => p.filter((_, j) => j !== i))}>
                  Hapus
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={adminLabel}>Nama</label>
                  <input className={adminInput} value={row.name} placeholder="ISO 9001:2015" onChange={(e) => updateCert(i, { name: e.target.value })} />
                </div>
                <div>
                  <label className={adminLabel}>URL logo (opsional)</label>
                  <input className={`${adminInput} font-mono text-sm`} value={row.image_url ?? ""} placeholder="https://…" onChange={(e) => updateCert(i, { image_url: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={adminLabel}>Deskripsi</label>
                  <textarea className={adminInput} rows={2} value={row.description} onChange={(e) => updateCert(i, { description: e.target.value })} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${adminSecondaryBtn} mt-3 w-full sm:w-auto`}
          onClick={() => setCerts((p) => [...p, { name: "", description: "", image_url: "" }])}
        >
          + Tambah sertifikasi
        </button>
      </div>

      <AdminSaveForm id="settings-credibility" action={updateSiteConfigCredibility} successMessage="Kredibilitas disimpan.">
        <input type="hidden" name="company_stats_json" value={JSON.stringify(stats)} />
        <input
          type="hidden"
          name="certifications_json"
          value={JSON.stringify(certs.map((c) => ({ ...c, image_url: c.image_url?.trim() || undefined })))}
        />
      </AdminSaveForm>
      <AdminSettingsFormFooter formId="settings-credibility" section="credibility" />
    </div>
  );
}
