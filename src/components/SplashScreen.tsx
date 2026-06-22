import { ArrowRight, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { profile } from "../data/portfolio";

type SplashScreenProps = {
  onComplete: () => void;
};

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const exitTimerRef = useRef<number | undefined>(undefined);
  const [photoReady, setPhotoReady] = useState(Boolean(profile.photo));
  const [readyToEnter, setReadyToEnter] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyLeft = body.style.left;
    const previousBodyRight = body.style.right;
    const previousBodyWidth = body.style.width;
    const previousBodyTouchAction = body.style.touchAction;
    const lockOptions = { passive: false, capture: true } as const;
    const preventScroll = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = "0";
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.touchAction = "none";
    window.addEventListener("wheel", preventScroll, lockOptions);
    window.addEventListener("touchmove", preventScroll, lockOptions);

    return () => {
      window.removeEventListener("wheel", preventScroll, lockOptions);
      window.removeEventListener("touchmove", preventScroll, lockOptions);
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.left = previousBodyLeft;
      body.style.right = previousBodyRight;
      body.style.width = previousBodyWidth;
      body.style.touchAction = previousBodyTouchAction;
      window.scrollTo(0, 0);
    };
  }, []);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsLeaving(true);
    exitTimerRef.current = window.setTimeout(onComplete, 860);
  }, [onComplete]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hardTimeout = window.setTimeout(
      () => setReadyToEnter(true),
      reduceMotion ? 260 : 1280,
    );

    return () => {
      window.clearTimeout(hardTimeout);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`splash-screen${readyToEnter ? " is-ready" : ""}${isLeaving ? " is-leaving" : ""}`}
      role="status"
      aria-label="Memuat portfolio"
    >
      <button
        type="button"
        className="splash-skip"
        onClick={complete}
        aria-label="Lewati intro"
        title="Lewati intro"
      >
        <X size={18} />
      </button>
      <div className="splash-grid" />
      <div className="splash-content">
        <div
          className="relative max-[375px]:!w-[200px] max-[375px]:!h-[200px] max-[425px]:!w-[250px] max-[425px]:!h-[250px] w-[280px] h-[280px] flex justify-center items-center p-0"
          aria-label={`Foto ${profile.name}`}
        >
          <div className="relative w-full h-full flex justify-center items-center profile-loading-frame2 drop-shadow-xl">
            <img
              className="w-full h-full"
              src="/images/svg-lingkaran-frame.svg"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div className="absolute inset-0 max-[375px]:!p-7 p-8 rounded-full">
            {photoReady ? (
              <div className="w-full h-full ">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full rounded-full"
                  decoding="async"
                  onError={() => setPhotoReady(false)}
                />
              </div>
            ) : (
              <strong>RB</strong>
            )}
          </div>
        </div>
        <div className="splash-name" aria-label="Rian Bayu Ananda">
          <span>Rian</span>
          <span>Bayu</span>
          <span>Ananda</span>
        </div>
        <p className="splash-meta">Front-End Web Developer · System Analyst</p>
        <div className="splash-chips" aria-hidden="true">
          <span className="splash-chip">UI/UX</span>
          <span className="splash-chip">REST API</span>
          <span className="splash-chip">Testing</span>
        </div>
        <div className="splash-progress" aria-hidden="true">
          <div className="splash-progress-fill" />
        </div>
        <div className="splash-cta-slot">
          {readyToEnter && (
            <button type="button" className="splash-cta" onClick={complete}>
              <span>Berkenalan dengan Saya</span>
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
