/**
 * Ambil favicon_url dari site_config (anon REST), untuk edge middleware
 * saat browser meminta GET /favicon.ico (di luar tag <link> di HTML).
 */
export async function fetchSiteFaviconUrl(): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_config?singleton_key=eq.main&select=favicon_url`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) return null;
    const body: unknown = await res.json();
    if (!Array.isArray(body) || body.length === 0) return null;
    const row = body[0] as { favicon_url?: unknown };
    const raw = row.favicon_url;
    const url = typeof raw === "string" ? raw.trim() : "";
    return url.length > 0 ? url : null;
  } catch {
    return null;
  }
}
