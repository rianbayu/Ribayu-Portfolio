import { ArrowUpRight, MonitorSmartphone, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LandingPage } from "../data/content";
import TetrisRain from "./TetrisRain";

/** Lebar viewport yang disimulasikan iframe sebelum diperkecil. */
const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 900;

export default function LandingPreviewCard({ page }: { page: LandingPage }) {
  const [requested, setRequested] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) setScale(width / DESKTOP_WIDTH);
    });

    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <article
      className={`landing-card tetris-host is-${page.status}`}
      aria-labelledby={`landing-${page.name.replace(/\s+/g, "-")}`}
    >
      <TetrisRain />

      <div className="landing-viewport" ref={viewportRef}>
        <div className="landing-browserbar" aria-hidden="true">
          <span />
          <span />
          <span />
          <p>{new URL(page.url).hostname}</p>
        </div>

        <div className="landing-stage">
          {requested && (
            <iframe
              className={`landing-frame${loaded ? " is-ready" : ""}`}
              src={page.url}
              title={`Pratinjau ${page.name}`}
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
              sandbox="allow-scripts allow-same-origin"
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              style={{
                width: DESKTOP_WIDTH,
                height: DESKTOP_HEIGHT,
                transform: `scale(${scale})`,
              }}
            />
          )}

          {requested && !loaded && (
            <div className="landing-skeleton">
              <span />
              <p>Memuat pratinjau...</p>
            </div>
          )}

          {!requested && (
            <button
              type="button"
              className="landing-facade"
              onClick={() => setRequested(true)}
            >
              <span className="landing-facade-icon">
                <PlayCircle size={22} />
              </span>
              <strong>Muat pratinjau langsung</strong>
              <small>Menampilkan situs asli di dalam halaman ini</small>
            </button>
          )}
        </div>

        <span className={`landing-status is-${page.status}`}>
          {page.statusLabel}
        </span>
      </div>

      <div className="landing-body">
        <small className="landing-tagline">{page.tagline}</small>
        <h3 id={`landing-${page.name.replace(/\s+/g, "-")}`}>{page.name}</h3>
        <p className="landing-role">{page.role}</p>
        <p className="landing-summary">{page.summary}</p>

        {page.note && (
          <p className="landing-note">
            <MonitorSmartphone size={14} />
            <span>{page.note}</span>
          </p>
        )}

        <ul className="landing-stack">
          {page.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <a
          className="landing-visit"
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Buka situs</span>
          <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  );
}
