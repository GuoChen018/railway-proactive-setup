import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { Canvas } from "./components/Canvas";
import { CommandPalette } from "./components/CommandPalette";
import { RepoPicker } from "./components/RepoPicker";
import { PaletteShell } from "./components/PaletteShell";
import { ServiceNode } from "./components/ServiceNode";
import { DeployPanel, type Service } from "./components/DeployPanel";
import { ToastStack } from "./components/ToastStack";
import { OSNotification } from "./components/OSNotification";
import { EmptyBackground } from "./components/EmptyBackground";
import { GitHubIcon, PlusIcon, PostgresLogo, Spinner } from "./components/icons";
import { fmt, REPO, type RepoStatus } from "./flow/flow";
import { useFlow } from "./flow/useFlow";
import "./App.css";

export default function App() {
  const flow = useFlow();
  const s = flow.state;
  const [selected, setSelected] = useState<Service | null>(null);
  const [resetN, setResetN] = useState(0);

  const running = s.phase === "running" || s.phase === "live";
  const live = s.phase === "live";

  const openNode = (id: Service) => {
    if (id === "postgres" && s.postgres !== "resolved") return;
    if (id === "frontend" && s.frontend !== "resolved") return;
    setSelected(id);
  };
  const closePanel = () => setSelected(null);

  const restart = () => {
    flow.reset();
    setSelected(null);
    setResetN((n) => n + 1);
  };

  return (
    <div className="app">
      <TopBar
        running={running}
        inPicker={s.phase === "picker"}
        onRestart={restart}
        liveUrl={live ? REPO.liveUrl : null}
      />
      <div className="app-main">
        {running && <Sidebar />}
        <div className="canvas-area">
          <Canvas
            interactive={running}
            selectedId={selected}
            recenter={resetN}
            panelOverlay={
              selected !== null && running ? (
                <DeployPanel service={selected} state={s} onClose={closePanel} />
              ) : null
            }
            showBackend={running}
            postgresVisible={s.postgres !== "hidden"}
            frontendVisible={s.frontend !== "hidden"}
            connectionsDrawn={s.connectionsDrawn}
            onNodeClick={openNode}
            backdrop={
              s.phase === "empty" || s.phase === "picker" ? (
                <EmptyBackground />
              ) : null
            }
            worldOverlay={
              s.phase === "empty" ? (
                <PaletteShell>
                  <CommandPalette onConnectGitHub={flow.openPicker} />
                </PaletteShell>
              ) : s.phase === "picker" ? (
                <PaletteShell className="repo-picker">
                  <RepoPicker onBack={flow.backToEmpty} onSelect={flow.selectRepo} />
                </PaletteShell>
              ) : null
            }
            backendNode={
              <ServiceNode
                icon={<GitHubIcon size={22} />}
                title={REPO.name}
                variant="resolved"
                selected={selected === "backend"}
                showDomain={s.domainsVisible}
                domainUrl={REPO.liveUrl}
                status={backendStatus(s.repoStatus, s.buildElapsed)}
              />
            }
            postgresNode={
              <ServiceNode
                icon={<PostgresLogo size={24} />}
                title="Postgres"
                variant={s.postgres === "ghost" ? "ghost" : "resolved"}
                selected={selected === "postgres"}
                detectionReason="Found DATABASE_URL reference"
                status={childStatus(live)}
              />
            }
            frontendNode={
              <ServiceNode
                icon={<GitHubIcon size={22} />}
                title="frontend"
                variant={s.frontend === "ghost" ? "ghost" : "resolved"}
                selected={selected === "frontend"}
                detectionReason="Found frontend/package.json"
                showDomain={s.domainsVisible}
                domainUrl={REPO.liveUrl}
                status={childStatus(live)}
              />
            }
          />

          {running && selected === null && (
            <button className="add-btn">
              <PlusIcon size={15} />
              Add
            </button>
          )}
        </div>
      </div>

      <ToastStack
        showSetup={s.setupToast}
        showLive={s.liveToast}
        notificationsEnabled={s.notificationsEnabled}
        onEnableNotifications={flow.enableNotifications}
        onDismissSetup={flow.dismissSetupToast}
        onDismissLive={flow.dismissLiveToast}
      />

      {s.osNotification && (
        <OSNotification onDone={flow.dismissOsNotification} />
      )}
    </div>
  );
}

function backendStatus(status: RepoStatus, elapsed: number) {
  if (status === "online") {
    return (
      <span className="status-line">
        <span className="status-dot" />
        <span className="status-online">Online</span>
      </span>
    );
  }
  const label =
    status === "initializing"
      ? "Initializing"
      : status === "building"
      ? `Building (${fmt(elapsed)})`
      : `Deploying (${fmt(elapsed)})`;
  return (
    <span className="status-line">
      <Spinner size={15} />
      {label}
    </span>
  );
}

function childStatus(live: boolean) {
  if (live) {
    return (
      <span className="status-line">
        <span className="status-dot" />
        <span className="status-online">Online</span>
      </span>
    );
  }
  return (
    <span className="status-line">
      <Spinner size={15} />
      Deploying
    </span>
  );
}
