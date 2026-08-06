/**
 * Penghitung kunjungan berbasis Supabase.
 *
 * Memanggil RPC `increment_visits` lewat REST API sehingga tidak perlu
 * menambah dependency @supabase/supabase-js. Anon key memang dirancang
 * untuk dipakai di browser; pengamanannya ada di RLS + SECURITY DEFINER
 * pada fungsi SQL (lihat supabase/schema.sql).
 *
 * Bila env belum diisi atau jaringan gagal, fungsi mengembalikan null dan
 * kartu statistik menyembunyikan dirinya sendiri.
 */

// Dashboard Supabase menampilkan endpoint REST lengkap (".../rest/v1/"),
// sementara yang dibutuhkan hanya alamat dasarnya. Keduanya diterima di sini
// agar salah tempel tidak menghasilkan URL ganda seperti "/rest/v1/rest/v1/".
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

/** Satu kunjungan dihitung sekali per sesi tab, bukan per muat halaman. */
const SESSION_KEY = "rb-visit-counted";
const CACHE_KEY = "rb-visit-total";

export const visitorCountConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY,
);

function readCache(): number | null {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    const value = raw ? Number.parseInt(raw, 10) : Number.NaN;

    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function writeCache(total: number) {
  try {
    window.sessionStorage.setItem(CACHE_KEY, String(total));
  } catch {
    /* penyimpanan diblokir, abaikan */
  }
}

/** Menandai sesi ini sudah dihitung. Dipanggil SEBELUM permintaan dikirim. */
function markCounted() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* penyimpanan diblokir, abaikan */
  }
}

/**
 * Permintaan yang sedang berjalan. React StrictMode sengaja menjalankan
 * useEffect dua kali saat development, dan tanpa penjaga ini keduanya
 * sama-sama memanggil increment_visits sehingga satu kunjungan terhitung dua.
 */
let inFlight: Promise<number | null> | null = null;

export function fetchVisitorCount(): Promise<number | null> {
  if (!visitorCountConfigured) return Promise.resolve(null);
  if (inFlight) return inFlight;

  inFlight = requestVisitorCount().finally(() => {
    inFlight = null;
  });

  return inFlight;
}

async function requestVisitorCount(): Promise<number | null> {
  let alreadyCounted = false;
  try {
    alreadyCounted = Boolean(window.sessionStorage.getItem(SESSION_KEY));
  } catch {
    /* penyimpanan diblokir: perlakukan sebagai kunjungan baru */
  }

  const cached = readCache();
  if (alreadyCounted && cached !== null) return cached;

  // Sesi diklaim lebih dulu, bukan setelah balasan tiba. Kalau menunggu
  // balasan, muat ulang cepat atau render ganda sempat menyelinap masuk
  // saat penanda belum sempat ditulis.
  if (!alreadyCounted) markCounted();

  // `increment_visits` menaikkan lalu mengembalikan total; `get_visits`
  // hanya membaca, dipakai saat sesi ini sudah pernah dihitung.
  const endpoint = alreadyCounted ? "get_visits" : "increment_visits";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: "{}",
    });

    if (!response.ok) return cached;

    const total = Number(await response.json());
    if (!Number.isFinite(total)) return cached;

    writeCache(total);

    return total;
  } catch {
    return cached;
  }
}
