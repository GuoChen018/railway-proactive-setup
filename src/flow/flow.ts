// Central scripted flow for the Proactive Setup prototype.
// Everything is mocked + timed to feel real. Tune the timings here.

export type Phase = "empty" | "picker" | "running" | "live";

export type RepoStatus =
  | "initializing"
  | "building"
  | "deploying"
  | "postDeploy"
  | "online";

export type NodeState = "hidden" | "ghost" | "resolved";

export type StageStatus = "pending" | "active" | "done";

export interface PipelineStage {
  key: "init" | "build" | "deploy" | "postDeploy";
  label: string;
  status: StageStatus;
  seconds: number; // displayed mm:ss once running/done
}

export interface InitStep {
  label: string;
  status: StageStatus;
}

export interface Variable {
  service: "backend" | "frontend";
  name: string;
  value: string;
  // why it was wired (shown subtly)
  source: string;
}

export interface FlowState {
  phase: Phase;
  repoStatus: RepoStatus;
  buildElapsed: number; // seconds, shown on node while building/deploying
  postgres: NodeState;
  frontend: NodeState;
  connectionsDrawn: boolean;
  domainsVisible: boolean;
  initSteps: InitStep[];
  pipeline: PipelineStage[];
  variables: Variable[];
  variablesWired: boolean;
  notificationsEnabled: boolean;
  setupToast: boolean;
  liveToast: boolean;
  osNotification: boolean;
  runtimeDetected: boolean;
}

// ---- Timing constants (ms, relative to repo selection) ----
// Tuned to feel like real provisioning — services take a few seconds each.
export const T = {
  setupToast: 1200,
  setupToastAutoDismiss: 9000,
  scanStart: 2200,
  monorepoDetected: 4200,
  connectionsDraw: 4600,
  ghostsAppear: 5450,
  postgresProvisioning: 6000,
  postgresResolve: 9600,
  frontendProvisioning: 10200,
  frontendResolve: 14400,
  variablesWired: 15600,
  initComplete: 16200,
  buildStart: 16200,
  runtimeDetected: 19000,
  buildDone: 23500,
  deployStart: 23500,
  deployDone: 27000,
  postDeployStart: 27000,
  postDeployDone: 28800,
  live: 28800,
} as const;

export const REPO = {
  name: "daybook",
  fullName: "GuoChen018/daybook",
  commit: "Run db init on startup for hosted deploys",
  liveUrl: "daybook-production.up.railway.app",
};

export const INIT_STEPS_LABELS = [
  "Scanning repository",
  "Detected monorepo (backend/, frontend/)",
  "Provisioning Postgres",
  "Provisioning frontend service",
  "Wiring variables",
];

export const VARIABLES: Variable[] = [
  {
    service: "backend",
    name: "DATABASE_URL",
    value: "${{ Postgres.DATABASE_URL }}",
    source: "Referenced in code (process.env.DATABASE_URL)",
  },
  {
    service: "backend",
    name: "PORT",
    value: "8080",
    source: "Railway default",
  },
  {
    service: "frontend",
    name: "VITE_API_URL",
    value: "https://daybook-backend-production.up.railway.app",
    source: "Backend public domain (set before build)",
  },
];

export const initialState: FlowState = {
  phase: "empty",
  repoStatus: "initializing",
  buildElapsed: 0,
  postgres: "hidden",
  frontend: "hidden",
  connectionsDrawn: false,
  domainsVisible: false,
  initSteps: INIT_STEPS_LABELS.map((label) => ({ label, status: "pending" })),
  pipeline: [
    { key: "init", label: "Initialization", status: "pending", seconds: 0 },
    { key: "build", label: "Build", status: "pending", seconds: 0 },
    { key: "deploy", label: "Deploy", status: "pending", seconds: 0 },
    { key: "postDeploy", label: "Post-deploy", status: "pending", seconds: 0 },
  ],
  variables: VARIABLES,
  variablesWired: false,
  notificationsEnabled: false,
  setupToast: false,
  liveToast: false,
  osNotification: false,
  runtimeDetected: false,
};

export function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
