# 流程總表 — FLOW MASTER（可編輯的單一真實來源）

> 這份文件是「整個上市流程」的設計稿。你在這裡重新排順序、加 / 刪任務、調整平行或循序、改工期；
> 確認後由我（Claude）同步回 `index.html` 的程式碼，**不需要你手動改那個 65 萬字的檔案**。
>
> 目前狀態：**已套用你確認的新順序** → 概念 → 開發 → 生產 → **上架建立** → **內容** → 上線 → 行銷。
> （文件先反映新順序；程式碼尚未改動，等你看完這份、決定下面的「待決策點」後我再一次改好。）

---

## 一、先搞懂三條規則（這決定什麼能平行、什麼要排隊）

整個系統的「鎖定 / 開放」只有三條規則（程式在 `index.html:866-878` 的 `nodeLocked`）：

1. **`Form (intake) 產品需求表` 是總根。** 它沒打勾前,**所有任務全部鎖住**。
2. **同一個「部門 lane」內 = 嚴格循序。** 同一部門的上一步沒完成,下一步不開放。
3. **不同部門 lane 之間 = 平行。** 各部門各走各的鏈,彼此不互鎖;只受「卡片目前在哪個階段」這個天花板限制（還沒進到的階段,該階段的任務一律鎖住）。

→ 換句話說:**「平行」= 把任務放進不同的部門 lane;「循序」= 放進同一個 lane 的前後位置。**
這就是你說的「前一個做完才開放（lane 內）」與「有些平行開放（跨 lane）」。

階段怎麼往前推:一個階段的**所有 exit criteria（出場條件，就是該階段每一格任務）都打勾**,卡片才能推進到下一階段。`◆` = 需要 Ben 拍板的決策關卡。

---

## 二、階段總覽（新順序）

| # | 階段 | 英文 key | 預設工期 | 主要部門（有出場條件的） | ◆ Ben 關卡 |
|---|------|----------|---------|--------------------------|-----------|
| 1 | 概念 | Concept | 21 天 | Product、Design | ✔ 概念定稿 |
| 2 | 開發 | Build | 35 天 | Product、Design | ✔ 驗證 |
| 3 | 生產 | Production | 45 天 | Product、Marketing、Logistics | — |
| 4 | **上架建立** | Listing creation | 14 天 | Catalog、Logistics、Design | ✔ 品牌語言 |
| 5 | **內容** | Content | 21 天 | Content、Design | — |
| 6 | 上線 | Live | 10 天 | Catalog、Design、Logistics、Marketing | — |
| 7 | 行銷 | Marketing | 30 天 | Marketing、Social、Ads、Email、CRM | ✔ KOL 成效評估 |

> 工期可改（程式裡的 `PLAN`）。想改哪個階段幾天,直接在這表上改數字。

---

## 三、每階段的任務（依「部門 lane」分組）

格式：`英文 task key　—　中文顯示名　[擁有部門]　(標記)`
標記：`◆`＝Ben 決策關卡、`根`＝總根、`▷sub`＝節點底下的子項目。
同一部門下方的清單由上而下 = 循序;不同部門的區塊彼此 = 平行。

### 階段 1 — 概念 Concept（21 天）

**Product 產品**（循序）
1. `Form (intake)` — 產品需求表　**根**
2. `Understand WHY` — 概念轉化
3. `Market research` — 市場調查　▷sub: `Competitor analysis 競品分析` · `Product strengths 產品優點`
4. `Concept definition` — 整合概念（建立概念定義文件）
5. `Concept brainstorming meeting` — 腦力激盪（Figma）
6. `Product info confirmed` — 產品資訊（spec · look · material · price）
7. `Concept definition doc finalized` — 規格確認（概念定義書定稿）
8. `Ben concept sign-off ◆` — Ben 確認想法定稿　**◆**

**Design 設計**（與 Product 平行）
- `Visual concept confirmed` — 視覺設計（外觀 · 顏色 · 材料）

### 階段 2 — 開發 Build（35 天）

**Product 產品**（接續概念的 Product lane）
9. `Prototype 1-2-3 approved` — 原型打樣 1-2-3 + 測試
10. `Ben validation ◆` — Ben 驗證　**◆**
11. `Costing & profit signed off` — 成本與利潤

**Design 設計**（接續）
- `Packaging / insert / manual locked` — 包裝 · 插卡 · 說明書
- `Model name set` — 型號名稱

### 階段 3 — 生產 Production（45 天）

**Product 產品**（接續）
12. `Design freeze` — 設計凍結　← 觸發行銷簡報初稿 + 物流部署
13. `Pre-production sample approved + BOM` — 產前樣 + BOM → Ben
14. `Mass production complete` — 大貨生產完成　← 觸發物流規劃 / 運輸 / 出貨標籤

**Marketing 行銷**（平行）
- `Marketing brief rough draft` — 行銷簡報初稿

**Logistics 物流**（平行，循序）
1. `Deploy marketing samples` — 部署行銷樣品
2. `Master order sheet updated` — 更新主訂單表
3. `Logistics planning done` — 物流規劃
4. `Logistics sheet updated` — 更新物流表
5. `Dispatch details & tracking filed` — 出貨與追蹤
6. `Freight booked (sea + air samples)` — 運輸：海運大貨 + 空運樣品

### 階段 4 — 上架建立 Listing creation（14 天）〔新位置：生產之後〕

**Catalog 商品目錄**（循序）
1. `Amazon SKU created` — Amazon SKU 建立
2. `Shopify SKU created` — Shopify SKU 建立
3. `Shipbob SKU created` — Shipbob SKU 建立
4. `Next Smart Ship SKU created` — Next Smart Ship SKU 建立
5. `All ASINs sheet updated` — All ASINs 表更新
6. `Ops sheet updated` — Ops 表更新
7. `Shopify COGS sheet updated` — Shopify COGS 表更新
8. `Product data filed → marketing brief` — 產品資料建檔 → 簡報　← 觸發行銷簡報定稿
9. `Brand language confirmed ◆` — 品牌語言確認　**◆**

**Logistics 物流**（接續生產的 Logistics lane）
7. `Shipping labels created (Amazon + Shipbob)` — 出貨標籤
8. `Labels handed to manufacturer / carriers` — 標籤交付工廠 · 安排承運 · 發往美國

**Design 設計**（接續）　⚠️ 見「待決策點 B」
- `Listing imagery / A+ uploaded` — 上架圖片 / A+ 上傳　← 觸發上架正式發佈

### 階段 5 — 內容 Content（21 天）〔新位置：上架建立之後〕

**Content 內容**（循序）
1. `Pre-production complete` — 前期製作
2. `Hero / lifestyle shoot done` — 主圖 / 生活照拍攝　← **需要實體產品**
3. `Post-production done` — 後製
4. `Content exported (...)` — 內容輸出：教學 · 生活 · 社群 · 廣告　← 觸發社群貼文 / A+ 素材 / 廣告後製

**Design 設計**（接續）　⚠️ 見「待決策點 A／B」
- `A+ / infographic assets ready` — A+ / 資訊圖素材

### 階段 6 — 上線 Live（10 天）

**Catalog 商品目錄**（接續）
- `Listings published live (Amazon + Shopify)` — 上架正式發佈

**Design 設計**（接續）
- `Amazon store / posts updated` — 更新 Amazon 商店 / 貼文

**Logistics 物流**（接續）
9. `Amazon pickup / shipped to Shipbob` — Amazon 提貨 / 送往 Shipbob
10. `Inventory received (Amazon + Shipbob)` — 監控庫存入庫

**Marketing 行銷**（接續）
- `Marketing brief finalized & ready` — 行銷簡報定稿　← 解鎖 KOL / 行銷引擎

### 階段 7 — 行銷 Marketing（30 天）

**Marketing 行銷**（循序）
- `Marketing brief v2 ready` — 行銷簡報 v2
- `KOL / influencer projects live` — KOL 專案（MOAT · ASMR · Cinematic · Authority · Reach · Seed · UGC · Pro）
- `KOL ideation / sourcing` — 發想 → 尋找網紅 / 收到 DM
- `KOL negotiation → payment` — 議約 → 寄送 → 影片上線 → 付款
- `KOL evaluation done (Ben + Marketing) ◆` — 評估（Ben + 行銷）　**◆**
- `Usage rights / archive` — 使用權 → 長期合作 / 歸檔

**Social 社群**（平行）
- `Channel posts live (IG / YouTube / TikTok)` — 社群貼文

**Ads 廣告**（平行，循序）
1. `Ad post-production (if needed)` — 後製（如需要）
2. `Partnerships approved` — 合作批准
3. `Launch ads running` — 投放廣告

**Email 電郵**（平行）
- `Launch email sequence sent` — 上市郵件序列

**CRM 客戶關係**（平行）
- `Influencer DM → email pipeline set` — 網紅 DM → 郵件流程

---

## 四、各部門的「完整循序鏈」（跨階段看一個部門的 pipeline）

這是「規則 2」的真正樣貌 —— 一個部門 lane 是**一條從頭到尾的鏈**,跨多個階段。
鏈內的箭頭 = 必須照順序解鎖。看這個最容易抓出「順序矛盾」。

- **Product 產品**：需求表 → WHY → 市調 → 整合概念 → 腦力激盪 → 產品資訊 → 規格確認 → Ben 定稿◆ → 原型打樣 → Ben 驗證◆ → 成本利潤 → 設計凍結 → 產前樣+BOM → 大貨生產
- **Design 設計**：視覺設計 → 包裝/插卡/說明書 → 型號名稱 → **〔此處有矛盾，見待決策點 A〕** A+ 上傳（上架階段） / A+ 素材（內容階段） → 更新商店/貼文
- **Catalog 目錄**：Amazon SKU → Shopify SKU → Shipbob SKU → Next Smart Ship SKU → All ASINs → Ops 表 → COGS 表 → 產品資料建檔 → 品牌語言◆ → 上架正式發佈
- **Content 內容**：前期製作 → 主圖/生活照拍攝 → 後製 → 內容輸出
- **Logistics 物流**：部署行銷樣品 → 主訂單表 → 物流規劃 → 物流表 → 出貨追蹤 → 運輸 → 出貨標籤 → 標籤交付 → Amazon 提貨 → 庫存入庫
- **Marketing 行銷**：簡報初稿（生產）→ 簡報定稿（上線）→ 簡報 v2 → KOL 專案 → 發想 → 議約 → 評估◆ → 使用權
- **Social**：社群貼文　**Ads**：後製 → 合作批准 → 投放　**Email**：上市郵件　**CRM**：網紅 DM → 郵件流程

---

## 五、跨部門依賴 / 交接（誰做完會「點亮」誰）

這些是 lane 與 lane 之間的關鍵交棒（程式裡的 `XROUTES`，用名稱比對、可靠）：

| 來源（做完） | 觸發 / 需通知 |
|--------------|----------------|
| Product 整合概念（建立概念定義文件）| Design 視覺設計（Visual concept confirmed）|
| Product Ben 驗證 ◆ | Design 包裝 / 插卡 / 說明書、Design 型號名稱 |
| Design 型號名稱 | Catalog 品牌語言確認 |
| Product 設計凍結 | Marketing 簡報初稿、Logistics 部署行銷樣品 |
| Marketing 簡報初稿 | Logistics 部署行銷樣品 |
| Product 大貨生產 | Logistics 物流規劃 · 運輸 · 出貨標籤 |
| Catalog Shipbob / Next Smart Ship SKU | Logistics 出貨標籤 |
| Catalog 產品資料建檔 | Marketing 簡報定稿 |
| **Content 內容輸出** | **Social 社群貼文、Design A+ 素材、Ads 後製** |
| **Design A+ 上傳** | **Catalog 上架正式發佈** |
| Logistics 庫存入庫 | Catalog 上架正式發佈 |
| Catalog 上架正式發佈 | Marketing 簡報 v2、KOL 專案 |
| Marketing 簡報定稿 | KOL 專案、Ads 後製、Email 上市郵件 |

> 注意這條真實的內容鏈：**內容輸出 → A+ 素材 → A+ 上傳 → 上架正式發佈**。
> 這正是下面「待決策點 B」要處理的核心。

---

## 六、⚠️ 重新排序後浮現的「待決策點」（這幾個要你拍板，我才知道怎麼接）

### A. Design 設計 lane 會「卡死」—— 必須處理（不是選配）

Design lane 目前的鏈是：… → `A+ 素材（內容階段）` → `A+ 上傳（上架階段）` → …
但新順序把「內容」排到「上架」**之後**。於是當卡片走到「上架建立」階段時：
- 想做 `A+ 上傳`（上架階段，允許），卻被規則 2 擋住 —— 它的 lane 前置是 `A+ 素材`,
- 而 `A+ 素材`屬於「內容」(現在是更後面的階段),被天花板鎖住、無法完成,
- → `A+ 上傳`永遠解不開 → **卡片卡死在上架建立階段,推不動。**

> ✅ 其他橫跨「上架 ↔ 內容」的 lane 都安全:Catalog（全部上架 → 上線,3→5 遞增）、Logistics（生產 → 上架 → 上線,2→3→5 遞增）都沒有逆序。**只有 Design** 這條因為把「內容」的 `A+ 素材` 排在「上架」的 `A+ 上傳` 之前才會卡。

**這必須修。** 兩個方向（選一個）：
- **A1（單純）**：把 `A+ 上傳` 在 Design lane 裡移到 `A+ 素材` **前面**。系統就不卡了。
  但邏輯上怪：你還沒做素材就先「上傳」。
- **A2（正解，配合 B）**：把 `A+ 上傳` 直接搬到「內容」階段、放在 `A+ 素材` 之後。
  （見 B。這才符合真實依賴。）

### B. 「上架建立」其實要拆成兩半 —— 建議

你的洞察是對的：上架的**資料 / 帳務部分**（各平台 SKU、各種表、出貨標籤、品牌語言）**不需要照片**,
所以可以在大貨生產期間就平行開跑。但上架的**圖片部分**（`A+ 上傳`、商店視覺）**需要照片 / A+ 素材**,
而那要等「內容」階段（攝影、後製）完成。第五節的依賴鏈 `內容輸出 → A+ 素材 → A+ 上傳 → 上架發佈` 也證明了這點。

**建議**：把「上架建立」階段保留在生產之後（放資料 / SKU / 標籤類），
把 `A+ 上傳`（以及視需要的 `上架正式發佈`）移到「內容」之後再做。
→ 想清楚一個關鍵問題：**「上架正式發佈（Listings published LIVE）」要在『有圖之前』還是『有圖之後』?**
   若必須有圖才發佈 → 它應該在內容之後（甚至屬於「上線」階段，目前正是如此）。

### C. 行銷規劃 / 簡報的時點 —— 確認

你提到「拿到產品後才開始行銷規劃」。目前行銷簡報散在三處：
`簡報初稿（生產）` → `簡報定稿（上線）` → `簡報 v2（行銷）`。
若你要「行銷規劃要等產品到手後」,可考慮把「簡報初稿」從生產往後移到「內容」階段。
（這個純粹是要不要移，影響不大，給你決定。）

### D. 工期是否要調 —— 選配

新順序的工期目前沿用舊值（上架 14 天、內容 21 天）。若實務上順序變了、天數也要變，告訴我數字即可。

---

## 七、這些東西在程式碼的哪裡（給你 / 給我同步用）

全部集中在單一檔案 **`index.html`** 的這幾個 const（不建議你直接手改，交給我）：

| 區塊 | 行數 | 管什麼 |
|------|------|--------|
| `STAGES` | 676 | 七大階段的**順序**（改順序只動這一行；不會被雲端快照覆寫，最安全） |
| `GATES` | 677-685 | 每階段的出場條件（任務清單、擁有部門、◆） |
| `FLOW` | 690-759 | 流程圖：部門 lane + lane 內順序 + 子項目 + 連到哪個任務 |
| `XROUTES` | 765-783 | 跨部門依賴 / 交接（名稱比對） |
| `CROSS` | 791-793 | 流程圖上的跨欄箭頭（**用 index，動 lane 順序時要一起修**） |
| `PLAN` | 796 | 各階段預設工期（天） |
| 中文對照 `ZH` | ~1700-1880 | 任務 / gate / 階段的中文 |
| 流程圖中文 `FLOWZH` | 2335-2372 | 流程圖節點的中文（與 ZH 分開） |

**重要的快照陷阱**：`GATES` / `FLOW` / `XROUTES` 會被存進雲端快照,光改程式碼會在載入時被舊快照覆寫 ——
所以這幾項的任何改動,我都要寫一段「idempotent migration」幫既有看板的卡片一起搬遷（已有 4 段同模式的範例）。
**只有 `STAGES`（階段順序）和 `PLAN`（工期）不在快照裡,改了立即生效、零遷移。**

### 我建議的協作方式
1. 你在**這份 `FLOW-MASTER.md`** 上直接改（搬順序、加 / 刪任務、調平行 / 循序、改工期、回答第六節的決策點）。
2. 改完跟我說一聲,我把差異翻譯成 `index.html` 的程式碼 + 必要的 migration，並用 headless 渲染檢查後給你。
3. 這樣你永遠面對的是這份好讀的中文表，不用碰那個 65 萬字的 HTML。
