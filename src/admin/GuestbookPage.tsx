import { Check, Trash2, Undo2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { NO_ROWS_MESSAGE } from "./messages";

type Entry = {
  id: string;
  name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
};

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function GuestbookPage({
  portfolioId,
}: {
  portfolioId: string;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = supabase;
    if (!client) return;

    setLoading(true);
    const { data, error: queryError } = await client
      .from("guestbook")
      .select("id, name, message, is_approved, created_at")
      .eq("portfolio_id", portfolioId)
      .order("created_at", { ascending: false });

    if (queryError) setError(queryError.message);
    else {
      setError(null);
      setEntries((data ?? []) as Entry[]);
    }

    setLoading(false);
  }, [portfolioId]);

  useEffect(() => {
    load();
  }, [load]);

  const setApproval = async (id: string, approved: boolean) => {
    const client = supabase;
    if (!client) return;

    setBusy(true);
    const { data: updated, error: updateError } = await client
      .from("guestbook")
      .update({ is_approved: approved })
      .eq("id", id)
      .eq("portfolio_id", portfolioId)
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
    await load();
  };

  const remove = async (id: string) => {
    const client = supabase;
    if (!client) return;

    setBusy(true);
    const { data: removed, error: deleteError } = await client
      .from("guestbook")
      .delete()
      .eq("id", id)
      .eq("portfolio_id", portfolioId)
      .select("id");

    setBusy(false);
    setConfirmId(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (!removed?.length) {
      setError(NO_ROWS_MESSAGE);
      return;
    }

    setError(null);
    await load();
  };

  const pending = entries.filter((entry) => !entry.is_approved);
  const approved = entries.filter((entry) => entry.is_approved);

  return (
    <section className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h2>Buku Tamu</h2>
          <p className="admin-muted">
            {loading
              ? "Memuat..."
              : `${pending.length} menunggu · ${approved.length} tayang`}
          </p>
        </div>
      </header>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <p className="admin-muted admin-footnote">
        Pesan baru masuk dalam keadaan belum disetujui dan tidak terlihat
        publik sampai Anda menyetujuinya.
      </p>

      <ul className="admin-list">
        {entries.map((entry) => (
          <li key={entry.id} className="admin-row is-stacked">
            <div className="admin-row-main">
              <strong>
                {entry.name}
                <span
                  className={`admin-tag${entry.is_approved ? " is-live" : ""}`}
                >
                  {entry.is_approved ? "Tayang" : "Menunggu"}
                </span>
              </strong>
              <small className="admin-muted">
                {dateFormat.format(new Date(entry.created_at))}
              </small>
              <p className="admin-message">{entry.message}</p>
            </div>

            <div className="admin-row-actions">
              {entry.is_approved ? (
                <button
                  type="button"
                  className="admin-icon"
                  onClick={() => setApproval(entry.id, false)}
                  disabled={busy}
                  title="Sembunyikan lagi"
                >
                  <Undo2 size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  className="admin-icon"
                  onClick={() => setApproval(entry.id, true)}
                  disabled={busy}
                  title="Setujui"
                >
                  <Check size={15} />
                </button>
              )}

              {confirmId === entry.id ? (
                <span className="admin-confirm">
                  <button
                    type="button"
                    className="admin-icon is-danger"
                    onClick={() => remove(entry.id)}
                    disabled={busy}
                  >
                    Hapus?
                  </button>
                  <button
                    type="button"
                    className="admin-icon"
                    onClick={() => setConfirmId(null)}
                    disabled={busy}
                  >
                    Batal
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="admin-icon is-danger"
                  onClick={() => setConfirmId(entry.id)}
                  disabled={busy}
                  title="Hapus"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </li>
        ))}

        {!loading && entries.length === 0 && (
          <li className="admin-empty admin-muted">Belum ada pesan masuk.</li>
        )}
      </ul>
    </section>
  );
}
