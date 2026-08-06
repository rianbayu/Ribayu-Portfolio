import { Clock3, Eye, GitBranch, RefreshCw } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { profile } from "../data/portfolio";
import { fetchVisitorCount, visitorCountConfigured } from "../lib/visitorCount";

const GITHUB_USERS = [profile.githubPersonal, profile.githubPrimary]
  .map((url) => url.replace(/\/+$/, "").split("/").pop())
  .filter((name): name is string => Boolean(name));

const REPO_CACHE_KEY = "rb-github-repos";
const REPO_CACHE_TTL = 6 * 60 * 60 * 1000;

const numberFormat = new Intl.NumberFormat("id-ID");

/** Tanggal build, disuntikkan Vite saat kompilasi (lihat vite.config.ts). */
const BUILD_DATE = new Date(__BUILD_TIME__);

function useJakartaClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);

    return () => window.clearInterval(timer);
  }, []);

  const time = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      hour12: false,
    }).format(now),
  );
  const weekday = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
  }).format(now);

  const isWeekday = !["Sat", "Sun"].includes(weekday);
  const working = isWeekday && hour >= 9 && hour < 18;

  return { time, working };
}

function useGithubRepos() {
  const [repos, setRepos] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const readCache = () => {
      try {
        const raw = window.localStorage.getItem(REPO_CACHE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as { total: number; at: number };
        if (Date.now() - parsed.at > REPO_CACHE_TTL) return null;

        return parsed.total;
      } catch {
        return null;
      }
    };

    const cached = readCache();
    if (cached !== null) {
      setRepos(cached);
      return () => {
        cancelled = true;
      };
    }

    // API publik GitHub dibatasi 60 permintaan/jam per IP, karena itu
    // hasilnya disimpan 6 jam di localStorage.
    Promise.all(
      GITHUB_USERS.map((user) =>
        fetch(`https://api.github.com/users/${user}`)
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null),
      ),
    )
      .then((results) => {
        if (cancelled) return;

        const counts = results
          .map((item) => (item as { public_repos?: number } | null)?.public_repos)
          .filter((value): value is number => typeof value === "number");

        if (counts.length === 0) return;

        const total = counts.reduce((sum, value) => sum + value, 0);
        setRepos(total);

        try {
          window.localStorage.setItem(
            REPO_CACHE_KEY,
            JSON.stringify({ total, at: Date.now() }),
          );
        } catch {
          /* penyimpanan diblokir, abaikan */
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return repos;
}

export default function LiveStats() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const clock = useJakartaClock();
  const repos = useGithubRepos();

  useEffect(() => {
    let cancelled = false;

    fetchVisitorCount().then((total) => {
      if (!cancelled && total !== null) setVisitors(total);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const showVisitors = visitorCountConfigured;

  return (
    <div className="stat-grid reveal">
      {showVisitors && (
        <StatTile
          icon={<Eye size={18} />}
          label="Pengunjung"
          value={visitors === null ? "—" : numberFormat.format(visitors)}
          note="Dihitung sekali per sesi"
          pending={visitors === null}
        />
      )}

      <StatTile
        icon={<GitBranch size={18} />}
        label="Repositori publik"
        value={repos === null ? "—" : String(repos)}
        note={`Gabungan ${GITHUB_USERS.length} akun GitHub`}
        pending={repos === null}
      />

      <StatTile
        icon={<Clock3 size={18} />}
        label="Waktu Jakarta"
        value={clock.time}
        note={clock.working ? "Dalam jam kerja" : "Di luar jam kerja"}
        live={clock.working}
      />

      <StatTile
        icon={<RefreshCw size={18} />}
        label="Terakhir diperbarui"
        value={new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(BUILD_DATE)}
        note="Tanggal build portofolio ini"
      />
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  note,
  pending = false,
  live = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  pending?: boolean;
  live?: boolean;
}) {
  return (
    <article className="stat-tile">
      <span className="stat-icon">{icon}</span>
      <p className="stat-label">
        {label}
        {live && <i className="stat-live" aria-hidden="true" />}
      </p>
      <strong className={`stat-value${pending ? " is-pending" : ""}`}>
        {value}
      </strong>
      <small className="stat-note">{note}</small>
    </article>
  );
}
