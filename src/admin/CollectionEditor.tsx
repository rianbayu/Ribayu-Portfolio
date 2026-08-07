import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { NO_ROWS_MESSAGE } from "./messages";
import type { CollectionSpec } from "./collections";
import RecordForm, { type RecordValues } from "./RecordForm";

type Row = RecordValues & { id: string; sort_order: number };

export default function CollectionEditor({
  spec,
  portfolioId,
}: {
  spec: CollectionSpec;
  portfolioId: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = supabase;
    if (!client) return;

    setLoading(true);
    const { data, error: queryError } = await client
      .from(spec.table)
      .select("*")
      .eq("portfolio_id", portfolioId)
      .order("sort_order", { ascending: true });

    if (queryError) setError(queryError.message);
    else {
      setError(null);
      setRows((data ?? []) as Row[]);
    }

    setLoading(false);
  }, [spec.table, portfolioId]);

  useEffect(() => {
    // Reset tampilan saat berpindah koleksi supaya form lama tidak
    // terbawa ke tabel yang berbeda.
    setEditing(null);
    setCreating(false);
    setConfirmId(null);
    load();
  }, [load]);

  const handleCreate = async (payload: RecordValues) => {
    const client = supabase;
    if (!client) return;

    setBusy(true);
    const nextOrder = rows.length
      ? Math.max(...rows.map((row) => row.sort_order ?? 0)) + 1
      : 0;

    // portfolio_id diambil dari data yang sudah diverifikasi, bukan dari
    // input form. RLS tetap menolak kalau nilainya bukan milik pengguna.
    const { data: inserted, error: insertError } = await client
      .from(spec.table)
      .insert({ ...payload, portfolio_id: portfolioId, sort_order: nextOrder })
      .select("id");

    setBusy(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    // RLS yang menolak tidak memunculkan error, hanya nol baris. Tanpa
    // pemeriksaan ini, kegagalan tampak seperti keberhasilan.
    if (!inserted?.length) {
      setError(NO_ROWS_MESSAGE);
      return;
    }

    setCreating(false);
    setError(null);
    await load();
  };

  const handleUpdate = async (payload: RecordValues) => {
    const client = supabase;
    if (!client || !editing) return;

    setBusy(true);
    const { data: updated, error: updateError } = await client
      .from(spec.table)
      .update(payload)
      .eq("id", editing.id)
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

    setEditing(null);
    setError(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    const client = supabase;
    if (!client) return;

    setBusy(true);
    const { data: removed, error: deleteError } = await client
      .from(spec.table)
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

  const move = async (index: number, direction: -1 | 1) => {
    const client = supabase;
    const target = index + direction;
    if (!client || target < 0 || target >= rows.length) return;

    const a = rows[index];
    const b = rows[target];

    setBusy(true);
    // Urutan ditukar dengan menulis ulang kedua barisnya. Cukup untuk
    // jumlah entri sekecil ini; tidak perlu penomoran ulang massal.
    const results = await Promise.all([
      client
        .from(spec.table)
        .update({ sort_order: b.sort_order })
        .eq("id", a.id)
        .eq("portfolio_id", portfolioId)
        .select("id"),
      client
        .from(spec.table)
        .update({ sort_order: a.sort_order })
        .eq("id", b.id)
        .eq("portfolio_id", portfolioId)
        .select("id"),
    ]);

    setBusy(false);

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      setError(failed.error.message);
      return;
    }

    // Kedua baris harus benar-benar berubah; kalau salah satu nol,
    // urutannya jadi timpang dan itu harus terlihat, bukan didiamkan.
    if (results.some((result) => !result.data?.length)) {
      setError(NO_ROWS_MESSAGE);
      await load();
      return;
    }

    setError(null);
    await load();
  };

  const title = (row: Row) => String(row[spec.titleField] ?? "(tanpa judul)");
  const subtitle = (row: Row) =>
    spec.subtitleField ? String(row[spec.subtitleField] ?? "") : "";

  return (
    <section className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h2>{spec.label}</h2>
          <p className="admin-muted">
            {loading ? "Memuat..." : `${rows.length} entri`}
          </p>
        </div>
        {!creating && !editing && (
          <button
            type="button"
            className="admin-primary"
            onClick={() => setCreating(true)}
          >
            <Plus size={15} />
            Tambah {spec.singular}
          </button>
        )}
      </header>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {creating && (
        <div className="admin-card admin-form-card">
          <h3>Tambah {spec.singular}</h3>
          <RecordForm
            fields={spec.fields}
            record={null}
            busy={busy}
            onCancel={() => setCreating(false)}
            onSubmit={handleCreate}
          />
        </div>
      )}

      {editing && (
        <div className="admin-card admin-form-card">
          <h3>Ubah {spec.singular}</h3>
          <RecordForm
            key={editing.id}
            fields={spec.fields}
            record={editing}
            busy={busy}
            onCancel={() => setEditing(null)}
            onSubmit={handleUpdate}
          />
        </div>
      )}

      <ul className="admin-list">
        {rows.map((row, index) => (
          <li key={row.id} className="admin-row">
            <div className="admin-row-main">
              <strong>{title(row)}</strong>
              {subtitle(row) && (
                <small className="admin-muted">{subtitle(row)}</small>
              )}
            </div>

            <div className="admin-row-actions">
              <button
                type="button"
                className="admin-icon"
                onClick={() => move(index, -1)}
                disabled={busy || index === 0}
                aria-label="Naikkan urutan"
                title="Naikkan"
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                className="admin-icon"
                onClick={() => move(index, 1)}
                disabled={busy || index === rows.length - 1}
                aria-label="Turunkan urutan"
                title="Turunkan"
              >
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                className="admin-icon"
                onClick={() => {
                  setCreating(false);
                  setEditing(row);
                }}
                disabled={busy}
                aria-label="Ubah"
                title="Ubah"
              >
                <Pencil size={15} />
              </button>

              {confirmId === row.id ? (
                <span className="admin-confirm">
                  <button
                    type="button"
                    className="admin-icon is-danger"
                    onClick={() => handleDelete(row.id)}
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
                  onClick={() => setConfirmId(row.id)}
                  disabled={busy}
                  aria-label="Hapus"
                  title="Hapus"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </li>
        ))}

        {!loading && rows.length === 0 && (
          <li className="admin-empty admin-muted">
            Belum ada {spec.singular}. Klik "Tambah {spec.singular}" untuk mulai.
          </li>
        )}
      </ul>
    </section>
  );
}
