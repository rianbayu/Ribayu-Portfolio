import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type PortfolioRow = {
  id: string;
  name: string;
  theme: string;
  is_published: boolean;
  [key: string]: unknown;
};

export type PortfolioState = {
  portfolio: PortfolioRow | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/**
 * Mengambil baris portofolio milik pengguna yang sedang masuk.
 *
 * `portfolio.id` dipakai sebagai portfolio_id di setiap operasi tulis.
 * Nilainya tetap datang dari database, bukan dari input pengguna, dan
 * RLS di sisi Postgres tetap menjadi penjaga terakhirnya.
 */
export function usePortfolio(): PortfolioState {
  const [portfolio, setPortfolio] = useState<PortfolioRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);

    const run = async () => {
      // Portofolio dicari berdasarkan PEMILIK, bukan slug.
      //
      // Policy SELECT sengaja mengizinkan siapa pun membaca portofolio yang
      // terbit, karena situs publik membutuhkannya. Kalau admin mencari
      // berdasarkan slug, setiap pengguna yang login akan mendapat baris itu
      // dan melihat isinya -- meski RLS tetap menolak upayanya menulis.
      // Menyaring berdasarkan owner_id membuat admin hanya pernah memuat
      // portofolio milik pengguna yang sedang masuk.
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!active) return;

      if (!user) {
        setError("Sesi tidak valid. Silakan masuk ulang.");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await client
        .from("portfolios")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!active) return;

      if (queryError) {
        setError(queryError.message);
      } else if (!data) {
        setError(
          "Akun ini belum memiliki portofolio. Hanya pemilik yang bisa mengelola konten di sini.",
        );
        setPortfolio(null);
      } else {
        setError(null);
        setPortfolio(data as PortfolioRow);
      }

      setLoading(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [nonce]);

  return {
    portfolio,
    loading,
    error,
    reload: () => setNonce((value) => value + 1),
  };
}
