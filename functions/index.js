// BV SuperPM — Claude chat proxy as a 2nd-gen Cloud Function.
// TEAM-tier: the Anthropic key lives in Secret Manager (ANTHROPIC_API_KEY), never downloaded, never in the app.
// Firebase Hosting rewrites /api/chat → this function, so the browser calls it SAME-ORIGIN (no CORS).
// Replaces the Render chat-proxy. Node 22 has global fetch.
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");

exports.chat = onRequest(
  {
    secrets: [ANTHROPIC_API_KEY],
    region: "us-central1",
    cors: true,                 // harmless (served same-origin via Hosting rewrite)
    memory: "256MiB",
    timeoutSeconds: 120,
    maxInstances: 10,
    // To kill cold starts entirely later: set minInstances: 1 (small always-on cost).
  },
  async (req, res) => {
    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST") return res.status(200).send("BV SuperPM chat function — OK");
    try {
      const { system, messages, tools, model } = req.body || {};
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY.value(),
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: model || "claude-sonnet-4-6",
          max_tokens: Number(process.env.MAX_TOKENS) || 8000,
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
  }
);
