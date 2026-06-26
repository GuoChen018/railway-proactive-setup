import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, GitHubIcon, RefreshIcon, SettingsIcon, Spinner } from "./icons";
import "./RepoPicker.css";

const REPOS = [
  "GuoChen018/daybook",
  "GuoChen018/quiet-pages",
  "GuoChen018/letter-journal",
  "GuoChen018/gg-home",
  "GuoChen018/baby-profound",
  "GuoChen018/slack-agent",
  "GuoChen018/similar-google-font",
  "GuoChen018/stock-screener",
  "GuoChen018/oak-website",
];

interface Props {
  onBack: () => void;
  onSelect: () => void;
}

export function RepoPicker({ onBack, onSelect }: Props) {
  const [selecting, setSelecting] = useState(false);
  const [active, setActive] = useState(0);

  const handleSelect = () => {
    if (selecting) return;
    setSelecting(true);
    // brief "connecting" beat before the canvas takes over
    window.setTimeout(onSelect, 650);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selecting) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, REPOS.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (REPOS[active] === "GuoChen018/daybook") handleSelect();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, selecting]);

  return (
    <>
      <div className="palette-input">
        <div className="repo-search-field">
          <button className="repo-back" onClick={onBack} aria-label="Back">
            <ArrowLeft size={16} />
          </button>
          <input placeholder="What would you like to create?" readOnly />
        </div>
      </div>

      <div className="repo-config-row">
        <span className="repo-config-left">
          <SettingsIcon size={15} />
          Configure GitHub App
        </span>
        <button className="repo-refresh">
          <RefreshIcon size={13} />
          Refresh
        </button>
      </div>

      <div className="repo-list">
          {REPOS.map((repo, i) => {
            const isDaybook = repo === "GuoChen018/daybook";
            const isSelecting = selecting && isDaybook;
            const dimmed = selecting && !isDaybook;
            return (
              <button
                key={repo}
                className={`repo-row ${active === i && !selecting ? "active" : ""} ${
                  isSelecting ? "selecting" : ""
                } ${dimmed ? "dimmed" : ""}`}
                onClick={isDaybook ? handleSelect : undefined}
                onMouseEnter={() => setActive(i)}
                disabled={dimmed}
              >
              <span className="repo-row-icon">
                <GitHubIcon size={17} />
              </span>
              <span className="repo-row-label">{repo}</span>
              {isSelecting ? (
                <Spinner size={15} className="repo-row-spinner" />
              ) : (
                <span className="repo-row-chevron">
                  <ChevronRight size={15} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
