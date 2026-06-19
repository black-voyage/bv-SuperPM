# BV SuperPM → Firebase (TEAM tier) — deploy & cutover

Per `~/Desktop/MASTER-CONFIG/PROJECT-TIERS.md`, SuperPM is **TEAM**: its own Firebase project
**`bv-superpm`** (owner **hello@blackvoyage.com**), Firebase **Hosting** for the static site + a
**Cloud Function** for the chat proxy, secret in **Secret Manager** (no downloaded key). Board, OAuth,
Drive, and Firestore all stay in this same `bv-superpm` project — only *hosting + proxy* move off Render.

## What's in the repo (already prepared)
- `firebase.json` — Hosting serves the static HTML; rewrite **`/api/chat` → the `chat` function** (same-origin, no CORS).
- `functions/` — the chat proxy as a 2nd-gen Cloud Function; reads `ANTHROPIC_API_KEY` from Secret Manager.
- `.firebaserc` — default project `bv-superpm`.
- `index.html` `CHAT_API_URL` is **host-aware**: on `*.web.app`/`*.firebaseapp.com` it calls `/api/chat`;
  on Render it still calls the old proxy → **both work in parallel, zero downtime**.

## Deploy (one interactive step, the rest headless)
The Firebase CLI is `~/.local/bin/firebase`. gcloud is logged in as `blackvoyageusa`, but this project
is under **hello@blackvoyage.com**, so:

```bash
cd "/Users/video/Desktop/BV SuperPM/bv-tracker-repo"
~/.local/bin/firebase login                       # ← INTERACTIVE: pick hello@blackvoyage.com (the one gated step)
~/.local/bin/firebase use bv-superpm
~/.local/bin/firebase functions:secrets:set ANTHROPIC_API_KEY   # paste the Claude key (from the local secrets file)
~/.local/bin/firebase deploy --only functions,hosting
```
- Needs the **Blaze** plan (already on for `bv-superpm`).
- After deploy the site is live at **https://bv-superpm.web.app** and `/api/chat` hits the function.

## Post-deploy (required or sign-in/Drive breaks)
1. **OAuth origin** — GCP console → project `bv-superpm` → APIs & Services → Credentials → the OAuth
   Web client → **Authorized JavaScript origins** → add **`https://bv-superpm.web.app`** (and
   `https://bv-superpm.firebaseapp.com`). Without this, Google sign-in / Doc-creation breaks on the new URL.
2. **Test** on `https://bv-superpm.web.app`: board loads, Google sign-in, and the chat (the function
   should answer; cold start ~1–5s vs Render's ~30s).
3. **Kill cold starts entirely (optional):** set `minInstances: 1` in `functions/index.js` and redeploy
   functions (tiny always-on cost).

## Cutover (after it's verified)
- Point any links/bookmarks to `https://bv-superpm.web.app`.
- Update the proxy `ALLOWED_ORIGIN` is now irrelevant (same-origin); the Render proxy + static site can
  be **retired** once traffic is on Firebase. Keep them a few days as fallback, then delete the Render
  services. The host-aware `CHAT_API_URL` means nothing breaks during the overlap.

## Notes
- The Anthropic key never enters the repo or the app — it lives in Secret Manager, read only by the
  function at runtime (TEAM-tier rule: no downloaded keys).
- `firebase deploy` ships from **local files**, not GitHub — no push required to deploy (push only to save config).
