# Black Voyage — Product Tracker

Live dashboard for BV product launches: 7 gated stages, 10 department lanes, the master flow chart (Workflow v2) with cross-department routing, timelines, burn-up charts, EN/中文, light/dark.

## Open it
- **Hosted (GitHub Pages):** `https://<account>.github.io/<repo>/` — the dashboard is `index.html`
- **Locally:** download and double-click `index.html` (no build needed — single file)
- `superpm.html` — the experimental SuperPM fork (autopilot, SLA timers, health score)

## Edit it
Everything lives in one file. Inside `index.html`:
- `TEAM` — departments, roles, heads/members
- `GATES` — stage exit criteria (the gate map)
- `FLOW` — master flow chart lanes/nodes
- `XROUTES` — cross-department hand-off routes
- `LAUNCHES` — the live cards (tasks, statuses, check-ins)
- `ZH` — Chinese translations (correct freely)
- `PLAN` — planned days per stage

Edit on GitHub (pencil icon on `index.html`) → commit → Pages redeploys in ~1 min.

## Reference
- `docs/build-plan-v0.3.md` — full build plan
- `data/` — Task Playbook + Flow Master Sheet (fill these in, team)
- `skill/` — the Claude skill for operating the tracker
