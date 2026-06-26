import type { ReactNode } from "react";
import { GlobeIcon } from "./icons";
import "./ServiceNode.css";

interface Props {
  icon: ReactNode;
  title: string;
  /** "ghost" while pending detection, "resolved" once provisioned. */
  variant: "ghost" | "resolved";
  selected?: boolean;
  /** status row content (spinner + label, or dot + label) */
  status?: ReactNode;
  /** muted reason shown while ghost, e.g. "Found DATABASE_URL reference" */
  detectionReason?: string;
  showDomain?: boolean;
  domainUrl?: string;
  onClick?: () => void;
}

export function ServiceNode({
  icon,
  title,
  variant,
  selected,
  status,
  detectionReason,
  showDomain,
  domainUrl,
  onClick,
}: Props) {
  const isGhost = variant === "ghost";
  return (
    <div
      className={`node ${isGhost ? "node-ghost" : "node-resolved"} ${
        selected ? "node-selected" : ""
      }`}
      onClick={isGhost ? undefined : onClick}
      role={isGhost ? undefined : "button"}
    >
      <div className="node-head">
        <span className="node-icon">{icon}</span>
        <span className="node-title">{title}</span>
        {showDomain && (
          <span className="node-domain" title={domainUrl}>
            <GlobeIcon size={13} />
          </span>
        )}
      </div>

      <div className="node-divider" />

      <div className="node-status">
        {isGhost ? (
          <span className="node-reason">{detectionReason}</span>
        ) : (
          status
        )}
      </div>
    </div>
  );
}
