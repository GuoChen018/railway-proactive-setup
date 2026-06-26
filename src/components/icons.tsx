import { useEffect, useState, type SVGProps } from "react";
import postgresPng from "../assets/postgres.png";
import railwayLogoPng from "../assets/railway-logo.png";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
});

export function RailwayMark({ size = 22 }: { size?: number }) {
  return (
    <img
      src={railwayLogoPng}
      width={size}
      height={size}
      alt="Railway"
      className="railway-mark"
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}

export function PostgresLogo({ size = 24 }: { size?: number }) {
  return (
    <img
      src={postgresPng}
      width={size}
      height={size}
      alt=""
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}

export function ActivityIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M3 12h3.5l2.2-5.5 4 12 2.3-6.5H21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GitHubIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

export function PostgresIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M17.3 3.6c-1.1-.3-2.4-.4-3.9-.2-.7.1-1.2.2-1.7.4-.4-.1-.8-.1-1.2-.2-1-.1-2.5-.2-3.7.3C5.4 4.5 4 6 3.8 8.4c-.2 2.3.2 5.3 1.2 7.6.5 1.1 1.1 1.9 1.9 2 .6.1 1.1-.2 1.6-.9.3.4.7.6 1.1.6 1 0 1.6-.7 1.9-1.4.1.1.3.1.4.2.5.4.5 1.4.4 2.4-.1.6.3 1 .7 1.1.9.2 1.9-.6 2.4-2.4.4-1.5.8-3.9.9-5.8.5.2 1.2.3 2 .1 1.3-.3 2.1-1.4 2.2-2.9.1-1.7-.4-4.2-1.3-5.5-.6-.9-1.4-1.5-2.3-1.7Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function LinkIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M9 13a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 11a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GlobeIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function EyeOffIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c5 0 8.5 4 9 6.5a12 12 0 0 1-2 3M6.2 7.2C3.8 8.6 2.4 10.7 2 11.5 2.5 14 6 18 11 18c1.4 0 2.7-.3 3.8-.8M9.5 10.4a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronRight({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M4 12.5l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckCircle({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18" />
      <path
        d="M8 12.2l2.6 2.6L16 9.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EmptyCircle({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.6"
      />
    </svg>
  );
}

export function ClockIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkleIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path
        d="M13.3332 1.99984V4.66651M14.6666 3.33317H11.9999M2.66655 11.3332V12.6665M3.33321 11.9998H1.99988M6.62455 10.3332C6.56503 10.1025 6.44477 9.89191 6.27629 9.72343C6.10781 9.55495 5.89726 9.43469 5.66655 9.37517L1.57655 8.32051C1.50677 8.3007 1.44535 8.25867 1.40162 8.2008C1.35789 8.14293 1.33423 8.07238 1.33423 7.99984C1.33423 7.9273 1.35789 7.85675 1.40162 7.79888C1.44535 7.74101 1.50677 7.69898 1.57655 7.67917L5.66655 6.62384C5.89718 6.56438 6.10767 6.44422 6.27615 6.27587C6.44462 6.10751 6.56492 5.8971 6.62455 5.66651L7.67921 1.57651C7.69882 1.50645 7.7408 1.44474 7.79876 1.40077C7.85672 1.35681 7.92747 1.33301 8.00021 1.33301C8.07296 1.33301 8.14371 1.35681 8.20167 1.40077C8.25962 1.44474 8.30161 1.50645 8.32121 1.57651L9.37521 5.66651C9.43473 5.89722 9.55499 6.10777 9.72347 6.27625C9.89195 6.44473 10.1025 6.56499 10.3332 6.62451L14.4232 7.67851C14.4936 7.69791 14.5556 7.73985 14.5998 7.79789C14.644 7.85594 14.6679 7.92688 14.6679 7.99984C14.6679 8.0728 14.644 8.14374 14.5998 8.20179C14.5556 8.25983 14.4936 8.30177 14.4232 8.32117L10.3332 9.37517C10.1025 9.43469 9.89195 9.55495 9.72347 9.72343C9.55499 9.89191 9.43473 10.1025 9.37521 10.3332L8.32055 14.4232C8.30094 14.4932 8.25896 14.5549 8.201 14.5989C8.14304 14.6429 8.07229 14.6667 7.99955 14.6667C7.9268 14.6667 7.85605 14.6429 7.79809 14.5989C7.74014 14.5549 7.69815 14.4932 7.67855 14.4232L6.62455 10.3332Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DatabaseIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function TemplateIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 3l8 4.5-8 4.5-8-4.5L12 3ZM4 12l8 4.5L20 12M4 16.5l8 4.5 8-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DockerIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path
        d="M15.7399 6.87424C15.3476 6.6102 14.3169 6.49744 13.5675 6.69927C13.5271 5.95286 13.1423 5.32387 12.4382 4.77507L12.1775 4.6001L12.0038 4.86244C11.6623 5.38078 11.5185 6.07134 11.5695 6.69906C11.6097 7.08581 11.7442 7.52058 12.0038 7.83602C11.0285 8.40176 10.1295 8.27333 6.14826 8.27333H0.00137999C-0.0166032 9.17228 0.127897 10.9016 1.22762 12.3094C1.34906 12.4649 1.48235 12.6153 1.62685 12.7603C2.52094 13.6556 3.87179 14.3121 5.89184 14.314C8.97353 14.3168 11.6139 12.6511 13.2199 8.62348C13.7484 8.63215 15.1435 8.71826 15.8262 7.39893C15.8429 7.37671 15.9999 7.04899 15.9999 7.04899L15.7397 6.87403L15.7399 6.87424ZM4.01291 6.05209H2.2844V7.78059H4.01291V6.05209ZM6.246 6.05209H4.5175V7.78059H6.246V6.05209ZM8.4791 6.05209H6.75059V7.78059H8.4791V6.05209ZM10.7122 6.05209H8.98369V7.78059H10.7122V6.05209ZM1.77982 6.05209H0.0513099V7.78059H1.77982V6.05209ZM4.01291 3.86892H2.2844V5.59743H4.01291V3.86892ZM6.246 3.86892H4.5175V5.59743H6.246V3.86892ZM8.4791 3.86892H6.75059V5.59743H8.4791V3.86892ZM8.4791 1.68555H6.75059V3.41405H8.4791V1.68555Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FunctionIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 16c0-5 1-8 3-8M8 12h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BucketIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M5 8h14l-1.3 11.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M3 8h18M9 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyProjectIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
    </svg>
  );
}

export function ArrowLeft({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RefreshIcon({ size = 14, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M20 11a8 8 0 0 0-14.3-4.5M4 5v3h3M4 13a8 8 0 0 0 14.3 4.5M20 19v-3h-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinIcon({ size = 14, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ReplicaIcon({ size = 14, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M5 8a7 4 0 1 0 14 0 7 4 0 1 0-14 0M5 8v8c0 2.2 3.1 4 7 4s7-1.8 7-4V8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CopyIcon({ size = 15, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BellIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AgentIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9.5L5 19.5V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CanvasIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.2v3M12 10.2l-4.5 5.5M12 10.2l4.5 5.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ChartIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 19V9M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function DocIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M6 3h8l5 5v13H6V3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5M9 13h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SettingsIcon({ size = 18, ...p }: IconProps) {
  // 8-tooth gear: ring + evenly spaced teeth + hub
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg {...base(size)} {...p}>
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      >
        <circle cx="12" cy="12" r="5.4" />
        <circle cx="12" cy="12" r="2.1" />
        {teeth.map((deg) => (
          <line
            key={deg}
            x1="12"
            y1="3.2"
            x2="12"
            y2="5.4"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
      </g>
    </svg>
  );
}

export function PlusIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GridDotsIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      {[6, 12, 18].map((y) =>
        [6, 12, 18].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill="currentColor" />
        ))
      )}
    </svg>
  );
}

export function LayersIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 3l9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UndoIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RedoIcon({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p} style={{ transform: "scaleX(-1)", ...(p.style || {}) }}>
      <path
        d="M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BRAILLE_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function Spinner({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setFrame((f) => (f + 1) % BRAILLE_FRAMES.length),
      80
    );
    return () => window.clearInterval(id);
  }, []);
  return (
    <span
      className={`spinner-braille ${className}`}
      aria-label="Loading"
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        fontSize: size * 1.15,
        lineHeight: 1,
        color: "currentColor",
        fontFamily:
          "var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace)",
      }}
    >
      {BRAILLE_FRAMES[frame]}
    </span>
  );
}
