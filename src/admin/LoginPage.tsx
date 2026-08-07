import { LogIn, ShieldAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || busy) return;

    setBusy(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      // Pesan asli Supabase berbahasa Inggris dan generik; diterjemahkan
      // seperlunya tanpa membocorkan apakah email-nya terdaftar atau tidak.
      setError(
        signInError.message === "Invalid login credentials"
          ? "Email atau kata sandi tidak cocok."
          : signInError.message,
      );
      setBusy(false);
      return;
    }

    // Tidak perlu redirect manual: useSession menangkap perubahan sesi
    // dan AdminApp otomatis menampilkan dasbor.
    setBusy(false);
  };

  return (
    <div className="admin-auth">
      <form className="admin-card admin-login" onSubmit={handleSubmit}>
        <span className="admin-badge">
          <ShieldAlert size={15} />
          Area Admin
        </span>
        <h1>Masuk untuk mengelola konten</h1>
        <p className="admin-muted">
          Gunakan akun yang terdaftar di Supabase Authentication.
        </p>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="admin-field">
          <span>Kata sandi</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="admin-primary" disabled={busy}>
          <LogIn size={16} />
          {busy ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
