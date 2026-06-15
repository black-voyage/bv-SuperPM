# Real-time shared board — Firebase Firestore setup

The dashboard now syncs through ONE shared Firestore document, so **every user sees every update
live**. Until a Firebase config is pasted into the code, the app stays local-only (per browser)
exactly as before. One-time setup (~5 min), do it as **hello@blackvoyage.com**.

## Steps
1. Go to https://console.firebase.google.com/ and sign in as **hello@blackvoyage.com**.
2. **Add project** → you can reuse the existing **BV SuperPM** Google Cloud project (pick it from the
   list) or create a new one. Google Analytics is optional (skip is fine).
3. **Create the database:** left nav → **Build → Firestore Database** → **Create database** →
   choose a location → start in **Production mode** (we'll paste rules next).
4. **Set rules** (Firestore → **Rules** tab) — paste this and **Publish**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if true; }
     }
   }
   ```
   ⚠️ This is **open** (anyone with the link/config can read+write). Fine to validate the shared board,
   but see "Locking it down" below before relying on it for sensitive data.
5. **Register a web app:** Project Overview (gear → **Project settings** → **General**) → scroll to
   **Your apps** → click the **web `</>`** icon → nickname **BV SuperPM web** → Register.
6. Firebase shows a **`firebaseConfig`** object like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza…",
     authDomain: "bv-superpm.firebaseapp.com",
     projectId: "bv-superpm",
     storageBucket: "bv-superpm.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```
   **Copy that whole object and send it to me.** I'll paste it into the code (the `FIREBASE_CONFIG`
   constant), push, and the board goes live-shared.

## How it works
- All browsers subscribe to `bv/superpm` in Firestore. Any change one user makes writes the full board
  state there; everyone else's screen updates within ~1 second (top-right shows **● live (shared)**).
- The **first** browser to connect seeds the cloud with its current board; after that, the cloud is the
  single source of truth and every device adopts it.

## Locking it down (do this soon)
Open rules mean anyone who views the page source (which contains the config) could read/write the data.
When you're ready, tell me and I'll add **Firebase Auth** (Google sign-in restricted to the
blackvoyage.com domain) and tighten the rules to `allow read, write: if request.auth != null`.

## Notes
- Simultaneous edits: because everyone syncs within ~1s, edits normally stack. If two people edit the
  *exact* same field within the same second, it's last-write-wins. If that becomes a problem, I can shard
  the data per-launch so concurrent edits never collide.
- Version history is still per-browser for now; say the word and I'll move the audit trail into Firestore
  too so everyone sees the full who-changed-what across all users.
