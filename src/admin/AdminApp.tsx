import { supabaseConfigured } from "../lib/supabase";
import AdminLayout from "./AdminLayout";
import LoginPage from "./LoginPage";
import { useSession } from "./useSession";
import "./admin.css";

export default function AdminApp() {
  const { session, loading } = useSession();

  if (!supabaseConfigured) {
    return (
      <div className="admin-auth">
        <div className="admin-card">
          <h1>Supabase belum dikonfigurasi</h1>
          <p className="admin-muted">
            Isi <code>VITE_SUPABASE_URL</code> dan{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> di berkas <code>.env</code>,
            lalu jalankan ulang dev server.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-auth">
        <div className="admin-card">
          <p className="admin-muted">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  if (!session) return <LoginPage />;

  return <AdminLayout email={session.user.email ?? ""} />;
}
