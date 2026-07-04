#!/bin/sh
# Sync a product vault to bv-second-brain Firestore after a commit (idempotent upsert).
# Invoked by each vault repo's post-commit hook. Arg1 = scope: info | assistant.
#
# Auth = gcloud ADC (user login; org policy blocks service-account keys). If the ADC
# token has EXPIRED the sync fails — this script logs it and fires a macOS notification
# so it never fails silently. Fix with:  gcloud auth application-default login
SCOPE="${1:-info}"
NODE="/opt/homebrew/bin/node"
INGEST="/Users/zac_ch3/My work space/bv-SuperPM/ingest/ingest-vaults.js"
LOG="/Users/zac_ch3/My work space/bv-SuperPM/ingest/sync.log"

{
  echo "=== $(date '+%Y-%m-%d %H:%M:%S')  scope=$SCOPE  repo=$(basename "$PWD") ==="
  if "$NODE" "$INGEST" --write --scope="$SCOPE"; then
    echo "OK"
  else
    code=$?
    echo "FAILED (exit $code) — likely gcloud ADC token expired."
    echo "   Fix: gcloud auth application-default login"
    osascript -e 'display notification "Vault → bv-second-brain 同步失敗（可能 gcloud ADC 過期，請重新登入）" with title "BV Second Brain sync"' 2>/dev/null
  fi
  echo
} >> "$LOG" 2>&1
