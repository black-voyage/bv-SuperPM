# Google Sign-In + create Sheets/Docs — one-time setup

Each teammate can **sign in with their own Google account** (button at the top-right) and then
create real **Google Sheets or Docs** straight from any task. New files are **auto-shared so anyone
with the link can edit** — so the team can always open/edit them without manual sharing. This needs a
free Google OAuth Client ID (one-time, ~5 min).

## Steps
1. Go to https://console.cloud.google.com/ and create (or pick) a project.
2. **Enable the API:** APIs & Services → **Library** → search **"Google Drive API"** → **Enable**.
   (Drive API covers creating both Sheets and Docs and setting sharing.)
3. **OAuth consent screen:** APIs & Services → **OAuth consent screen** →
   - User type: **External** (or **Internal** if everyone is in your Google Workspace — recommended for a
     company tool, and it skips the test-user step).
   - Fill app name + your email. If **External**, add each teammate's email under **Test users** while
     the app is in "Testing" (or publish the app).
4. **Create the credential:** APIs & Services → **Credentials** → **Create Credentials** →
   **OAuth client ID** → Application type **Web application**.
   - **Authorized JavaScript origins** — add the exact site URLs (no trailing slash):
     - `https://bv-superpm-ey4i.onrender.com`
     - (optional, for local testing on a server) `http://localhost:8000`
       *(Note: Google sign-in does NOT work from a `file://` page — use the live site.)*
   - Create. **Copy the Client ID** (looks like `1234567890-abc...apps.googleusercontent.com`).
5. **Paste it into the code:** in `index.html` (and `dashboard.html` / `superpm.html`), find:
   ```js
   const GOOGLE_CLIENT_ID="";
   ```
   and put the Client ID between the quotes. Commit & push — Render redeploys in ~1 min.

## How it works
- **Sign in** with the button at the top-right. Your name/email shows there; everything you create is
  under **your** Google account.
- On any task (and the intake **Form (intake)**), use **📊 Sheet** or **📝 Doc** to create a file.
  The intake file is named after the **product**; other files are named `Product · Task`. Creating the
  intake file also **unlocks the pipeline**.
- Every created file is automatically set to **"Anyone with the link — Editor."**
- Scope used: `drive.file` — the app can only see/manage files it creates, nothing else in your Drive.

## Notes
- If your Google Workspace admin **blocks public link-sharing**, the file is still created and linked,
  but the auto "anyone-with-link" step is skipped (you'll get a toast). In that case share within the org,
  or ask the admin to allow link-sharing.
- If you change the live domain later, **add the new domain** to Authorized JavaScript origins.
- Until a Client ID is set, the sign-in button shows a setup reminder.
