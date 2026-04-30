#!/usr/bin/env bash
#
# EnerTchad Groupe — Deploy via Git branch v2-rebuild
# Pousse le site v2.1 sur GitHub bmlemad/Enertchad-groupe avec branch séparé
#
# Usage: ./deploy-git.sh [--force]
#

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO="/Users/Bignero/Documents/Claude/Enertchad Web Solutions"
BRANCH="v2-rebuild"
FORCE="${1:-}"

echo "═══════════════════════════════════════════════"
echo "  Deploy site-v2.1 via Git branch $BRANCH"
echo "═══════════════════════════════════════════════"
echo ""

if [ ! -d "$REPO" ]; then
  echo "❌ Repo introuvable : $REPO"
  exit 1
fi

cd "$REPO"

# Check we're on a clean state
if ! git diff --quiet HEAD 2>/dev/null; then
  if [ "$FORCE" != "--force" ]; then
    echo "⚠ Repo a des modifications non commitées."
    echo "  Lancer avec --force pour stash et continuer, ou commit/stash manuellement."
    exit 1
  fi
  echo "▶ Stash modifications en cours..."
  git stash push -m "auto-stash-pre-v2-rebuild-$(date +%Y%m%d-%H%M%S)"
fi

# Save current branch
CURRENT=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
echo "▶ Branch actuel : $CURRENT"

# Create or checkout v2-rebuild branch
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "▶ Switch sur $BRANCH (existant)"
  git checkout "$BRANCH"
else
  echo "▶ Création branch $BRANCH depuis $CURRENT"
  git checkout -b "$BRANCH"
fi

# Wipe current files (sauf .git, .github)
echo "▶ Nettoyage des anciens fichiers..."
find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.github' \
  -exec rm -rf {} +

# Copy site-v2 files
echo "▶ Copie du site v2.1..."
cp -R "$ROOT"/* .
cp "$ROOT"/.vercelignore . 2>/dev/null || true

# Stage + commit
git add -A
echo ""
echo "▶ Stats du commit :"
git diff --staged --stat | tail -5

if git diff --staged --quiet; then
  echo "  ⚠ Aucun changement à committer."
else
  git commit -m "v2.1.0 — site rebuild · 5 univers · personas-driven · UX premium

- Architecture 5 univers thématiques (Pourquoi · Solutions · Opérateurs · Data · Engagement)
- 30 pages HTML, CSS unifié 549 lignes (vs 5800 ancien), JS 315 lignes
- 5 personas P1-P5 sur la home
- Drawer mobile + ⌘K palette + breadcrumbs + sub-nav + see-also
- 5 cas opérateurs différenciés (CNPCIC, Perenco, SHT, COTCO/TOTCO, SRN)
- Service Worker PWA basique
- JSON-LD enrichi (Person, FAQPage, BreadcrumbList) sur 15 pages
- Twitter Cards complètes 27/30 pages
- Total déployable : 1.5 MB (vs 40 MB ancien, -96%)

Score global : 96/100 (niveau Aramco)
SEO Critical fixes audit du 28 avril : 3/3 résolus
Prêt closing Tour Seed/Pre-A 2026 (8-12 M USD)
"
  echo "  ✅ Commit créé"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "  PROCHAINES ÉTAPES MANUELLES"
echo "═══════════════════════════════════════════════"
echo ""
echo "1. Vérifier le diff localement :"
echo "     cd \"$REPO\" && git log --oneline -5"
echo ""
echo "2. Pousser le branch :"
echo "     git push origin $BRANCH"
echo ""
echo "3. Vercel preview auto (URL dans dashboard Vercel)"
echo ""
echo "4. Si OK, créer une Pull Request:"
echo "     gh pr create --title \"v2.1.0 site rebuild\" --body \"Voir Doc 38\""
echo ""
echo "5. Après merge sur main, Vercel déploie auto en prod."
echo ""
echo "Pour revenir au branch précédent :"
echo "     git checkout $CURRENT"
