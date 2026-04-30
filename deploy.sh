#!/usr/bin/env bash
# EnerTchad Groupe — Site v2 deployment script
# Usage: ./deploy.sh [preview|prod]

set -e
MODE="${1:-preview}"

echo "═══════════════════════════════════════════════"
echo "  EnerTchad Groupe SA/CA — Deploy Site v2.0"
echo "  Mode : $MODE"
echo "  Date : $(date +%Y-%m-%d_%H:%M)"
echo "═══════════════════════════════════════════════"

# Pre-flight
echo ""
echo "▶ Pre-flight checks..."
[ -f "vercel.json" ] || { echo "✗ vercel.json missing"; exit 1; }
[ -f "index.html" ] || { echo "✗ index.html missing"; exit 1; }
[ -f "assets/css/enertchad.css" ] || { echo "✗ CSS missing"; exit 1; }

# JSON validation
python3 -c "import json; json.load(open('vercel.json'))" || { echo "✗ vercel.json invalid"; exit 1; }
python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml')" || { echo "✗ sitemap.xml invalid"; exit 1; }
echo "✓ Configs valid"

# Stats
echo ""
echo "▶ Stats:"
echo "  Pages HTML : $(find . -name '*.html' -not -path './node_modules/*' | wc -l)"
echo "  Total size : $(du -sh . --exclude=node_modules --exclude=.git 2>/dev/null | cut -f1)"
echo "  Sitemap URLs: $(grep -c '<url>' sitemap.xml)"

# Deploy
echo ""
if [ "$MODE" = "prod" ]; then
  echo "▶ Deploying to PRODUCTION..."
  vercel --prod
else
  echo "▶ Deploying to PREVIEW..."
  vercel
fi

echo ""
echo "✓ Deploy complete."
