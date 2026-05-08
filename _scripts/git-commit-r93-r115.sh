#!/bin/bash
# ============================================================
# Git commit + push session 2026-05-02 · R93 → R115 cumul
# 23 vagues canon · header strips, hero brutaliste, CSS cleanup
# ============================================================

set -e

cd "$(dirname "$0")/.."  # site-v2/

echo "=== Git status ==="
git status --short | head -30
echo ""

echo "=== Staging all changes ==="
git add -A

echo ""
echo "=== Commit ==="
git commit -m "Session 2026-05-02 · R93→R115 · brutalist hero + cleanup massif

23 vagues canon enchaînées :
- R93 Pack P1 Images (OG normalize 80 pages · srcset 87% · 16 variants)
- R94 Strip Bar 1+3 header v11 (132px → 72px)
- R95 Cleanup CSS Bar 1/3 orphan (-124 lignes)
- R96 Delete all <header> + <nav> markup (492 elements stripped)
- R97 Footer 7 stranded operateurs (coverage 71→78/86)
- R98 Hero modernize v1 (transitoire)
- R99 Strip hero brand row + positioning-banner (14 pages)
- R100 Dead code CSS (80 rules · -481 lignes)
- R101 CSS exhaustif sweep (390 rules · -1965 lignes)
- R102 Hero rebuild ultra-premium (transitoire)
- R103 Strip eyebrow+trust+ticker hero
- R104 162 commentaires HTML <!-- HEADER --> retirés
- R105 Delete all hero sections (53 sections / 52 pages)
- R106 Strip footer nav-like <ul> (133 cols / 65 pages)
- R107 Inline <style> block stripped (-15.6 KB)
- R108 Hero brutaliste éditorial style Linear/Browser Co
- R109 Apply page-statement cross-pages (11 pages canon)
- R110-112 Strip widgets + footer fix + doublons
- R113 Propagation kill widgets cross-pages
- R114 Global kill rules dans enertchad.css
- R115 Force .reveal visible (fix Atlas H2 invisible)

Économies cumulées :
- enertchad.css : 6521 → 4075 lignes (-38%, -75 KB)
- index.html : 1138 → 617 lignes (-46%, -30 KB)
- Total elements stripped : ~1000 (header, nav, hero, comments, widgets)

Architecture finale ultra-minimaliste :
- 0 <header> · 0 <nav> · 0 hero pleine-largeur cross-pages
- Hero brutaliste page-statement (11 pages canon)
- Footer canon riche (brand + slogan + newsletter + meta)
- Skip-link + widgets injectés JS tous neutralisés CSS

3 nouveaux CSS files :
- /assets/css/page-statement.css (R108 brutaliste · 130 lignes)
- /assets/css/hero-2026.css (R98 modernize · 346 lignes)
- /assets/css/header-v11.css (DEPRECATED stub)

20 docs stratégiques produits (Doc 138-149)
12 scripts Python idempotents (R93-R115)
3 archives sécurisées (pré-strips revertibles)"

echo ""
echo "=== Push origin main ==="
git push origin main

echo ""
echo "✓ Done · session 2026-05-02 R93-R115 pushed"
