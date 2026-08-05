import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RING_RADIUS = 21;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const EASING = 0.14;

export default function ScrollTopButton() {
  const [percent, setPercent] = useState(0);
  const [complete, setComplete] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const completeRef = useRef(false);
  const frameRef = useRef(0);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const paint = (value: number) => {
      const circle = circleRef.current;
      if (circle) {
        circle.style.strokeDashoffset = String(RING_LENGTH * (1 - value));
      }

      const isComplete = value >= 0.998;
      if (isComplete !== completeRef.current) {
        completeRef.current = isComplete;
        setComplete(isComplete);
      }
    };

    const tick = () => {
      const distance = targetRef.current - progressRef.current;

      if (Math.abs(distance) < 0.0004) {
        progressRef.current = targetRef.current;
        paint(progressRef.current);
        setPercent(Math.round(progressRef.current * 100));
        frameRef.current = 0;
        return;
      }

      progressRef.current += distance * EASING;
      paint(progressRef.current);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const startTicking = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const measure = () => {
      const doc = document.documentElement;
      const distance = doc.scrollHeight - window.innerHeight;

      if (distance <= 4) {
        setScrollable(false);
        targetRef.current = 0;
      } else {
        setScrollable(true);
        targetRef.current = Math.min(1, Math.max(0, window.scrollY / distance));
      }

      if (reduceMotion) {
        progressRef.current = targetRef.current;
        paint(progressRef.current);
        setPercent(Math.round(progressRef.current * 100));
        return;
      }

      startTicking();
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`scroll-top${complete ? " is-complete" : ""}${
        scrollable ? "" : " is-idle"
      }`}
      onClick={scrollToTop}
      aria-label={`Kembali ke atas (${percent}% halaman terlihat)`}
      title="Kembali ke atas"
    >
      <svg className="scroll-top-ring" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient
            id="scrollTopRing"
            x1="0"
            y1="24"
            x2="48"
            y2="24"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(90 24 24)"
          >
            <stop stopColor="#2D2686" />
            <stop offset="1" stopColor="#6B009C" />
          </linearGradient>
        </defs>
        <circle className="scroll-top-track" cx="24" cy="24" r={RING_RADIUS} />
        <circle
          ref={circleRef}
          className="scroll-top-progress"
          cx="24"
          cy="24"
          r={RING_RADIUS}
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH}
        />
      </svg>
      <ArrowUp size={17} strokeWidth={2.4} />
      <span className="sr-only">{percent}%</span>
    </button>
  );
}
