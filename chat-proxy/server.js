// BV SuperPM — Claude chat proxy
// Holds the Anthropic API key (env ANTHROPIC_API_KEY) and forwards chat requests to Claude.
// The app NEVER sees the key. Deploy on Render as a Web Service. See README.md.
const express = require("express");
const app = express();
app.use(express.json({ limit: "4mb" }));

// Allow the app's known origins (Render static site + Firebase Hosting). Override with ALLOWED_ORIGINS (comma-separated).
const ALLOWED = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN ||
  "https://bv-superpm-ey4i.onrender.com,https://bv-superpm.web.app,https://bv-superpm.firebaseapp.com")
  .split(",").map((s) => s.trim()).filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED.includes(origin)) res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (_req, res) => res.send("BV SuperPM chat proxy — OK"));

app.post("/chat", async (req, res) => {
  try {
    const { system, messages, tools, model } = req.body || {};
    if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: { message: "ANTHROPIC_API_KEY not set on the server" } });
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-6",
        max_tokens: Number(process.env.MAX_TOKENS) || 8000, // enough to generate full HTML/docs without truncation
        system,
        messages,
        tools,
      }),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: { message: String(e) } });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("chat proxy listening on " + PORT));
