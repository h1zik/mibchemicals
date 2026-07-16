"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = { slug: string; name: string };

export function IndustryFinder({ options }: { options: Option[] }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  function go(target: string) {
    if (target) router.push(`/industries/${target}`);
  }

  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white/80 p-3 shadow-card backdrop-blur sm:flex-row sm:items-center">
      <label htmlFor="industry-finder" className="shrink-0 pl-1 text-sm font-semibold text-mib-ink">
        Pilih industri Anda
      </label>
      <div className="flex flex-1 gap-2">
        <select
          id="industry-finder"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-mib focus:ring-2 focus:ring-mib/15"
        >
          <option value="">— Pilih sektor —</option>
          {options.map((o) => (
            <option key={o.slug} value={o.slug}>{o.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => go(slug)}
          disabled={!slug}
          className="shrink-0 rounded-lg bg-mib-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-glow-lg disabled:pointer-events-none disabled:opacity-50"
        >
          Cari solusi
        </button>
      </div>
    </div>
  );
}
