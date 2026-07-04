# Design

Visual system for Black Voyage Product Tracker (SuperPM). **v3 direction — "Spatial Console"** (2026-07-03): re-planned from a reference analysis (Fluxa case study, Gliuk.Studio — dark node-canvas AI-workflow UI, Behance gallery 251326143), reconciled against **BV Brand Guidelines Condensed Version V4** (in the `bv-second-brain` data core). Register shifted **from "Restrained Product" toward "Expressive Spatial"** — glass and glow are deliberately turned UP (see Material & Glow tiers). The user-facing decode + full spec lives as a rendered artifact ("Spatial Console v3 設計規範") + a pattern library artifact ("Pattern Library v3", 21 rendered layout examples); this file is the code-facing source of truth.

**Implementation scope (2026-07-03):** the vertical slice started on the **flow-chart / Launch page**, then **the depth/material system was rolled out APP-WIDE** (this session): every view's panels/cards/KPIs float via lifted `--panel` + brighter `--edge` + a new `--g2` neutral surface-glow, over a full-bleed `body` dot-grid field lit by a strengthened two-corner drifting glow; overlays/modals use real glass; dense-data table panels opt out via `.panel.flat` (M0). New pages still drop in by choosing a Material/Glow tier + component vocabulary. See Migration notes for per-item status.

**Standing constraints from the replan:**
- **Orange is THE signal (priority) color; Blue is a permitted SECONDARY.** Orange `#EE3124` owns primary action, selection, current, key-phrase emphasis, the one signal glow. **Blue is usable** for links, secondary emphasis, info, data-viz, and ambient glow — but must stay **subordinate to orange** (quieter/less saturated, never competes for the "act now" role). (Earlier v2 rejected blue outright; the user corrected this — blue is fine, orange is just the priority.) Cyan `#1ED1E9` is an optional tertiary/data hue.
- Brand colors and fonts below are canonical — do not re-seed. Identity-preservation wins over reference-matching (hence Aeonik stays, not the reference's Urbanist; see Typography).
- Everything else in the reference is fair source material: depth layering, soft geometry, glass, connector language, presence chips, control vocabulary, typographic attitude. **Not** adopted: the freeform-canvas *layout* applied to scan-heavy dashboards (canvas paradigm maps to the flow chart only); Urbanist; orange as ambient decoration.

## Theme

A **spatial** Mission Control: instead of a flat black page with boxed panels, the UI is a deep void with a faint dot-grid field, on which soft dark surfaces *float*. Depth is the organizing metaphor — layers, not boxes. Black remains dominant (space — limitless possibility); Orange remains the signal (action, precision, direction); silver grayscale carries hierarchy. The brand's "clean geometry, thin lines" language now expresses itself through **hairlines, connector dots, and generous negative space** rather than sharp corners. Three themes ship: **Dark (default)**, **Light**, **Blue**; users pick by ambient light.

## Color

OKLCH for any new tokens; the canonical brand hexes below are fixed.

### Brand primary colors (canonical — from Brand Guidelines V4)

| Role | Name | HEX | RGB | Print |
|---|---|---|---|---|
| Base / dominant | **Black** | `#111215` | 17,18,21 | Pantone Black C |
| Signal / accent | **Orange** | `#EE3124` | 238,49,36 | Pantone 17-1563 TCX · CMYK 0,95,100,0 |
| Neutral | **Silver** | `#D0D5E1` | 208,213,225 | CMYK 7.6,5.3,0,12 |
| Neutral | **Aero White** | `#F6F8FC` | 246,248,252 | CMYK 2.4,1.6,0,1.2 |

> Usage law: Black is the dominant base; Orange is used **strategically** for emphasis, contrast, and brand recognition only — never as fill or decoration. (The reference itself carries a warm orange chip on its void — the pairing is proven.)

### Depth layers — dark theme (target)

The flat `bg/panel/panel2` triad becomes a five-layer depth system. Each layer is defined by surface value **plus material** (see Materials & Depth).

Values widened 2026-07-03 for readable figure-ground — the first pass kept page and panel within ~5 values of each other, so cards read as flat, not floating. Canonical BV Black `#111215` now lives as the header/mid tone; the page drops below it so panels float above.

| Token | Value | Role |
|---|---|---|
| `--void` | `#070809` | Canvas fields (flow chart, dashboards' field areas), hero moments — the deepest layer |
| `--bg` | `#0C0D10` | Page base — sits BELOW floating panels (darker than canonical black so surfaces read as raised) |
| `--panel` | `#181B21` | Floating surface (cards, panels) — clearly lighter than page; carries the edge+shadow material |
| `--panel2` | `#20242C` | Inner wells: inputs, ghost buttons, nested boxes |
| `--line` | `#2E323B` | 1px hairline borders / dividers |
| `--edge` | `rgba(246,248,252,.11)` | **New** — 1px top-inset light edge on floating surfaces (the "lit from above" cue) |
| `--text` | `#F6F8FC` | Body / ink (Aero White) |
| `--dim` | `#ADB6C6` | Secondary text |
| `--faint` | `#7B8494` | Tertiary / meta / mono captions |
| `--accent` | `#EE3124` | Primary action, current selection, state (BV Orange) |
| `--btntext` | `#fff` | Text on accent |

**Ambient depth glows**: the reference floats large soft gradient blobs behind the void. Adopted — but **neutral only** (white/silver at ≤5% alpha, or a barely-cool gray), never orange: orange is signal, not scenery. At most **two per surface, in opposite corners** (the shipped pattern: top-right + bottom-left on `body::before`); the canvas field (`.flowwrap`) may carry its own corner pair. The sticky header and the auth overlay repeat the same halo slice on their own backgrounds so no opaque band slices the glow.

**Dot-grid field**: `radial-gradient` dots at 24px pitch, ~5% alpha, on `--void` surfaces (already live on `.flowwrap`). This is the system's "canvas" signature — apply to flow chart, launch dashboard, and other node/field surfaces; not to text-dense panels.

### Light theme

`--bg:#F6F8FC` (Aero White) · `--panel:#FFFFFF` · `--panel2:#ECEFF5` · `--line:#D0D5E1` (Silver) · `--text:#111215` · `--dim:#4E5666` · `--faint:#8A93A3` · `--void:#EEF1F7` · `--edge:rgba(255,255,255,.8)`. Accent stays BV Orange. Dot grid: ink at ~5.5%.

### Blue theme

`--bg:#0D1320` · `--panel:#121A2B` · `--panel2:#16213A` · `--line:#243353` · `--text:#E3EDFB` · `--dim:#92A8C7` · `--faint:#61748C` · `--accent:#3D8BFF` (theme-specific signal) · `--void:#090E18`.

### Semantic state colors

`--green:#4ade80` (on-track / success) · `--amber:#fbbf24` (warning / at-risk) · `--red:#f87171` (blocked / error) · `--purple:#c084fc` (code / system). Use for status dots, SLA pills, gate states — never decoratively.

**Blue — the secondary color (v3):** `#3D8BFF` (secondary actions/emphasis) · `#60a5fa` (info / links) · `#1ED1E9` (cyan, tertiary/data-viz). Blue is a real, usable supporting hue (links, secondary buttons, secondary emphasis in display copy, data-viz series, ambient glow) but stays **subordinate to Orange** — quieter, never the "primary action / current / act-now" role. When blue and orange could both apply to a control, orange wins.

**Owner/person colors** (presence language, see Components): Ben `#c084fc` · Zac `#60a5fa` · Ann `#f472b6` · Angel `#fb923c` · LC `#34d399` · Design Team `#a78bfa` · 各攝影師 `#67e8f9`. These identify *people*, not states.

### Color strategy

**Restrained**, the product floor: dark layered neutrals + one signal accent (≤10% of surface). Orange + semantic states stay confined to actions, selection, status, and one emphasized phrase in display copy. Gray text always sits on a darker shade of its own surface hue, never washed out.

## Typography

Two families on a deliberate contrast axis (per Brand Guidelines): a geometric sans for headings/UI, a mono for data and brand voice.

- `--font-head`: **Aeonik** (Bold / Medium / Regular / Light), → `"Inter","Helvetica Neue",-apple-system,"Segoe UI",sans-serif`. Headings, UI, body.
- `--font-mono`: **IBM Plex Mono** (Light), → `ui-monospace,Menlo,Consolas,monospace`. Data, dates, SLA/stage codes, coordinates, brand signatures.

> The reference uses **Urbanist** — analyzed and *not* adopted: Aeonik is canonical and already geometric/modern; what we take is the **attitude**, not the font: light weights at large sizes, generous scale contrast, airy leading.

**Display attitude (new)**: large display moments (hero titles, empty-state statements, auth screen) drop to weight **300–400** and gain size — quiet confidence instead of bold shouting. Mixed-emphasis lines are the reference's signature worth keeping: within one display sentence, key words in `--text` while the rest sits in `--dim` (and at most one phrase in Orange). Body and functional UI keep their current weights.

**Scale**: fixed **rem** tokens (respect user zoom). Existing dense functional band + hierarchy jump, plus one new display tier:

| Token | Value | px @16 | Role |
|---|---|---|---|
| `--fs-caption` | `0.6875rem` | 11 | mono captions, legal, meta chips |
| `--fs-meta` | `0.75rem` | 12 | column heads, secondary labels |
| `--fs-sm` | `0.8125rem` | 13 | `.sub`, secondary body |
| `--fs-body` | `0.875rem` | 14 | body base |
| `--fs-title` | `1.125rem` | 18 | section `h2` |
| `--fs-lg` | `1.375rem` | 22 | dialog / auth `h2` |
| `--fs-display` | `1.6875rem` | 27 | launch page hero title |
| `--fs-hero` | `2.5rem` | 40 | **New** — display statements (weight 400 — no 300 weight is hosted for Aeonik; lh 1.15; use sparingly: auth, empty states, one per surface max) |

Leading roles: `--lh-tight:1.12 / --lh-snug:1.3 / --lh-body:1.5` (headings ~1.2, body ~1.4–1.5 per the reference's own type board).

**Numerics**: `body` carries `font-variant-numeric:tabular-nums` (SLA counters, day-counts, dates, progress fractions align; digits only — no effect on 繁中). Plus `font-kerning:normal` + `font-optical-sizing:auto`. **Never a global `letter-spacing`** — it would space out every Chinese character; tracking lives only on Latin mono-uppercase label classes.

**Panel-title voice (changed)**: the old "every panel title in mono uppercase" grammar retires. Panel/section titles become **status-dot + sentence case** (see Components): a small colored dot carrying live state + a plain `--font-head` title. Mono-uppercase remains the voice of **data and brand only**: table headers, stage/SLA codes, KV labels, coordinates, footer signatures. This concentrates the mono voice where it means something instead of wallpapering it.

## Spacing & Layout

- Content max-width ~1320px, centered.
- **Field composition**: canvas surfaces (flow chart, dashboards) compose by *proximity on an open field* — related items tight, groups separated generously, no boxed lanes/containers. (Shipped in the flow chart: lanes 46px apart, in-lane nodes 26px, zero lane boxes.)
- Department-lane / flow layouts are structural 2D (Grid/SVG); 1D rows use flex + wrap. Responsive behavior is structural (collapse panels), not fluid type.
- Vary spacing for rhythm: tight within a group (8–12px), generous between groups (32–64px). The inverted-rhythm failure (groups closer than their members) is the one to watch for.

## Shape & Elevation

- **Radius — soft scale (v2)**: the sharp-2px doctrine retires; precision now reads through hairlines, alignment, and connector geometry, not corner sharpness. Tier by element size:
  - `--r-xs: 6px` — chips, tags, status squares, code chips
  - `--r-sm: 10px` — buttons, inputs, selects, rows, tabs
  - `--r-md: 14px` — panels, cards, popovers
  - `--r-lg: 20px` — floating tiles (node icons), modals, chat rail, media wells
  - `--r-pill: 999px` — presence chips, pill tabs, toggles, count badges
- **Borders**: 1px `--line` hairline is the primary separator. Floating surfaces add the `--edge` top-inset highlight. **No side-stripe accent borders.**
- **Shadow scale** (soft, layered — surfaces float): `--sh-sm: 0 2px 10px rgba(0,0,0,.30)` (raised controls · cards/KPI tiles at rest · compact dropdown menus) · `--sh-md: 0 10px 30px rgba(0,0,0,.38)` (panels · anchored popovers · cards on hover) · `--sh-lg: 0 24px 64px rgba(0,0,0,.5)` (fixed overlays: modals, command palette, chat rail, flow-node popover). Focus/active accent glow `0 0 6px var(--accent)` for selection only. **Nesting rule**: a card/tile *inside* a floating panel renders as an inner well (`--panel2`, no shadow) — two full-strength floating surfaces never nest; inside scroll containers, hover stays at `--sh-sm` so the halo isn't clipped.

## Materials & Depth (new)

The reference's core trick: a surface is a *material*, not a fill.

- **Floating surface** (default for panels/cards): `--panel` fill + 1px `--line` border + `--edge` top-inset highlight + `--sh-md`. Reads as a slab lit from above, floating over the void.
- **Inner well**: `--panel2`, hairline border, no shadow, no edge — content sunk *into* a surface (inputs, nested boxes, prompt wells).
- **Accent tile**: one saturated Orange rounded tile can anchor a composition (the reference's logo tile between problems→solutions). At most one per view; it is a landmark, not a button style.

### Material & Glow tiers (v3 — the "how much" dial)

Glass/glow are turned up but **graded**, not all-or-nothing. Each surface picks **one Material tier (M) + one Glow tier (G)**; data-dense zones go low (legibility), overlays/canvas go high (expression). This replaces the old "decorative glassmorphism banned" rule — glass is now a first-class material, but tiered.

| Material | Recipe | Where |
|---|---|---|
| **M0 · Flat** | solid `--surface`, hairline, no blur | dense tables, long-text lists, high-legibility zones |
| **M1 · Frosted** | `rgba(20,23,29,.80)` + `blur(14px)` + `--edge` + `--sh-sm` | default cards/panels |
| **M2 · Glass** | `rgba(22,25,31,.55)` + `blur(24px) saturate(1.2)` + `--edge` + `--sh-md` | floating overlays, popovers, node inspector, command bar |
| **M3 · Deep** | `rgba(22,25,31,.42)` + `blur(32px)` + `--edge` + surface halo + `--sh-lg` | modals, hero, launch-canvas inspector |

| Glow | Recipe | Where |
|---|---|---|
| **G0 · none** | — | dense data zones |
| **G1 · ambient** | page corner halos, **blue-tinted**, **slowly drifting** (~24s loop, see Motion) — always on | every view background |
| **G2 · surface** | soft neutral halo (`0 0 ~50px rgba(244,247,252,.12)`) behind a floating panel/canvas | canvas field, hero panels |
| **G3 · signal** | **Orange** glow `0 0 16–24px rgba(238,49,36,.4–.5)` on active/selected/primary **only** | primary buttons, current node, dependency line |

Pairings: tables/long-text = **M0·G0** · cards = **M1·G1** · overlays/inspector/command bar = **M2·G2** · modals/hero/canvas inspector = **M3·G2**. **G3 (orange glow) is reserved for signal** — never ambient scenery. Blue may enter G1/G2 ambient (secondary); orange never does.

## Canvas & Connectors (new — the system's signature)

Node-graph language for flow/relationship surfaces (flow chart today; anywhere relationships are drawn tomorrow):

- **Field**: `--void` + dot grid, no containers; grouping by proximity.
- **Nodes**: floating-surface material, `--r-md/--r-lg`, state carried by border + text color (done green / active amber / blocked red / locked faint).
- **Connectors**: 1.2px hairlines with **endpoint dots** (r≈2) at both junctions; in-lane flow needs no arrowheads (direction implicit top-down); cross-group links are dashed curves at ~50% opacity with an origin dot + arrowhead; junction dots sit exactly on node edges.
- **Highlight**: selected node's real dependency graph draws in Orange (animated dash, glow) while everything else dims to ~18% — the one moment the chart goes loud.
- **Position markers**: small Orange pill badges ("📍 這裡") anchored to a node corner, never floating text in gaps.

## Components

- **Panel title (dot + sentence case)**: `<dot> Title` — dot is 6–8px, colored by live state (green ok / amber attention / accent active / faint idle), title in `--font-head` sentence case, `--fs-body`–`--fs-title`. Replaces mono-uppercase `h3`.
- **Presence / owner chips**: pill (`--r-pill`), person-colored border or fill tint + name; the flow chart and task rows use them to say *who owns this* (hover tooltip today; may surface as cursor-style chips on canvas nodes). People = person colors, never semantic state colors.
- **Button** (`.btn`): accent bg, `#fff` text, `--r-sm`, 8×14 padding, weight 600. `.btn.ghost` = `--panel2` + hairline. `.btn.red` = destructive. Icon-buttons sit in rounded squares (`--r-sm`). Every interactive element needs default/hover/focus/active/disabled/loading.
- **Pill controls**: selects and steppers render as dark inner-well pills — select = value + chevron; stepper = `‹ value ›`. Segmented/pill tabs for view switching (`.ld-cardtab` pattern).
- **KV rows**: label left (`--faint`, mono ok), value right (pill or plain), hairline dividers between rows — the reference's Project/Industry/Scope table and our detail-panel info grid share this shape.
- **Pill / chip** (`.pill`, `.sla`, `.stg`): compact, `--r-xs`, mono for SLA/stage codes. Status carried by semantic color.
- **Inputs**: inner-well material, radius `--r-sm`, inherit font.
- **Media wells**: imagery sits in `--r-lg` wells with glass transport controls; cinematic photography is welcome in hero/empty states (brand-true: expedition, motion), never as filler.
- Loading → skeletons, not centered spinners. Empty states teach the next action (and are the licensed home for `--fs-hero` statements + imagery). Dropdowns escape `overflow` via `<dialog>`/popover/fixed, never clipped.
- **Numbered sequences** (`/01`, `/02`): only when the list is genuinely ordered (problems→solutions, runbooks). Never as section scaffolding.

## Motion (v3 — aligned to the Fluxa 32s reel, read frame-by-frame 2026-07-03)

The reference reel is a slow, ease-out, glass+glow-heavy **cinematic** language, not scattered effects. Adopted DNA + BV adaptations:

- **Living ambient glow** (NEW, biggest change): the void's ambient glow is not static — large **blue-teal** blobs **drift/breathe** (~24s loop) and bloom on pull-back. → BV: `body::before`/canvas glow becomes an **animated, blue-tinted** atmosphere (blue is the secondary hue; orange still never enters glow). Slow, low-opacity, GPU-cheap (transform/opacity on a couple of radial layers); paused under `prefers-reduced-motion`.
- **Staggered entrance choreography** (ADAPT): elements reveal in sequence — chrome → side panels slide in → nodes fade/scale → **connectors draw** → content. This **overrides** the old "no orchestrated page-load" rule — BUT only **once per card-open / first load**, never on every re-render (a PM console can't perform on each tick). ≤600ms total, ease-out, reduced-motion → instant.
- **Connector draw-in** (ADOPT): curved wire animates source→target, glows, endpoint dot lights after (≤300ms). Flow-chart connectors on first paint.
- **Camera pull-back transition** (OPTIONAL): whole workspace scales into a floating card and recedes into the glow. → BV: card → Portfolio "back" transition (scale+fade), if wanted.
- **Dependency dash-flow** (SHIPPED): selected node's orange dashed dependency lines flow (~1s linear loop) + glow.
- **Typewriter** (ADOPT): command bar / AI-chat text types out.
- **Panel expand** (ADOPT): collapsed node → content reveal, blur→clear + rise 6px (~180ms).
- **Presence cursors** (DEFER): owner chips glide (spring) with name labels — only if multi-user is built.

Base rules unchanged: 150–250ms on most transitions; ease-out (quart/quint/expo), **no bounce/elastic**; motion conveys state, not decoration; every animation has a `@media (prefers-reduced-motion: reduce)` crossfade/instant alternative. Motion reel frames archived in the session scratchpad (`mframes/`).

## Brand signatures (use sparingly, in the margins)

- Footer: `40.6892° N , 74.0445° W — DESIGNED IN NYC` · `TRAVEL WITHOUT LIMITS` (mono, wide tracking, `--faint`).
- Wordmark SVG (logo) in `currentColor`; full wordmark+icon preferred, icon may stand alone but the wordmark never appears without the icon.
- Terminology white-list (carry into any copy): **Vortex Vacuum Seal®**, **Vortex™** (氣密隔艙 — never 真空袋), **YKK® AquaGuard®**, **CORDURA®**, **Fidlock®**, **SBS®**, **X-Pac®**, **CloudWeave™**.

## Bans (enforced)

Gradient text · side-stripe borders · per-section uppercase eyebrows · numbered section scaffolding unless a real sequence · hero-metric template · identical card grids · consumer-cute illustration · generic SaaS/Bootstrap admin look · text overflowing its container at any breakpoint · **blue out-shouting orange** (blue is secondary — it must never take the primary-action / current / act-now role) · **orange as ambient decoration** (the one hard color rule: orange = signal, glows stay neutral/blue) · **glass/glow on data-dense zones** (tables & long-text stay M0/G0 for legibility — glass is graded, not blanket). NOTE: the old "decorative glassmorphism banned" is retired — glass is now a first-class **tiered** material (see Material & Glow tiers).

## Migration notes (code → this doc)

Current `index.html` vs. this target, in suggested implementation order:

1. **Tokens**: add `--void`, `--edge`, shadow scale; bump radius scale 4/7/11/16 → 6/10/14/20; add `--fs-hero`.
2. **Materials — SHIPPED app-wide (2026-07-03):** floating-surface recipe (brighter `--edge` .18 + `--sh-md` + new `--g2` neutral surface glow) on `.panel`/`.card`/`.kpi`/`.stl-card` + the previously-missed `.pj-*` / `.deptpanel` / `.slack`; modals (`.cmbox`/`.bedpbox`) → glass + `--r-lg`; nested `.panel .card/.kpi` de-glassed to M0 inner wells (`backdrop-filter:none`); dense-data table/long-text panels wear `.panel.flat` (solid M0, no blur/bloom) so the glass/glow ban on data zones holds.
3. **Panel titles**: mono-uppercase `h3` → dot + sentence case (keep mono for `th`, KV labels, codes). Biggest visual shift; do it per-view with screenshots. **Status (2026-07-03): sentence case shipped everywhere; the live-state dot is NOT yet implemented — existing leading emoji act as static dots for now; retrofit per-view when each panel gains a meaningful live state.**
4. **Presence chips**: owner hover-tooltip → optional visible pill chips on canvas nodes and gate rows.
5. **Ambient glows + dot-grid rollout — SHIPPED app-wide (2026-07-03):** a faint full-bleed `body` dot-grid field (≤3% alpha, 26px pitch) sits under a strengthened two-corner drifting `body::before` glow (top-right blue / bottom-left cyan, occluded center blob dropped, top blob moved clear of the header); panels float over it; `.flowwrap` keeps its own denser field and now uses the `--void` token (theme-correct in all three themes).
6. **Display moments — SHIPPED (2026-07-03):** key empty states (Home decision-queue / Exceptions, Progress no-data) adopt the `.empty-hero` light-weight display statement (1.75rem, weight 400, CJK-safe — **no** `letter-spacing`); auth screen already used `--fs-hero`. The status-dot title component (item 3) stays deferred (leading emoji remain the sanctioned stand-in) to avoid a partial-rollout inconsistency.

Already aligned (shipped earlier): dot-grid flow field, proximity grouping, endpoint-dot connectors, Orange dependency highlight, rem type scale, tabular numerics, pill view-toggle tabs, KV-shaped detail grid, figure-ground (darker page `#0C0D10` below lighter panels `#181B21`), glass materials + neutral+blue ambient glow, sentence-case panel titles.

## v3 build plan (2026-07-03)

**Scope:** implement on the **flow-chart / Launch page only** for now (vertical slice); other pages await their own plans. Spec is full-system so new pages drop in via M/G tiers + the component vocabulary.

**Layout / IA (proposed, per-surface, for when other pages are planned):** global shell = left icon rail + top context bar (card name + pill tabs + actions) + bottom command bar (BV chat/STORM/jump). Fluxa→BV mapping: Overview→Home/CEO lens · **Flows (node canvas)→流程圖 (the 1:1 fit, canvas-first)** · Campaigns→行銷活動 · Pipeline→Portfolio/進度 · Content→素材(MS3a/b) · Insights→Progress. Dashboards stay structured grids (NOT freeform canvas). A pattern library of 21 rendered layout examples (dropdowns, tables, toolbars, overlays, master-detail, bento…) exists as an artifact — pull from it per surface.

**Build order:** (1) tokens/materials/tiers + rail shell + command bar skeleton → (2) **Launch canvas** to reference grade (M2/M3 glass nodes+inspector, glowing curves, presence) → (3) Home/Portfolio frosting → (4) command bar wired → (5) presence chips → (6) motion.

**Motion — PENDING the user's reel.** After Effects is in Fluxa's toolchain → real motion exists. The spec's motion section is a *proposal* until locked against the reference recording. Method to ingest it: the user provides the screen recording as a local file → extract frames with `ffmpeg -i reel.mp4 -vf fps=3 frame_%03d.png` (or scene-change) → Read the frames to observe entrance/curve-flow/easing → upgrade proposal to matched. (ffmpeg not yet installed; `brew install ffmpeg`.) Claude cannot play video or read it from a URL — frames-as-images only. All motion ships with `prefers-reduced-motion` fallbacks.
