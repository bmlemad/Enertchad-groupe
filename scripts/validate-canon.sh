#!/usr/bin/env bash
# validate-canon.sh — Lint canon EnerTchad
# Detects obsolete values across the entire site-v2 repo.
# Usage: bash scripts/validate-canon.sh
# Exit 0 = canon clean · Exit 1 = obsolete found
# Recommended: bind as pre-commit hook (.git/hooks/pre-commit)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

errors=0
warnings=0

echo -e "${YELLOW}=== EnerTchad Canon Validator v1.0 ===${NC}"
echo "Scanning $ROOT"
echo ""

# Patterns interdits (obsolete values)
declare -A BLACKLIST=(
  ["1 067 km"]="Pipeline distance · canon=1 070 km"
  ["1067 km"]="Pipeline distance · canon=1 070 km"
  ["Rônier"]="Pipeline name · canon=Ronier (sans accent)"
  ["311 km"]="Tronçon Tchad · canon=300 km"
  ["47 stations"]="IRVE network · canon=50 stations"
  ["JV CNPC + SHT"]="JV SRN · canon=CNPC 60% / SHT 40%"
  ["JV CNPC+SHT"]="JV SRN · canon=CNPC 60% / SHT 40%"
  ["Tour 5 M USD"]="Tour fundraise · canon=8-12 M USD"
  ["Tour 15 M USD"]="Tour fundraise · canon=8-12 M USD"
  ["4 bassins"]="Bassins actifs · canon=5 bassins (Bongor·Doba·Lac·Doseo·Borkou)"
  ["6 bassins"]="Bassins actifs · canon=5 bassins"
  ["3 ressources EOR"]="Programme EOR · canon=5 ressources"
  ["4 ressources EOR"]="Programme EOR · canon=5 ressources"
  ["2 marques"]="Marques OAPI · canon=5 marques™"
  ["3 marques"]="Marques OAPI · canon=5 marques™"
  ["4 marques"]="Marques OAPI · canon=5 marques™"
)

echo -e "${YELLOW}── 1. Valeurs canon obsolètes interdites ──${NC}"
for pattern in "${!BLACKLIST[@]}"; do
  if grep -rn "$pattern" --include="*.html" --include="*.md" --include="*.yml" --include="*.yaml" 2>/dev/null | grep -v "scripts/validate-canon.sh" | grep -v "^.*Doc 46\|^.*46_Ultra-Review-Doublons" >/dev/null; then
    matches=$(grep -rn "$pattern" --include="*.html" --include="*.md" 2>/dev/null | grep -v "scripts/validate-canon.sh" | grep -v "46_Ultra-Review")
    echo -e "${RED}✗ FAIL${NC} → '$pattern'"
    echo "  → ${BLACKLIST[$pattern]}"
    echo "  → Found in:"
    echo "$matches" | head -3 | sed 's/^/    /'
    errors=$((errors + 1))
  else
    echo -e "${GREEN}✓ OK${NC}    '$pattern' absent (canon: ${BLACKLIST[$pattern]})"
  fi
done

echo ""
echo -e "${YELLOW}── 2. Valeurs canon présentes (must-have) ──${NC}"
declare -A WHITELIST=(
  ["1 070 km"]="Pipeline distance"
  ["Ronier-Komé-Kribi"]="Pipeline name"
  ["50 kW"]="IRVE capacity"
  ["EnerTchad Groupe SA/CA"]="Brand"
  ["8-12 M USD"]="Tour fundraise"
)

for pattern in "${!WHITELIST[@]}"; do
  count=$(grep -rl "$pattern" --include="*.html" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$count" -gt 0 ]; then
    echo -e "${GREEN}✓ OK${NC}    '$pattern' présent sur $count page(s) (${WHITELIST[$pattern]})"
  else
    echo -e "${YELLOW}⚠ WARN${NC} '$pattern' absent (${WHITELIST[$pattern]})"
    warnings=$((warnings + 1))
  fi
done

echo ""
echo -e "${YELLOW}── 3. Cohérence structurelle ──${NC}"

# Check CSS braces balance
if [ -f "assets/css/enertchad.css" ]; then
  open_braces=$(grep -c '{' assets/css/enertchad.css || true)
  close_braces=$(grep -c '}' assets/css/enertchad.css || true)
  if [ "$open_braces" -eq "$close_braces" ]; then
    echo -e "${GREEN}✓ OK${NC}    CSS balanced ($open_braces=$close_braces braces)"
  else
    echo -e "${RED}✗ FAIL${NC} CSS unbalanced ($open_braces ouvrants vs $close_braces fermants)"
    errors=$((errors + 1))
  fi
fi

# Check JSON-LD presence on key pages
key_pages=("index.html" "engagement/investisseurs.html" "pourquoi/manifeste.html")
for page in "${key_pages[@]}"; do
  if [ -f "$page" ]; then
    if grep -q "application/ld+json" "$page"; then
      echo -e "${GREEN}✓ OK${NC}    JSON-LD présent · $page"
    else
      echo -e "${YELLOW}⚠ WARN${NC} JSON-LD absent · $page"
      warnings=$((warnings + 1))
    fi
  fi
done

echo ""
echo -e "${YELLOW}=== Résultat ===${NC}"
if [ "$errors" -eq 0 ] && [ "$warnings" -eq 0 ]; then
  echo -e "${GREEN}✓ CANON CLEAN — 0 errors · 0 warnings${NC}"
  exit 0
elif [ "$errors" -eq 0 ]; then
  echo -e "${YELLOW}⚠ CANON OK avec $warnings warning(s)${NC}"
  exit 0
else
  echo -e "${RED}✗ CANON FAIL — $errors errors · $warnings warnings${NC}"
  echo "Corriger les obsolescences avant commit."
  exit 1
fi
