import { useEffect, useRef } from "react";

const colors = [
  [47, 184, 172],
  [216, 179, 90],
  [255, 122, 89],
  [122, 160, 118],
  [246, 242, 234],
  [47, 184, 172],
];

const pathData = [
  {
    d: "M1290.05 255.329H113.784C57.0007 255.329 10.9688 209.296 10.9688 152.514C10.9688 95.5433 57.1521 49.3599 114.122 49.3599H160.875L293.036 30.5437C323.824 26.1602 355.183 32.5431 381.809 48.613C420.43 71.9232 468.144 74.3985 508.971 55.21L538.082 41.5278C593.698 15.3878 658.381 16.9785 712.646 45.8207L750.287 65.8275C810.231 97.6882 883.315 91.2662 936.784 49.4397C976.842 18.1047 1028.72 6.12615 1078.46 16.7286L1216.49 46.15C1226.5 48.284 1236.7 49.3599 1246.94 49.3599H1290.05C1346.93 49.3599 1393.03 95.4675 1393.03 152.344C1393.03 209.221 1346.93 255.329 1290.05 255.329Z",
    opacity: 0.82,
  },
  {
    d: "M1299.8 255.329H123.534C66.7507 255.329 20.7188 209.296 20.7188 152.514C20.7188 95.5433 66.9021 49.3599 123.873 49.3599H170.625L302.786 30.5437C333.574 26.1602 364.933 32.5431 391.559 48.613C430.18 71.9232 477.894 74.3985 518.721 55.21L547.832 41.5278C603.448 15.3878 668.131 16.9785 722.396 45.8207L760.037 65.8275C819.981 97.6882 893.065 91.2662 946.534 49.4397C986.592 18.1047 1038.47 6.12615 1088.21 16.7286L1226.23 46.15C1236.25 48.284 1246.45 49.3599 1256.69 49.3599H1299.8C1356.68 49.3599 1402.78 95.4675 1402.78 152.344C1402.78 209.221 1356.68 255.329 1299.8 255.329Z",
    opacity: 0.46,
  },
  {
    d: "M1280.3 255.329H104.034C47.2507 255.329 1.21875 209.296 1.21875 152.514C1.21875 95.5433 47.4021 49.3599 104.372 49.3599H151.125L283.286 30.5437C314.074 26.1602 345.433 32.5431 372.059 48.613C410.68 71.9232 458.394 74.3985 499.221 55.21L528.332 41.5278C583.948 15.3878 648.631 16.9785 702.896 45.8207L740.537 65.8275C800.481 97.6882 873.565 91.2662 927.034 49.4397C967.092 18.1047 1018.97 6.12615 1068.71 16.7286L1206.74 46.15C1216.75 48.284 1226.95 49.3599 1237.19 49.3599H1280.3C1337.18 49.3599 1383.28 95.4675 1383.28 152.344C1383.28 209.221 1337.18 255.329 1280.3 255.329Z",
    opacity: 0.28,
  },
];

type GradientRef = {
  gradient: SVGLinearGradientElement;
  stops: SVGStopElement[];
};

function interpolate(from: number[], to: number[], amount: number) {
  return [
    Math.round(from[0] + (to[0] - from[0]) * amount),
    Math.round(from[1] + (to[1] - from[1]) * amount),
    Math.round(from[2] + (to[2] - from[2]) * amount),
  ];
}

function samplePalette(time: number) {
  const normalized = ((time % 1) + 1) % 1;
  const scaled = normalized * (colors.length - 1);
  const index = Math.floor(scaled);
  return interpolate(colors[index % colors.length], colors[(index + 1) % colors.length], scaled - index);
}

export default function AnimatedWave({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const isVisibleRef = useRef(true);
  const gradientsRef = useRef<GradientRef[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    const defs = svg?.querySelector("defs");
    if (!svg || !defs) return undefined;

    gradientsRef.current.forEach(({ gradient }) => gradient.remove());
    gradientsRef.current = [];

    svg.querySelectorAll<SVGPathElement>("path[data-wave]").forEach((path, lineIndex) => {
      const length = path.getTotalLength();
      const start = path.getPointAtLength(0);
      const end = path.getPointAtLength(length);
      const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      const stops: SVGStopElement[] = [];

      gradient.setAttribute("id", `portfolio-wave-${lineIndex}`);
      gradient.setAttribute("gradientUnits", "userSpaceOnUse");
      gradient.setAttribute("x1", String(start.x));
      gradient.setAttribute("y1", String(start.y));
      gradient.setAttribute("x2", String(end.x));
      gradient.setAttribute("y2", String(end.y));

      for (let index = 0; index <= 20; index += 1) {
        const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop.setAttribute("offset", `${(index / 20) * 100}%`);
        gradient.appendChild(stop);
        stops.push(stop);
      }

      defs.appendChild(gradient);
      path.setAttribute("stroke", `url(#portfolio-wave-${lineIndex})`);
      gradientsRef.current.push({ gradient, stops });
    });

    const paintGradient = (timestamp: number) => {
      const time = timestamp / 26000;

      gradientsRef.current.forEach(({ stops }, lineIndex) => {
        stops.forEach((stop, stopIndex) => {
          const fraction = stopIndex / Math.max(stops.length - 1, 1);
          const color = samplePalette(fraction - time + lineIndex * 0.14);
          const opacity = 0.34 + Math.abs(Math.sin((fraction - time * 1.9) * Math.PI * 2)) * 0.58;
          stop.setAttribute("stop-color", `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
          stop.setAttribute("stop-opacity", opacity.toFixed(3));
        });
      });
    };

    const stop = () => {
      if (intervalRef.current === undefined) return;
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    };

    const start = () => {
      if (intervalRef.current !== undefined || document.hidden || !isVisibleRef.current) return;
      intervalRef.current = window.setInterval(() => paintGradient(performance.now()), 320);
    };

    const preferStaticWave = window.matchMedia(
      "(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 768px)",
    ).matches;
    paintGradient(performance.now());

    if (preferStaticWave) {
      return stop;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          paintGradient(performance.now());
          start();
          return;
        }
        stop();
      },
      { rootMargin: "140px" },
    );

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
        return;
      }
      start();
    };

    observer.observe(svg);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 1404 258"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs />
      {pathData.map(({ d, opacity }, index) => (
        <path
          key={index}
          data-wave={index}
          d={d}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}
