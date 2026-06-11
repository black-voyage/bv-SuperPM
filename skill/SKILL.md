---
name: bv-product-tracker
description: Operate Black Voyage's live product-launch tracker — the gated, multi-department system that takes each product from Concept to Marketing. Use this whenever working with a BV product launch in any way: creating a new launch, updating a task's status, advancing ("pushing") a launch to the next stage, checking whether a stage's exit criteria are met, adding a written check-in, scanning what's blocking a launch, scaffolding the tracker repo, or answering "what's left / what's blocking <product>". Trigger for any mention of a BV product tracker, launch card, stage gate, exit criteria, production cycle, or "what's blocking" — even if the user doesn't use those exact words. Products are named things like Vesper, Apex, Cyclone, Zephyr.
---

# Black Voyage — Product Tracker

This skill lets you operate Black Voyage's product-launch tracker: a gated, multi-department pipeline that moves each product through seven stages from idea to fully marketed. The tracker's data lives as plain files in a Git repo, so you (via Claude Code / Cowork) edit the files and the web dashboard re-renders from them. Everyone in the company can see the same state.

Read `references/build-plan.md` for the full product/design rationale. Read `references/gate-map.md` for the authoritative stage exit-criteria (you need it for any "push to next stage" or "what's blocking" task).

## Core concepts

- **Product Launch** — one product's whole journey, stored as one file (`launches/<slug>.md`). Has a DRI (owner), a current `stage`, a target date, an intake form, tasks grouped by department, and a check-in log.
- **Stage** — one of seven: `Concept → Build → Production → Content → Listing creation → Live → Marketing`.
- **Task** — a checklist item under a department heading. Status by checkbox/marker (see Conventions).
- **Exit criteria** — the tasks (often across several departments) that must all be done before a launch can move to the next stage. Defined per stage in `references/gate-map.md`.
- **Push to next stage** — advancing a launch's `stage`. Only allowed when the current stage's exit criteria are all met.
- **Campaign** — a time-boxed event (e.g. Black Friday) stored as `campaigns/<slug>.md`, referencing products and holding cross-department tasks.
- **DRI** — the one person accountable for a launch. **◆** marks a Ben decision gate.

## Repo layout

```
/launches/<slug>.md          one file per product launch
/campaigns/<slug>.md         one file per campaign
/config/stages.yaml          the ordered seven stages
/config/departments.yaml     the department list
/config/gate-map.yaml        machine-readable exit criteria per stage
/templates/launch-template.md  copied to start a new launch
```

(`assets/launch-template.md` in this skill is the canonical template; `assets/example-apex.md` is a filled example.)

## Launch file format

YAML frontmatter for structured state, then per-department task sections, then a check-in log:

```markdown
---
name: Apex
slug: apex
dri: Bella Cordone
stage: Build
target_launch: 2026-08-12
status: in_progress
intake:
  why: <one line>
  spec: <…>
  customer: <…>
  price: <…>
links:
  marketing_brief: <drive url>
  brand_guidelines: <drive url>
---

## Product
- [x] Form (intake)
- [x] Market research
- [ ] Prototype 1-2-3
- [ ] Ben validation ◆

## Design
- [ ] Packaging / insert / manual locked

## Check-ins
- 2026-06-09 (Bella): prototype v2 with factory, waiting on sample. Blocker: none.
```

Status markers: `[x]` done · `[ ]` to do · `[~]` in progress · `[!]` blocked. Keep department headings exactly matching `config/departments.yaml` so the dashboard and gate checks line up.

## Operations

### 1. Create a new launch
Copy `assets/launch-template.md` to `launches/<slug>.md`, fill the frontmatter from the user's intake answers, set `stage: Concept`, and leave tasks unchecked. Don't invent tasks the user didn't mention — the template's standard checklist is the starting point. Commit with a clear message ("Add launch: <name>").

### 2. Update a task
Find the launch file, flip the relevant checkbox marker, and (if useful) add a one-line check-in noting what changed and any blocker. Never silently delete tasks — mark them done or blocked so history is preserved.

### 3. Add a check-in
Append to the `## Check-ins` section: `- YYYY-MM-DD (author): progress. Blocker: <none / what>.` Keep it scannable in seconds — progress, blockers, asks. This is the heartbeat of the remote team; prefer a short honest check-in over none.

### 4. Validate & push to next stage (the gate — most important)
This is the central rule: **a launch only advances when its current stage's exit criteria are met.**

1. Read the launch's current `stage`.
2. Look up that stage's exit criteria and mandatory departments in `references/gate-map.md`.
3. Check each required task in the launch file. A criterion is met only if its task is `[x]`.
4. If **all** are met: set `stage` to the next stage in `config/stages.yaml`, add a check-in ("Pushed to <next stage>"), and note which departments now own the next stage's work. Commit ("Push <name> → <next stage>").
5. If **any** are unmet: do **not** advance. Report exactly which criteria are missing and who owns them. Never override a gate to "unblock" someone — surface the blocker instead.

### 5. Blocker scan — "what's blocking <product>?"
Read the launch, compare against its current stage's exit criteria, and return a short list of unmet criteria with their owning department. Also list any `[!]` blocked tasks and any unmet task dependencies. This same logic is what powers the dashboard's gate display, so keep it consistent. Output format:

```
<Product> — stage <X>, <n> of <m> exit criteria met.
Blocked by:
- <criterion> (<department> · <owner>)
Ready to push: yes/no
```

### 6. Scaffold the repo (first-time setup)
If the repo doesn't exist yet: create the layout above, write `config/stages.yaml` and `config/departments.yaml`, copy `references/gate-map.md` into `config/gate-map.yaml` (as structured YAML), drop in `templates/launch-template.md`, and create launch files for the current products (Vesper, Apex, Cyclone, Zephyr) in their real states. Then a dashboard app can read `launches/` and `campaigns/` to render the five views (Portfolio, Product launch, Department, Flow chart, Campaign).

## Conventions

- **Departments:** Product, Design, Catalog, Content, Social, Marketing, Ads, Email, CRM, Logistics.
- **Gates (◆) are Ben's.** Don't mark a ◆ task done on Ben's behalf unless the user is Ben or explicitly relays his decision.
- **DRI runs the launch; Ben gates only the strategic forks.** Don't route every decision to Ben — respect the DRI's authority for in-stage work.
- **Transparency first.** Everyone sees the same files; write updates plainly so the blocker list is never a surprise.
- **One source of truth.** This repo holds *state and decisions*; documents live in Google Drive — link to them, never paste their contents in.

## When unsure
If a requested push would skip a gate, or a task/department doesn't match the config, stop and ask rather than guessing — a wrong push corrupts the pipeline everyone relies on.
