interface Pt {
  x: number;
  y: number;
}

interface Props {
  width: number;
  height: number;
  edges: { from: Pt; to: Pt }[];
  drawn: boolean;
}

// Orthogonal "elbow" connector: drop down from the source, run horizontally at
// the midpoint, then drop into the target — with small rounded corners.
function elbowPath(from: Pt, to: Pt): string {
  const midY = Math.round((from.y + to.y) / 2);
  const r = Math.min(14, Math.abs(to.x - from.x) / 2, Math.abs(midY - from.y));
  if (r < 2 || Math.abs(to.x - from.x) < 2) {
    // basically straight down
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  const dir = to.x > from.x ? 1 : -1;
  return [
    `M ${from.x} ${from.y}`,
    `L ${from.x} ${midY - r}`,
    `Q ${from.x} ${midY} ${from.x + dir * r} ${midY}`,
    `L ${to.x - dir * r} ${midY}`,
    `Q ${to.x} ${midY} ${to.x} ${midY + r}`,
    `L ${to.x} ${to.y}`,
  ].join(" ");
}

export function ConnectionLines({ width, height, edges, drawn }: Props) {
  if (!width || !height) return null;
  return (
    <svg
      className="connection-svg"
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    >
      <defs>
        <marker
          id="conn-arrow"
          viewBox="0 0 16 16"
          markerWidth={16}
          markerHeight={16}
          refX={11}
          refY={8}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M5 4 L11 8 L5 12"
            fill="none"
            stroke="var(--line)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      {edges.map((e, i) => (
        <path
          key={i}
          d={elbowPath(e.from, e.to)}
          pathLength={1}
          fill="none"
          stroke="var(--line)"
          strokeWidth={1.6}
          strokeLinecap="round"
          markerEnd="url(#conn-arrow)"
          className={`conn-path ${drawn ? "drawn" : ""}`}
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </svg>
  );
}
