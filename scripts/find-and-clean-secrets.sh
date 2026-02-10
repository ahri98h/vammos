#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATTERNS=(
  "\b[A-Za-z0-9_\-]{20,}\b" # long tokens
  "sk_live_[A-Za-z0-9_\-]+"
  "pk_live_[A-Za-z0-9_\-]+"
  "whsec_[A-Za-z0-9_\-]+"
  "SENTRY_DSN=|sentry.io/"
  "AWS_SECRET_ACCESS_KEY|AWS_ACCESS_KEY_ID"
  "PIX_WEBHOOK_SECRET"
)

echo "Scanning repository for potential secrets..."
for p in "${PATTERNS[@]}"; do
  echo "--- Pattern: $p ---"
  grep -RIn --exclude-dir={node_modules,.git} -E "$p" "$REPO_ROOT" || true
done

echo
echo "Done. To mask or remove found secrets, review results above and run with --mask"

if [[ "${1:-}" == "--mask" ]]; then
  echo "Masking found secrets (creating backups *.bak)..."
  for p in "${PATTERNS[@]}"; do
    grep -RIl --exclude-dir={node_modules,.git} -E "$p" "$REPO_ROOT" | while read -r file; do
      cp "$file" "$file.bak"
      # replace long tokens with [REDACTED_TOKEN]
      sed -E -i "s/${p}/[REDACTED_TOKEN]/g" "$file" || true
      echo "Patched: $file"
    done
  done
  echo "Masking complete. Review .bak files as needed."
fi
