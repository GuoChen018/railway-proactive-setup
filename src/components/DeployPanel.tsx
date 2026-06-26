import { useState, type ReactNode } from "react";
import {
  CheckCircle,
  CheckIcon,
  CloseIcon,
  EmptyCircle,
  EyeOffIcon,
  GitHubIcon,
  GlobeIcon,
  PinIcon,
  PostgresLogo,
  ReplicaIcon,
  Spinner,
} from "./icons";
import { fmt, REPO, type FlowState } from "../flow/flow";
import "./DeployPanel.css";

export type Service = "backend" | "postgres" | "frontend";

const TABS = ["Deployments", "Variables", "Metrics", "Console", "Settings"];

const STAGE_DURATION: Record<string, number> = {
  init: 16,
  build: 7,
  deploy: 4,
  postDeploy: 2,
};

interface SvcConfig {
  title: string;
  icon: ReactNode;
  exposed: boolean;
  domain?: string;
  runtime: string;
  runtimeBadge: "node" | "pg";
  showScan: boolean;
}

const SVC: Record<Service, SvcConfig> = {
  backend: {
    title: REPO.name,
    icon: <GitHubIcon size={22} />,
    exposed: true,
    domain: "daybook-backend-production.up.railway.app",
    runtime: "node@22.22.3",
    runtimeBadge: "node",
    showScan: true,
  },
  postgres: {
    title: "Postgres",
    icon: <PostgresLogo size={22} />,
    exposed: false,
    runtime: "postgres@16",
    runtimeBadge: "pg",
    showScan: false,
  },
  frontend: {
    title: "frontend",
    icon: <GitHubIcon size={22} />,
    exposed: true,
    domain: REPO.liveUrl,
    runtime: "node@22.22.3",
    runtimeBadge: "node",
    showScan: false,
  },
};

interface Props {
  service: Service;
  state: FlowState;
  onClose: () => void;
}

export function DeployPanel({ service, state, onClose }: Props) {
  const [tab, setTab] = useState("Deployments");
  const cfg = SVC[service];

  return (
    <aside className="panel" onPointerDown={(e) => e.stopPropagation()}>
      <div className="panel-header">
        <div className="panel-title">
          {cfg.icon}
          <span>{cfg.title}</span>
        </div>
        <button className="panel-close" onClick={onClose} aria-label="Close">
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="panel-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`panel-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="panel-body">
        {tab === "Deployments" && (
          <DeploymentsTab service={service} state={state} />
        )}
        {tab === "Variables" && (
          <VariablesTab service={service} state={state} />
        )}
        {tab !== "Deployments" && tab !== "Variables" && (
          <div className="panel-empty">No {tab.toLowerCase()} to show yet.</div>
        )}
      </div>
    </aside>
  );
}

function serviceOnline(service: Service, state: FlowState) {
  return service === "backend"
    ? state.repoStatus === "online"
    : state.phase === "live";
}

function DeploymentsTab({
  service,
  state,
}: {
  service: Service;
  state: FlowState;
}) {
  const cfg = SVC[service];
  const online = serviceOnline(service, state);
  const showRuntime = service === "backend" ? state.runtimeDetected : online;
  const buildSubLabel =
    state.buildElapsed >= 4 ? "Publishing image…" : "Building the image…";

  // Non-backend services resolve during init; show their stages as complete
  // once online, otherwise a generic in-progress.
  const pipeline =
    service === "backend"
      ? state.pipeline
      : state.pipeline.map((s) => ({
          ...s,
          status: (online ? "done" : "active") as typeof s.status,
        }));

  return (
    <>
      <div className="panel-meta">
        {cfg.exposed ? (
          <span className="meta-exposed">
            <GlobeIcon size={14} />
            {cfg.domain}
          </span>
        ) : (
          <span className="meta-unexposed">
            <EyeOffIcon size={15} />
            Private networking
          </span>
        )}
        <div className="meta-right">
          {showRuntime && (
            <span className="meta-chip">
              <span
                className={`runtime-dot ${cfg.runtimeBadge === "pg" ? "pg" : ""}`}
              />
              {cfg.runtime}
            </span>
          )}
          <span className="meta-chip">
            <PinIcon size={13} />
            US West
          </span>
          <span className="meta-chip">
            <ReplicaIcon size={13} />1 Replica
          </span>
        </div>
      </div>

      <div className="deploy-card">
        <div className="deploy-card-top">
          <span className={`deploy-badge ${online ? "active" : "building"}`}>
            {online ? "ACTIVE" : "BUILDING"}
          </span>
          <span className="deploy-avatar" />
          <div className="deploy-commit">
            <div className="deploy-commit-msg">
              {service === "postgres"
                ? "Provisioned via Proactive Setup"
                : `${REPO.commit} Co-authored-by: Cur…`}
            </div>
            <div className="deploy-commit-sub">
              {online ? "50 seconds" : "9 seconds"} ago
              {service !== "postgres" && " via GitHub"}
            </div>
          </div>
          <button className="deploy-logs">View logs</button>
          <button className="deploy-kebab" aria-label="More">
            ⋮
          </button>
        </div>

        <div className={`deploy-status-bar ${online ? "success" : ""}`}>
          {online ? (
            <span className="dsb-success">
              <CheckCircle size={16} />
              Deployment successful
            </span>
          ) : (
            <span className="dsb-progress">Deployment in progress:</span>
          )}
        </div>

        <div className="stage-list">
          {pipeline.map((stage) => (
            <div key={stage.key}>
              <div className="stage-row">
                <StageIcon status={stage.status} />
                <span
                  className={`stage-label ${
                    stage.status === "pending" ? "muted" : ""
                  }`}
                >
                  {stage.label}
                  {service === "backend" &&
                    stage.key === "build" &&
                    stage.status === "active" &&
                    ` › ${buildSubLabel}`}
                </span>
                <span className="stage-time">
                  {stageTime(stage, state.buildElapsed, online)}
                </span>
              </div>

              {cfg.showScan &&
                stage.key === "init" &&
                stage.status !== "pending" && (
                  <div className="init-substeps">
                    {state.initSteps.map((step, i) => (
                      <div key={i} className="substep-row">
                        <SubstepIcon status={step.status} />
                        <span
                          className={`substep-label ${
                            step.status === "pending" ? "muted" : ""
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function VariablesTab({
  service,
  state,
}: {
  service: Service;
  state: FlowState;
}) {
  const cfg = SVC[service];

  if (service !== "postgres" && !state.variablesWired) {
    return (
      <div className="panel-empty">
        <Spinner size={16} />
        <span style={{ marginLeft: 10 }}>Wiring variables…</span>
      </div>
    );
  }

  const vars =
    service === "postgres"
      ? POSTGRES_VARS
      : state.variables.filter((v) => v.service === service);

  const note =
    service === "postgres"
      ? "Exposed to services that referenced it during the scan."
      : "Wired automatically from the repository scan — set before the build ran.";

  return (
    <div className="vars">
      <div className="vars-note">
        <CheckIcon size={14} />
        {note}
      </div>
      <div className="vars-group">
        <div className="vars-group-head">
          {cfg.title}
          {cfg.exposed && (
            <span className="vars-domain">
              <GlobeIcon size={12} /> public
            </span>
          )}
        </div>
        {vars.map((v) => (
          <div key={v.name} className="var-row">
            <div className="var-kv">
              <span className="var-key">{v.name}</span>
              <span className="var-eq">=</span>
              <span className="var-val">{v.value}</span>
            </div>
            <div className="var-source">{v.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const POSTGRES_VARS = [
  {
    name: "DATABASE_URL",
    value: "postgresql://postgres:***@postgres.railway.internal:5432/railway",
    source: "Consumed by daybook (private network)",
  },
  {
    name: "POSTGRES_DB",
    value: "railway",
    source: "Railway default",
  },
  {
    name: "PGDATA",
    value: "/var/lib/postgresql/data/pgdata",
    source: "Railway default",
  },
];

function stageTime(
  stage: FlowState["pipeline"][number],
  buildElapsed: number,
  forceDone: boolean
): string {
  if (stage.status === "pending") return "Not started";
  if (stage.key === "build" && stage.status === "active" && !forceDone)
    return `(${fmt(buildElapsed)})`;
  if (stage.status === "active" && !forceDone) return "";
  return `(${fmt(STAGE_DURATION[stage.key] ?? 0)})`;
}

function StageIcon({
  status,
}: {
  status: FlowState["pipeline"][number]["status"];
}) {
  if (status === "done")
    return (
      <span className="stage-ic done">
        <CheckIcon size={15} />
      </span>
    );
  if (status === "active")
    return (
      <span className="stage-ic active">
        <Spinner size={15} />
      </span>
    );
  return (
    <span className="stage-ic">
      <EmptyCircle size={15} />
    </span>
  );
}

function SubstepIcon({
  status,
}: {
  status: FlowState["initSteps"][number]["status"];
}) {
  if (status === "done")
    return (
      <span className="substep-ic done">
        <CheckIcon size={12} />
      </span>
    );
  if (status === "active")
    return (
      <span className="substep-ic active">
        <Spinner size={12} />
      </span>
    );
  return <span className="substep-ic dot" />;
}
