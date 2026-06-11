# Black Voyage — Live Product Tracker
## Build Plan v0.2

*Status: **planning**. This version folds in the dashboard/card model, the seven-stage lifecycle, the five views, a shared vocabulary, and the findings from researching world-class remote teams (now expressed as concrete design requirements). It also adds the central build-vs-buy decision. Nothing is being built yet.*

---

## 1. What we're building

A single live **dashboard** that tracks every product from Ben's first idea through to live-on-Amazon/Shopify with content shot and influencers activated. It replaces the static Figma flow chart with a working tracker where ~90% of each department's real tasks live and update.

Each product is a **card** (a Product Launch). It starts from an intake form and grows into a cross-department checklist that the whole company can see — progress, owners, documents, decisions, blockers, and what's coming next. This is a card-based dashboard (Trello-like), **not** a file passed around.

---

## 2. Core principle — one source of truth

The tracker is the single place where the state of every launch lives. Borrowed directly from how GitLab runs ~2,000 all-remote staff ("handbook-first": everything documented in one place, no "latest version" floating in someone's head).

Clear division of responsibility between systems:
- **Tracker** owns *state + decisions* (stages, task status, owners, gates, updates).
- **Google Drive** owns *documents* (briefs, branding, images, ideas). The tracker links to them; it never duplicates them.
- **Gemini** *answers questions* using Drive (and optionally the tracker).
- **Apify** *gathers data* (competitor/market research) that feeds tasks.
- **Slack** *notifies* — later, and as digests (see §7.4).

---

## 3. Vocabulary (so the team shares one language)

- **Product Launch** — the project, shown as a card. One per product. The whole effort to take it from idea to live-and-marketed. Has an owner (DRI), a target launch date, a current stage, and all tasks across every department.
- **Stage** — where a launch sits in its lifecycle (the seven steps below). A launch moves through them as it matures.
- **Task** — a unit of work inside a launch. Belongs to one department, has a status (To do / In progress / Done / Blocked), an owner, a due date, and document links. A ◆ marks a decision gate.
- **Department** — the team owning a set of tasks: Product, Design, Catalog, Content, Social, Marketing, Ads, Email, CRM, Logistics.
- **Campaign** — a time-bound event with a target date (e.g. Black Friday) that pulls in tasks and products across departments. Separate from launches: one campaign can touch many products; one product can be in many campaigns.
- **DRI (Directly Responsible Individual)** — the one named person who owns a launch's timeline and decisions. (New — see §7.2.)
- **Update / check-in** — a short written status post on a fixed cadence, with owner, progress, blockers, and asks. (New — see §7.1.)
- **Exit criteria** — the required tasks (often across several departments) that must all be done before a launch can move to the next stage. (New — see §7.7.)
- **Push to next stage** — the action of advancing a launch card; locked until that stage's exit criteria are met.
- **Dependency / precondition** — a task that cannot start until an upstream task is done (e.g. Catalog · Amazon SKU waits on Product · design freeze).

### The seven stages
`Concept → Build → Production → Content → Listing creation → Live → Marketing`

---

## 4. The five views (all over the same data)

1. **Portfolio** — every launch as a card, grouped by stage. The company-wide board.
2. **Product launch** — one card opened: all departments + a stage timeline for that product.
3. **Department** — one team's tasks across *all* launches, grouped by status (their personal workload).
4. **Flow chart** — the process map, redrawn per department and scoped to a launch, color-coded by progress. This is the Figma board made live. (A genuine differentiator — most tools don't visualize process.)
5. **Campaign** — one time-boxed event (e.g. Black Friday) and every task/product tied to it across departments.

---

## 5. Data model

```
Product Launch
 ├─ id, name, DRI/owner, stage, target launch date, status
 ├─ intake form (why, spec, look, material, hardware, customer, price)
 ├─ document links → Google Drive
 ├─ Tasks[]
 │    └─ title, department, status, owner, due date, links, is_gate
 └─ Updates[]  (written check-ins: date, author, progress, blockers, asks)

Campaign
 ├─ id, name, target date
 ├─ featured products → [Product Launch]
 └─ Tasks[] (cross-department; may include campaign-only tasks)
```

Relationships: a launch has many tasks (each owned by a department, each at a status) and a running update log; a campaign cuts across launches and departments by date. Each **stage** defines exit criteria (a list of required tasks, possibly across departments) that gate the push to the next stage; tasks may also declare **dependencies** on other tasks. The "push" action is validated against the current stage's exit criteria.

---

## 6. Best-practice alignment (what we're adopting)

From researching GitLab, Automattic, Doist/Twist, Basecamp and the 2026 remote-tool landscape:

- **Single source of truth** — the tracker (§2). ✔ already core.
- **Public by default** — whole company can view; outsiders can't. ✔
- **Async-first written updates** on a predictable cadence — *adopting* (§7.1).
- **A DRI per project** — *adopting* (§7.2).
- **Notification discipline** (digests, not a firehose) — *adopting* (§7.4).
- **Templates so nothing is forgotten** — *adopting* (§7.6).

---

## 7. Design requirements added from the research

**7.1 Written check-in layer (highest value).** Checkboxes show *what* is done, not *what happened, what's blocked, what's needed*. Add a short weekly update per launch (and a per-department roll-up): one place, one template, one cadence — owner / progress / blockers / asks, scannable in under three minutes. This is the heartbeat of every strong remote team and is the biggest current gap.

**7.2 DRI per launch + reduce the Ben bottleneck.** Today Ben gates nearly everything; across timezones a single approver on every launch stalls the company. Assign a DRI per launch with real authority, and reserve Ben's ◆ gates for genuinely strategic forks (e.g. concept sign-off, design freeze). Delegate the rest.

**7.3 Easy editing for non-technical staff — moved earlier.** The tools that win remote adoption let a warehouse or content person update from their phone in seconds. Updating only via Claude Code/GitHub is developer-centric. The simple in-app editing UI must come early, not in a late phase (and this feeds the build-vs-buy decision, §8).

**7.4 Notifications as digests.** When Slack is added, design predictable digests + targeted DRI alerts — never real-time everything. Overload is the top killer of async systems.

**7.5 One-source-of-truth boundary.** Tracker = state + decisions; Drive = documents. Link, never duplicate, to prevent drift.

**7.6 Launch templates.** Every new product spawns from a standard seven-stage, per-department checklist (like GitLab issue templates) so steps are never missed.

**7.7 Gated stages, exit criteria & dependencies (new — core mechanic).** Each stage has **exit criteria**: a set of required tasks that may span several departments. A launch can only be **pushed to the next stage** when every criterion is met — the "Push to [next stage]" control stays locked until then, and the portal shows live which criteria are done and who owns the rest. Advancing a card notifies the departments that own the next stage's work. Tasks can also carry **dependencies/preconditions** (a task can't start until an upstream task is done). Each department fills in and checks off its own items, so everyone sees the same blocker list — and the same logic powers a Claude Code "what's blocking [launch]?" scan that returns the unmet criteria and owners. This turns the board from a passive tracker into a gated production pipeline.

---

## 8. The strategic decision — build vs buy

Your model is arguably *better fitted to Black Voyage* than any generic tool, mainly because of the Product-Launch + per-department flow-chart concept. But building fully custom means inheriting everything mature tools give for free (mobile apps, permissions, notifications, integrations, reliability). Three concrete options:

**Option A — Build fully custom.** GitHub/DB source of truth + a bespoke web app for all five views, editing, Gemini, automations.
- *Pros:* exactly your model; total control; the flow-chart and Gemini are first-class.
- *Cons:* you build and maintain a project-management engine; no native mobile; slowest to a usable v1; non-technical editing is on you to solve.

**Option B — Buy the engine, build the distinctive layer (recommended to evaluate first).** Run task tracking on a proven tool (Linear, ClickUp, or Notion), and build only what's unique to BV — the **flow-chart view** and the **Gemini Q&A** — pulling from that tool's API.
- *Pros:* best-in-class PM plumbing (mobile, notifications, permissions) immediately; teams update tasks in a familiar UI; you still get your signature views.
- *Cons:* two surfaces to keep in sync; some limits on how far you can bend the host tool.

**Option C — Configure an all-in-one, minimal custom.** Stand up monday.com or ClickUp with the five views as saved views + automations; add Gemini via their AI/integration; skip the custom build almost entirely.
- *Pros:* fastest to live; lowest maintenance; non-technical adoption is the tool's job.
- *Cons:* the flow-chart view is approximated, not bespoke; less distinctive; subscription cost per seat.

**Decision (locked): Option A — custom build.** Ben chose a custom web dashboard with Claude Code as the editing path, valuing the exact five-view model, a first-class flow-chart, and a single Claude-editable source of truth over a bought engine. Mitigation for the non-technical-editing risk (§7.3): add a thin in-app edit form in Phase 2 (change status, tick a task, add a check-in) that writes back to the repo, so Claude Code handles power edits and the form covers quick updates. (Option B remains the fallback if that friction proves too high.)

---

## 9. Components & how they map

- **Editing** — data lives as files in a GitHub repo; everyone edits via their own Claude Code (and Ben via Cowork), which commits and rebuilds the dashboard within seconds. A thin in-app edit form (status change, tick task, add check-in) is added in Phase 2 to cover quick updates for non-technical staff on mobile (mitigation for §7.3).
- **Web app** — the dashboard with the five views; company Google sign-in (restricted to @blackvoyage.com).
- **Google Drive** — documents + Gemini's knowledge base (service account, read access to defined folders).
- **Gemini** — embedded Q&A grounded in Drive; key held server-side.
- **Apify** — automation Actors for competitor/market data feeding tasks (its right seat — not a dashboard host).
- **Slack** — digest notifications + DRI alerts (later).

---

## 10. Phased roadmap (revised)

**Phase 1 — Core tracker + easy editing.** The data model, the five views, **simple in-app editing for everyone**, company login, launch templates, and the written check-in layer.

**Phase 2 — Intelligence.** Gemini Q&A over Drive; Apify data feeds into tasks.

**Phase 3 — Notifications & scale.** Slack digests + DRI alerts; cross-launch roll-ups and reporting.

*(Note: easy editing moved into Phase 1 per §7.3.)*

---

## 11. Decisions locked so far

- Single source of truth: the tracker. ✔
- Experience: card-based dashboard with five views (Portfolio, Product launch, Department, Flow chart, Campaign). ✔
- Lifecycle: seven stages (Concept → Build → Production → Content → Listing creation → Live → Marketing). ✔
- Example products: Vesper, Apex, Cyclone, Zephyr (Zephyr complete). ✔
- Adopting: written check-ins, DRI per launch, digest notifications, launch templates. ✔
- Drive = documents; tracker = state + decisions. ✔
- Build approach: **custom web dashboard**, GitHub source of truth, edited via Claude Code (Option A). ✔

---

## 12. Open questions

1. **Editing friction (§7.3)** — confirm the Phase-2 in-app edit form is enough for non-technical teams; this is the main risk of the custom-build choice.
2. **DRI assignments** — who is the DRI for each active launch (Vesper, Apex, Cyclone)?
3. **Stage sequencing** — does Content come fully before Listing creation, or do they overlap?
4. **Campaign-only tasks** — should a campaign hold tasks not tied to any single product (e.g. "decorate warehouse for BF")?
5. **Google setup** — who is the Workspace admin to configure Gemini's Drive access, and which folders are "company knowledge / branding"?
6. **Check-in cadence** — weekly per launch? Who writes them (DRI)?

---

## 13. Suggested next steps

1. Build-vs-buy — decided: Option A, custom web dashboard edited via Claude Code (§8).
2. Assign DRIs and lock the standard per-department checklist (lift it from the Figma board).
3. Lock the gate map (Appendix A) and scaffold the foundation from it.

---

## Appendix A — Stage gate map (v1 draft)

A card can only be pushed to the next stage when every criterion in its row is met. ◆ = Ben decision gate. "Mandatory departments" block the push; other departments may contribute without blocking.

| # | Stage → next | Mandatory departments | Exit criteria (all required to advance) |
|---|--------------|----------------------|------------------------------------------|
| 1 | Concept → Build | Product, Ben ◆ | Intake form complete (why, spec, customer, price); market research done; concept definition done; Ben concept sign-off ◆. (Catalog: competitor analysis — contributes.) |
| 2 | Build → Production | Product, Design, Ben ◆ | Prototype 1-2-3 approved; Ben validation ◆; costing & profit signed off; packaging / insert / manual locked; model name set. |
| 3 | Production → Content | Product, Logistics | Design freeze; pre-production sample approved + BOM provided; mass production complete; freight booked (sea bulk + air samples). |
| 4 | Content → Listing creation | Content, Design | Hero / lifestyle shoot done; post-production done; content exported (instruction / lifestyle / social clips); A+ / infographic assets ready. |
| 5 | Listing creation → Live | Catalog, Design, Ben ◆ | Amazon SKU created; Shopify SKU created; product data filed → marketing brief; brand language confirmed ◆; listing imagery / A+ uploaded. |
| 6 | Live → Marketing | Catalog, Marketing | Listings published live (Amazon + Shopify); product marketing brief finalized & marked "ready" (handoff that unblocks the influencer engine). |
| 7 | Marketing (final) | Marketing, Social, Ads | KOL / influencer projects live; channel posts live (IG / YouTube / TikTok); launch ads running; launch email sequence sent. (Email / CRM contribute.) |

Assumptions to confirm: Content is sequenced before Listing creation; the "marketing brief ready" gate sits at Live → Marketing.
