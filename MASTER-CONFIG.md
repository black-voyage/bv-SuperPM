# BV SuperPM — Master Config & Connections

Single source of truth for every account, connection, and config value behind the SuperPM dashboard.
Keep this updated when anything changes. **No real secrets live here** (see "Secrets" at the bottom).

_Last updated: 2026-06-15_

---

## 1. Accounts / emails

| Role | Email / handle | Used for |
|---|---|---|
| **Primary owner** | **hello@blackvoyage.com** | GitHub org-account, Render hosting, Google Cloud, Firebase, Drive — owns everything |
| GitHub collaborator | `tennisandcode` (Benjamin Chung) | Push access to the repo (guest). Commit identity: `154731536+tennisandcode@users.noreply.github.com` |
| Google Workspace domain | `blackvoyage.com` | OAuth "Internal" audience — any blackvoyage.com user can sign in |

---

## 2. GitHub — source code

| Item | Value |
|---|---|
| Repository | **`black-voyage/bv-SuperPM`** (private) |
| URL | https://github.com/black-voyage/bv-SuperPM |
| Default branch | `main` |
| Owner | `black-voyage` (hello@blackvoyage.com) |
| Collaborators | `tennisandcode` (write) |
| Key files | `index.html` (the app), `dashboard.html` + `superpm.html` (synced copies), `render.yaml` (deploy blueprint) |
| Workflow | Pull/rebase before push so commits stack; see `CONTRIBUTING.md` |

---

## 3. Render — hosting (static site)

| Item | Value |
|---|---|
| Account | hello@blackvoyage.com |
| Service name | `bv-superpm` (static site) |
| **Live URL** | **https://bv-superpm-ey4i.onrender.com** |
| Deploys from | `black-voyage/bv-SuperPM`, branch `main` (auto-deploy on push, ~1 min) |
| Config | `render.yaml` blueprint (no build step; publish path = repo root) |
| ⚠️ Dead/old | `https://bv-superpm-ihnr.onrender.com` (old `tennisandcode` Render account, now 503) — safe to delete |

---

## 4. Google Cloud / OAuth — sign-in + Drive file creation

| Item | Value |
|---|---|
| GCP project | **BV SuperPM** (project # `864428735438`) |
| OAuth Client ID | `864428735438-704etq9hsq1lrse1s2i6fs2ctg6m7vu2.apps.googleusercontent.com` |
| Client type | Web application ("BV SuperPM web") |
| Consent screen | **Internal** (blackvoyage.com Workspace) — no test-user list needed |
| Authorized JS origin | `https://bv-superpm-ey4i.onrender.com` |
| API enabled | **Google Drive API** (creates Sheets/Docs + sets sharing) |
| Scopes requested | `https://www.googleapis.com/auth/drive` + `email profile` |
| Files created under | **hello@blackvoyage.com** (login hint) |
| Saved into Drive folder | `16b_sYyvOGNxemgdDhADHpd_-z6lu1GgA` |
| Folder URL | https://drive.google.com/drive/folders/16b_sYyvOGNxemgdDhADHpd_-z6lu1GgA |
| File naming | `BV-SuperPM-<Product>` (intake) / `BV-SuperPM-<Product>-<Task>` (other) |
| New files shared as | Anyone-with-link → **Editor** |

> If the live URL ever changes, add the new domain to **Authorized JavaScript origins** or sign-in breaks.

---

## 5. Firebase / Firestore — real-time shared board

Same Google Cloud project as the OAuth client (project # `864428735438`).

| Item | Value |
|---|---|
| Firebase project ID | **`bv-superpm`** |
| Firestore | Standard edition, location **nam5 (US)**, Production mode, **Blaze plan** (billing enabled) |
| Shared document | collection `bv` → doc `superpm` (the whole board state) |
| Live status badge | top-right of app: ● live (shared) |
| Security rules | **OPEN** (`allow read, write: if true`) — ⚠️ see Security below |

**Web config (also embedded in `index.html` → `FIREBASE_CONFIG`):**
```js
apiKey:            "AIzaSyACM71vycT4OeKxxoT6vL5MCK7H6g592vQ"
authDomain:        "bv-superpm.firebaseapp.com"
projectId:         "bv-superpm"
storageBucket:     "bv-superpm.firebasestorage.app"
messagingSenderId: "864428735438"
appId:             "1:864428735438:web:d353709e716410fecf899f"
```

---

## 6. In-code config (edit these in `index.html`, then push)

| Constant | Current value | Purpose |
|---|---|---|
| `GOOGLE_CLIENT_ID` | `864428735438-704…apps.googleusercontent.com` | OAuth sign-in |
| `GOOGLE_ACCOUNT` | `hello@blackvoyage.com` | account that creates Sheets/Docs |
| `GOOGLE_FOLDER_ID` | `16b_sYyvOGNxemgdDhADHpd_-z6lu1GgA` | Drive folder for generated files |
| `FIREBASE_CONFIG` | (object above) | shared Firestore board |

> `index.html`, `dashboard.html`, and `superpm.html` are kept byte-identical — change `index.html`, copy to the other two, then push.

---

## 7. Live URLs (quick links)

- **App (live):** https://bv-superpm-ey4i.onrender.com
- App / SuperPM homepage = `/` · main tracker dashboard = `/dashboard.html`
- **Code:** https://github.com/black-voyage/bv-SuperPM
- **Generated-files folder:** https://drive.google.com/drive/folders/16b_sYyvOGNxemgdDhADHpd_-z6lu1GgA
- **Firebase console:** https://console.firebase.google.com/project/bv-superpm
- **Render dashboard:** https://dashboard.render.com (hello@blackvoyage.com)

---

## 8. Security status & TODO

- [ ] **Lock down Firestore** — rules are currently open (anyone with the config could read/write). Recommend Firebase Auth (Google, restricted to blackvoyage.com) + `allow read, write: if request.auth != null`.
- [ ] **Delete the dead old Render service** `bv-superpm-ihnr` (under the `tennisandcode` Render account).
- [ ] **(Optional)** Move version-history audit into Firestore so it's shared across all users.
- [ ] **(Optional)** Remove `tennisandcode` as a GitHub collaborator once black-voyage handles all pushes.

## Secrets — NOT stored in this file
- **GitHub push token** (`ghp_…`): lives only on the developer's machine; never commit it. Rotate at
  https://github.com/settings/tokens if exposed.
- The OAuth Client ID and Firebase `apiKey` above are **not secrets** — they are public client
  identifiers by design (already visible in the page source); security is enforced by OAuth origins +
  Firestore rules, not by hiding them.
