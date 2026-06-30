-- Google Analytics (GA4) — Measurement ID diatur dari admin panel
-- (Pengaturan situs → Analytics). Kosong = GA tidak dimuat.

alter table public.site_config
  add column if not exists ga_measurement_id text;

comment on column public.site_config.ga_measurement_id is
  'GA4 Measurement ID (mis. G-XXXXXXXXXX). Kosong/null = Google Analytics tidak dimuat.';
