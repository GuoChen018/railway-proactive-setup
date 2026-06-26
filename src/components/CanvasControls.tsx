import type { PointerEvent as ReactPointerEvent } from "react";
import {
  GridDotsIcon,
  LayersIcon,
  PlusIcon,
  RedoIcon,
  UndoIcon,
} from "./icons";
import "./CanvasControls.css";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}

export function CanvasControls({ onZoomIn, onZoomOut, onFit }: Props) {
  const stop = (e: ReactPointerEvent) => e.stopPropagation();
  return (
    <div className="canvas-controls" onPointerDown={stop}>
      <div className="cc-group">
        <button className="cc-btn" aria-label="Grid">
          <GridDotsIcon />
        </button>
      </div>
      <div className="cc-group cc-stack">
        <button className="cc-btn" aria-label="Zoom in" onClick={onZoomIn}>
          <PlusIcon size={15} />
        </button>
        <div className="cc-divider" />
        <button className="cc-btn" aria-label="Zoom out" onClick={onZoomOut}>
          <span className="cc-minus" />
        </button>
        <div className="cc-divider" />
        <button className="cc-btn" aria-label="Fit" onClick={onFit}>
          <FitIcon />
        </button>
      </div>
      <div className="cc-group cc-stack">
        <button className="cc-btn" aria-label="Undo">
          <UndoIcon />
        </button>
        <div className="cc-divider" />
        <button className="cc-btn" aria-label="Redo">
          <RedoIcon />
        </button>
      </div>
      <div className="cc-group">
        <button className="cc-btn" aria-label="Layers">
          <LayersIcon />
        </button>
      </div>
    </div>
  );
}

function FitIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
