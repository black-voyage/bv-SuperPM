#!/usr/bin/env node
/**
 * ingest-vaults.js — parse the two product vaults into Firestore.
 *
 * Maps (per BV-DATA-ARCHITECTURE.md):
 *   products_info/products/ ..md            -> product_docs/{slug}      (rich per-product source-of-truth; NOT catalog)
 *   products_info/reference/五金輔料總覽.md  -> hardware/{slug}          (type:'overview'; 2026-07 moved from hardware/)
 *   products_info/products/.._LINEAGE.md    -> brand_docs/lineage      (naming evolution)
 *   products_assistant/1-Projects/ ..md     -> apps/superpm/launches/{id}            (work layer — gated, see below)
 *   products_assistant/2-Areas/suppliers/   -> apps/superpm/suppliers/{slug}
 *   products_assistant/daily/ ..md          -> apps/superpm/daily/{date}
 *   products_assistant/meetings/ ..md       -> apps/superpm/meetings/{slug}
 *   products_assistant/4-Archive/ ..md      -> apps/superpm/archive/{slug}
 *   products_info/reference/{品牌共通規格,受控料名清單}.md -> apps/superpm/materials_reference/{slug}
 *                                              (2026-07 moved from products_assistant/3-Resources/materials/)
 *
 * catalog/{SKU} is OWNED BY the Google Sheet sync and read by the live dashboard — this
 * script NEVER writes there. Work-layer (apps/superpm/*) uploads are refused while the
 * Firestore rules are still open (public); lock down Auth first.
 *
 * Every write is an idempotent upsert keyed by a STABLE id, so re-running is safe.
 *
 * Usage:
 *   node ingest-vaults.js                 # DRY RUN — prints what would upload, writes nothing
 *   node ingest-vaults.js --write         # writes products_info (catalog/hardware/brand_docs/materials)
 *   node ingest-vaults.js --write --scope=all      # also writes products_assistant (apps/superpm/*)
 *   node ingest-vaults.js --write --scope=assistant# only the work layer
 *   node ingest-vaults.js --sample        # print one full encoded doc per collection then exit
 *   node ingest-vaults.js --dry-run [--scope=all]  # explicit zero-write (wins over --write)
 *   node ingest-vaults.js --prune --dry-run        # READ-ONLY: list Firestore docs with no matching md (never deletes)
 * Work-layer docs are keyed by the permanent frontmatter `id` (may differ from the filename).
 * Skips (duplicate id within a collection) are summarized on stderr, exit code 2, macOS notification.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

// ---- config -------------------------------------------------------------
// Default target is the BV Data Core (bv-second-brain). The Core is locked (auth-only),
// so writes go through the Admin SDK. Two ways to authenticate it:
//   1. a service-account key (service-account.json), OR
//   2. gcloud Application Default Credentials — `gcloud auth application-default login`
//      (a USER login, no key file — works even when org policy blocks service-account keys).
// With neither, we fall back to the keyed REST API — which only works on OPEN projects (e.g. bv-superpm).
const PROJECT_ID = process.env.BV_PROJECT_ID || "bv-second-brain";
const API_KEY = process.env.BV_API_KEY || "AIzaSyDWj27ftoWzMJyr2Q7PgRAGBDjzesJjk0o"; // Core web apiKey (REST fallback / probe only)
const SA_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || [path.join(__dirname, "service-account.json"), path.join(__dirname, "bv-second-brain-service-account.json")].find(p => fs.existsSync(p));
const ADC_PATH = path.join(os.homedir(), ".config", "gcloud", "application_default_credentials.json");
const HAS_ADC = fs.existsSync(ADC_PATH);
const ADMIN = !!(SA_PATH || HAS_ADC);
const WORKSPACE = path.resolve(__dirname, "..", "..");
const INFO = path.join(WORKSPACE, "products_info");
const ASSIST = path.join(WORKSPACE, "products_assistant");

// Lazy Admin SDK handle (bypasses security rules; required for the locked Core).
let _db = null;
function adminDb() {
  if (_db) return _db;
  const admin = require("firebase-admin");
  if (!admin.apps.length) {
    if (SA_PATH) {
      const cred = require(path.resolve(SA_PATH));
      admin.initializeApp({ credential: admin.credential.cert(cred), projectId: cred.project_id });
    } else {
      admin.initializeApp({ projectId: PROJECT_ID }); // uses gcloud ADC (application-default login)
    }
  }
  _db = admin.firestore();
  return _db;
}

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const PRUNE = args.includes("--prune");
const WRITE = args.includes("--write") && !DRY; // --dry-run always wins over --write (zero-write)
const SAMPLE = args.includes("--sample");
const DUMP = (args.find(a => a.startsWith("--dump=")) || "").slice(7); // local JSON of what WOULD be written (no Firestore; brain-to-sheet simulator input)
const scopeArg = (args.find(a => a.startsWith("--scope=")) || "--scope=info").split("=")[1];
const SCOPE = (SAMPLE || PRUNE) ? "all" : scopeArg; // info | assistant | all (prune must see every managed collection)
const NOW = Date.now();

// --prune gates: decided BEFORE any Firestore connection. Phase 1 = list only, never delete.
if (PRUNE && args.includes("--write")) {
  console.error("--prune 不可與 --write 併用(Phase 1 未開放刪除,需 Zac 確認)。只支援 --prune --dry-run。");
  process.exit(3);
}
if (PRUNE && !DRY) {
  console.error("Phase 1 未開放刪除,需 Zac 確認。(只支援 --prune --dry-run 列出孤兒,不刪除)");
  process.exit(3);
}

// Skips are never silent: collect, then summarize loudly on stderr at process exit,
// force a non-zero exit code and fire a macOS notification (ignored if unavailable).
const skipped = []; // {file, id, expected, collection}
process.on("exit", (code) => {
  if (!skipped.length) return;
  const bar = "=".repeat(70);
  console.error(`\n${bar}\n!! INGEST 跳過 ${skipped.length} 筆(同一 collection 內 frontmatter id 重複),這些資料「沒有」進 Firestore:`);
  for (const s of skipped) console.error(`   - ${s.file}\n       id="${s.id}"  ${s.expected}  (${s.collection})`);
  console.error(`   修法:找出哪個檔是複製時沿用了別人的 id,改成該檔建檔時的 slug(DATA-CONTRACT.md 第一節)。\n${bar}`);
  if (!code) process.exitCode = 2;
  if (process.platform === "darwin") {
    try {
      require("child_process").spawnSync("osascript", ["-e",
        `display notification "ingest 跳過 ${skipped.length} 筆(id 重複),詳見 stderr" with title "BV Second Brain ingest"`],
        { stdio: "ignore", timeout: 5000 });
    } catch (_) { /* ignore */ }
  }
});

// ---- tiny helpers -------------------------------------------------------
function walk(dir, filter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p, filter));
    else if (filter(p)) out.push(p);
  }
  return out;
}
const isMd = p => p.toLowerCase().endsWith(".md");
const slugify = s => s.replace(/\.md$/i, "").trim().toLowerCase()
  .replace(/[\s_]+/g, "-").replace(/[^\w一-鿿-]/g, "").replace(/-+/g, "-");

function splitFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  let key = null;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const v = kv[2].trim();
      fm[key] = v === "" ? [] : v.replace(/^["']|["']$/g, "");
    } else {
      const li = line.match(/^\s*-\s+(.*)$/);
      if (li && key && Array.isArray(fm[key])) fm[key].push(li[1].replace(/^["']|["']$/g, ""));
    }
  }
  // collapse single-item placeholders that were really scalars
  for (const k of Object.keys(fm)) if (Array.isArray(fm[k]) && fm[k].length === 0) fm[k] = "";
  return { fm, body: raw.slice(m[0].length) };
}

const firstHeading = body => (body.match(/^#\s+(.+)$/m) || [, ""])[1].trim();
function tableRow(body, label) {
  const re = new RegExp(`^\\|\\s*${label}\\s*\\|\\s*(.+?)\\s*\\|`, "m");
  const m = body.match(re);
  return m ? m[1].trim() : "";
}
// SKU cells are sometimes a "待補（…）" placeholder, or a real SKU with a Chinese
// annotation (Format B carry-on, e.g. "ACPro20-2X-MB-60kPa-Pump（Sheet 精確值）").
// Strip any trailing （…）/non-token tail, then keep only real SKU tokens.
const splitSkus = s => !s ? []
  : s.split(/[、,，;；]/)
      .map(x => x.trim().replace(/[（(].*$/, "").replace(/[^A-Za-z0-9\-_]+$/, ""))
      .filter(t => /^[A-Za-z0-9][\w-]+$/.test(t));
const clean = s => (s || "").replace(/[*_`]/g, "").replace(/^[\s（(]+|[\s）)]+$/g, "").trim();

// ---- Firestore REST value encoder --------------------------------------
function enc(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(enc) } };
  if (typeof v === "object") return { mapValue: { fields: encFields(v) } };
  return { stringValue: String(v) };
}
function encFields(obj) {
  const f = {};
  for (const [k, val] of Object.entries(obj)) if (val !== undefined) f[k] = enc(val);
  return f;
}

async function upsert(collection, docId, data) {
  if (!WRITE) return { dry: true };
  if (ADMIN) { await adminDb().doc(`${collection}/${docId}`).set(data); return { admin: true }; }
  const segs = [...collection.split("/"), docId].map(encodeURIComponent).join("/");
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${segs}?key=${API_KEY}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: encFields(data) }),
  });
  if (!res.ok) throw new Error(`${collection}/${docId} -> ${res.status} ${await res.text()}`);
  return res.json();
}

// Safety gate: the work layer (apps/superpm/*) holds supplier identities, costs and
// raw notes. Refuse to upload it while Firestore rules are still OPEN (public), since
// the API key is in the deployed page source. Probe = a keyed-but-unauthenticated
// write; if it succeeds, rules are `if true` (open) and we abort.
async function rulesAreOpen() {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/_ruleprobe/anon?key=${API_KEY}`;
  const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { t: { booleanValue: true } } }) });
  if (res.ok) { await fetch(url, { method: "DELETE" }).catch(() => {}); return true; }
  return false;
}

// ---- builders: file -> {collection, docId, data} ------------------------
const tasks = []; // {collection, docId, data}

// Sheet-ready per-SKU cells (Phase A 2026-11-16: Google Sheet becomes read-only, filled from Firestore by
// products_info/tools/apps-script/brain-to-sheet.gs). Derivation is NOT re-implemented here — sheet-rows.js reuses
// build-catalog.js + sync-master.js. Lint hit (money / internal code) => no `sheet` field at all this run (loud).
function loadSheetRows() {
  const mod = path.join(INFO, "tools", "sheet-rows.js");
  if (!fs.existsSync(mod)) return null;
  try {
    const r = require(mod).buildSheetRows();
    if (r.errors.length) {
      console.error(`⛔ sheet-rows lint 擋下 ${r.errors.length} 筆,本輪 product_docs 不附 sheet 欄:\n   ${r.errors.slice(0, 5).join("\n   ")}`);
      sheetLintFailed = true;
      return null;
    }
    return r.byFile;
  } catch (e) { console.error(`⚠️ sheet-rows 產生失敗(product_docs 不附 sheet 欄):${e.message}`); sheetLintFailed = true; return null; }
}
let sheetLintFailed = false;

function buildProductsInfo() {
  const sheetRows = loadSheetRows();
  for (const file of walk(path.join(INFO, "products"), isMd)) {
    const rel = path.relative(INFO, file);
    const raw = fs.readFileSync(file, "utf8");
    const { fm, body } = splitFrontmatter(raw);
    const base = path.basename(file);
    const category = path.basename(path.dirname(file)); // backpack | carry-on | travel-essentials

    if (base === "_LINEAGE.md") {
      tasks.push({ collection: "brand_docs", docId: "lineage", data: {
        name: "背包命名演進總覽 (_LINEAGE)", type: "lineage", text: raw,
        source: rel, app: "products_info", ts: NOW } });
      continue;
    }
    const formatA = /目前版本：MO/.test(body) || /目前版本：MO/.test(raw);
    // NOTE: routed to product_docs (NOT catalog). catalog/{SKU} is owned by the
    // Google Sheet sync and read by the live dashboard; this is the rich per-product
    // markdown source-of-truth (1 product = many SKUs/MOs), a different grain.
    tasks.push({ collection: "product_docs", docId: slugify(base), data: {
      name: firstHeading(body) || base.replace(/\.md$/, ""),
      category, // physical type folder
      format: formatA ? "A" : "B",
      // Format A labels the column "對應 SKU"; Format B carry-on uses "SKU".
      skus: splitSkus(tableRow(body, "對應 SKU") || tableRow(body, "SKU")),
      brand: tableRow(body, "品牌") || "Black Voyage",
      factory: tableRow(body, "工廠"),
      designer: tableRow(body, "設計師"),
      currentMO: (body.match(/目前版本：(MO\d+)/) || [, ""])[1],
      onSaleMO: clean((body.match(/在售版本：([^\n（(]+)/) || [, ""])[1]),
      text: raw, // full markdown so the LLM can quote it
      ...(sheetRows && sheetRows[base] ? { sheet: { products: sheetRows[base].products, specs: sheetRows[base].specs } } : {}),
      source: rel, app: "products_info", ts: NOW,
      ...(Object.keys(fm).length ? { frontmatter: fm } : {}),
    }});
  }
  // 五金輔料總覽 moved: products_info/hardware/ → products_info/reference/ (2026-07 固定產品事實統一).
  // Pinned to the one overview file — reference/ also holds non-hardware docs (SKU/退貨卡/容量方案).
  const hwOverview = path.join(INFO, "reference", "五金輔料總覽.md");
  for (const file of fs.existsSync(hwOverview) ? [hwOverview] : []) {
    const raw = fs.readFileSync(file, "utf8");
    // type:'overview' distinguishes this human-readable index from future
    // Sheet-synced part rows (type:'part') that share the hardware collection.
    tasks.push({ collection: "hardware", docId: slugify(path.basename(file)), data: {
      name: firstHeading(raw) || path.basename(file).replace(/\.md$/, ""),
      type: "overview", slug_en: "hardware-overview",
      text: raw, source: path.relative(INFO, file), app: "products_info", ts: NOW } });
  }
}

function pushAssist(subdir, collection, idFrom) {
  for (const file of walk(path.join(ASSIST, subdir), isMd)) {
    const raw = fs.readFileSync(file, "utf8");
    const { fm, body } = splitFrontmatter(raw);
    const base = path.basename(file);
    const docId = idFrom(fm, base);
    if (!docId) continue;
    // DATA-CONTRACT.md:15/44 — frontmatter `id` is the PERMANENT key and never changes on
    // rename/git mv, so id != filename is legal and the doc is keyed by id (2026-11-16 Phase A;
    // the old "id must equal filename" guard skipped 5 renamed files on every run).
    // What still corrupts data is two files claiming the same id in one collection — skip those.
    const dup = tasks.find(t => t.collection === collection && t.docId === docId);
    if (dup) {
      console.error(`SKIP ${collection}/${docId}: duplicate id — already used by ${dup.data.source} (fix vault frontmatter first)`);
      skipped.push({ file: file, id: docId, expected: `(與 ${dup.data.source} 重複)`, collection });
      continue;
    }
    tasks.push({ collection, docId, data: {
      name: fm.title || firstHeading(body) || base.replace(/\.md$/, ""),
      aliases: Array.isArray(fm.aliases) ? fm.aliases : (fm.aliases ? [fm.aliases] : []),
      id: fm.id || docId, filename_slug: slugify(base),
      category: fm.category || "", fabric: fm.fabric || "", size_label: fm.size_label || "",
      weight: fm.weight || "", mo: fm.mo || "", status: fm.status || "", owner: fm.owner || "",
      tags: Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []),
      text: raw, source: path.relative(ASSIST, file), app: "superpm", ts: NOW,
    }});
  }
}

function buildProductsAssistant() {
  pushAssist("1-Projects", "apps/superpm/launches", (fm, base) => fm.id || slugify(base));
  pushAssist("4-Archive", "apps/superpm/archive", (fm, base) => fm.id || slugify(base));
  pushAssist("2-Areas/suppliers", "apps/superpm/suppliers", (fm, base) => slugify(base));
  pushAssist("meetings", "apps/superpm/meetings", (fm, base) => slugify(base));
  // App-private reference, NOT the Sheet-owned top-level `materials` collection.
  // Source moved: products_assistant/3-Resources/materials/ → products_info/reference/
  // (2026-07 固定產品事實統一). Only the two materials docs — reference/ 的其他檔
  // (SKU規範/退貨卡/容量方案) 不屬 materials，暫不 ingest。
  for (const base of ["品牌共通規格.md", "受控料名清單.md"]) {
    const file = path.join(INFO, "reference", base);
    if (!fs.existsSync(file)) { console.error(`SKIP materials_reference: missing ${file}`); continue; }
    const raw = fs.readFileSync(file, "utf8");
    const { fm, body } = splitFrontmatter(raw);
    tasks.push({ collection: "apps/superpm/materials_reference", docId: slugify(base), data: {
      name: fm.title || firstHeading(body) || base.replace(/\.md$/, ""),
      aliases: Array.isArray(fm.aliases) ? fm.aliases : (fm.aliases ? [fm.aliases] : []),
      id: slugify(base),
      category: fm.category || "", fabric: fm.fabric || "", size_label: fm.size_label || "",
      weight: fm.weight || "", mo: fm.mo || "", status: fm.status || "", owner: fm.owner || "",
      tags: Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []),
      text: raw, source: path.relative(INFO, file), app: "superpm", ts: NOW,
    }});
  }
  // daily: doc id = the date filename (already YYYY-MM-DD)
  for (const file of walk(path.join(ASSIST, "daily"), isMd)) {
    const raw = fs.readFileSync(file, "utf8");
    tasks.push({ collection: "apps/superpm/daily", docId: path.basename(file).replace(/\.md$/, ""), data: {
      text: raw, source: path.relative(ASSIST, file), app: "superpm", ts: NOW } });
  }
}

// ---- prune (Phase 1: READ-ONLY listing, no deletion code exists) ---------
// Lists docs in ingest-managed collections that no longer have a matching md.
// Readers, tried in order (all GET-only): ① firebase-tools login (`firebase login`) via its apiv2 Client,
// ② Admin SDK (service account / gcloud ADC), ③ keyed REST without credentials (only collections the rules make public).
const FIREBASE_TOOLS_PKG = process.env.FIREBASE_TOOLS_PKG || "/opt/homebrew/lib/node_modules/firebase-tools/package.json";
function restDocsToRows(body) {
  return (body.documents || []).map(d => {
    const f = d.fields || {}, s = k => (f[k] && f[k].stringValue) || undefined;
    return { id: d.name.split("/").pop(), data: { app: s("app"), source: s("source"), type: s("type") } };
  });
}
async function restList(getPage, col) { // getPage(relUrl) -> parsed JSON body; paginates
  const rows = [];
  let token = "";
  do {
    const q = `pageSize=300&mask.fieldPaths=app&mask.fieldPaths=source&mask.fieldPaths=type${token ? `&pageToken=${encodeURIComponent(token)}` : ""}`;
    const body = await getPage(`/projects/${PROJECT_ID}/databases/(default)/documents/${col}?${q}`);
    rows.push(...restDocsToRows(body));
    token = body.nextPageToken;
  } while (token);
  return rows;
}
const PRUNE_READERS = [
  { label: "firebase-tools login", make() {
    const req = require("module").createRequire(FIREBASE_TOOLS_PKG);
    const { Client } = req("firebase-tools/lib/apiv2"), auth = req("firebase-tools/lib/auth");
    const acct = auth.getGlobalDefaultAccount();
    if (!acct) throw new Error("firebase-tools 沒有登入帳號");
    auth.setActiveAccount({}, acct);
    const c = new Client({ urlPrefix: "https://firestore.googleapis.com", apiVersion: "v1", auth: true });
    return col => restList(async u => (await c.get(u)).body, col);
  } },
  { label: "Admin SDK (service account / gcloud ADC)", make() {
    if (!ADMIN) throw new Error("找不到 service account 或 gcloud ADC");
    const db = adminDb();
    return async col => (await db.collection(col).select("app", "source", "type").get()).docs.map(d => ({ id: d.id, data: d.data() }));
  } },
  { label: "keyed REST, no credentials (public collections only)", make() {
    return col => restList(async u => {
      const res = await fetch(`https://firestore.googleapis.com/v1${u}&key=${API_KEY}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }, col);
  } },
];
async function pruneDryRun() {
  const expected = {};
  for (const t of tasks) (expected[t.collection] ||= new Set()).add(t.docId);
  const cols = ["product_docs", "hardware", "brand_docs",
    "apps/superpm/launches", "apps/superpm/archive", "apps/superpm/suppliers", "apps/superpm/meetings",
    "apps/superpm/materials_reference", "apps/superpm/daily"];
  // pick the first reader whose credentials work (probe = list product_docs)
  let list = null, used = null;
  for (const r of PRUNE_READERS) {
    try { const fn = r.make(); await fn("product_docs"); list = fn; used = r.label; break; }
    catch (e) { console.error(`(prune 讀取方式「${r.label}」不可用:${String(e.details || e.message).split("\n")[0].slice(0, 160)})`); }
  }
  if (!list) { console.error("⛔ 三種讀取方式都失敗。請自行在終端機執行:firebase login --reauth"); process.exitCode = 1; return; }
  console.log(`Project: ${PROJECT_ID}   Mode: PRUNE DRY-RUN (read-only, nothing deleted)   Reader: ${used}\n`);
  let total = 0, foreign = 0;
  const unreadable = [];
  for (const col of cols) {
    let docs;
    try { docs = await list(col); } // read-only
    catch (e) { unreadable.push(`${col}(${String(e.details || e.message).split("\n")[0].slice(0, 80)})`); continue; }
    const have = expected[col] || new Set();
    const orphans = [];
    for (const d of docs) {
      if (have.has(d.id)) continue;
      const x = d.data;
      if (x.app !== "products_info" && x.app !== "superpm") { foreign++; continue; } // not written by this ingest (e.g. Sheet-synced rows)
      let reason;
      if (x.source) {
        const base = (col.startsWith("apps/superpm/") && col !== "apps/superpm/materials_reference") ? ASSIST : INFO;
        reason = fs.existsSync(path.join(base, x.source))
          ? `source 檔仍在(${x.source}),但現行 docId 規則不再產生此 id(id/檔名變更或被 id≠檔名規則跳過)`
          : `md 已改名/刪除(原 source: ${x.source})`;
      } else reason = "無 source 欄,無法推測";
      orphans.push({ id: d.id, reason });
    }
    console.log(`[${col}]  Firestore ${docs.length} 筆 / md 對應 ${have.size} 筆 / 孤兒 ${orphans.length}`);
    for (const o of orphans) console.log(`    ${o.id}  <- ${o.reason}`);
    total += orphans.length;
  }
  if (foreign) console.log(`\n(另有 ${foreign} 筆非本 ingest 寫入的文件(無 app 標記),已排除)`);
  if (unreadable.length) console.log(`\n⚠️ 讀不到(未檢查):${unreadable.join("、")}——用目前讀取方式無權限;firebase login --reauth 後重跑可補齊`);
  console.log(`\nTOTAL orphans: ${total} (只列不刪)`);
}

// ---- run ----------------------------------------------------------------
(async () => {
  if (SCOPE === "info" || SCOPE === "all") buildProductsInfo();
  if (SCOPE === "assistant" || SCOPE === "all") buildProductsAssistant();

  if (PRUNE) {
    try { await pruneDryRun(); }
    catch (e) {
      console.error(`⛔ prune 讀取 Firestore 失敗:${String(e.details || e.message).slice(0, 200)}\n   若是憑證過期,請自行在終端機執行:firebase login --reauth`);
      process.exitCode = 1;
    }
    return;
  } // diverts before any write path; zero writes

  // group summary
  const byCol = {};
  for (const t of tasks) (byCol[t.collection] ||= []).push(t.docId);

  if (DUMP) {
    fs.writeFileSync(DUMP, JSON.stringify(tasks.filter(t => t.collection === "product_docs" || t.collection.startsWith("apps/superpm/launches"))
      .map(t => ({ collection: t.collection, docId: t.docId, data: { ...t.data, text: undefined } })), null, 1));
    console.log(`DUMP → ${DUMP}(本機檔,未連 Firestore)`);
    if (!WRITE) return;
  }

  if (SAMPLE) {
    const seen = new Set();
    for (const t of tasks) {
      if (seen.has(t.collection)) continue;
      seen.add(t.collection);
      console.log(`\n# ${t.collection}/${t.docId}`);
      console.log(JSON.stringify({ fields: encFields(t.data) }, null, 2).slice(0, 1200));
    }
    return;
  }

  const authLabel = SA_PATH ? "Admin SDK (service account)" : HAS_ADC ? "Admin SDK (gcloud ADC)" : "REST apiKey";
  console.log(`Project: ${PROJECT_ID}   Mode: ${WRITE ? "WRITE" : "DRY RUN"}   Auth: ${authLabel}   Scope: ${SCOPE}\n`);
  for (const col of Object.keys(byCol).sort()) {
    console.log(`  ${col.padEnd(26)} ${byCol[col].length} docs`);
  }
  console.log(`  ${"".padEnd(26)} ── ${tasks.length} total`);
  const withSheet = tasks.filter(t => t.data.sheet).length;
  if (SCOPE !== "assistant") console.log(`  product_docs 附 sheet 欄(Sheet 唯讀填寫用):${withSheet} 筆${sheetLintFailed ? "  ⛔ lint/產生失敗,見 stderr" : ""}\n`);
  else console.log("");

  if (!WRITE) { console.log("DRY RUN — nothing written. Re-run with --write to upload."); return; }

  // Writing to the locked Core requires the Admin SDK — fail fast with guidance if the key is missing.
  if (PROJECT_ID === "bv-second-brain" && !ADMIN) {
    console.error("⛔ Target is the locked Core (bv-second-brain) but no admin credential was found.\n   Either: `gcloud auth application-default login` (no key needed), or drop a service-account.json in ingest/. Then re-run.");
    process.exit(1);
  }

  // Block any work-layer upload while the database is publicly writable (REST/open path only).
  const touchesWorkLayer = tasks.some(t => t.collection.startsWith("apps/superpm/"));
  if (touchesWorkLayer && !ADMIN && await rulesAreOpen()) {
    console.error("\n⛔ ABORT: Firestore rules are still OPEN (public read/write) and the API key is in the\n   deployed dashboard's page source. Refusing to upload the products_assistant work layer\n   (supplier identities, costs, daily logs) to a publicly-readable database.\n   → Lock down Firebase Auth + tighten rules first (see prerequisites), then re-run.");
    process.exit(1);
  }

  let ok = 0, fail = 0;
  for (const t of tasks) {
    try { await upsert(t.collection, t.docId, t.data); ok++; } // note: set() replaces the doc → a lint-blocked run drops `sheet` until next clean run
    catch (e) { fail++; console.error("FAIL", e.message); }
  }
  console.log(`\nDone. ${ok} written, ${fail} failed.`);
})();
