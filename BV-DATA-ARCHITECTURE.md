# BV Data Architecture — the shared "Data Core" every app connects to

**Goal:** one interconnected Firebase data layer for ALL Black Voyage apps (SuperPM, Second Brain,
Marketing, KCC, future apps). One source of truth, one shared AI memory, entities joined on stable IDs.
This file is the **single source of truth for the data layer** — every app + every Claude chat follows it.
(App-specific config — repos, hosting, keys — stays in each app's own MASTER-CONFIG; this is only the
shared data spine.)

_Last updated: 2026-06-18_

---

## 1. The Core  =  **BV Second Brain**
**BV DATA CORE = the BV Second Brain Firestore project.** That is the company's data center by design —
the canonical knowledge graph (entities/facts, the domains). Every other app is a **client**:

- **BV Second Brain** = the data center. **Owns** the core schema, ingestion, and writes at scale
  (server-side via Application Default Credentials / Admin SDK on Firebase App Hosting).
- **BV SuperPM** = a product-management dashboard. A **client** — it **reads** core data when needed and
  **writes learnings back to `memory`**. It does NOT own shared data.
- Marketing / KCC / future apps = clients, same rules.

**Connect to the core** (the Second Brain project provides these — fill in once its chat sets up a Web App):
```js
const BV_CORE = {                 // <-- from BV Second Brain → Project settings → Web app
  apiKey: "…", authDomain: "<secondbrain>.firebaseapp.com",
  projectId: "<secondbrain-project-id>", storageBucket: "…",
  messagingSenderId: "…", appId: "…"
};
```
- **Client apps:** Firebase JS SDK with `BV_CORE` (+ Firebase Auth, §5) — read core, write `memory`.
- **Servers / agents / LLM backends:** Admin SDK (service-account / ADC) or REST.

> **Interim migration note:** brand/catalog data was seeded into the `bv-superpm` project to get SuperPM's
> AI working. That data **migrates to the core** (Second Brain ingests the Sheets); SuperPM then reads the
> core instead of its local copies. Until then SuperPM uses its local copies — no app code changes when it
> repoints, only the `BV_CORE` config.

---

## 2. Shared collections (the company source of truth)
Read by every app. Written by the owning app or a sync job. **Doc IDs are STABLE keys** so entities link
across apps (a product's SKU is the same everywhere → the graph).

| Collection | Doc ID | Owner / source | Holds |
|---|---|---|---|
| `catalog` | SKU | Catalog Google Sheet | products: specs, features, pricing, vs-competitor, vs-previous |
| `materials` | material_code | Sheet | CloudWeave™, Cordura®, X-Pac®… |
| `tech` | id | Sheet | Vortex Vacuum Seal™, IPX8, compression |
| `series` | id | Sheet | Essential / Pro / Pro Lite positioning |
| `hardware` | id | Sheet | YKK, Fidlock… |
| `glossary` | term | Sheet | approved-vs-avoid **voice rules** |
| `competitors` | id | comparison tabs | competitor profiles + comparisons |
| `brand_docs` | id | Drive PDFs | design guideline / brand bible (chunked text) |
| **`memory`** | auto | **any app's AI** | shared long-term memory (see §3) |

**Rule:** never copy a shared entity into an app — **reference it by ID** (e.g. SuperPM's `launches/{sku}`
points at `catalog/{sku}`). App-private data lives in app-named collections (e.g. `bv/superpm/...`).

---

## 3. Shared memory (the part that "connects all chats")
One collection, **`memory`**, that EVERY app's AI reads and writes — so insights compound across the whole
company. Schema:
```js
memory/{autoId} = {
  text:     "the durable fact / insight / decision",
  tags:     "comma,separated,tags",         // e.g. "pricing,Aero,brand"
  app:      "superpm" | "secondbrain" | "marketing" | ...,  // which app learned it
  entities: ["Aero-PRO-..."],               // linked stable IDs (SKUs, etc.)
  who:      "person/role",
  ts:       1718600000000                    // Date.now()
}
```
- **Before answering**, an app's AI should `recall` (search `memory`) for relevant prior insight.
- **After learning** something durable, it should `remember` (add to `memory`, tagged with its `app`).
- Result: SuperPM's chat sees what the Second Brain learned, and vice-versa.

---

## 4. Ingestion (sources → core)
Sources stay editable; sync jobs upsert them into the core.
- **Google Sheets** (catalog, materials, tech, series, hardware, glossary, comparisons) → `catalog` etc.
- **Drive PDFs** (design bible) → `brand_docs` (extract text → chunk).
- Each app may own a sync (Cloud Function / hosting endpoint / script). Re-runnable = idempotent upserts by stable ID.

---

## 5. Security (do before sensitive scale)
- Currently **OPEN rules** (prototype) — anyone with the config can read/write. Fine to build; **not** for
  long-term sensitive data.
- Target: **Firebase Auth (Google, restricted to `blackvoyage.com`)** as the shared identity for all apps,
  then rules like `allow read: if request.auth != null;` and writes scoped per collection.

---

## 6. Adding a new app (the checklist)
1. Connect with `BV_CORE` (client) or a service account (server).
2. **Read** shared collections (§2) for context — don't duplicate them.
3. `recall` from `memory` before answering; `remember` durable insights (tagged with your app).
4. Reference shared entities by **stable ID**; keep app-private data in app-named collections.
5. If you own a data source, write a sync job into the core (§4).

---

## 7. Roadmap
- [ ] Ingest remaining tabs: Specs → `catalog`/`specs`, 4 comparison tabs → `competitors`.
- [ ] Ingest design-bible PDFs → `brand_docs`.
- [ ] "Sync from Sheet" job (idempotent re-pull).
- [ ] Firebase Auth + locked rules (§5).
- [ ] Promote/mirror the core to BV Second Brain as the canonical graph; optional BigQuery mirror for analytics.
