import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  MessageSquare,
  Palette,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CONTENT_TABLES } from "./navigation";
import type { PortfolioRow } from "./usePortfolio";

type Counts = Record<string, number>;

type Pending = { id: string; name: string; message: string };

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
  timeStyle: "short",
});

/**
 * Memeriksa kelengkapan portofolio.
 *
 * Tujuannya bukan menghakimi, tapi menunjukkan bagian yang masih kosong --
 * hal yang mudah terlewat karena situsnya tetap tampil normal meski ada
 * section yang tidak terisi.
 */
function buildChecklist(portfolio: PortfolioRow, counts: Counts) {
  const items: { ok: boolean; label: string; to: string }[] = [];

  const need = (
    ok: boolean,
    label: string,
    to: string,
  ): void => void items.push({ ok, label, to });

  need(Boolean(portfolio.photo_url), "Foto profil terisi", "/admin/profil");
  need(Boolean(portfolio.cv_url), "Berkas CV terisi", "/admin/profil");
  need(Boolean(portfolio.about), "Deskripsi diri terisi", "/admin/profil");
  need(
    (counts.experiences ?? 0) > 0,
    "Ada pengalaman kerja",
    "/admin/pengalaman",
  );
  need((counts.projects ?? 0) > 0, "Ada proyek", "/admin/proyek");
  need(
    (counts.landing_pages ?? 0) > 0,
    "Ada landing page",
    "/admin/landing-page",
  );
  need(
    (counts.skill_groups ?? 0) > 0,
    "Ada grup keahlian",
    "/admin/keahlian",
  );
  need(
    (counts.certifications ?? 0) > 0,
    "Ada sertifikasi",
    "/admin/sertifikasi",
  );

  return items;
}

export default function DashboardPage({
  portfolio,
}: {
  portfolio: PortfolioRow;
}) {
  const [counts, setCounts] = useState<Counts>({});
  const [pending, setPending] = useState<Pending[]>([]);
  const [visitors, setVisitors] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const client = supabase;
    if (!client) return;

    setLoading(true);

    const results = await Promise.all(
      CONTENT_TABLES.map(async ({ table }) => {
        const { count } = await client
          .from(table)
          .select("id", { count: "exact", head: true })
          .eq("portfolio_id", portfolio.id);

        return [table, count ?? 0] as const;
      }),
    );

    const { data: waiting } = await client
      .from("guestbook")
      .select("id, name, message")
      .eq("portfolio_id", portfolio.id)
      .eq("is_approved", false)
      .order("created_at", { ascending: false })
      .limit(3);

    const { data: total } = await client.rpc("get_visits");

    setCounts(Object.fromEntries(results));
    setPending((waiting ?? []) as Pending[]);
    setVisitors(typeof total === "number" ? total : null);
    setLoading(false);
  }, [portfolio.id]);

  useEffect(() => {
    load();
  }, [load]);

  const checklist = buildChecklist(portfolio, counts);
  const incomplete = checklist.filter((item) => !item.ok);
  const totalEntries = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="dash">
      <header className="dash-head">
        <div>
          <p className="admin-muted">Selamat datang kembali,</p>
          <h2>{portfolio.name}</h2>
        </div>
        <button type="button" className="admin-ghost" onClick={load}>
          <RefreshCw size={15} />
          Muat ulang
        </button>
      </header>

      <div className="dash-stats">
        <article
          className={`dash-stat${portfolio.is_published ? " is-good" : " is-warn"}`}
        >
          <span>Status situs</span>
          <strong>{portfolio.is_published ? "Terbit" : "Disembunyikan"}</strong>
          <small>
            {portfolio.is_published
              ? "Konten terlihat pengunjung"
              : "Pengunjung tidak bisa melihat konten"}
          </small>
        </article>

        <article className="dash-stat">
          <span>
            <Eye size={14} /> Pengunjung
          </span>
          <strong>{visitors === null ? "—" : visitors.toLocaleString("id-ID")}</strong>
          <small>Total kunjungan tercatat</small>
        </article>

        <article className="dash-stat">
          <span>Total entri konten</span>
          <strong>{loading ? "—" : totalEntries}</strong>
          <small>Tersebar di {CONTENT_TABLES.length} koleksi</small>
        </article>

        <article className={`dash-stat${pending.length ? " is-warn" : ""}`}>
          <span>
            <MessageSquare size={14} /> Menunggu moderasi
          </span>
          <strong>{pending.length}</strong>
          <small>
            {pending.length ? "Perlu ditinjau" : "Tidak ada antrean"}
          </small>
        </article>
      </div>

      <div className="dash-columns">
        <section className="admin-card dash-panel">
          <h3>Kelengkapan portofolio</h3>
          <p className="admin-muted">
            {incomplete.length === 0
              ? "Semua bagian penting sudah terisi."
              : `${incomplete.length} bagian masih kosong. Situs tetap tampil normal, jadi ini mudah terlewat.`}
          </p>

          <ul className="dash-check">
            {checklist.map((item) => (
              <li key={item.label} className={item.ok ? "is-ok" : "is-missing"}>
                {item.ok ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <AlertTriangle size={15} />
                )}
                <span>{item.label}</span>
                {!item.ok && (
                  <Link to={item.to} className="dash-fix">
                    Perbaiki <ArrowRight size={13} />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="dash-side">
          <section className="admin-card dash-panel">
            <h3>Isi per koleksi</h3>
            <ul className="dash-counts">
              {CONTENT_TABLES.map((item) => (
                <li key={item.table}>
                  <Link to={item.to}>
                    <item.icon size={15} />
                    <span>{item.label}</span>
                    <b>{loading ? "—" : (counts[item.table] ?? 0)}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {pending.length > 0 && (
            <section className="admin-card dash-panel">
              <h3>Pesan menunggu</h3>
              <ul className="dash-pending">
                {pending.map((entry) => (
                  <li key={entry.id}>
                    <strong>{entry.name}</strong>
                    <p>{entry.message}</p>
                  </li>
                ))}
              </ul>
              <Link to="/admin/buku-tamu" className="admin-ghost">
                Buka moderasi <ArrowRight size={14} />
              </Link>
            </section>
          )}

          <section className="admin-card dash-panel">
            <h3>Info situs</h3>
            <dl className="dash-meta">
              <div>
                <dt>
                  <Palette size={14} /> Tema
                </dt>
                <dd>{String(portfolio.theme ?? "default")}</dd>
              </div>
              <div>
                <dt>Alamat</dt>
                <dd>/{String(portfolio.slug ?? "")}</dd>
              </div>
              <div>
                <dt>Terakhir diubah</dt>
                <dd>
                  {portfolio.updated_at
                    ? dateFormat.format(new Date(String(portfolio.updated_at)))
                    : "—"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
