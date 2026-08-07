import { CONTENT_QUERIES, mapContent } from "../data/mapContent.js";
import { applyLiveContent, type LiveContent } from "../data/content";

/**
 * Menyegarkan konten dari Supabase setelah halaman tampil.
 *
 * Memakai fetch biasa, bukan SDK Supabase, supaya bundel publik tidak ikut
 * membesar. Semua data yang diambil memang sudah publik -- dibaca lewat
 * anon key dengan policy baca yang sama seperti pengunjung mana pun.
 *
 * Kegagalan apa pun diabaikan tanpa suara: konten panggangan dari build
 * sudah tampil dan tetap benar. Itu yang membuat situs tidak pernah kosong
 * meski project Supabase sedang dijeda.
 */

const URL_BASE = (import.meta.env.VITE_SUPABASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();
const SLUG = "rianbayu";

export const liveContentConfigured = Boolean(URL_BASE && KEY);

async function get(path: string) {
  const response = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  return response.json();
}

export async function refreshContent(): Promise<boolean> {
  if (!liveContentConfigured) return false;

  try {
    const portfolios = await get(
      `portfolios?slug=eq.${SLUG}&select=*&limit=1`,
    );
    const portfolio = portfolios[0];
    if (!portfolio) return false;

    const tables = Object.entries(CONTENT_QUERIES) as [string, string][];
    const results = await Promise.all(
      tables.map(([table, cols]) =>
        get(
          `${table}?portfolio_id=eq.${portfolio.id}&select=${cols}&order=sort_order.asc`,
        ),
      ),
    );

    const raw = Object.fromEntries(
      tables.map(([table], index) => [table, results[index]]),
    );

    // Penjaga yang sama seperti di script build: jangan pernah mengganti
    // konten yang tampil dengan hasil kosong.
    if (!raw.experiences?.length && !raw.projects?.length) return false;

    return applyLiveContent(mapContent(portfolio, raw) as LiveContent);
  } catch {
    return false;
  }
}
