import { useEffect, useState, type ReactElement } from "react";
import {
  BucketIcon,
  ChevronRight,
  DatabaseIcon,
  DockerIcon,
  EmptyProjectIcon,
  FunctionIcon,
  GitHubIcon,
  SparkleIcon,
  TemplateIcon,
  type IconProps,
} from "./icons";
import "./CommandPalette.css";

interface Props {
  onConnectGitHub: () => void;
}

type Item = {
  icon: (p: IconProps) => ReactElement;
  label: string;
  kind: "suggestion" | "item";
  chevron?: boolean;
  onSelect?: () => void;
};

export function CommandPalette({ onConnectGitHub }: Props) {
  const items: Item[] = [
    {
      kind: "suggestion",
      icon: SparkleIcon,
      label: "Create to-do list function with a database",
    },
    {
      kind: "suggestion",
      icon: SparkleIcon,
      label: "Deploy Redis, Postgres, and a Bucket",
    },
    {
      kind: "item",
      icon: GitHubIcon,
      label: "GitHub Repository",
      chevron: true,
      onSelect: onConnectGitHub,
    },
    { kind: "item", icon: DatabaseIcon, label: "Database", chevron: true },
    { kind: "item", icon: TemplateIcon, label: "Template", chevron: true },
    { kind: "item", icon: DockerIcon, label: "Docker Image", chevron: true },
    { kind: "item", icon: FunctionIcon, label: "Function" },
    { kind: "item", icon: BucketIcon, label: "Bucket" },
    { kind: "item", icon: EmptyProjectIcon, label: "Empty Project" },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        items[active]?.onSelect?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <>
      <div className="palette-input">
        <input
          placeholder="What would you like to create?"
          autoFocus
          readOnly
        />
      </div>

      <div className="palette-list">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div key={it.label}>
              {i === 2 && <div className="palette-divider" />}
              <button
                className={`palette-row ${active === i ? "active" : ""} ${
                  it.kind === "suggestion" ? "palette-suggestion" : ""
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => it.onSelect?.()}
              >
                <span
                  className={`palette-row-icon ${
                    it.kind === "suggestion" ? "sparkle" : ""
                  }`}
                >
                  <Icon size={it.kind === "suggestion" ? 15 : 16} />
                </span>
                <span className="palette-row-label">{it.label}</span>
                {it.chevron && (
                  <span className="palette-row-chevron">
                    <ChevronRight size={15} />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
