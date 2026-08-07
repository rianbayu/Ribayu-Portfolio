import { ArrowLeft, LogOut, MessageSquare, Rocket, UserRound } from "lucide-react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { supabase } from "../lib/supabase";
import CollectionEditor from "./CollectionEditor";
import { COLLECTIONS } from "./collections";
import GuestbookPage from "./GuestbookPage";
import ProfilePage from "./ProfilePage";
import PublishPanel from "./PublishPanel";
import { usePortfolio } from "./usePortfolio";

export default function AdminLayout({ email }: { email: string }) {
  const { portfolio, loading, error, reload } = usePortfolio();

  if (loading) {
    return (
      <div className="admin-auth">
        <div className="admin-card">
          <p className="admin-muted">Memuat portofolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="admin-auth">
        <div className="admin-card">
          <h1>Tidak bisa memuat data</h1>
          <p className="admin-error">{error}</p>
          <div className="admin-form-actions">
            <button type="button" className="admin-ghost" onClick={reload}>
              Coba lagi
            </button>
            <button
              type="button"
              className="admin-ghost is-danger"
              onClick={() => supabase?.auth.signOut()}
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div>
          <span className="admin-badge">Admin</span>
          <h1>{portfolio.name}</h1>
          <p className="admin-muted">{email}</p>
        </div>
        <div className="admin-actions">
          <a className="admin-ghost" href="/">
            <ArrowLeft size={15} />
            Lihat situs
          </a>
          <button
            type="button"
            className="admin-ghost is-danger"
            onClick={() => supabase?.auth.signOut()}
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <NavLink to="/admin/profil" className="admin-tab">
          <UserRound size={14} />
          Profil
        </NavLink>
        {COLLECTIONS.map((spec) => (
          <NavLink
            key={spec.slug}
            to={`/admin/${spec.slug}`}
            className="admin-tab"
          >
            {spec.label}
          </NavLink>
        ))}
        <NavLink to="/admin/buku-tamu" className="admin-tab">
          <MessageSquare size={14} />
          Buku Tamu
        </NavLink>
        <NavLink to="/admin/terbitkan" className="admin-tab">
          <Rocket size={14} />
          Terbitkan
        </NavLink>
      </nav>

      <Routes>
        <Route index element={<Navigate to="profil" replace />} />
        <Route
          path="profil"
          element={<ProfilePage portfolio={portfolio} onSaved={reload} />}
        />
        {COLLECTIONS.map((spec) => (
          <Route
            key={spec.slug}
            path={spec.slug}
            element={
              <CollectionEditor
                key={spec.slug}
                spec={spec}
                portfolioId={portfolio.id}
              />
            }
          />
        ))}
        <Route
          path="buku-tamu"
          element={<GuestbookPage portfolioId={portfolio.id} />}
        />
        <Route
          path="terbitkan"
          element={<PublishPanel portfolioId={portfolio.id} />}
        />
        <Route path="*" element={<Navigate to="profil" replace />} />
      </Routes>
    </div>
  );
}
