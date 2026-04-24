#!/usr/bin/env bash
# ==============================================================================
# EnerTchad — smoke test post-deploy
# Usage : bash _sources/tools/smoke-test.sh <BASE_URL>
# Ex    : bash _sources/tools/smoke-test.sh https://enertchad-groupe.pages.dev
# ==============================================================================
set -u

BASE="${1:-https://enertchad-groupe.pages.dev}"
PASS=0
FAIL=0

color_pass() { printf "  \033[32m✓\033[0m %s\n" "$1"; PASS=$((PASS+1)); }
color_fail() { printf "  \033[31m✘\033[0m %s\n" "$1"; FAIL=$((FAIL+1)); }

check_status() {
  local path="$1"
  local expected="$2"
  local code
  code=$(curl -sI -o /dev/null -w "%{http_code}" "$BASE$path" --max-time 10)
  if [ "$code" = "$expected" ]; then
    color_pass "$path → $code"
  else
    color_fail "$path → $code (attendu $expected)"
  fi
}

check_contains() {
  local path="$1"
  local pattern="$2"
  local label="$3"
  if curl -s "$BASE$path" --max-time 10 | grep -q "$pattern"; then
    color_pass "$label : '$pattern' trouvé sur $path"
  else
    color_fail "$label : '$pattern' MANQUANT sur $path"
  fi
}

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ EnerTchad smoke test v1.2.0                                   ║"
echo "║ Base URL : $BASE"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "━━━ [1/5] Pages principales (attendu 200) ━━━"
for p in / /groupe /services /investisseurs /durabilite /talents /actualites \
         /contact /maps /newsletter /dashboard /dashboard-executif \
         /operations/amont /operations/intermediaire /operations/aval /operations/services \
         /energies/ /technologies/ /confidentialite /mentions-legales /cookies; do
  check_status "$p" 200
done
echo ""

echo "━━━ [2/5] Clean URLs services (attendu 301) ━━━"
for p in /services/ep /services/eor /services/pipeline /services/distribution \
         /services/petrochimie /services/digital /services/ics /services/cybersecurite \
         /services/securite /services/solaire /services/esg \
         /services/exploration-production /services/pipeline-midstream \
         /services/petrochimie-transformation /services/esg-formation-gouvernance; do
  check_status "$p" 301
done
echo ""

echo "━━━ [3/5] Anti-leak (attendu 404) ━━━"
for p in /_sources/ /_sources/tools/sync-services.py /_sources/enerfrica-deck/build.js \
         /DATA_MASTER.yml /dashboard-src/ /scripts/gen_assets.py \
         /AUDIT_TECHNIQUE_2026-04-22.md /ANALYSE_INCOHERENCES.md /MASTER_ACTIONS_TRACKER.md \
         /poles/01-amont.md /build-cf.sh /.cfignore; do
  check_status "$p" 404
done
echo ""

echo "━━━ [4/5] Contenu services.html (v1.2.0 anchors) ━━━"
for anchor in section-ep section-eor section-pipeline section-distribution \
              section-petrochimie section-digital section-ics-security \
              section-physical-security section-energies section-esg; do
  check_contains "/services" "id=\"$anchor\"" "Anchor $anchor"
done
echo ""

echo "━━━ [5/5] Headers sécurité et contenu ━━━"
headers=$(curl -sI "$BASE/" --max-time 10)
if echo "$headers" | grep -qi "strict-transport-security.*max-age=63072000"; then
  color_pass "HSTS max-age=63072000 présent"
else
  color_fail "HSTS manquant ou mauvais max-age"
fi
if echo "$headers" | grep -qi "content-security-policy"; then
  color_pass "CSP header présent"
else
  color_fail "CSP manquant"
fi
if echo "$headers" | grep -qi "x-frame-options"; then
  color_pass "X-Frame-Options présent"
else
  color_fail "X-Frame-Options manquant"
fi

check_contains "/" "Unité · Innovation · Durabilité" "Slogan homepage"
check_contains "/contact" "wa.me/23599298696" "WhatsApp Business dans contact"
check_contains "/services" "\"numberOfItems\":10" "JSON-LD 10 services"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ RÉSUMÉ"
echo "║   ✓ Passed : $PASS"
echo "║   ✘ Failed : $FAIL"
echo "║"
if [ $FAIL -eq 0 ]; then
  echo "║ 🎉 TOUS LES TESTS PASSENT — deploy prêt pour production."
  echo "╚════════════════════════════════════════════════════════════════╝"
  exit 0
else
  echo "║ ⚠  $FAIL test(s) échoué(s) — à investiguer avant promotion."
  echo "╚════════════════════════════════════════════════════════════════╝"
  exit 1
fi
