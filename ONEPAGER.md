# Proactive Setup

_Railway deploys your repo before you finish reading the docs._

## Problem

Getting an app from "connected repo" to "running in production" still asks too much of the developer. Even on Railway — where deploys are already fast — the first run is a sequence of manual, easy-to-miss steps:

- You connect a repo, then have to **figure out what services it needs** (a database? a separate frontend? a cache?).
- You manually **add each service**, then manually **wire the variables** between them (`DATABASE_URL`, internal URLs, ports) — and a single missing reference means a failed first deploy.
- While it builds, you're **staring at a screen waiting**, with no clear sense of what's happening or how long it'll take.
- If you walk away, you **miss the moment it goes live** and lose your flow.

The result: the first deploy — the moment that should feel magical — is instead the moment most likely to stall, error out, or get abandoned. The platform already knows enough to do almost all of this for you. It just doesn't.

## Proposal

### Pitch

**Proactive Setup turns the first deploy into a guided, mostly-automatic experience.** The moment you connect a repo, Railway scans it, infers the architecture, and lays down the whole topology for you — provisioning services, wiring variables, and kicking off the build — while narrating each decision and _why_ it made it. You watch the project assemble itself on the canvas, and a notification taps you on the shoulder the second it's live, even if you've switched tabs.

It reframes the canvas from a blank workspace you have to fill in, to a system that proposes a complete, correct setup you can simply confirm — moving the developer from "assembler" to "approver."

The three bets:
1. **Detection is trustworthy when it shows its reasoning.** Every inferred service carries a plain-language reason ("Found `DATABASE_URL` reference", "Found `frontend/package.json`"), so the automation feels legible, not magic-black-box.
2. **Provisioning should be visible, not hidden behind a progress bar.** Ghost nodes, drawn connections, and live build/deploy stages turn waiting into a story you can follow.
3. **The finish line should find you.** Real browser notifications mean the developer never has to babysit the tab.

### Core flow (what we built)

A working, clickable prototype of the end-to-end happy path (Vite + React + TypeScript), built to match Railway's real UI:

1. **Connect** — Command palette → GitHub repo picker (keyboard-navigable), select a repo to kick off the flow.
2. **Detect** — Railway scans the repo and reports findings step by step ("Scanning repository" → "Detected monorepo (backend/, frontend/)").
3. **Propose (ghost nodes)** — Inferred services fade in as ghost nodes on the canvas, each with a **detection reason** explaining why it's there, connected to the backend with animated edges.
4. **Provision** — Services resolve from ghost → real one at a time (Postgres, then frontend), with realistic timing.
5. **Auto-wire** — Variables are wired across services automatically (`DATABASE_URL`, `VITE_API_URL`, `PORT`), each annotated with its source — so the storytelling makes the "why" explicit.
6. **Build & deploy** — A live pipeline (Initialization → Build → Deploy → Post-deploy) with real-time elapsed timers and per-node status (using the train loading indicator).
7. **Go live** — Public domains appear on the relevant services, and a **real browser notification** fires the moment the app is online, with the live URL surfaced in the top bar.

Throughout, a persistent setup toast ("Get notified when complete") offers to enable notifications, and the deploy panel (opened by clicking any node) shows the full breakdown of init sub-steps, wired variables, and deployment detail.

**Live demo:** https://guochen018.github.io/railway-proactive-setup/
