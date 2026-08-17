#!/bin/bash
# BV-SuperPM 唯一部署入口 —— 不要直接跑 firebase deploy。
# 為什麼存在：APPVER 版本閘是「混版分頁互寫＝回朔」的唯一防線，但它靠人工 bump，
# 2026-08-15/16 連續三次部署忘記 bump，艦隊混版直接引爆第六輪回朔（U5 假警報 Reopen、
# 舊分頁繞過 push 掃全卡關卡）。此腳本把 bump 變成部署的一部分，人不用記。
#
# ⚠️ rollback 陷阱：firebase hosting:rollback 之後全艦 APPVER < 文件 appv，版本閘會把所有人
#    鎖死停寫——逃生口是網址加 ?forcewrite（index.html 版本閘註解有記）。
# ⚠️ 若這次部署動到 chat-proxy（/notify、/chat），先部署 proxy 再跑本腳本（前端先上會打到舊 proxy）。
set -euo pipefail
cd "$(dirname "$0")"
# 只允許乾淨的 index.html 上線：dirty 工作樹直接部署＝未審核碼上線＋邏輯變更被埋進版本戳 commit
git diff --quiet -- index.html || { echo "❌ index.html 有未提交變更 — 先 commit（審核過的內容）再部署"; exit 1; }
BASE=$(git rev-parse --short HEAD)
TODAY=$(TZ=Asia/Taipei date +%Y%m%d)
sed -i '' -E "s/const APPVER=[0-9]+;/const APPVER=${TODAY};/" index.html
# BSD sed 沒命中照樣 exit 0 —— 必須驗證真的戳到，否則「靜默不戳版仍部署」正是本腳本要消滅的事故
grep -q "const APPVER=${TODAY};" index.html || { echo "❌ APPVER 戳版失敗（pattern 沒命中，常數被改名/改格式？）— 部署中止"; git checkout -- index.html; exit 1; }
echo "APPVER → $(grep -o 'const APPVER=[0-9]*' index.html)（基於 ${BASE}）"
firebase deploy --only hosting
git add index.html && git commit -m "chore(deploy): APPVER ${TODAY} — deploy.sh 自動戳版（基於 ${BASE}）" || true
echo "✅ 已部署 APPVER=${TODAY}（基於 ${BASE}）。"
echo "   收斂提醒：舊分頁要等『收到一筆帶新 appv 的寫入』才會轉紅停寫——部署完不會自動收斂，請通知全員重整。commit 已建，記得 push。"
