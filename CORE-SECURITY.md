# Locking down the BV Data Core (`bv-second-brain`)

The Core currently runs **OPEN rules** (`allow read, write: if true`). That was fine for setup, but the
Core now holds company-wide data and is reachable via SuperPM's **public** web `apiKey`. Anyone who views
the page source could read or write the whole Core. This doc is the **ready-to-apply** lockdown.

> ⚠️ **Do NOT flip the rules until EVERY client app authenticates to the Core** (SuperPM, KOL, email app…).
> The instant rules require auth, any app that isn't signed in to the Core's Firebase Auth gets
> `permission-denied` on every read — its knowledge/memory goes blank. Sequence it (see §4).

---

## 1. Target Firestore rules (paste in Firebase Console → `bv-second-brain` → Firestore → Rules)
Gate everything to verified Google accounts on the `blackvoyage.com` workspace domain:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function bvUser() {
      return request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email.matches('.*@blackvoyage[.]com$');
    }
    match /{document=**} {
      allow read, write: if bvUser();
    }
  }
}
```
This is a blanket company-only gate — a big step up from open. Per-collection hardening (e.g. apps may
only write their own `apps/<app>/…` + shared `memory`, shared collections read-only) can come later.

## 2. Enable the sign-in provider (one-time, Core project)
In **Firebase Console → `bv-second-brain` → Authentication**:
1. **Get started** → **Sign-in method** → enable **Google**.
2. **Settings → Authorized domains** → add `bv-superpm-ey4i.onrender.com` (and any other app domains +
   `localhost` for local testing). Without this, `signInWithPopup` is rejected.

## 3. Client wiring — SuperPM signs in to the Core (add to `index.html`)
SuperPM uses Google Identity Services (GIS) for Drive today; the Core needs **Firebase Auth** (separate).
Two changes:

**(a) Load the Firebase Auth SDK** — next to the existing firestore compat script:
```html
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
```

**(b) In `fbInit`, sign in to the `"core"` app BEFORE attaching Core listeners.** Replace the current
"attach Core subscriptions immediately" block so the subscriptions only start once a `blackvoyage.com`
user is signed in (otherwise locked rules reject them):
```js
let coreApp; try{ coreApp=firebase.app("core"); }catch(_){ coreApp=firebase.initializeApp(CORE_CONFIG,"core"); }
const cdb=coreApp.firestore(); FB.coreDb=cdb;
const coreAuth=coreApp.auth();
const provider=new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ hd:"blackvoyage.com" });   // hint the workspace domain
function attachCoreListeners(){
  cdb.collection("catalog").onSnapshot(qs=>{KNOWLEDGE.catalog=qs.docs.map(d=>d.data());}, e=>{});
  cdb.collection("memory").limit(500).onSnapshot(qs=>{KNOWLEDGE.memory=qs.docs.map(d=>Object.assign({id:d.id},d.data()));}, e=>{});
  cdb.collection("competitors").onSnapshot(qs=>{KNOWLEDGE.competitors=qs.docs.map(d=>Object.assign({id:d.id},d.data()));}, e=>{});
  cdb.collection("brand_docs").onSnapshot(qs=>{KNOWLEDGE.brand_docs=qs.docs.map(d=>d.data());}, e=>{});
  ["tech","series","materials","hardware","glossary"].forEach(c=>cdb.collection(c).onSnapshot(qs=>{KNOWLEDGE[c]=qs.docs.map(d=>d.data());}, e=>{}));
}
coreAuth.onAuthStateChanged(u=>{
  if(u){ attachCoreListeners(); }
  else { coreAuth.signInWithPopup(provider).catch(()=>{}); }
});
```
> The currently-shipped code attaches the Core listeners immediately (correct under OPEN rules). When you
> flip to locked rules, swap in the block above (guarded by auth). Keep them in lockstep: **rules locked
> ⇄ auth wiring live.** Mismatch = blank knowledge.

## 4. Recommended rollout sequence (no downtime)
1. Enable Google provider + authorized domains (§2) — harmless while rules stay open.
2. Ship the auth wiring (§3) to **every** client app; confirm each signs in and still reads the Core.
3. Only then paste the locked rules (§1). Knowledge keeps flowing because every app is now authenticated.
4. (Optional, later) per-collection rules: shared = read-only to apps, writes scoped to `apps/<app>/…` + `memory`.

## 5. Notes
- The web `apiKey` is **not** a secret (it only identifies the project); security comes from these rules +
  authorized domains, not from hiding it.
- Two Google sign-ins (GIS for Drive + Firebase Auth for the Core) is workable but clunky. A later cleanup
  is to unify SuperPM on Firebase Auth and derive Drive access from it.
- Same lockdown pattern applies to the `bv-superpm` board project (its own open rules).
