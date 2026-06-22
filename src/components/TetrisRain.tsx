import { useCallback, useEffect, useRef, useState } from "react";

type TetrisDrop = {
  id: number;
  x: number;
  duration: number;
  fill: string;
  opacity: number;
};

const DROP_SEQUENCE: Omit<TetrisDrop, "id">[] = [
  { x: 10, duration: 2000, fill: "#52D9D9", opacity: 0.42 },
  { x: 40, duration: 2400, fill: "#52CCD9", opacity: 0.38 },
  { x: 70, duration: 1800, fill: "#52D9D9", opacity: 0.42 },
  { x: 100, duration: 2200, fill: "#52CCD9", opacity: 0.4 },
  { x: 130, duration: 1600, fill: "#52D9D9", opacity: 0.42 },
  { x: 160, duration: 2100, fill: "#52CCD9", opacity: 0.36 },
  { x: 190, duration: 1900, fill: "#52D9D9", opacity: 0.42 },
  { x: 220, duration: 2300, fill: "#52CCD9", opacity: 0.4 },
  { x: 10, duration: 2000, fill: "#52CCD9", opacity: 0.32 },
  { x: 40, duration: 2400, fill: "#6000FF", opacity: 0.26 },
  { x: 70, duration: 1800, fill: "#52CCD9", opacity: 0.32 },
  { x: 100, duration: 2200, fill: "#2D2686", opacity: 0.36 },
  { x: 130, duration: 1600, fill: "#52CCD9", opacity: 0.3 },
  { x: 160, duration: 2100, fill: "#52D9D9", opacity: 0.3 },
  { x: 190, duration: 1900, fill: "#52CCD9", opacity: 0.32 },
  { x: 220, duration: 2300, fill: "#52D9D9", opacity: 0.28 },
  { x: 10, duration: 2000, fill: "#52D9D9", opacity: 0.18 },
  { x: 40, duration: 2400, fill: "#52D9D9", opacity: 0.17 },
  { x: 70, duration: 1800, fill: "#FFFFFF", opacity: 0.16 },
  { x: 100, duration: 2200, fill: "#52D9D9", opacity: 0.2 },
  { x: 130, duration: 1600, fill: "#6000FF", opacity: 0.18 },
  { x: 160, duration: 2100, fill: "#2D2686", opacity: 0.22 },
  { x: 190, duration: 1900, fill: "#FFFFFF", opacity: 0.15 },
  { x: 220, duration: 2300, fill: "#6000FF", opacity: 0.2 },
];

export default function TetrisRain() {
  const rootRef = useRef<SVGSVGElement>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const isSpawningRef = useRef(false);
  const dropCountRef = useRef(0);
  const nextDropIdRef = useRef(0);
  const sequenceIndexRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [drops, setDrops] = useState<TetrisDrop[]>([]);

  const clearSpawnTimer = useCallback(() => {
    if (spawnTimerRef.current === null) return;
    window.clearTimeout(spawnTimerRef.current);
    spawnTimerRef.current = null;
  }, []);

  const spawnDrop = useCallback(() => {
    const base = DROP_SEQUENCE[sequenceIndexRef.current % DROP_SEQUENCE.length];
    sequenceIndexRef.current += 1;
    nextDropIdRef.current += 1;

    setDrops((current) => [
      ...current.slice(-34),
      {
        ...base,
        id: nextDropIdRef.current,
      },
    ]);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const host = root?.parentElement;
    if (!host) return undefined;

    const scheduleNextDrop = () => {
      if (!isSpawningRef.current) return;
      spawnDrop();
      spawnTimerRef.current = window.setTimeout(scheduleNextDrop, 150);
    };

    const start = () => {
      if (isSpawningRef.current) return;
      clearSpawnTimer();
      isSpawningRef.current = true;
      setIsVisible(true);
      scheduleNextDrop();
    };

    const drain = () => {
      isSpawningRef.current = false;
      clearSpawnTimer();
      if (dropCountRef.current === 0) setIsVisible(false);
    };

    const handleFocusOut = () => {
      window.setTimeout(() => {
        if (!host.contains(document.activeElement)) drain();
      }, 0);
    };

    host.addEventListener("pointerenter", start);
    host.addEventListener("pointerleave", drain);
    host.addEventListener("focusin", start);
    host.addEventListener("focusout", handleFocusOut);

    return () => {
      isSpawningRef.current = false;
      clearSpawnTimer();
      host.removeEventListener("pointerenter", start);
      host.removeEventListener("pointerleave", drain);
      host.removeEventListener("focusin", start);
      host.removeEventListener("focusout", handleFocusOut);
    };
  }, [clearSpawnTimer, spawnDrop]);

  useEffect(() => {
    dropCountRef.current = drops.length;
    if (!isSpawningRef.current && drops.length === 0) {
      setIsVisible(false);
    }
  }, [drops.length]);

  const removeDrop = useCallback((dropId: number) => {
    setDrops((current) => current.filter((drop) => drop.id !== dropId));
  }, []);

  return (
    <svg
      ref={rootRef}
      className={`tetris-rain${isVisible ? " is-visible" : ""}`}
      viewBox="0 0 240 182"
      preserveAspectRatio="xMidYMin slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {drops.map((drop) => (
        <rect
          key={drop.id}
          className="tetris-block"
          x={drop.x}
          y="0"
          width="14"
          height="14"
          fill={drop.fill}
          fillOpacity={drop.opacity}
          style={{ animationDuration: `${drop.duration}ms` }}
          onAnimationEnd={() => removeDrop(drop.id)}
        />
      ))}
    </svg>
  );
}
