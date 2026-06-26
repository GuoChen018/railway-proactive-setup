import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { ConnectionLines } from "./ConnectionLines";
import { CanvasControls } from "./CanvasControls";
import "./Canvas.css";

// World-space layout (large positive coords so the connection SVG never clips).
const WORLD = 5000;
const INIT_POS = {
  backend: { x: 2500, y: 2360 },
  postgres: { x: 2360, y: 2600 },
  frontend: { x: 2640, y: 2600 },
};

type NodeId = "backend" | "postgres" | "frontend";

interface Viewport {
  x: number;
  y: number;
  k: number;
}

interface Props {
  interactive: boolean;
  showBackend: boolean;
  postgresVisible: boolean;
  frontendVisible: boolean;
  connectionsDrawn: boolean;
  backendNode: ReactNode;
  postgresNode: ReactNode;
  frontendNode: ReactNode;
  selectedId: NodeId | null;
  onNodeClick: (id: NodeId) => void;
  backdrop?: ReactNode;
  worldOverlay?: ReactNode;
  panelOverlay?: ReactNode;
  recenter?: number;
}

// World anchor for the centered command palette / repo picker so it pans
// along with the canvas.
const OVERLAY_ANCHOR = { x: INIT_POS.backend.x, y: INIT_POS.backend.y + 30 };

const MIN_K = 0.45;
const MAX_K = 2.4;
// horizontal space occluded by the floating panel (panel + margins)
const PANEL_OCCLUDE = 476;

export function Canvas({
  interactive,
  showBackend,
  postgresVisible,
  frontendVisible,
  connectionsDrawn,
  backendNode,
  postgresNode,
  frontendNode,
  selectedId,
  onNodeClick,
  backdrop,
  worldOverlay,
  panelOverlay,
  recenter,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState<Viewport>({ x: 0, y: 0, k: 1 });
  const [positions, setPositions] = useState(INIT_POS);
  const [interacting, setInteracting] = useState(false);
  const didInit = useRef(false);
  const interactTimer = useRef<number | null>(null);
  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const markInteracting = () => {
    setInteracting(true);
    if (interactTimer.current) clearTimeout(interactTimer.current);
    interactTimer.current = window.setTimeout(() => setInteracting(false), 180);
  };

  // Center the cluster on first paint.
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || didInit.current) return;
    const { clientWidth: w, clientHeight: h } = el;
    if (!w || !h) return;
    didInit.current = true;
    setVp({
      k: 1,
      x: w / 2 - INIT_POS.backend.x,
      y: h * 0.46 - INIT_POS.backend.y,
    });
  }, []);

  // Recenter the viewport when the flow restarts so the command palette is
  // always centered at a comfortable zoom (skips the initial mount).
  useEffect(() => {
    if (!recenter) return;
    const el = rootRef.current;
    if (!el) return;
    setVp({
      k: 1,
      x: el.clientWidth / 2 - INIT_POS.backend.x,
      y: el.clientHeight * 0.46 - INIT_POS.backend.y,
    });
  }, [recenter]);

  // When a node is selected, smoothly center it within the visible canvas
  // (the area not covered by the floating panel). When the panel closes,
  // re-center the whole node cluster.
  const prevSelected = useRef<NodeId | null>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (selectedId) {
      const pos = positionsRef.current[selectedId];
      setVp((v) => ({
        ...v,
        x: (el.clientWidth - PANEL_OCCLUDE) / 2 - pos.x * v.k,
        y: el.clientHeight / 2 - pos.y * v.k,
      }));
    } else if (prevSelected.current) {
      const p = positionsRef.current;
      const cx = (p.backend.x + p.postgres.x + p.frontend.x) / 3;
      const cy = (p.backend.y + p.postgres.y + p.frontend.y) / 3;
      setVp((v) => ({
        ...v,
        x: el.clientWidth / 2 - cx * v.k,
        y: el.clientHeight / 2 - cy * v.k,
      }));
    }
    prevSelected.current = selectedId;
  }, [selectedId]);

  // Wheel: pinch/ctrl => zoom toward pointer, else pan.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      markInteracting();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (e.ctrlKey || e.metaKey) {
        setVp((v) => {
          const k2 = clamp(v.k * Math.exp(-e.deltaY * 0.01), MIN_K, MAX_K);
          const worldX = (px - v.x) / v.k;
          const worldY = (py - v.y) / v.k;
          return { k: k2, x: px - worldX * k2, y: py - worldY * k2 };
        });
      } else {
        setVp((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Background pan.
  const panRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(
    null
  );
  const onRootPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    panRef.current = { sx: e.clientX, sy: e.clientY, ox: vp.x, oy: vp.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onRootPointerMove = (e: ReactPointerEvent) => {
    if (!panRef.current) return;
    markInteracting();
    const p = panRef.current;
    setVp((v) => ({ ...v, x: p.ox + (e.clientX - p.sx), y: p.oy + (e.clientY - p.sy) }));
  };
  const endPan = (e: ReactPointerEvent) => {
    panRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Node drag (or click if no movement).
  const dragRef = useRef<{
    id: NodeId;
    sx: number;
    sy: number;
    ox: number;
    oy: number;
    moved: boolean;
  } | null>(null);

  const startNodeDrag = (id: NodeId) => (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    dragRef.current = {
      id,
      sx: e.clientX,
      sy: e.clientY,
      ox: positions[id].x,
      oy: positions[id].y,
      moved: false,
    };
    const onMove = (ev: globalThis.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = ev.clientX - d.sx;
      const dy = ev.clientY - d.sy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
      markInteracting();
      setPositions((prev) => ({
        ...prev,
        [d.id]: { x: d.ox + dx / vp.k, y: d.oy + dy / vp.k },
      }));
    };
    const onUp = () => {
      const d = dragRef.current;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (d && !d.moved) onNodeClick(d.id);
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const zoomBy = (factor: number) => {
    const el = rootRef.current;
    if (!el) return;
    const px = el.clientWidth / 2;
    const py = el.clientHeight / 2;
    setVp((v) => {
      const k2 = clamp(v.k * factor, MIN_K, MAX_K);
      const worldX = (px - v.x) / v.k;
      const worldY = (py - v.y) / v.k;
      return { k: k2, x: px - worldX * k2, y: py - worldY * k2 };
    });
  };

  const fit = () => {
    const el = rootRef.current;
    if (!el) return;
    setVp({
      k: 1,
      x: el.clientWidth / 2 - INIT_POS.backend.x,
      y: el.clientHeight * 0.46 - INIT_POS.backend.y,
    });
  };

  const HALF_H = 56;
  const down = (p: { x: number; y: number }) => ({ x: p.x, y: p.y + HALF_H });
  const up = (p: { x: number; y: number }) => ({ x: p.x, y: p.y - HALF_H });
  const edges = [
    { from: down(positions.backend), to: up(positions.postgres) },
    { from: down(positions.backend), to: up(positions.frontend) },
  ];

  return (
    <div
      className="canvas"
      ref={rootRef}
      onPointerDown={onRootPointerDown}
      onPointerMove={onRootPointerMove}
      onPointerUp={endPan}
      onPointerCancel={endPan}
    >
      <div className="canvas-grid" />

      {backdrop}

      <div
        className="canvas-world"
        style={{
          transform: `translate(${vp.x}px, ${vp.y}px) scale(${vp.k})`,
          transition: interacting
            ? "none"
            : "transform 0.42s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {worldOverlay && (
          <div
            className="canvas-overlay-anchor"
            style={{ left: OVERLAY_ANCHOR.x, top: OVERLAY_ANCHOR.y }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {worldOverlay}
          </div>
        )}

        {connectionsDrawn && (
          <ConnectionLines
            width={WORLD}
            height={WORLD}
            edges={edges}
            drawn={connectionsDrawn}
          />
        )}

        {showBackend && (
          <NodeSlot pos={positions.backend} onPointerDown={startNodeDrag("backend")}>
            {backendNode}
          </NodeSlot>
        )}
        {postgresVisible && (
          <NodeSlot pos={positions.postgres} onPointerDown={startNodeDrag("postgres")}>
            {postgresNode}
          </NodeSlot>
        )}
        {frontendVisible && (
          <NodeSlot pos={positions.frontend} onPointerDown={startNodeDrag("frontend")}>
            {frontendNode}
          </NodeSlot>
        )}
      </div>

      {panelOverlay}

      {interactive && (
        <CanvasControls onZoomIn={() => zoomBy(1.25)} onZoomOut={() => zoomBy(1 / 1.25)} onFit={fit} />
      )}
    </div>
  );
}

function NodeSlot({
  pos,
  onPointerDown,
  children,
}: {
  pos: { x: number; y: number };
  onPointerDown: (e: ReactPointerEvent) => void;
  children: ReactNode;
}) {
  return (
    <div
      className="node-slot"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
    >
      {children}
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
