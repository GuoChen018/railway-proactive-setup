import { useCallback, useEffect, useRef, useState } from "react";
import {
  initialState,
  REPO,
  T,
  type FlowState,
  type StageStatus,
} from "./flow";
import railwayIcon from "../assets/railway-logo.png";

function setStage(
  prev: FlowState,
  key: FlowState["pipeline"][number]["key"],
  status: StageStatus
): FlowState["pipeline"] {
  return prev.pipeline.map((s) => (s.key === key ? { ...s, status } : s));
}

function setInitStep(
  prev: FlowState,
  index: number,
  status: StageStatus
): FlowState["initSteps"] {
  return prev.initSteps.map((s, i) => (i === index ? { ...s, status } : s));
}

export function useFlow() {
  const [state, setState] = useState<FlowState>(initialState);
  const timers = useRef<number[]>([]);
  const intervals = useRef<number[]>([]);

  const clearAll = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    intervals.current.forEach((i) => clearInterval(i));
    timers.current = [];
    intervals.current = [];
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  const at = useCallback(
    (ms: number, fn: (s: FlowState) => FlowState) => {
      const id = window.setTimeout(() => setState(fn), ms);
      timers.current.push(id);
    },
    []
  );

  const openPicker = useCallback(() => {
    setState((s) => ({ ...s, phase: "picker" }));
  }, []);

  const backToEmpty = useCallback(() => {
    setState((s) => ({ ...s, phase: "empty" }));
  }, []);

  const enableNotifications = useCallback(() => {
    setState((s) => ({ ...s, notificationsEnabled: true }));
    // Actually request real browser notification permission.
    if (typeof Notification !== "undefined") {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  const dismissSetupToast = useCallback(() => {
    setState((s) => ({ ...s, setupToast: false }));
  }, []);

  const dismissLiveToast = useCallback(() => {
    setState((s) => ({ ...s, liveToast: false }));
  }, []);

  const dismissOsNotification = useCallback(() => {
    setState((s) => ({ ...s, osNotification: false }));
  }, []);

  const reset = useCallback(() => {
    clearAll();
    setState(initialState);
  }, [clearAll]);

  // Selecting the repo kicks off the entire scripted sequence.
  const selectRepo = useCallback(() => {
    clearAll();
    setState({ ...initialState, phase: "running", repoStatus: "initializing" });

    // mark Initialization stage active
    at(50, (s) => ({ ...s, pipeline: setStage(s, "init", "active") }));

    // setup toast — stays up for the whole setup, replaced by the live toast
    at(T.setupToast, (s) => ({ ...s, setupToast: true }));

    // scanning
    at(T.scanStart, (s) => ({ ...s, initSteps: setInitStep(s, 0, "active") }));
    at(T.monorepoDetected, (s) => ({
      ...s,
      initSteps: s.initSteps.map((step, i) =>
        i === 0 || i === 1 ? { ...step, status: "done" as const } : step
      ),
    }));

    // connection lines draw out from the backend first...
    at(T.connectionsDraw, (s) => ({ ...s, connectionsDrawn: true }));

    // ...then the ghost nodes materialize at the line ends
    at(T.ghostsAppear, (s) => ({
      ...s,
      postgres: "ghost",
      frontend: "ghost",
    }));

    // provision + resolve postgres
    at(T.postgresProvisioning, (s) => ({
      ...s,
      initSteps: setInitStep(s, 2, "active"),
    }));
    at(T.postgresResolve, (s) => ({
      ...s,
      postgres: "resolved",
      initSteps: setInitStep(s, 2, "done"),
    }));

    // provision + resolve frontend
    at(T.frontendProvisioning, (s) => ({
      ...s,
      initSteps: setInitStep(s, 3, "active"),
    }));
    at(T.frontendResolve, (s) => ({
      ...s,
      frontend: "resolved",
      initSteps: setInitStep(s, 3, "done"),
    }));

    // wire variables
    at(T.variablesWired - 300, (s) => ({
      ...s,
      initSteps: setInitStep(s, 4, "active"),
    }));
    at(T.variablesWired, (s) => ({
      ...s,
      variablesWired: true,
      initSteps: setInitStep(s, 4, "done"),
    }));

    // initialization complete -> build
    at(T.initComplete, (s) => ({
      ...s,
      pipeline: setStage(s, "init", "done"),
    }));
    at(T.buildStart, (s) => ({
      ...s,
      repoStatus: "building",
      buildElapsed: 0,
      pipeline: setStage(s, "build", "active"),
    }));

    // build elapsed ticker (side effect, scheduled separately)
    const tickerTimer = window.setTimeout(() => {
      const id = window.setInterval(() => {
        setState((s) =>
          s.repoStatus === "building" ||
          s.repoStatus === "deploying" ||
          s.repoStatus === "postDeploy"
            ? { ...s, buildElapsed: s.buildElapsed + 1 }
            : s
        );
      }, 1000);
      intervals.current.push(id);
    }, T.buildStart);
    timers.current.push(tickerTimer);

    at(T.runtimeDetected, (s) => ({ ...s, runtimeDetected: true }));

    // build done -> deploy
    at(T.buildDone, (s) => ({ ...s, pipeline: setStage(s, "build", "done") }));
    at(T.deployStart, (s) => ({
      ...s,
      repoStatus: "deploying",
      pipeline: setStage(s, "deploy", "active"),
    }));
    at(T.deployDone, (s) => ({
      ...s,
      pipeline: setStage(s, "deploy", "done"),
    }));

    // post-deploy
    at(T.postDeployStart, (s) => ({
      ...s,
      repoStatus: "postDeploy",
      pipeline: setStage(s, "postDeploy", "active"),
    }));
    at(T.postDeployDone, (s) => ({
      ...s,
      pipeline: setStage(s, "postDeploy", "done"),
    }));

    // live!
    at(T.live, (s) => {
      // Fire a real OS-level browser notification if the user granted permission.
      if (
        s.notificationsEnabled &&
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification("Your app is live", {
            body: REPO.liveUrl,
            icon: railwayIcon,
          });
        } catch {
          // some browsers require a ServiceWorker; the in-app banner still shows
        }
      }
      return {
        ...s,
        phase: "live",
        repoStatus: "online",
        domainsVisible: true,
        setupToast: false,
        liveToast: true,
        osNotification: s.notificationsEnabled,
      };
    });
  }, [at, clearAll]);

  return {
    state,
    openPicker,
    backToEmpty,
    selectRepo,
    enableNotifications,
    dismissSetupToast,
    dismissLiveToast,
    dismissOsNotification,
    reset,
  };
}
