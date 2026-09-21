#!/bin/bash
# BV-SuperPM 唯一部署入口 —— 不要直接跑 firebase deploy。
# 為什麼存在：APPVER 版本閘是「混版分頁互寫＝回朔」的唯一防線，但它靠人工 bump，
# 2026-08-15/16 連續三次部署忘記 bump，艦隊混版直接引爆第六輪回朔（U5 假警報 Reopen、
# 舊分頁繞過 push 掃全卡關卡）。此腳本把 bump 變成部署的一部分，人不用記。
#
# ⚠️ rollback 陷阱：firebase hosting:rollback 之後全艦 APPVER < 文件 appv，版本閘會把所有人
#    鎖死停寫——逃生口是網址加 ?forcewrite（index.html 版本閘註解有記）。
# ⚠️ 若這次部署動到 chat-proxy（/notify、/chat），先部署 proxy 再跑本腳本（前端先上會打到舊 proxy）。
#
# 自我測試：./deploy.sh --selftest（只驗版號計算，不碰 git／firebase／index.html）
set -euo pipefail
cd "$(dirname "$0")"

# ── 版號＝日期＋當日序號（YYYYMMDDNN），只進不退 ────────────────────────────────
# 2026-09-21 教訓：舊版一天只戳一個日期，同一天第二次部署戳出一模一樣的數字＝等於沒 bump，
# 版本閘當天形同不存在（那天連續兩次部署都沒跳版）。改成帶當日序號後，每次部署必定遞增。
# 安全性：index.html 的比較是「數字」比較（`(+data.appv||0)>APPVER`），APPVER 沒有任何地方被
# 當日期字串解析（全檔只有宣告、這個比較、寫進 Firestore 三處），所以 10 位版號一定大於
# 任何舊的 8 位版號，舊分頁照樣會被攔下。
next_appver(){
  local today="$2" curdate="${1:0:8}" curseq="${1:8}"
  if [ "$curdate" -ge "$today" ]; then                    # 同一天再部署（或時鐘往回跑）→ 序號 +1
    printf "%s%02d" "$curdate" "$((10#${curseq:-0} + 1))"  # 10# ＝ 避免 08/09 被當成八進位
  else                                                     # 新的一天 → 從 01 開始
    printf "%s01" "$today"
  fi
}

if [ "${1:-}" = "--selftest" ]; then
  fail=0
  t(){ local got; got=$(next_appver "$1" "$2")
       if [ "$got" = "$3" ]; then echo "PASS  $1 @$2 → $got"
       else echo "FAIL  $1 @$2 → $got（應為 $3）"; fail=1; fi; }
  t 20260921   20260921 2026092101    # 舊的 8 位版號、同一天再部署 → 補上序號（本次改版的主因）
  t 2026092101 20260921 2026092102    # 同一天第三次
  t 2026092109 20260921 2026092110    # 序號進位：09 不可被當八進位
  t 2026092199 20260921 20260921100   # 一天超過 99 次也只是變長，仍然遞增
  t 20260920   20260921 2026092101    # 昨天部署過 → 今天第一次
  t 2026092003 20260921 2026092101    # 昨天有序號 → 今天重新從 01
  t 2026092201 20260921 2026092202    # 時鐘往回跑 → 沿用較大的日期，只進不退
  [ $fail = 0 ] && echo "✅ 版號計算 selftest 全過" || { echo "❌ selftest 有失敗項"; exit 1; }
  exit 0
fi

# 只允許乾淨的 index.html 上線：dirty 工作樹直接部署＝未審核碼上線＋邏輯變更被埋進版本戳 commit
git diff --quiet -- index.html || { echo "❌ index.html 有未提交變更 — 先 commit（審核過的內容）再部署"; exit 1; }
BASE=$(git rev-parse --short HEAD)
TODAY=$(TZ=Asia/Taipei date +%Y%m%d)
CUR=$(grep -oE 'const APPVER=[0-9]+;' index.html | grep -oE '[0-9]+' || true)
[ -n "${CUR:-}" ] || { echo "❌ 讀不到現行 APPVER（常數被改名／改格式？）— 部署中止"; exit 1; }
NEW=$(next_appver "$CUR" "$TODAY")
# 版號倒退＝全艦 APPVER < 文件 appv ＝ 集體鎖死停寫，比忘記 bump 更慘 —— 寧可中止
[ "$NEW" -gt "$CUR" ] || { echo "❌ 新版號 ${NEW} 沒有大於現行 ${CUR} — 部署中止"; exit 1; }
sed -i '' -E "s/const APPVER=[0-9]+;/const APPVER=${NEW};/" index.html
# BSD sed 沒命中照樣 exit 0 —— 必須驗證真的戳到，否則「靜默不戳版仍部署」正是本腳本要消滅的事故
grep -q "const APPVER=${NEW};" index.html || { echo "❌ APPVER 戳版失敗（pattern 沒命中，常數被改名/改格式？）— 部署中止"; git checkout -- index.html; exit 1; }
echo "APPVER ${CUR} → ${NEW}（基於 ${BASE}）"
firebase deploy --only hosting
git add index.html && git commit -m "chore(deploy): APPVER ${NEW} — deploy.sh 自動戳版（基於 ${BASE}）" || true
echo "✅ 已部署 APPVER=${NEW}（基於 ${BASE}）。"
echo "   收斂提醒：舊分頁要等『收到一筆帶新 appv 的寫入』才會轉紅停寫——部署完不會自動收斂，請通知全員重整。commit 已建，記得 push。"
