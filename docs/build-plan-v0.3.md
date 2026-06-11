# Black Voyage — Live Product Tracker
## Build Plan v0.3

*Status: **planning**. v0.3 extends v0.2 with two major additions: (1) **role-level lenses** — purpose-built views for CEO / Directors / Managers / Analysts over the same data, and (2) a **deep Slack integration** — approvals, alerts/digests, and per-launch thread discussions — promoted from "later" to a core phase. The architecture evolves accordingly: still Option A (custom build, GitHub source of truth), now with a thin always-on service to power the portal and Slack interactivity. Everything locked in v0.2 stays locked.*

---

### v0.3.1 amendments (Jun 10)

- **Master flow chart goes live.** The Figma/PDF flow chart ("BV Team Workflow.pdf") is digitized into the tracker: every department lane, ◆ decision diamonds, and cross-department hand-offs (Product spine → samples to Content/Logistics; Content export → Social/Design; Catalog data filing → Marketing brief → KOL engine → Ads). Each launch card is overlaid on this map — colored by its real task statuses with a "📍 here" marker — so the card is *passed around like the master PDF*, as a second visualization of where the project is.
- **Tasks carry links, not just checkboxes.** Any task can hold one or more links (Drive docs, Figma, listings). Tracker = state; Drive = documents — links enforce the boundary.
- **Department-gated push.** The gate panel shows per-department readiness for the current stage. When every mandatory department has ticked its items, the **Push** button unlocks — pressable only by the **DRI**, a **mandatory department head**, or **Ben**. DRI is changeable on the card.
- **DRI is a department, not a person (for now).** Ownership is by department (Product, Design, Catalog, Content, Social, Marketing, Ads, Email, CRM, Logistics). A **Team tab** edits departments, role descriptions, and optional head/member names — the live form of `config/people.yaml`. Renames propagate to tasks, gates, DRIs, and flow lanes; staff changes are one edit.

### v0.3.3 amendments (Jun 10)

- **Sequential unlock + clickable flow.** Tasks unlock lane-by-lane: nothing opens until the intake Form is done; later steps stay greyed (🔒) until their predecessor completes. Clicking any flow-chart node opens the card at that exact task — locked nodes too, which show *why* they're locked and their definition of done.
- **Progression view.** Burn-up chart per launch (cumulative tasks done vs the pace needed for the target date) + department progression bars (laggards first) + cross-launch % strips.
- **Task Playbook workbook (`BV-Task-Playbook.xlsx`).** One tab per department: task, definition of done, evidence required, who updates, default urgency, estimated days, dependencies — pre-filled from the gate map so teams correct rather than start blank; yellow rows for new tasks; READ ME + Gate-rules tabs. This is the structured input channel: each department's sheet becomes its lane's rules in the tracker.
- **Evidence-required gates.** Key tasks (from the playbook) can't be checked ✓ without an attached link — definitions of done shown in every task panel.
- **Visuals.** Consistent per-department color system across flow lanes, chips, and progression bars; stage-dot strips on cards.

### v0.3.2 amendments (Jun 10)

- **Timeline view (delay attribution).** Each launch renders as a planned-vs-actual bar: one segment per stage, striped red for days over plan, plus a projected-late/on-time badge per card. Above it, a **"Delay by department"** ranking sums overrun days attributed to whichever departments were holding each stage (unmet gate criteria + blocked tasks now; the stage log for past stages) — so leadership sees *which team to help first*. Planned stage durations live in config (`config/plan.yaml`: Concept 21d, Build 35d, Production 45d, Content 21d, Listing 14d, Live 10d, Marketing 30d — tune freely).
- **In-card task editing.** Every task row now carries: **assignee** (suggested from the Team tab), **urgency** (low / med / high / urgent), and a **▾ details dropdown** holding threaded notes and attached **Loom / video links** — so context lives on the task, not in someone's DMs.

---

## 1. What's new in v0.3 (summary)

| Area | v0.2 | v0.3 |
|---|---|---|
| Views | 5 views (Portfolio, Launch, Department, Flow chart, Campaign) | Same 5 views **+ 4 role lenses** that pick the right view + widgets per level |
| Slack | Phase 3, digests only | Phase 2, three capabilities: **approvals, alerts/digests, threads** |
| Architecture | Static dashboard rebuilt from repo | Repo still source of truth **+ thin sync service** (portal backend + Slack endpoint that writes back as commits) |
| Approvals | ◆ gates ticked in files | ◆ gates **approvable from Slack** with full audit trail |

---

## 2. Role lenses — same data, four altitudes

Principle (borrowed from monday.com portfolio practice): *define audiences and build a dashboard per audience; 3–5 well-chosen widgets beat twenty.* We do **not** silo data — "public by default" stays. A lens is a default landing page + widget set + filters, not a permission wall.

### 2.1 CEO lens (Ben)
Exceptions and decisions only — never raw task lists.

- **My decision queue** — every ◆ gate currently waiting on Ben, oldest first, each with one-click context (the launch's stage, DRI, what approving unblocks). This is the single highest-value widget.
- **Portfolio health** — all launches as cards by stage, with health roll-up (on track / at risk / blocked) computed from blocked tasks + overdue gates + days-stuck-in-stage.
- **Exceptions** — launches stalled in a stage beyond threshold, blocked tasks older than N days, check-ins missed.
- **Campaign countdown** — days to next campaign (e.g. Black Friday) and its readiness %.

### 2.2 Director lens
Cross-department flow: where work piles up, which department blocks which gate.

- **Stage funnel** — count of launches per stage; bottleneck visible at a glance.
- **Blocker matrix** — departments × launches, cells showing open blockers / unmet gate criteria owed.
- **Check-in compliance** — which launches have a fresh weekly check-in, which DRIs are silent.
- **Gate forecast** — gates likely to be ready this week (criteria ≥ 80% met).

### 2.3 Manager lens (per department)
One team's reality across all launches.

- **My department's board** — all our tasks across every launch, grouped by status (the v0.2 Department view).
- **What we owe the next gates** — our unmet exit criteria per launch, sorted by launch target date. This converts the gate map into a team to-do list.
- **Workload** — open tasks per person.

### 2.4 Analyst / IC lens
Just my work, frictionless updates.

- **My tasks** — across all launches, with due dates and status, one-tap status flip.
- **Waiting on me** — tasks where others' dependencies point at my tasks.
- **Check-in composer** — the owner/progress/blockers/asks template pre-filled, postable in under a minute (this is the §7.1 written-update layer made effortless).

Role assignment: a `config/people.yaml` file maps person → role + department (+ DRI assignments). Google sign-in identifies the person; the portal opens their lens. Anyone can switch lenses — transparency first.

---

## 3. Slack integration — the three capabilities

Channel topology: **one channel per launch** (`#launch-apex`), auto-created at intake; one per department (`#team-design`); one `#bv-portfolio` for leadership. The bot ("BV Tracker") is in all of them.

### 3.1 Approvals (◆ gates and beyond)
Pattern follows Slack's official approval-workflow blueprint:

1. When a gate's *other* criteria are all met, the bot posts an approval request to the launch channel + DMs the approver: context block (launch, stage, what's been completed, links to brief) + **Approve / Reject** buttons.
2. Button press → service validates the presser **is** the authorized approver (Ben for ◆; DRI for delegated gates), acks within 3 s, then:
   - writes the decision back to the repo as a commit (`[x] Ben concept sign-off ◆` + auto check-in line `Approved via Slack by Ben, 2026-06-10`),
   - **updates the original message** to show the decision and remove the buttons (single-use — prevents double-approval),
   - if that completed the stage's exit criteria, offers a follow-up **"Push to <next stage>?"** button to the DRI.
3. Reject opens a modal asking for a reason; reason lands in the check-in log.

Every approval is therefore a Git commit — full audit trail for free.

### 3.2 Alerts & digests (discipline, not firehose)
- **Real-time, targeted only:** approval requests (approver), "your task is now unblocked" (task owner), stage pushed (next stage's mandatory departments), task marked blocked (DRI).
- **Daily digest** per department channel: tasks due/overdue, newly unblocked, blockers raised.
- **Weekly portfolio digest** to `#bv-portfolio`: stage movements, gates cleared, stalls, check-in compliance — the CEO lens in prose.
- Everything else is silent. Overload kills async systems (v0.2 §7.4 — unchanged, now specified).

### 3.3 Thread discussions
Pattern follows the Linear/Asana model:

- Every significant event the bot posts (approval request, stage push, blocker raised, weekly check-in) becomes a **thread anchor** in the launch channel — discussion happens in that thread, so context never scatters.
- The portal shows a **"Discuss in Slack"** deep link on every card/task/gate; if no thread exists the bot creates the anchor on first click.
- Thread → tracker: a `/bv note` command (or 📌 reaction) on any thread message appends it to the launch's check-in log with a permalink back to the thread. Link, never duplicate — full conversations stay in Slack; decisions land in the repo.

---

## 4. Architecture (evolved, still Option A)

```
GitHub repo (source of truth: launches/, campaigns/, config/)
   ▲  commits                            ▲ commits (approvals, /bv note)
   │                                     │
 Claude Code / Cowork (power edits)   BV Service (one small Node app)
                                         ├─ Portal API + web app (5 views × 4 lenses,
                                         │   Google sign-in, thin edit form: flip status,
                                         │   tick task, post check-in)
                                         ├─ Slack endpoints (interactivity, events, slash cmds)
                                         ├─ Gate engine (one module: exit-criteria check used
                                         │   by portal display, push validation, Slack triggers,
                                         │   and "what's blocking" — single implementation)
                                         └─ Schedulers (daily/weekly digests, stall detection)
```

Key point: the **gate engine is written once** and reused everywhere (portal lock/unlock, Slack approval triggering, blocker scan, digests). The repo remains the only state; the service holds no database beyond a cache — it reads the repo and writes commits. If the service dies, the data is intact and Claude Code still works.

The thin in-app edit form (v0.2 §7.3 mitigation) ships in **Phase 1** and covers: flip task status, post a check-in, request an approval. Slack becomes the second mobile-friendly edit surface in Phase 2 — between them, non-technical staff never need Git.

---

## 5. Research notes (what we copied, from where)

- **monday.com**: audience-specific dashboards (lens per level, 3–5 widgets); portfolio board sitting above project boards with roll-up health; one workspace per department ≈ our department channels/views. We replicate the structure without the per-seat cost, and our flow-chart + gate engine stay sharper than their approximation.
- **Slack approval blueprint**: Block Kit Approve/Reject, validate the presser is authorized, ack < 3 s, update the message after decision so buttons are single-use.
- **Linear/Asana Slack patterns**: channel-per-project linking, threads anchored to items, comments/permalinks synced back to the item rather than duplicating conversation.

---

## 6. Roadmap (revised)

**Phase 1 — Core tracker + lenses.** Data model, gate engine, five views, four role lenses, Google sign-in, thin edit form, launch templates, check-in layer. *(Slack-ready: events emitted internally from day one.)*

**Phase 2 — Slack.** Bot + channels, approvals (§3.1), targeted alerts + digests (§3.2), threads + `/bv note` (§3.3). *Moved up from Phase 3 — it's now a stated core requirement.*

**Phase 3 — Intelligence.** Gemini Q&A over Drive; Apify market-data feeds into tasks; cross-launch reporting.

---

## 7. Decisions locked (cumulative)

All v0.2 locks stand (single source of truth, five views, seven stages, custom build Option A, DRI model, templates, Drive boundary). New in v0.3:

- Four role lenses over shared data; no data silos. ✔
- Slack scope: approvals + alerts/digests + threads; channel-per-launch topology. ✔
- Approvals execute as Git commits (audit trail). ✔
- One gate engine shared by portal, Slack, and blocker scans. ✔
- Slack moves to Phase 2. ✔

---

## 8. Open questions (updated)

1. Who are the named Directors/Managers per department for `config/people.yaml`? (Supersedes v0.2 Q2 — DRI assignments still needed too.)
2. May any gates be delegated from Ben to DRIs now that approvals are one-tap? (The bottleneck risk shrinks, but delegation still helps across timezones.)
3. Channel-per-launch vs thread-per-launch in one channel — confirm topology if launch count grows large.
4. Hosting for the BV Service (Vercel/Fly/Cloud Run) and who owns the Slack workspace app install.
5. Carried over from v0.2: stage sequencing (Content vs Listing overlap), campaign-only tasks, Google Workspace admin for Gemini, check-in cadence.

---

*Companion file: `BV-Tracker-Prototype.html` — clickable prototype of the portal (all four lenses, gate display, Slack mock) using the real Vesper/Apex/Cyclone/Zephyr data model and the v1 gate map.*
