import {
  ActivityIcon,
  AgentIcon,
  BellIcon,
  ChevronDown,
  ChevronRight,
  LinkIcon,
  RailwayMark,
  RefreshIcon,
} from "./icons";
import "./TopBar.css";

interface Props {
  running: boolean;
  inPicker: boolean;
  onRestart: () => void;
  liveUrl?: string | null;
}

export function TopBar({ running, inPicker, onRestart, liveUrl }: Props) {
  const projectName = running ? "ideal-flexibility" : "New project";
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <RailwayMark size={22} />
        </div>
        <span className="topbar-divider" />
        <div className="breadcrumb">
          <span className="crumb-avatar" />
          <span className="crumb-project">{projectName}</span>
          {running ? (
            <>
              <ChevronRight size={14} className="crumb-chevron" />
              <span className="crumb-env">
                <span className="env-dot" />
                production
              </span>
            </>
          ) : (
            <ChevronDown size={14} className="crumb-caret" />
          )}
          {inPicker && (
            <>
              <ChevronRight size={14} className="crumb-chevron" />
              <span className="crumb-sub">GitHub</span>
            </>
          )}
        </div>
      </div>

      {liveUrl && (
        <a
          className="topbar-url"
          href={`https://${liveUrl}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.preventDefault()}
          title={liveUrl}
        >
          <LinkIcon size={13} />
          <span className="topbar-url-text">{liveUrl}</span>
        </a>
      )}

      <div className="topbar-right">
        {running && (
          <button className="topbar-icon-btn" aria-label="Observability">
            <ActivityIcon size={17} />
          </button>
        )}
        <button
          className="topbar-icon-btn"
          aria-label="Restart demo"
          title="Restart demo"
          onClick={onRestart}
        >
          <RefreshIcon size={16} />
        </button>
        <button className="topbar-icon-btn" aria-label="Notifications">
          <BellIcon size={17} />
        </button>
        <span className="topbar-divider" />
        {running ? (
          <button className="agent-btn">
            <AgentIcon size={15} />
            Agent
          </button>
        ) : (
          <span className="plan-badge">17 days or $5.00 left</span>
        )}
        <div className="topbar-avatar" />
      </div>
    </header>
  );
}
