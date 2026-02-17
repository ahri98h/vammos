#!/usr/bin/env bash
set -euo pipefail
OLD='https://leidycleaner.com.br/logo-leidy.png'
NEW='/images/logo-leidy.svg'
BASEDIR="/workspaces/prossiga"
ROOTS=("$BASEDIR/frontend/public_html" "$BASEDIR/frontend/out")

echo "Procurando e substituindo: $OLD -> $NEW"
for root in "${ROOTS[@]}"; do
  if [ -d "$root" ]; then
    echo "Processando $root"
    # list files that contain the string, ignore binary files
    mapfile -t files < <(grep -RIl --exclude-dir=node_modules --exclude-dir=.git --exclude='*.png' --exclude='*.jpg' --exclude='*.jpeg' --exclude='*.ico' "$OLD" "$root" || true)
    for f in "${files[@]}"; do
      echo "  Substituindo em: $f"
      sed -i "s|$OLD|$NEW|g" "$f" || echo "    Falha ao substituir em $f"
    done
  else
    echo "Pasta não encontrada: $root (pulando)"
  fi
done

echo "Substituições concluídas."