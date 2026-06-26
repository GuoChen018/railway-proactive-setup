import { CanvasIcon, ChartIcon, DocIcon, SettingsIcon } from "./icons";
import "./Sidebar.css";

export function Sidebar() {
  return (
    <nav className="sidebar">
      <button className="sidebar-btn active" aria-label="Architecture">
        <CanvasIcon />
      </button>
      <button className="sidebar-btn" aria-label="Metrics">
        <ChartIcon />
      </button>
      <button className="sidebar-btn" aria-label="Logs">
        <DocIcon />
      </button>
      <button className="sidebar-btn" aria-label="Settings">
        <SettingsIcon />
      </button>
      <div className="sidebar-spacer" />
      <div className="sidebar-avatar" />
    </nav>
  );
}
