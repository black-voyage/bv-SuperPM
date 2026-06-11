# Google Sheets intake — one-time setup

The intake Form can create a **real Google Sheet** in the signed-in user's Google account,
named after the product, and save it back onto the card as the intake form. This needs a
free Google OAuth Client ID (one-time, ~5 min).

## Steps
1. Go to https://console.cloud.google.com/ and create (or pick) a project.
2. **Enable the API:** APIs & Services → **Library** → search **"Google Sheets API"** → **Enable**.
3. **OAuth consent screen:** APIs & Services → **OAuth consent screen** →
   - User type: **External** (or Internal if you use Google Workspace and want company-only).
   - Fill app name + your email. Add yourself (and teammates) as **Test users** while it's unpublished.
4. **Create the credential:** APIs & Services → **Credentials** → **Create Credentials** →
   **OAuth client ID** → Application type **Web application**.
   - **Authorized JavaScript origins** — add the exact site URLs (no trailing slash):
     - `https://bv-superpm-ihnr.onrender.com`
     - (optional, for local testing) `http://localhost:8000`
   - Create. **Copy the Client ID** (looks like `1234567890-abc...apps.googleusercontent.com`).
5. **Paste it into the code:** in `index.html` (and `dashboard.html` / `superpm.html`), find:
   ```js
   const GOOGLE_CLIENT_ID="";
   ```
   and put the Client ID between the quotes. Commit & push — Render redeploys in ~1 min.

## How it works
- On a launch card, the intake task **"Form (intake)"** shows a **📄 Create Google Sheet** button
  while it has no sheet yet.
- Clicking it opens Google sign-in (pick the **browser account / email**), creates a new sheet
  **titled with the product name**, saves the sheet link onto the intake task, and **unlocks the pipeline**.
- Scope used: `drive.file` — the app can only touch sheets it creates, nothing else in your Drive.

## Notes
- If you transfer the repo or change the live domain, **add the new domain** to Authorized JavaScript
  origins, or sign-in will be blocked.
- Until a Client ID is set, the button shows a reminder instead of creating a sheet.
