# Design

Visual system for Black Voyage Product Tracker (SuperPM). **v2 direction — "Spatial Console"** (2026-07-02): re-planned from a reference analysis (Fluxa case study, Gliuk.Studio — dark node-canvas AI-workflow UI), reconciled against **BV Brand Guidelines Condensed Version V4** (in the `bv-second-brain` data core). Register: **product** (Mission Control).

**Standing constraints from the replan:**
- The reference's **blue (#0981FF) and cyan (#1EDIE9) are NOT adopted**. BV Orange `#EE3124` takes every role the reference gives blue (active nav, selection, primary action, key-phrase emphasis, accent node). `--blue` survives only as a semantic *info* state.
- Brand colors and fonts below are canonical — do not re-seed. Identity-preservation wins over reference-matching (hence Aeonik stays; see Typography).
- Everything else in the reference is fair source material: depth layering, soft geometry, connector language, presence chips, control vocabulary, typographic attitude.

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

`--green:#4ade80` (on-track / success) · `--amber:#fbbf24` (warning / at-risk) · `--red:#f87171` (blocked / error) · `--blue:#60a5fa` (**info only** — never an accent) · `--purple:#c084fc` (code / system). Use for status dots, SLA pills, gate states — never decoratively.

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
- **Glass overlay** (restricted): `backdrop-filter: blur(16–20px)` + `rgba(22,24,28,.72)`. **Only** for floating transient chrome that sits over live content: media transport controls, the flow-node popover, command palette. Never as decoration on static panels — decorative glassmorphism stays banned.
- **Accent tile**: one saturated Orange rounded tile can anchor a composition (the reference's blue logo tile between problems→solutions). At most one per view; it is a landmark, not a button style.

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

## Motion

- 150–250ms on most transitions (`.15s` borders, `.25s` drawers). Motion conveys state — change, feedback, selection, reveal — never decoration. No orchestrated page-load sequences (a console loads into a task).
- **Canvas motion vocabulary**: dependency-highlight dash-flow (~1s linear loop); glow pulse on awaiting-decision nodes (~1.15s ease-in-out); connector draw-in on first paint is acceptable at ≤300ms; everything else static.
- Ease-out (quart/quint/expo); no bounce/elastic. Reveals enhance already-visible content; never gate visibility on a transition.
- Every animation has a `@media (prefers-reduced-motion: reduce)` alternative (crossfade or instant).

## Brand signatures (use sparingly, in the margins)

- Footer: `40.6892° N , 74.0445° W — DESIGNED IN NYC` · `TRAVEL WITHOUT LIMITS` (mono, wide tracking, `--faint`).
- Wordmark SVG (logo) in `currentColor`; full wordmark+icon preferred, icon may stand alone but the wordmark never appears without the icon.
- Terminology white-list (carry into any copy): **Vortex Vacuum Seal®**, **Vortex™** (氣密隔艙 — never 真空袋), **YKK® AquaGuard®**, **CORDURA®**, **Fidlock®**, **SBS®**, **X-Pac®**, **CloudWeave™**.

## Bans (enforced)

Gradient text · decorative glassmorphism (glass = floating transient chrome only) · side-stripe borders · per-section uppercase eyebrows · numbered section scaffolding unless a real sequence · hero-metric template · identical card grids · consumer-cute illustration · generic SaaS/Bootstrap admin look · text overflowing its container at any breakpoint · **blue/cyan as accent** (reference colors explicitly not adopted; Orange is the only signal hue — blue is info-state only) · orange as ambient decoration (glows stay neutral).

## Migration notes (code → this doc)

Current `index.html` vs. this target, in suggested implementation order:

1. **Tokens**: add `--void`, `--edge`, shadow scale; bump radius scale 4/7/11/16 → 6/10/14/20; add `--fs-hero`.
2. **Materials**: apply floating-surface recipe (edge highlight + `--sh-md`) to `.panel`/cards; inner-well recipe to inputs/nested boxes; audit that nothing nests two floating surfaces.
3. **Panel titles**: mono-uppercase `h3` → dot + sentence case (keep mono for `th`, KV labels, codes). Biggest visual shift; do it per-view with screenshots. **Status (2026-07-03): sentence case shipped everywhere; the live-state dot is NOT yet implemented — existing leading emoji act as static dots for now; retrofit per-view when each panel gains a meaningful live state.**
4. **Presence chips**: owner hover-tooltip → optional visible pill chips on canvas nodes and gate rows.
5. **Ambient glows + dot-grid rollout**: `--void` field behind launch dashboard (flow chart already has it); one neutral ambient glow max.
6. **Display moments**: auth screen + key empty states adopt `--fs-hero` light-weight statements with mixed emphasis.

Already aligned (shipped earlier): dot-grid flow field, proximity grouping, endpoint-dot connectors, Orange dependency highlight, rem type scale, tabular numerics, pill view-toggle tabs, KV-shaped detail grid.
