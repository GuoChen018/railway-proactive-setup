import { useEffect, useState, type CSSProperties } from "react";

/*
 * SpinnerLab — comparison screen of small, square, single-cell braille
 * spinners. Each is icon-sized (one braille cell ≈ square), uses
 * currentColor, monospace, and constant-width frames (zero jitter).
 * Not wired into the main flow.  Preview at: <dev-url>/?spinners
 */

function useFrame(length: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((p) => (p + 1) % length), ms);
    return () => window.clearInterval(id);
  }, [length, ms]);
  return i;
}

function cell(size: number): CSSProperties {
  return {
    fontFamily:
      "var(--mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)",
    fontSize: size,
    lineHeight: 1,
    width: size,
    height: size,
    color: "currentColor",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

interface SpinnerProps {
  size?: number;
  className?: string;
}

function makeSpinner(frames: string[], ms: number) {
  return function Spinner({ size = 16, className = "" }: SpinnerProps) {
    const f = useFrame(frames.length, ms);
    return (
      <span className={className} style={cell(size)}>
        {frames[f]}
      </span>
    );
  };
}

// 1. Classic perimeter spin
export const BrailleSpin = makeSpinner(
  ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  80
);

// 2. Orbit — a single dot circles the cell like a train on a loop
export const BrailleOrbit = makeSpinner(
  ["⠁", "⠈", "⠐", "⠠", "⠄", "⠂"],
  110
);

// 3. Sweep — a bar passes left→right through the cell (train passing)
export const BrailleSweep = makeSpinner(["⠇", "⠿", "⠸", "⠿"], 130);

// 4. Fill — track builds up from the bottom, then resets
export const BrailleFill = makeSpinner(
  ["⡀", "⣀", "⣄", "⣤", "⣦", "⣶", "⣷", "⣿"],
  120
);

// 5. Pulse — dots grow then shrink, a breathing signal
export const BraillePulse = makeSpinner(
  ["⠁", "⠃", "⠇", "⠧", "⠷", "⠿", "⠷", "⠧", "⠇", "⠃"],
  100
);

// ---------------------------------------------------------------------------
// Dot-matrix spinners — a square grid of faint dots where lit dots animate.
// Not braille; rendered as SVG so dot size/spacing is fully controllable.
// ---------------------------------------------------------------------------
const DIM = 0.16;

function makeMatrix(
  n: number,
  frames: number,
  ms: number,
  fn: (f: number, r: number, c: number) => number
) {
  return function Matrix({ size = 24, className = "" }: SpinnerProps) {
    const f = useFrame(frames, ms);
    const pad = size * 0.14;
    const span = size - pad * 2;
    const step = n > 1 ? span / (n - 1) : 0;
    const radius = size * 0.05;
    const dots = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        dots.push(
          <circle
            key={`${r}-${c}`}
            cx={pad + c * step}
            cy={pad + r * step}
            r={radius}
            fill="currentColor"
            opacity={fn(f, r, c)}
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
      >
        {dots}
      </svg>
    );
  };
}

// perimeter cells of an n×n grid in clockwise order
function perimeter(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let c = 0; c < n; c++) out.push([0, c]);
  for (let r = 1; r < n; r++) out.push([r, n - 1]);
  for (let c = n - 2; c >= 0; c--) out.push([n - 1, c]);
  for (let r = n - 2; r >= 1; r--) out.push([r, 0]);
  return out;
}
const N = 5;
const MID = (N - 1) / 2;
const PERIM = perimeter(N);

// A. Sweep — a column passes left→right (train passing the grid)
export const MatrixSweep = makeMatrix(N, N, 120, (f, _r, c) => {
  if (c === f) return 1;
  if (c === (f - 1 + N) % N) return 0.4;
  return DIM;
});

// B. Comet — a single dot snakes through every cell with a fading tail
export const MatrixComet = makeMatrix(N, N * N, 70, (f, r, c) => {
  const idx = r * N + (r % 2 === 0 ? c : N - 1 - c);
  const d = (f - idx + N * N) % (N * N);
  if (d === 0) return 1;
  if (d === 1) return 0.45;
  if (d === 2) return 0.26;
  return DIM;
});

// C. Ripple — rings expand outward from the center
export const MatrixRipple = makeMatrix(N, 4, 150, (f, r, c) => {
  const ring = Math.round(Math.hypot(r - MID, c - MID));
  return ring === f ? 1 : DIM;
});

// D. Orbit — center stays lit while a dot circles the perimeter
export const MatrixOrbit = makeMatrix(N, PERIM.length, 90, (f, r, c) => {
  if (r === MID && c === MID) return 0.85;
  const head = PERIM[f];
  const tail = PERIM[(f - 1 + PERIM.length) % PERIM.length];
  if (r === head[0] && c === head[1]) return 1;
  if (r === tail[0] && c === tail[1]) return 0.4;
  return DIM;
});

// E. Fill — track is laid column by column, then resets
export const MatrixFill = makeMatrix(N, N + 1, 130, (f, _r, c) => {
  if (c === f - 1) return 1;
  if (c < f) return 0.7;
  return DIM;
});

// F. Cross — two trains pass, one rolling right, one rolling left
export const MatrixCross = makeMatrix(N, N, 130, (f, r, c) => {
  const colA = f % N; // top train →
  const colB = N - 1 - (f % N); // bottom train ←
  if (r === 1) {
    if (c === colA) return 1;
    if (c === (colA - 1 + N) % N) return 0.4;
  }
  if (r === 3) {
    if (c === colB) return 1;
    if (c === (colB + 1) % N) return 0.4;
  }
  if (r === MID) return DIM * 1.6; // faint track between them
  return DIM;
});

// G. Tunnel — dots collapse to the center, then burst back out
const TUNNEL = [2, 1, 0, 1];
export const MatrixTunnel = makeMatrix(N, TUNNEL.length, 150, (f, r, c) => {
  const ring = Math.max(Math.abs(r - MID), Math.abs(c - MID));
  return ring === TUNNEL[f] ? 1 : DIM;
});

// H. Split-flap — columns scroll like a station departure board
export const MatrixBoard = makeMatrix(N, N, 85, (f, r, c) => {
  const head = (f + c) % N;
  if (r === head) return 1;
  if (r === (head - 1 + N) % N) return 0.4;
  return DIM;
});

// I. Switch — a dot climbs the track, then the switch throws left/right
const SW_UP: [number, number][] = [
  [4, 2],
  [3, 2],
  [2, 2],
];
const SW_L = SW_UP.concat([
  [1, 1],
  [0, 0],
]);
const SW_R = SW_UP.concat([
  [1, 3],
  [0, 4],
]);
export const MatrixSwitch = makeMatrix(N, SW_L.length * 2, 120, (f, r, c) => {
  const path = Math.floor(f / SW_L.length) % 2 === 0 ? SW_L : SW_R;
  const local = f % SW_L.length;
  const [hr, hc] = path[local];
  if (hr === r && hc === c) return 1;
  if (local > 0) {
    const [pr, pc] = path[local - 1];
    if (pr === r && pc === c) return 0.45;
  }
  if (c === MID && r >= MID) return DIM * 1.7; // track stem
  return DIM;
});

// J. Radar — a signal arm sweeps around the grid
const RN = 7;
const RMID = (RN - 1) / 2;
const RADAR_FRAMES = 12;
export const MatrixRadar = makeMatrix(RN, RADAR_FRAMES, 90, (f, r, c) => {
  if (r === RMID && c === RMID) return 0.55;
  const a0 = Math.atan2(r - RMID, c - RMID);
  const a = a0 < 0 ? a0 + 2 * Math.PI : a0;
  const sweep = (f / RADAR_FRAMES) * 2 * Math.PI;
  let diff = Math.abs(a - sweep);
  if (diff > Math.PI) diff = 2 * Math.PI - diff;
  const lead = (2 * Math.PI) / RADAR_FRAMES;
  if (diff < lead * 0.6) return 1;
  if (diff < lead * 1.6) return 0.35;
  return DIM;
});

// K. Incline — a diagonal band climbs across the grade
export const MatrixIncline = makeMatrix(N, 2 * N - 1, 85, (f, r, c) => {
  const d = r + c;
  if (d === f) return 1;
  if (d === f - 1) return 0.4;
  return DIM;
});

// L. Train — a little locomotive drives left→right (7×7) with rising smoke
const TN = 7;
// engine cells relative to its head column: [dr, dc, intensity]
const ENGINE: [number, number, number][] = [
  [2, 1, 1], // chimney
  [3, 0, 1],
  [3, 1, 1],
  [3, 2, 1],
  [3, 3, 1], // body top (incl. cab)
  [4, 0, 1],
  [4, 1, 1],
  [4, 2, 1],
  [4, 3, 1], // body bottom
  [5, 0, 0.85],
  [5, 3, 0.85], // wheels
];
export const MatrixTrain = makeMatrix(TN, TN + 6, 140, (f, r, c) => {
  const x = f - 4; // enters from the left, exits right
  let v = DIM;
  for (const [dr, dc, i] of ENGINE) {
    if (r === dr && c === dc + x) v = Math.max(v, i);
  }
  // smoke puffs drifting up & back from the chimney
  if (f % 2 === 0) {
    if (r === 1 && c === 1 + x) v = Math.max(v, 0.35);
    if (r === 0 && c === x) v = Math.max(v, 0.22);
  } else {
    if (r === 1 && c === x) v = Math.max(v, 0.3);
  }
  return v;
});

// L2. Train (clean) — same locomotive, no smoke, all focus on the train
const ENGINE_CLEAN: [number, number][] = [
  [2, 1], // chimney
  [3, 0],
  [3, 1],
  [3, 2],
  [3, 3], // body top
  [4, 0],
  [4, 1],
  [4, 2],
  [4, 3], // body bottom
  [5, 0],
  [5, 3], // wheels
];
export const MatrixTrainClean = makeMatrix(TN, TN + 6, 140, (f, r, c) => {
  const x = f - 4;
  for (const [dr, dc] of ENGINE_CLEAN) {
    if (r === dr && c === dc + x) return 1;
  }
  return DIM;
});

// L3. Train on track — square 7×7 grid, stable bottom rail. A 13-wide train
// sprite (reconstructed from the reference keyframes) slides one column per
// frame: empty → enters from the left → crosses → exits right → empty → loop.
// sl = sprite-local column (0..12).
function trainCell(r: number, sl: number): boolean {
  if (sl < 0 || sl > 12) return false;
  if (r === 1) return sl >= 2 && sl <= 10; // roof
  if (r === 2) return sl === 1 || sl === 11; // chimney bump at each end
  if (r === 3 || r === 4) return true; // body (full length)
  return false;
}
const TRAIN_X_MIN = -13; // fully off the left → nothing
const TRAIN_NFRAMES = 21; // X from -13..7 (X=7 is fully off the right)
export const MatrixTrainTrack = makeMatrix(TN, TRAIN_NFRAMES, 90, (f, r, c) => {
  if (r === TN - 1) return 0.9; // stable track line along the bottom
  return trainCell(r, c - (TRAIN_X_MIN + f)) ? 1 : DIM;
});

// M. Tracks — rails + sleepers are laid down left→right, then rebuild
const KN = 7;
export const MatrixTracks = makeMatrix(KN, KN + 1, 120, (f, r, c) => {
  if (c === f && r >= 2 && r <= 4) return 1; // bright building edge
  if (c < f) {
    if (r === 2 || r === 4) return 0.9; // two parallel rails
    if (r === 3 && c % 2 === 0) return 0.55; // sleepers
  }
  return DIM;
});

// N. Build-up — a pyramid grows row by row (structure being built)
export const MatrixBuild = makeMatrix(N, N + 1, 160, (f, r, c) => {
  if (r <= f && Math.abs(c - MID) <= r) return r === f ? 1 : 0.6;
  return DIM;
});

const MATRIX_ITEMS: {
  label: string;
  desc: string;
  Spinner: (p: SpinnerProps) => React.ReactElement;
}[] = [
  {
    label: "Matrix Sweep",
    desc: "A column passes left→right — a train passing the grid.",
    Spinner: MatrixSweep,
  },
  {
    label: "Matrix Comet",
    desc: "A single dot snakes through every cell with a fading tail.",
    Spinner: MatrixComet,
  },
  {
    label: "Matrix Ripple",
    desc: "Rings expand outward from the center.",
    Spinner: MatrixRipple,
  },
  {
    label: "Matrix Orbit",
    desc: "Center stays lit while a dot circles the perimeter.",
    Spinner: MatrixOrbit,
  },
  {
    label: "Matrix Fill",
    desc: "Track is laid column by column, then resets.",
    Spinner: MatrixFill,
  },
  {
    label: "Matrix Cross",
    desc: "Two trains pass — one rolls right, one rolls left.",
    Spinner: MatrixCross,
  },
  {
    label: "Matrix Tunnel",
    desc: "Dots collapse to the center, then burst back out.",
    Spinner: MatrixTunnel,
  },
  {
    label: "Matrix Split-Flap",
    desc: "Columns scroll like a station departure board.",
    Spinner: MatrixBoard,
  },
  {
    label: "Matrix Switch",
    desc: "A dot climbs the track, then the switch throws left/right.",
    Spinner: MatrixSwitch,
  },
  {
    label: "Matrix Radar",
    desc: "A signal arm sweeps around like radar.",
    Spinner: MatrixRadar,
  },
  {
    label: "Matrix Incline",
    desc: "A diagonal band climbs across the grade.",
    Spinner: MatrixIncline,
  },
  {
    label: "Matrix Train",
    desc: "A little locomotive drives left→right with rising smoke.",
    Spinner: MatrixTrain,
  },
  {
    label: "Matrix Train (clean)",
    desc: "Same locomotive, no smoke — all focus on the train.",
    Spinner: MatrixTrainClean,
  },
  {
    label: "Matrix Train on Track",
    desc: "Bottom row is a stable rail; the train rolls left→right above it.",
    Spinner: MatrixTrainTrack,
  },
  {
    label: "Matrix Tracks",
    desc: "Rails and sleepers are laid down left→right, then rebuild.",
    Spinner: MatrixTracks,
  },
  {
    label: "Matrix Build-Up",
    desc: "A pyramid grows row by row — structure being built.",
    Spinner: MatrixBuild,
  },
];

const ITEMS: {
  label: string;
  desc: string;
  Spinner: (p: SpinnerProps) => React.ReactElement;
}[] = [
  {
    label: "Spin",
    desc: "Canonical CLI braille cycle (⠋⠙⠹…).",
    Spinner: BrailleSpin,
  },
  {
    label: "Orbit",
    desc: "A single dot circles the cell — a train on a loop.",
    Spinner: BrailleOrbit,
  },
  {
    label: "Sweep",
    desc: "A bar passes left→right through the cell — train passing.",
    Spinner: BrailleSweep,
  },
  {
    label: "Fill",
    desc: "Track builds up from the bottom, then resets.",
    Spinner: BrailleFill,
  },
  {
    label: "Pulse",
    desc: "Dots grow then shrink — a breathing signal.",
    Spinner: BraillePulse,
  },
];

function Group({
  title,
  items,
}: {
  title: string;
  items: typeof ITEMS;
}) {
  return (
    <>
      <div
        style={{
          fontSize: 11.5,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          opacity: 0.4,
          margin: "26px 0 10px",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map(({ label, desc, Spinner }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "14px 16px",
              border: "1px solid #1d1b27",
              borderRadius: 12,
              background: "#0c0b11",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flex: "0 0 auto",
                width: 96,
              }}
            >
              <Spinner size={16} />
              <Spinner size={28} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 12.5, opacity: 0.5, marginTop: 2 }}>
                {desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function SpinnerLab() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        background: "#08070b",
        padding: "48px 40px",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#e7e5ee",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
          Railway loading spinners
        </h1>
        <p style={{ fontSize: 13.5, opacity: 0.5, marginTop: 6 }}>
          Square, icon-scale. All use currentColor. Shown at 16px and 28px.
        </p>

        <Group title="Dot matrix (custom grid)" items={MATRIX_ITEMS} />
        <Group title="Braille (single cell)" items={ITEMS} />
      </div>
    </div>
  );
}
