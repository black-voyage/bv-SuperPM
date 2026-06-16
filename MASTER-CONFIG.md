# BV SuperPM — Master Config & Connections

Single source of truth for every account, connection, and config value behind the SuperPM dashboard.
Keep this updated when anything changes. **No real secrets live here** (see §9).

_Last updated: 2026-06-15_

---

## 0. TL;DR — the live stack
- **App (live):** https://bv-superpm-ey4i.onrender.com  — homepage `/` = SuperPM, dashboard at `/dashboard.html`
- **Code:** https://github.com/black-voyage/bv-SuperPM (private)  — branch `main`, auto-deploys to Render
- **Data:** Firebase Firestore `bv-superpm` — real-time shared board (everyone sees everyone's edits)
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

## 3. Render — hosting (static site)
| Item | Value |
|---|---|
| Account | hello@blackvoyage.com |
| Service | `bv-superpm` (static site, free tier) |
| **Live URL** | **https://bv-superpm-ey4i.onrender.com** |
| Deploys from | `black-voyage/bv-SuperPM` `main` (~1 min after push) |
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

## 6. In-code config (edit in `index.html`, copy to `dashboard.html`+`superpm.html`, push)
| Constant | Value | Purpose |
|---|---|---|
| `GOOGLE_CLIENT_ID` | `864428735438-704…apps.googleusercontent.com` | OAuth sign-in |
| `GOOGLE_ACCOUNT` | `hello@blackvoyage.com` | account that creates Sheets/Docs |
| `GOOGLE_FOLDER_ID` | `16b_sYyvOGNxemgdDhADHpd_-z6lu1GgA` | Drive folder for generated files |
| `FIREBASE_CONFIG` | (object in §5) | shared Firestore board |

---

## 7. Features (so the team knows what's wired up)
- **Real-time shared board** (Firestore) — top-right shows `● live (shared)`.
- **Shared version history** (History tab) — every user's changes, with restore. Click **👤 Set your name** so your edits are attributed to you (not just your role).
- **Google sign-in** (Connect Google) → create **Sheet/Doc** on any task (`📊 Sheet` / `📝 Doc`), auto-shared.
- **Attachments per task:** `+ link` (URL), **`</> Code/Link`** (paste HTML *or* a link → preview / view source / **⛶ full page**).
- **Edit/remove (✎/✕)** on every link & attachment.
- **Wide view** (⛶) full-width; **flow-chart hide** toggle; EN/中文; light/dark/blue theme.

---

## 8. Security status & TODO
- [ ] **(planned) Gemini LLM feature** — an AI feature is planned for this app, to be added later. It will use the **Gemini API key held under Ben@blackvoyage.com** (§1/§9). The key must be called from a backend / secret store (e.g. a small server or Cloud Function) — it can **not** go in `index.html`, which is fully public.
- [ ] **Lock down Firestore** — rules are open (anyone with the config could read/write). Add Firebase Auth (Google, restricted to blackvoyage.com) + `allow read, write: if request.auth != null`. ← do soon.
- [ ] **Delete the dead old Render service** `bv-superpm-ihnr` (under `tennisandcode`).
- [ ] *(optional)* Remove `tennisandcode` as a GitHub collaborator once black-voyage handles all pushes.
- [ ] *(optional)* Clean mock data out of the code `LAUNCHES` seed (live board already cleaned in Firestore).

## 9. Secrets — NOT stored in this file
- **GitHub push token** (`ghp_…`): lives only on the developer's machine; never commit it. Rotate at
  https://github.com/settings/tokens if exposed.
- **Gemini API key**: held under the **Ben@blackvoyage.com** Google account (Google AI Studio /
  Google Cloud). Not stored in this repo — keep it in an env var / secret manager, not in client code.
- The OAuth Client ID and Firebase `apiKey` above are **not secrets** — they're public client identifiers
  by design (already visible in page source). Security comes from OAuth origins + Firestore rules, not from
  hiding them.
