import { Rocket, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { NO_ROWS_MESSAGE } from "./messages";

type Status =
  | { kind: "idle" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export default function PublishPanel({
  portfolioId,
}: {
  portfolioId: string;
}) {
  const [hook, setHook] = useState("");
  const [savedHook, setSavedHook] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const load = useCallback(async () => {
    const client = supabase;
    if (!client) return;

    setLoading(true);
    const { data } = await client
      .from("portfolio_secrets")
      .select("deploy_hook_url")
      .eq("portfolio_id", portfolioId)
      .maybeSingle();

    const value = (data?.deploy_hook_url as string | null) ?? "";
    setHook(value);
    setSavedHook(value);
    setLoading(false);
  }, [portfolioId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveHook = async () => {
    const client = supabase;
    if (!client) return;

    const value = hook.trim();
    if (value && !value.startsWith("https://")) {
      setStatus({ kind: "error", message: "Deploy hook harus diawali https://" });
      return;
    }

    setBusy(true);
    const { data, error } = await client
      .from("portfolio_secrets")
      .upsert(
        {
          portfolio_id: portfolioId,
          deploy_hook_url: value || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "portfolio_id" },
      )
      .select("portfolio_id");

    setBusy(false);

    if (error) {
      setStatus({ kind: "error", message: error.message });
      return;
    }

    if (!data?.length) {
      setStatus({ kind: "error", message: NO_ROWS_MESSAGE });
      return;
    }

    setSavedHook(value);
    setStatus({ kind: "idle" });
  };

  const publish = async () => {
    if (!savedHook) return;

    setBusy(true);
    try {
      // Cloudflare tidak mengizinkan pembacaan respons dari browser, jadi
      // permintaannya dikirim dengan mode no-cors: memicu build tetap
      // berhasil, tetapi hasilnya memang tidak bisa dibaca dari sini.
      await fetch(savedHook, { method: "POST", mode: "no-cors" });
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: "Permintaan gagal terkirim. Periksa URL deploy hook-nya.",
      });
    }
    setBusy(false);
  };

  return (
    <section className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h2>Terbitkan</h2>
          <p className="admin-muted">
            Memicu build ulang agar data panggangan situs ikut diperbarui.
          </p>
        </div>
        <button
          type="button"
          className="admin-primary"
          onClick={publish}
          disabled={busy || loading || !savedHook}
          title={savedHook ? undefined : "Isi deploy hook lebih dulu"}
        >
          <Rocket size={15} />
          Terbitkan sekarang
        </button>
      </header>

      {status.kind === "error" && (
        <p className="admin-error" role="alert">
          {status.message}
        </p>
      )}

      {status.kind === "sent" && (
        <p className="admin-notice">
          Permintaan build terkirim. Cloudflare biasanya selesai dalam 1-3
          menit. Browser tidak bisa membaca balasannya, jadi pastikan lewat
          dashboard Cloudflare kalau ingin melihat statusnya.
        </p>
      )}

      <div className="admin-card admin-form-card">
        <label className="admin-field">
          <span>Deploy Hook Cloudflare Pages</span>
          <input
            type="text"
            value={hook}
            onChange={(event) => setHook(event.target.value)}
            placeholder="https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/..."
            autoComplete="off"
            spellCheck={false}
          />
          <small className="admin-muted">
            Ambil di Cloudflare Pages → Settings → Builds &amp; deployments →
            Deploy hooks. URL ini rahasia dan disimpan di tabel yang hanya
            bisa dibaca oleh akun Anda.
          </small>
        </label>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-ghost"
            onClick={saveHook}
            disabled={busy || loading || hook.trim() === savedHook}
          >
            <Save size={15} />
            Simpan hook
          </button>
        </div>
      </div>

      <p className="admin-muted admin-footnote">
        Perubahan konten sebenarnya sudah langsung terlihat pengunjung tanpa
        menekan tombol ini, karena situs menyegarkan dirinya dari database
        setelah halaman tampil. Menerbitkan hanya memperbarui data yang
        dipanggang ke dalam build, supaya tampilan pertama sebelum
        penyegaran pun sudah versi terbaru.
      </p>
    </section>
  );
}
