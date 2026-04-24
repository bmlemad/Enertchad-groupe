#!/usr/bin/env bash
# ==============================================================================
# Cloudflare Pages — build script
# Copie le site statique dans ./dist en excluant sources, docs et tooling.
# Usage : bash build-cf.sh  (appelé par CF Pages avec "Build command: bash build-cf.sh")
# Build output directory : dist
# ==============================================================================
set -euo pipefail

DIST=dist
rm -rf "$DIST"
mkdir -p "$DIST"

# rsync avec liste d'exclusion alignée sur .cfignore
rsync -av --delete \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='.gitignore' \
  --exclude='.wrangler/' \
  --exclude='.cfignore' \
  --exclude='.netlifyignore' \
  --exclude='.vercelignore' \
  --exclude='README.md' \
  --exclude='DATA_MASTER.yml' \
  --exclude='AUDIT_TECHNIQUE_*.md' \
  --exclude='CLOUDFLARE_SETUP.md' \
  --exclude='DESIGN_SYSTEM.md' \
  --exclude='DOMAIN_SETUP.md' \
  --exclude='MASTER_ACTIONS_TRACKER.md' \
  --exclude='ANALYSE_INCOHERENCES.md' \
  --exclude='.perf-budget.md' \
  --exclude='_sources/' \
  --exclude='dashboard-src/' \
  --exclude='scripts/' \
  --exclude='poles/' \
  --exclude='wrangler.toml' \
  --exclude='netlify.toml' \
  --exclude='vercel.json' \
  --exclude='.DS_Store' \
  --exclude='Thumbs.db' \
  --exclude='.~lock.*' \
  --exclude='*.bak' \
  --exclude='*.tmp' \
  --exclude='*~' \
  --exclude='*.bundle' \
  --exclude='node_modules/' \
  --exclude='package-lock.json' \
  --exclude='build-cf.sh' \
  --exclude="$DIST/" \
  ./ "$DIST/"

echo ""
echo "━━━ Build CF Pages ━━━"
echo "Files staged : $(find $DIST -type f | wc -l)"
echo "Size         : $(du -sh $DIST | awk '{print $1}')"
echo "Output dir   : $DIST"
echo ""
echo "Sanity checks:"
test -f "$DIST/services.html" && echo "  ✓ services.html" || echo "  ✘ services.html MISSING"
test -d "$DIST/assets/images" && echo "  ✓ assets/images/ ($(ls $DIST/assets/images/*.jpg 2>/dev/null | wc -l) hero jpg)" || echo "  ✘ assets/images/ MISSING"
test ! -d "$DIST/_sources" && echo "  ✓ _sources/ excluded" || echo "  ✘ _sources/ LEAKED"
test ! -f "$DIST/DATA_MASTER.yml" && echo "  ✓ DATA_MASTER.yml excluded" || echo "  ✘ DATA_MASTER.yml LEAKED"
test -f "$DIST/_headers" && echo "  ✓ _headers present (CF Pages reads it)" || echo "  ⚠ _headers absent"
test -f "$DIST/_redirects" && echo "  ✓ _redirects present" || echo "  ⚠ _redirects absent"
echo ""
echo "✓ Build done."
