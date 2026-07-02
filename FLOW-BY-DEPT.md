# 各部門流程 — FLOW BY DEPARTMENT（逐部門編輯稿）

> **用途**：先把「每個部門自己的流程」一條一條定好。同一部門 = 由上而下**循序**（前一步做完才開放下一步）。
> 跨部門的**平行銜接**這階段先不用管，等各部門流程都更新好，再回到 [FLOW-MASTER.md](FLOW-MASTER.md) 第五節處理。
>
> **怎麼編輯**：在每個部門底下直接搬動 / 增加 / 刪除步驟。每行格式：
> &nbsp;&nbsp;`順序. 中文名 ｜ English key ｜ [階段] ｜ 標記`
> **標記**：`◆`＝需要 Ben 拍板、`根`＝整個流程的總起點、`▷`＝該步驟底下的子項目、`⚠️`＝目前有順序問題待處理。
> （`English key` 是我同步回程式時用的識別碼，改中文名沒關係，但這個英文盡量別動；要新增步驟就寫中文、英文留空，我來補。）
>
> **階段**目前共 7 個（新順序）：概念 → 開發 → 生產 → 上架建立 → 內容 → 上線 → 行銷。
> 你不只能改部門內順序，也能把某步驟改到別的階段——直接改 `[階段]` 即可。

**部門清單（共 10 個）**：Product 產品 ｜ Design 設計 ｜ Catalog 商品目錄 ｜ Logistics 物流 ｜ Content 內容 ｜ Marketing 行銷 ｜ Social 社群 ｜ Ads 廣告 ｜ Email 電郵 ｜ CRM 客戶關係

---

## 1. Product 產品
> 職責：產品本身 — 需求表、市場調查、概念、原型、成本、設計凍結、產前樣 + BOM、大貨生產。

1. 產品需求表 ｜ Form (intake) ｜ [概念] ｜ 根
2. 概念轉化 ｜ Understand WHY ｜ [概念]
3. 市場調查 ｜ Market research ｜ [概念] ｜ ▷ 競品分析 Competitor analysis · 產品優點 Product strengths
4. 整合概念（建立概念定義文件）｜ Create concept definition document ｜ [概念]
5. 腦力激盪（Figma）｜ Concept brainstorming meeting ｜ [概念]
6. 產品資訊（spec · look · material · price）｜ Product info ｜ [概念]
7. 規格確認（概念定義書定稿）｜ Concept definition doc FINAL ｜ [概念]
8. Ben 確認想法定稿 ｜ Ben confirms concept ｜ [概念] ｜ ◆
9. 原型打樣 1-2-3 + 測試 ｜ Prototyping 1-2-3 + testing ｜ [開發]
10. Ben 驗證 ｜ Ben validation ｜ [開發] ｜ ◆
11. 成本與利潤 ｜ Costing & profit ｜ [開發]
12. 設計凍結 ｜ Design freeze ｜ [生產]
13. 產前樣 + BOM → Ben ｜ Pre-prod sample + BOM ｜ [生產]
14. 大貨生產 ｜ Mass production ｜ [生產]

---

## 2. Design 設計
> 職責：包裝 / 插卡 / 說明書、型號名稱、資訊圖 & A+ 素材、上架圖片、Amazon 商店視覺。

1. 視覺設計（外觀 · 顏色 · 材料）｜ Concept: look · color · material ｜ [概念]
2. 包裝設計（包裝 · 插卡 · 說明書）｜ Packaging · insert · manual ｜ [開發]
3. 型號名稱 ｜ Model name ｜ [開發]
4. A+ 素材（資訊圖 / A+）｜ Infographic / A+ assets ｜ [內容] ｜ ⚠️
5. A+ 上傳（上架圖片 / A+）｜ Listing imagery / A+ upload ｜ [上架建立] ｜ ⚠️
6. 更新 Amazon 商店 / 貼文 ｜ Update Amazon store / posts ｜ [上線]

> ⚠️ **這條 lane 目前有順序問題（要你決定）**：第 4 步「A+ 素材」屬於**內容**階段，卻排在第 5 步「A+ 上傳」（**上架建立**階段）前面。新順序裡「內容」在「上架建立」**之後**，所以照現狀會卡死（A+ 上傳永遠等不到它的前一步）。
> 真實邏輯：要先有 **A+ 素材**（需要照片 / 攝影 → 內容階段）才能**上傳**。
> 建議改法：把第 5 步「A+ 上傳」搬到「內容」階段、放在「A+ 素材」**之後**（即 4↔5 對調且都歸內容）。你決定後我來改。

---

## 3. Catalog 商品目錄
> 職責：Amazon & Shopify SKU 建立、Ops 表、產品資料建檔、上架正式發佈。

1. Amazon SKU 建立 ｜ Amazon SKU creation ｜ [上架建立]
2. Shopify SKU 建立 ｜ Shopify SKU creation ｜ [上架建立]
3. Shipbob SKU 建立 ｜ Shipbob SKU creation ｜ [上架建立]
4. Next Smart Ship SKU 建立 ｜ Next Smart Ship SKU ｜ [上架建立]
5. All ASINs 表更新 ｜ All ASINs sheet update ｜ [上架建立]
6. Ops 表更新 ｜ Ops sheet update ｜ [上架建立]
7. Shopify COGS 表更新 ｜ Shopify COGS sheet update ｜ [上架建立]
8. 產品資料建檔 → 簡報 ｜ Product data filed → brief ｜ [上架建立]
9. 品牌語言確認 ｜ Brand language confirmed ｜ [上架建立] ｜ ◆
10. 上架正式發佈 ｜ Listings published LIVE ｜ [上線]

---

## 4. Logistics 物流
> 職責：運輸（海運大貨 + 空運樣品）、倉儲就緒、出貨標籤與追蹤。

1. 部署行銷樣品 ｜ Deploy marketing samples ｜ [生產]
2. 更新主訂單表 ｜ Update master order sheet ｜ [生產]
3. 物流規劃 ｜ Logistics planning ｜ [生產]
4. 更新物流表 ｜ Update logistics sheet ｜ [生產]
5. 出貨與追蹤 ｜ Dispatch details & tracking ｜ [生產]
6. 運輸：海運大貨 + 空運樣品 ｜ Freight: sea bulk + air samples ｜ [生產]
7. 出貨標籤（Amazon + Shipbob）｜ Shipping labels: Amazon + Shipbob ｜ [上架建立]
8. 標籤交付工廠 · 安排承運 · 發往美國 ｜ Labels → manufacturer · carriers · send to USA ｜ [上架建立]
9. Amazon 提貨 / 送往 Shipbob ｜ Amazon pickup / ship to Shipbob ｜ [上線]
10. 監控庫存入庫 ｜ Monitor inventory receiving ｜ [上線]

---

## 5. Content 內容
> 職責：前期製作、主圖 / 生活照拍攝、後製、內容輸出（教學 · 生活 · 社群短片）。

1. 前期製作 ｜ Pre-production ｜ [內容]
2. 主圖 / 生活照拍攝 ｜ Hero / lifestyle shoot ｜ [內容]　← 需要實體產品
3. 後製 ｜ Post-production ｜ [內容]
4. 內容輸出：教學 · 生活 · 社群 · 廣告 ｜ Content export ｜ [內容]

---

## 6. Marketing 行銷
> 職責：產品行銷簡報、KOL / 網紅引擎（MOAT · ASMR · Cinematic · Authority · Reach · Seed · UGC · Pro）、成效評估循環。

1. 簡報初稿 ｜ Marketing brief rough draft ｜ [生產]
2. 簡報定稿 ｜ Marketing brief finalized ｜ [上線]
3. 行銷簡報 v2 ｜ Marketing brief v2 ｜ [行銷]
4. KOL 專案 ｜ KOL projects ｜ [行銷]
5. 發想 → 尋找網紅 / 收到 DM ｜ Ideation → Sourcing / DM received ｜ [行銷]
6. 議約 → 寄送 → 影片上線 → 付款 ｜ Negotiation → Shipping → Video live → Payment ｜ [行銷]
7. 評估（Ben + 行銷）｜ Evaluation (Ben + Marketing) ｜ [行銷] ｜ ◆
8. 使用權 → 長期合作 / 歸檔 ｜ Usage rights → long-term / archive ｜ [行銷]

---

## 7. Social 社群
> 職責：社群通路貼文 — IG / YouTube / TikTok。

1. 社群貼文 ｜ IG / YouTube / TikTok posts ｜ [行銷]

---

## 8. Ads 廣告
> 職責：廣告後製、合作批准、付費投放。

1. 後製（如需要）｜ Post-production (if needed) ｜ [行銷]
2. 合作批准 ｜ Partnerships approval ｜ [行銷]
3. 投放廣告 ｜ Post ad ｜ [行銷]

---

## 9. Email 電郵
> 職責：上市與活動的郵件序列。

1. 上市郵件序列 ｜ Launch email sequence ｜ [行銷]

---

## 10. CRM 客戶關係
> 職責：網紅 DM 導流 → 郵件流程、關係記錄。

1. 網紅 DM → 郵件流程 ｜ Influencer DMs → email pipeline ｜ [行銷]

---

### 更新完成後
各部門流程都調整好，跟我說一聲，我會：
1. 把你的改動同步回 `index.html`（`FLOW` 各 lane + 對應 `GATES`）。
2. 處理你決定的 Design lane 順序問題（第 2 節 ⚠️）。
3. 接著我們再回 [FLOW-MASTER.md](FLOW-MASTER.md) 第五節，更新跨部門的平行銜接。
