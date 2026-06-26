import { useEffect, useState } from "react";

/*
 * TrainSpinner — a square dot-matrix loading indicator: a little train slides
 * left→right along a stable bottom rail (empty → enters → crosses → exits →
 * empty → loop). Uses currentColor so it inherits the surrounding text color.
 */

const N = 7; // square grid
const DIM = 0.16;

// 13-wide train sprite. sl = sprite-local column (0..12).
function trainCell(r: number, sl: number): boolean {
  if (sl < 0 || sl > 12) return false;
  if (r === 1) return sl >= 2 && sl <= 10; // roof
  if (r === 2) return sl === 1 || sl === 11; // chimney bump at each end
  if (r === 3 || r === 4) return true; // body (full length)
  return false;
}

const X_MIN = -13; // fully off the left → nothing
const NFRAMES = 21; // X from -13..7 (X=7 is fully off the right)

interface Props {
  size?: number;
  className?: string;
  speed?: number; // ms per frame
}

export function TrainSpinner({ size = 18, className = "", speed = 90 }: Props) {
  const [f, setF] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setF((p) => (p + 1) % NFRAMES), speed);
    return () => window.clearInterval(id);
  }, [speed]);

  const pad = size * 0.1;
  const span = size - pad * 2;
  const step = span / (N - 1);
  const radius = size * 0.058;
  const x = X_MIN + f;

  const dots = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const op = r === N - 1 ? 0.9 : trainCell(r, c - x) ? 1 : DIM;
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={pad + c * step}
          cy={pad + r * step}
          r={radius}
          fill="currentColor"
          opacity={op}
        />
      );
    }
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", color: "currentColor" }}
      aria-label="Loading"
      role="status"
    >
      {dots}
    </svg>
  );
}
