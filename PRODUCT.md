# Product

## Register

product

## Users

Black Voyage 的內部團隊 —— 產品經理、各部門主管與成員（橫跨 10 條部門 lane）。他們在「正在跑的產品上市專案」這個工作脈絡中使用本工具：追蹤每個 launch 走到哪一個 gated stage、誰是該步驟的 DRI、卡在哪、距離 SLA 還有多久。多為桌機、辦公室光線下的高頻使用；同一畫面常被反覆掃讀，需要快速定位狀態而非閱讀。中英雙語切換（真實 EN | 繁體中文），明暗主題並存。

## Product Purpose

Black Voyage Product Tracker（SuperPM）是產品上市流程的**單一真相儀表板**：7 個 gated stages、10 條部門 lane、master flow chart（Workflow v2，含跨部門 routing）、時程與 burn-up 圖、進度 chat、autopilot / SLA 計時 / health score。它存在的理由是消滅「現在到底卡在哪、誰該動、何時會延」這種反覆對焦的成本。成功的樣子：團隊成員打開就能在數秒內定位任一 launch 的狀態與下一步，不需要問人、不需要翻訊息。

## Brand Personality

承載 Black Voyage 的品牌精髓 **「Precision Liberation」（精準 × 解放）** 與 slogan **「Travel Without Limits」**，但以**內部工具的紀律**表達 —— 這是一個「Mission Control（任務控制台）」式的介面，不是行銷頁。

- **三詞個性**：精準（precise）、結構化（structural）、有方向感（directional）。
- **語氣**：專業、克制、可信。中文用「您」、不浮誇；英文 premium、主動語態、短句。允許 expedition / 太空語彙（座標、TRAVEL WITHOUT LIMITS）作為品牌簽名，但不喧賓奪主、不犧牲可讀性。
- **情緒目標**：掌控感與信任。打開像走進任務控制台 —— 黑底為無限的可能、橘色是「該行動了」的信號，一切井然有序。

## Anti-references

- **消費級可愛風**：圓潤插畫、活潑配色、emoji 過量、玩具感 —— 與 premium / 技術定位相斥。
- **通用 SaaS / Bootstrap 後台**：圓角藍、千篇一律的卡片網格、icon＋標題＋內文無限重複堆疊、模板感。
- 延伸自品牌指南的底線：不是 fast-fashion luggage、不是花俏噱頭 —— 介面同理，不靠裝飾博眼球。
- 共通禁區（亦見 DESIGN.md）：gradient text、裝飾性 glassmorphism、side-stripe 邊框、每段都來一個 uppercase eyebrow、hero-metric 模板。

## Design Principles

1. **工具消失在任務裡（The tool disappears into the task）** —— familiarity 是優點。狀態定位優先於視覺表演；密度與一致性服務反覆掃讀的使用者。
2. **精準即美學（Precision is the aesthetic）** —— 品牌的「clean geometry、矩形與細線」直譯成介面：銳利 2px 圓角、細 1px 分隔線、mono 大寫標籤建立結構。對齊與節奏即是裝飾。
3. **橘色是信號，不是裝飾（Orange signals, never decorates）** —— 強調色只用於主要動作、目前選取、狀態指示；黑與灰階承載其餘一切。inactive 狀態不上飽和色。
4. **每個狀態都要說話（Every state speaks）** —— default / hover / focus / active / disabled / loading（skeleton 而非 spinner）/ empty（教學而非空白）/ error 一個都不能少；狀態語彙全站一致。
5. **品牌作為簽名，而非佈景（Brand as signature, not scenery）** —— Mission Control 語彙（座標、Travel Without Limits、Vortex™ 等術語）出現在恰當的角落作為身份印記，不鋪滿頁面、不干擾工作。

## Accessibility & Inclusion

無正式 WCAG 對齊目標。仍維持務實基線：沿用品牌本就高對比的深色系（`#F6F8FC` on `#111215`），body 文字維持可讀對比、不用過淺灰；focus 狀態可見；明/暗/藍三主題並存供環境光選擇；所有動效附 `prefers-reduced-motion: reduce` 替代（crossfade 或即時切換）。中英雙語為一等公民。
