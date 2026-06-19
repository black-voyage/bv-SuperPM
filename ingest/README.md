# ingest-vaults.js — vault → Firestore ingestion

Parses the two product vaults into the bv-superpm Firestore (per `../BV-DATA-ARCHITECTURE.md`)
and upserts each file as a doc keyed by a STABLE id, so re-running is safe (idempotent).

## What goes where

| Source | → Firestore collection | Notes |
|---|---|---|
| `products_info/products/**.md` (excl. `_LINEAGE.md`) | `product_docs/{slug}` | rich per-product spec source-of-truth. **Never** `catalog` — that is owned by the Google Sheet sync and read by the live dashboard. |
| `products_info/hardware/*.md` | `hardware/{slug}` | tagged `type:'overview'` |
| `products_info/products/**/_LINEAGE.md` | `brand_docs/lineage` | |
| `products_assistant/*` (work layer) | `apps/superpm/*` | **gated** — refuses to upload while rules are OPEN (see security) |

## Usage

```bash
node ingest-vaults.js                  # DRY RUN (default scope=info) — writes nothing
node ingest-vaults.js --write          # upload products_info → product_docs / hardware / brand_docs
node ingest-vaults.js --sample         # print one encoded doc per collection
node ingest-vaults.js --write --scope=all   # ALSO work layer — BLOCKED until Auth lockdown
```

Env overrides: `BV_PROJECT_ID`, `BV_API_KEY`.

## Keeping Firestore in sync

This is a **manual push**, not live sync. Editing a `.md` does NOT update Firestore — re-run
`--write` to push changes (upsert by stable id, safe to repeat). The recommended long-term wiring
is to hook this into the existing close-mo / sync-master flow so one action updates Sheet + Firebase.

## Security gate (work layer)

`products_assistant` holds supplier identities, costs, and raw notes. The Firestore rules are
currently OPEN (public) and the API key is in the deployed dashboard's page source, so the script
**refuses** any `apps/superpm/*` write until Firebase Auth (restricted to blackvoyage.com) + tightened
rules are in place. Do the catalog/product_docs work under open rules FIRST, then lock down, then
switch this script to the Admin SDK (service account) for any work-layer sync.

## Dashboard

`product_docs` is wired into `../superpm.html` (= index.html / dashboard.html) via the
`search_product_spec` chat tool + the KNOWLEDGE loader. Changes go live only after the site is
redeployed (git push → Render).

## Files

- `ingest-vaults.js` — the tool
- `_catalog-prepurge-backup.json` — backup of the 15 docs deleted from `catalog` during the
  2026-06-18 cleanup (they were mistakenly written there before being moved to `product_docs`).
