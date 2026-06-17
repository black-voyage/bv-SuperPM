# Claude chat — backend setup (one-time)

The in-app Claude chat (per product card) needs a tiny backend that holds the Anthropic API key,
because `index.html` is **public** (an exposed key = anyone can spend your Claude credits). The app
calls this proxy; the proxy calls Claude. Code lives in `chat-proxy/`.

## Deploy the proxy on Render (~3 min, as hello@blackvoyage.com)
1. https://dashboard.render.com → **New + → Web Service**.
2. Connect the repo **`black-voyage/bv-SuperPM`**.
3. Settings:
   - **Root Directory:** `chat-proxy`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - Instance type: Free is fine.
4. **Environment → add variables:**
   - `ANTHROPIC_API_KEY` = the Claude key (in the local secrets file — NOT committed here)
   - `ALLOWED_ORIGIN` = `https://bv-superpm-ey4i.onrender.com`
5. Create the service. When live, copy its URL (e.g. `https://bv-superpm-chat.onrender.com`).

## Point the app at it
In `index.html` set:
```js
const CHAT_API_URL="https://bv-superpm-chat.onrender.com/chat";   // <-- your proxy URL + /chat
```
Copy `index.html` → `dashboard.html` + `superpm.html`, commit, push → the static site redeploys and the
chat goes live.

## How the chat works
- One **shared chat per product card** (stored in Firestore `bv/superpm/chats/<slug>`) — everyone sees
  the conversation and the actions taken, for that product.
- Claude can **take actions via tools**: `add_link`, `add_html`, `add_note`, `set_task_status`. These
  write to the board (synced to everyone in real time + recorded in History).
- **⛶ full** expands the chat to full screen.
- Model: `claude-sonnet-4-6` (change `CHAT_MODEL` in `index.html`).

## Security notes
- The proxy only accepts requests from `ALLOWED_ORIGIN` (the live site). For stronger protection later,
  add an auth check (e.g. require a Firebase ID token).
- Never put `ANTHROPIC_API_KEY` in `index.html` or commit it — it stays an env var on the proxy.
