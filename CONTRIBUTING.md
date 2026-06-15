# 協作指南 · Contributing Guide

> 目標：每個人各自下載 repo、編輯、上傳，而我們**永遠能查出「誰改的、誰 push 的、改了什麼」**。
> Goal: everyone clones, edits, and pushes on their own machine — and we can **always tell who changed what, who pushed, and what was committed.**

本專案是純靜態網站（單一 HTML 檔，無需 build）。主要檔案：
- `index.html`（＝ `superpm.html`）— 線上首頁 `/`（SuperPM fork）
- `dashboard.html` — 主儀表板（`/dashboard.html`）

> ⚠️ 三個 HTML 檔目前內容相同。若你的改動希望首頁也生效，記得對應檔案要一起改。

---

## 一次性設定 · One-time setup（每個人在自己的電腦各做一次）

### 1. 設定你自己的 git 身分
用**你本人的**名字，以及**你註冊 GitHub 的 email**（這樣 GitHub 才會自動連到你的頭像/帳號）：

```bash
git config --global user.name  "你的名字 Your Name"
git config --global user.email "you@blackvoyage.com"
```

確認設定：
```bash
git config --global user.name
git config --global user.email
```

### 2. 用你自己的 GitHub 帳號登入（決定「誰 push」）
最簡單的方式是 GitHub CLI：
```bash
gh auth login
```
> 選 GitHub.com → HTTPS → 用瀏覽器登入**你自己的**帳號。
> 登入後推送就會以你的身分記錄在 GitHub 上。

### 3. Clone 專案（每個人各自一份，不要共用同一個資料夾）
```bash
git clone https://github.com/black-voyage/bv-SuperPM.git
cd bv-SuperPM
```

> ❗ 不要多人共用同一個 clone。共用會讓 GitHub 上「誰 push」全部變成同一個帳號。

---

## 日常流程 · Daily workflow（建議走 Pull Request）

不要直接推 `main`。每次改動開一個分支 → push → 開 PR → 合併。
這樣 GitHub 會清楚記錄「誰提交、誰審核、誰合併」，最容易追溯。

```bash
# 0. 先把 main 更新到最新
git checkout main
git pull

# 1. 開一個分支（名字用：你的名字/改了什麼）
git checkout -b terry/fix-timeline-copy

# 2. 改檔案（index.html / dashboard.html …），存檔

# 3. 看看自己改了什麼
git status          # 哪些檔被改了
git diff            # 逐行看改了什麼

# 4. 提交（commit 訊息寫清楚改了什麼、為什麼）
git add -A
git commit -m "Timeline: 修正文案，校正中文翻譯"

# 5. 推上去
git push -u origin terry/fix-timeline-copy

# 6. 開 PR（用 gh，或到 GitHub 網頁按 Compare & pull request）
gh pr create --fill
```

PR 被合併後，Render 約 1 分鐘自動重新部署上線。

### 想簡單一點？直接推 main（較不推薦）
若團隊還沒準備好 PR 流程，也可以直接推 main —— 只要前面的「身分」設定有做對，commit 一樣會正確署你的名：
```bash
git pull
# 改檔、存檔
git add -A
git commit -m "清楚描述這次改了什麼"
git push
```

---

## 怎麼查「誰改了什麼」· How to see who changed what

### 在本機用指令
```bash
# 每筆 commit：簡碼、作者、email、日期、訊息
git log --pretty=format:"%h %an <%ae> %ad %s" --date=short

# 某筆 commit 具體改了哪些行
git show <commit簡碼>

# 某個檔每一行最後是誰改的
git blame index.html

# 只看某個人的 commit
git log --author="Terry"

# 某段時間的改動
git log --since="2026-06-01" --until="2026-06-15"
```

### 在 GitHub 網頁（最直覺）
- repo 的 **Commits** 頁 → 每筆都有頭像、時間、訊息
- 每個檔的 **History** / **Blame** → 逐行看誰改的
- **Pull requests** → 誰提交、誰審核、誰合併
- repo **Insights → Contributors** → 每個人的貢獻量

---

## commit 訊息怎麼寫 · Commit message tips
- 寫「改了什麼」而不是「改了東西」。例：`Timeline: 加上每階段預計天數` 比 `update` 好太多。
- 一次 commit 只做一件事，方便日後回溯與還原。
- 中英文都可以，團隊看得懂最重要。

---

## 常見問題 · FAQ

**Q：網頁裡那個「Version history / 歷史」是不是就會記錄我？**
不是。網頁裡的版本歷史存在**各自瀏覽器的 localStorage**，是每台電腦各自一份、不會同步、也不會跟著 git 上傳。要追「誰改了原始碼」請看 git / GitHub 的紀錄（本文件講的就是這個）。

**Q：我 commit 後發現署名是別人？**
代表這台機器的 `git config user.name / user.email` 不是你。回到「一次性設定」第 1 步重設。

**Q：推送時叫我輸入帳密／權限被拒？**
跑 `gh auth login` 用你自己的 GitHub 帳號重新登入。
