import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk kebutuhan admin (login + CRUD terautentikasi).
 *
 * Sengaja HANYA diimpor dari dalam bundel admin yang dimuat lazy, supaya
 * SDK-nya tidak ikut terunduh oleh pengunjung biasa yang cuma membuka
 * halaman portofolio. Penghitung pengunjung tetap memakai fetch biasa
 * di src/lib/visitorCount.ts karena tidak butuh sesi.
 */

const url = (import.meta.env.VITE_SUPABASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

export const supabaseConfigured = Boolean(url && key);

// createClient melempar error kalau URL kosong, jadi dijaga di sini dan
// admin menampilkan pesan yang jelas ketimbang layar putih.
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const PORTFOLIO_SLUG = "rianbayu";
