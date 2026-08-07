import { useState } from "react";
import { supabase } from "../lib/supabase";
import { NO_ROWS_MESSAGE } from "./messages";
import { PROFILE_FIELDS } from "./collections";
import RecordForm, { type RecordValues } from "./RecordForm";
import type { PortfolioRow } from "./usePortfolio";

export default function ProfilePage({
  portfolio,
  onSaved,
}: {
  portfolio: PortfolioRow;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (payload: RecordValues) => {
    const client = supabase;
    if (!client) return;

    setBusy(true);
    setSaved(false);

    const { data: updated, error: updateError } = await client
      .from("portfolios")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", portfolio.id)
      .select("id");

    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (!updated?.length) {
      setError(NO_ROWS_MESSAGE);
      return;
    }

    setError(null);
    setSaved(true);
    onSaved();
  };

  const togglePublished = async () => {
    const client = supabase;
    if (!client) return;

    setBusy(true);
    const { data: toggled, error: updateError } = await client
      .from("portfolios")
      .update({ is_published: !portfolio.is_published })
      .eq("id", portfolio.id)
      .select("id");

    setBusy(false);

    if (updateError) setError(updateError.message);
    else if (!toggled?.length) setError(NO_ROWS_MESSAGE);
    else {
      setError(null);
      onSaved();
    }
  };

  return (
    <section className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h2>Profil</h2>
          <p className="admin-muted">
            Data diri yang tampil di hero dan bagian kontak.
          </p>
        </div>
        <button
          type="button"
          className={`admin-ghost${portfolio.is_published ? "" : " is-danger"}`}
          onClick={togglePublished}
          disabled={busy}
        >
          {portfolio.is_published ? "Status: Terbit" : "Status: Disembunyikan"}
        </button>
      </header>

      {!portfolio.is_published && (
        <p className="admin-error">
          Portofolio sedang disembunyikan. Pengunjung tidak bisa membaca
          kontennya sampai status dikembalikan ke Terbit.
        </p>
      )}

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {saved && !error && <p className="admin-notice">Perubahan tersimpan.</p>}

      <div className="admin-card admin-form-card">
        <RecordForm
          fields={PROFILE_FIELDS}
          record={portfolio}
          busy={busy}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
