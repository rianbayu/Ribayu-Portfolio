import { useEffect, useState } from "react";
import { profile } from "../data/portfolio";

export default function ProfilePin({ start = true }: { start?: boolean }) {
  const [photoReady, setPhotoReady] = useState(Boolean(profile.photo));
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (!start) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return undefined;

    // Ditunda sesaat supaya putarannya terlihat utuh, bukan terpotong
    // saat hero baru selesai dirender.
    const timer = window.setTimeout(() => setFlipping(true), 120);

    return () => window.clearTimeout(timer);
  }, [start]);

  return (
    <div className="coin-scene">
      <div className="coin-ring">
        <img
          className="profile-loading-frame2 h-full w-full"
          src="/images/svg-lingkaran-frame.svg"
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className={`coin-body${flipping ? " is-flipping" : ""}`}>
        <div className="coin-face coin-front">
          {photoReady ? (
            <img
              src={profile.photo}
              alt={profile.name}
              decoding="async"
              onError={() => setPhotoReady(false)}
            />
          ) : (
            <strong>RB</strong>
          )}
          <span className="coin-rim" aria-hidden="true" />
        </div>

        <div className="coin-face coin-back" aria-hidden="true">
          <strong>RB</strong>
          <span className="coin-rim" />
        </div>
      </div>
    </div>
  );
}
