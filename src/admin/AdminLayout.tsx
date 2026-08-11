import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import CollectionEditor from "./CollectionEditor";
import { COLLECTIONS } from "./collections";
import DashboardPage from "./DashboardPage";
import GuestbookPage from "./GuestbookPage";
import { NAV_GROUPS } from "./navigation";
import ProfilePage from "./ProfilePage";
import PublishPanel from "./PublishPanel";
import { usePortfolio } from "./usePortfolio";

export default function AdminLayout({ email }: { email: string }) {
  const { portfolio, loading, error, reload } = usePortfolio();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Sidebar versi ponsel selalu ditutup setelah berpindah halaman,
  // supaya tidak menutupi konten yang baru dibuka.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
    <div className={`admin-app${menuOpen ? " is-menu-open" : ""}`}>
      <header className="admin-navbar">
        <button
          type="button"
          className="admin-burger"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="admin-brand">
          <span className="admin-brand-mark">RB</span>
          <div>
            <strong>Portfolio CMS</strong>
            <small>{portfolio.name}</small>
          </div>
        </div>

        <div className="admin-navbar-right">
          <span
            className={`admin-pill${portfolio.is_published ? " is-live" : ""}`}
          >
            {portfolio.is_published ? "Terbit" : "Tersembunyi"}
          </span>
          <a
            className="admin-ghost"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={15} />
            <span className="admin-hide-sm">Lihat situs</span>
          </a>
          <button
            type="button"
            className="admin-ghost is-danger"
            onClick={() => supabase?.auth.signOut()}
          >
            <LogOut size={15} />
            <span className="admin-hide-sm">Keluar</span>
          </button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <nav>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="admin-navgroup">
                <p className="admin-navgroup-label">{group.label}</p>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin"}
                    className="admin-navlink"
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <div className="admin-sidebar-foot">
            <p className="admin-muted">Masuk sebagai</p>
            <strong>{email}</strong>
          </div>
        </aside>

        <button
          type="button"
          className="admin-scrim"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="admin-main">
          <main className="admin-content">
            <Routes>
              <Route index element={<DashboardPage portfolio={portfolio} />} />
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
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>

          <footer className="admin-footer">
            <span>Portfolio CMS · {portfolio.name}</span>
            <span>
              Konten tersimpan di Supabase · perubahan tampil di situs setelah
              halaman dimuat ulang
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
