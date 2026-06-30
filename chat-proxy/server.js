// BV SuperPM — Claude chat proxy (runs on Google Cloud Run, project bv-infra-499600).
// Holds the Anthropic API key (env ANTHROPIC_API_KEY, mounted from Secret Manager) and forwards chat to
// Claude. The app NEVER sees the key. Hardening here: CORS allowlist (browser-only), MODEL allowlist,
// per-IP RATE LIMIT, fixed max_tokens. NOTE: a public --allow-unauthenticated endpoint can still be called
// by non-browser clients, so ALSO set an Anthropic spend cap and (ideally) add Firebase App Check for real
// caller auth. See FIREBASE-DEPLOY.md.
const express = require("express");
const app = express();
app.set("trust proxy", true);
app.use(express.json({ limit: "4mb" }));

// Allow the app's known browser origins; env ALLOWED_ORIGINS adds more. (Browser-enforced only.)
const DEFAULT_ORIGINS = ["https://bv-superpm.web.app", "https://bv-superpm.firebaseapp.com", "https://bv-superpm-ey4i.onrender.com"];
const ALLOWED = [...new Set([...DEFAULT_ORIGINS,
  ...(process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean)])];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED.includes(origin)) res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Only the models the app actually offers — anything else falls back to the cheapest (blocks cost abuse).
const ALLOWED_MODELS = new Set(["claude-opus-4-8", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"]);
const DEFAULT_MODEL = "claude-sonnet-4-6";  // a missing/invalid model degrades to the app's INTENDED tier (Sonnet), never silently to the weakest (Haiku)
const MAX_TOKENS = Math.min(Number(process.env.MAX_TOKENS) || 32000, 32000);  // 32K default so long briefs/sections finish in one pass (non-streaming-safe; 4.x models support it)

// Best-effort per-IP rate limit (in-memory; per Cloud Run instance — pair with a low --max-instances).
const RL_WINDOW_MS = 60000;
const RL_MAX = Number(process.env.RATE_LIMIT_PER_MIN) || 20;
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RL_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // bound memory under a flood
  return arr.length > RL_MAX;
}

app.get("/", (_req, res) => res.send("BV SuperPM chat proxy — OK"));

app.post("/chat", async (req, res) => {
  try {
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip || "unknown";
    if (rateLimited(ip)) return res.status(429).json({ error: { message: "Too many requests — please slow down." } });
    if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: { message: "ANTHROPIC_API_KEY not set on the server" } });
    const { system, messages, tools, model, think } = req.body || {};
    const safeModel = ALLOWED_MODELS.has(model) ? model : DEFAULT_MODEL; // never honor an arbitrary/pricier model
    const payload = { model: safeModel, max_tokens: MAX_TOKENS, system, messages, tools };
    if (think) payload.thinking = { type: "enabled", budget_tokens: Math.min(6000, MAX_TOKENS - 2048) }; // extended thinking so the app can show the LLM's reasoning
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: { message: String(e) } });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("chat proxy listening on " + PORT));
