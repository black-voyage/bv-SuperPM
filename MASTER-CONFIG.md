# BV SuperPM — Master Config & Connections

Single source of truth for every account, connection, and config value behind the SuperPM dashboard.
Keep this updated when anything changes. **No real secrets live here** (see §9).

_Last updated: 2026-06-18_

---

## 0. TL;DR — the live stack
- **App (live):** **https://bv-superpm.web.app** (Firebase Hosting, `bv-superpm` project) — homepage `/` = SuperPM, dashboard at `/dashboard.html`. _(Legacy: https://bv-superpm-ey4i.onrender.com — Render static, kept as fallback, retire after cutover.)_
- **Chat backend:** **Google Cloud Run** service `bv-superpm-chat` in project `bv-infra-499600` (`https://bv-superpm-chat-475005600052.us-central1.run.app/chat`) — holds `ANTHROPIC_API_KEY` (Secret Manager). **Off Render.** Public endpoint, hardened (model allowlist + per-IP rate limit); set an Anthropic spend cap. See `FIREBASE-DEPLOY.md`.
- **Code:** https://github.com/black-voyage/bv-SuperPM (private)  — branch `main`. Firebase Hosting deploys via `firebase deploy` (local); the proxy is a manually-managed Render service.
- **Data (board):** Firebase Firestore `bv-superpm` — real-time shared board/chats/versions (everyone sees everyone's edits)
- **Data (shared brain):** Firebase Firestore **`bv-second-brain`** = the **BV Data Core** — catalog/brand/competitor knowledge + cross-app AI `memory`. SuperPM's AI **reads** the Core (board stays in `bv-superpm`). See `BV-DATA-ARCHITECTURE.md`.
- **Docs/Sheets:** created under hello@blackvoyage.com into one Drive folder
- **Everything is owned by hello@blackvoyage.com** (one GCP project `#864428735438` powers OAuth + Firebase)

---

## 1. Accounts / emails

| Role | Email / handle | Used for |
|---|---|---|
| **Primary owner** | **hello@blackvoyage.com** | GitHub `black-voyage`, Render, Google Cloud, Firebase, Drive |
| GitHub collaborator | `tennisandcode` (Benjamin Chung) | Push access (guest). Commit identity `154731536+tennisandcode@users.noreply.github.com` |
| **Gemini / AI key holder** | **Ben@blackvoyage.com** | Holds the **Gemini API key** (for AI features). The key itself is a secret — see §9. |
| Workspace domain | `blackvoyage.com` | OAuth "Internal" audience — any blackvoyage.com user can sign in |

---

## 2. GitHub — source code
| Item | Value |
|---|---|
| Repo | **`black-voyage/bv-SuperPM`** (private) · https://github.com/black-voyage/bv-SuperPM |
| Branch | `main` (auto-deploys to Render on push) |
| App file | `index.html` — the whole app. `dashboard.html` + `superpm.html` are byte-identical copies. |
| Other files | `render.yaml` (deploy), `CONTRIBUTING.md` (git workflow), `*-SETUP.md` (Google/Firestore setup), this file |
| Workflow | **Pull/rebase before every push** so commits stack — never force-push. Multiple devs push here. |

---

## 3. Hosting
**Site → Firebase Hosting** (TEAM tier, project `bv-superpm`, owner hello@). **Chat proxy → Cloud Run** in no-org `bv-infra-499600` (org policy blocks a public Firebase Function in `bv-superpm`). **Render fully retired.**
| Item | Value |
|---|---|
| **Site (live)** | **https://bv-superpm.web.app** + `https://bv-superpm.firebaseapp.com` (Firebase Hosting) |
| Site deploy | `~/.local/bin/firebase deploy --only hosting` (from local repo; `firebase.json` serves the HTML, ignores everything else) |
| **Chat proxy** | **Cloud Run** `bv-superpm-chat` in `bv-infra-499600` (`https://bv-superpm-chat-475005600052.us-central1.run.app/chat`) — holds `ANTHROPIC_API_KEY` (Secret Manager `anthropic-api-key`); public + hardened (model allowlist, per-IP rate limit, max_tokens 8000). Source `chat-proxy/server.js`. Redeploy: `gcloud run deploy … --source chat-proxy … --project bv-infra-499600 --account blackvoyageusa@gmail.com`. |
| Legacy site | `bv-superpm-ey4i.onrender.com` (Render static, `render.yaml`) — fallback during cutover, then retire |
| Deployed-but-unused | Firebase Function `chat(us-central1)` + Secret Manager `ANTHROPIC_API_KEY` (built, but org policy blocks public invoke; left for the App Hosting follow-up) |
| ⚠️ Dead/old | `bv-superpm-ihnr.onrender.com` (old `tennisandcode` Render acct, 503) — **delete it** |

---

## 4. Google Cloud / OAuth — sign-in + Drive file creation
| Item | Value |
|---|---|
| GCP project | **BV SuperPM** (project # `864428735438`) — same project as Firebase |
| OAuth Client ID | `864428735438-704etq9hsq1lrse1s2i6fs2ctg6m7vu2.apps.googleusercontent.com` |
| Client type / consent | Web app "BV SuperPM web" · **Internal** (blackvoyage.com) |
| Authorized JS origin | `https://bv-superpm-ey4i.onrender.com` |
| API enabled | **Google Drive API** |
| Scopes | `…/auth/drive` + `email profile` |
| Files created under | **hello@blackvoyage.com** (login hint) |
| Saved into folder | `16b_sYyvOGNxemgdDhADHpd_-z6lu1GgA` → https://drive.google.com/drive/folders/16b_sYyvOGNxemgdDhADHpd_-z6lu1GgA |
| File naming | `BV-SuperPM-<Product>` (intake) / `BV-SuperPM-<Product>-<Task>` |
| Shared as | Anyone-with-link → **Editor** |

> If the live URL changes, add the new domain to **Authorized JavaScript origins** or sign-in breaks.

---

## 5. Firebase / Firestore — real-time shared board ✅ LIVE
Same GCP project as §4.
| Item | Value |
|---|---|
| Project ID | **`bv-superpm`** |
| Firestore | Standard, location **nam5 (US)**, Production mode, **Blaze plan** (billing on) |
| Board doc | `bv/superpm` — full board state (real-time across all users) |
| Version history | `bv/superpm/versions/*` — shared who-changed-what audit |
| Rules | **OPEN** (`allow read, write: if true`) — ⚠️ see §8 |
| Console | https://console.firebase.google.com/project/bv-superpm |

**Web config (also in `index.html` → `FIREBASE_CONFIG`):**
```js
apiKey:            "AIzaSyACM71vycT4OeKxxoT6vL5MCK7H6g592vQ"
authDomain:        "bv-superpm.firebaseapp.com"
projectId:         "bv-superpm"
storageBucket:     "bv-superpm.firebasestorage.app"
messagingSenderId: "864428735438"
appId:             "1:864428735438:web:d353709e716410fecf899f"
```

---

## 5b. BV Data Core — `bv-second-brain` (shared knowledge + memory) ✅ LIVE
A **separate** Firebase project = the company-wide knowledge graph every BV app reads. SuperPM connects to
it as a **secondary** Firebase app named `"core"` (default app stays `bv-superpm`, §5). Shipped `7c96b55`.
| Item | Value |
|---|---|
| Project ID / # | **`bv-second-brain`** / `100585934071` |
| Firestore | `(default)`, **nam5 (US)** |
| SuperPM reads | `catalog` (specs by SKU — canonical for product Q&A), `tech`, `series`, `materials`, `hardware`, `glossary`, `competitors`, `brand_docs` |
| SuperPM read+write | **`memory`** — shared cross-app long-term memory (writes tagged `app:"superpm"`) |
| Rules | **OPEN** (`allow read, write: if true`) — ⚠️ company-wide data; lock down next, see §8 + `CORE-SECURITY.md` |
| Server SA email | `firebase-adminsdk-fbsvc@bv-second-brain.iam.gserviceaccount.com` (admin key is a secret — §9) |
| Console | https://console.firebase.google.com/project/bv-second-brain |

**Web config (also in `index.html` → `CORE_CONFIG`; non-secret client identifiers):**
```js
apiKey:            "AIzaSyDWj27ftoWzMJyr2Q7PgRAGBDjzesJjk0o"
authDomain:        "bv-second-brain.firebaseapp.com"
projectId:         "bv-second-brain"
storageBucket:     "bv-second-brain.firebasestorage.app"
messagingSenderId: "100585934071"
appId:             "1:100585934071:web:7f5c941dcd1e8959dc57f2"
```
> The Core owns ingestion (Sheets/Drive sync, native analytics graph). SuperPM is a **read** client (+ `memory`
> writes). It does NOT use the Core's Amazon/finance collections (e.g. `amazon_asin_performance__ABA-SCP`).
> Full contract: `BV-DATA-ARCHITECTURE.md`.

---

## 6. In-code config (edit in `index.html`, copy to `dashboard.html`+`superpm.html`, push)
| Constant | Value | Purpose |
|---|---|---|
| `GOOGLE_CLIENT_ID` | `864428735438-704…apps.googleusercontent.com` | OAuth sign-in |
| `GOOGLE_ACCOUNT` | `hello@blackvoyage.com` | account that creates Sheets/Docs |
| `GOOGLE_FOLDER_ID` | `16b_sYyvOGNxemgdDhADHpd_-z6lu1GgA` | Drive folder for generated files |
| `FIREBASE_CONFIG` | (object in §5) | shared Firestore board (project `bv-superpm`) |
| `CORE_CONFIG` | `bv-second-brain` web config | **BV Data Core** — shared knowledge + cross-app memory (read as a 2nd Firebase app named `"core"`) |
| `CHAT_API_URL` | _(set after deploying chat-proxy)_ | the Claude chat backend URL (`…/chat`) |
| `CHAT_MODEL` | `claude-sonnet-4-6` | model for the in-app Claude chat |

**Two Firebase projects, one page:** the default app = `bv-superpm` (board/chats/versions); a secondary app `"core"` = `bv-second-brain` (knowledge collections + `memory`). The chat tools (`search_catalog`/`search_knowledge`/`recall`/`remember`) read/write the Core. Repointing apps = swap `CORE_CONFIG` only.

**Claude chat backend** (`chat-proxy/`, deploy as a Render **Web Service**): holds `ANTHROPIC_API_KEY` (Claude key, tested ✅, value in the local secrets file — Ben@/hello@blackvoyage.com). See `CHAT-SETUP.md`.

---

## 7. Features (so the team knows what's wired up)
- **Real-time shared board** (Firestore) — top-right shows `● live (shared)`.
- **Shared version history** (History tab) — every user's changes, with restore. Click **👤 Set your name** so your edits are attributed to you (not just your role).
- **Google sign-in** (Connect Google) → create **Sheet/Doc** on any task (`📊 Sheet` / `📝 Doc`), auto-shared.
- **Attachments per task:** `+ link` (URL), **`</> Code/Link`** (paste HTML *or* a link → preview / view source / **⛶ full page**).
- **Claude chat per card** (in the product card, replacing the old Slack/check-in panel) — shared across all users, ⛶ full-screen, and can attach links/HTML, add notes, and update task status via tools. Needs the **chat-proxy** backend (`CHAT_API_URL`); see `CHAT-SETUP.md`. Key (`ANTHROPIC_API_KEY`) lives on the proxy, never in the app.
- **AI grounded in the BV Data Core** (§5b) — the per-card chat reads real **catalog specs, tech, materials, competitors, and brand guidelines** from `bv-second-brain` before answering (tools: `search_catalog`/`get_product`/`search_knowledge`), and **remembers** durable insights to shared cross-app `memory` (`recall`/`remember`). Voice rules from the glossary are always enforced.
- **Edit/remove (✎/✕)** on every link & attachment.
- **Wide view** (⛶) full-width; **flow-chart hide** toggle; EN/中文; light/dark/blue theme.

---

## 8. Security status & TODO
- [ ] **(planned) Gemini LLM feature** — an AI feature is planned for this app, to be added later. It will use the **Gemini API key held under Ben@blackvoyage.com** (§1/§9). The key must be called from a backend / secret store (e.g. a small server or Cloud Function) — it can **not** go in `index.html`, which is fully public.
- [ ] **🔴 Lock down the BV Data Core (`bv-second-brain`)** — now holds company-wide data under OPEN rules (`allow read,write: if true`), exposed via SuperPM's public web config. **Top priority.** Ready-to-apply rules + the Firebase-Auth client wiring are drafted in **`CORE-SECURITY.md`**. ⚠️ Do NOT flip the rules until every client app authenticates to the Core, or their reads break.
- [ ] **Lock down `bv-superpm` Firestore** — board rules are also open. Add Firebase Auth (Google, blackvoyage.com) + `allow read, write: if request.auth != null`.
- [ ] **Delete the dead old Render service** `bv-superpm-ihnr` (under `tennisandcode`).
- [ ] *(optional)* Remove `tennisandcode` as a GitHub collaborator once black-voyage handles all pushes.
- [ ] *(optional)* Clean mock data out of the code `LAUNCHES` seed (live board already cleaned in Firestore).

## 9. Secrets — NOT stored in this file
- **GitHub push token** (`ghp_…`): lives only on the developer's machine; never commit it. Rotate at
  https://github.com/settings/tokens if exposed.
- **Gemini API key**: held under the **Ben@blackvoyage.com** Google account (Google AI Studio /
  Google Cloud). Not stored in this repo — keep it in an env var / secret manager, not in client code.
- **BV Data Core service-account key** (`bv-second-brain-*.json`, admin/server key): lives **outside the
  repo** at `~/Desktop/MASTER-CONFIG/` (and is gitignored by name). Used only for server-side/admin sync &
  one-off scripts — never client code, never committed. SA email in §5b. Rotate in the Firebase console if exposed.
- The OAuth Client ID and Firebase `apiKey` above are **not secrets** — they're public client identifiers
  by design (already visible in page source). Security comes from OAuth origins + Firestore rules, not from
  hiding them.
