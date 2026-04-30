# Deployment Checklist · EnerTchad site v2

*Bignéro Moïalbéi Le Madang · DG · 2026-04-28*  
*Référence rapide pour déploiement Vercel · v2.1.7+Z+Y+X+V+W+U+V+Q+Q2+F+G+M+TWR+D2*

---

## Pré-déploiement (5 min)

```bash
cd /Users/Bignero/Documents/Claude/Projects/Enertchad/site-v2/

# 1. Validation canon (DOIT retourner CANON CLEAN)
bash scripts/validate-canon.sh
```

**Attendu** : `✓ CANON CLEAN — 0 errors · 0 warnings`

Si erreurs : corriger avant de continuer (ne JAMAIS push une régression canon).

---

## Smoke test local (10 min)

```bash
# 2. Aperçu local
python3 -m http.server 8000
# → ouvrir http://localhost:8000
```

**Pages à vérifier visuellement :**

| Page | Élément clé à valider |
|---|---|
| `/` (homepage) | 3 pôles canon section · cards avec services applicables · footer ULTRA · CTA Tour pulse |
| `/engagement/investisseurs.html` | **War Room** chargé avec live tracker · funnel · jalons |
| `/data/atlas.html` | 3 sections H2 par pôle · 5 bassins (incl. Borkou + Lac) |
| `/solutions/` | Catalogue 10 services + matrice services applicables · Carottage SVG embedded |
| `/glossaire.html` | Taxonomie 02 PRIMAIRE = 3 pôles canon Oil & Gas |
| `/operateurs/srn.html` | Banner aval-hero visible · JV CNPC 60% / SHT 40% canon |

**Tests interactifs :**
- ☐ Hover sur nav items → mega-menu apparaît avec icônes colorées + badges
- ☐ Cmd+K (ou clic 🔍 Rechercher) → palette modal s'ouvre · indexation visible
- ☐ Persona switcher (top utility bar) → fonctionnel
- ☐ Quick actions sidebar droite → 4 icônes visibles avec tooltips
- ☐ Scroll > 80px → header shrink + glassmorphism
- ☐ Footer newsletter form → input email + bouton submit
- ☐ Footer 9 badges → tous cliquables (target="_blank")

---

## Déploiement Vercel (5 min)

```bash
# 3. Option A : déploiement direct
bash deploy.sh

# 3. Option B : via Git (recommandé pour traçabilité)
git add -A
git commit -m "Release v2.1.7+Z+Y+X+V+W+U+V+Q+Q2+F+G+M+TWR+D2 · Tour-ready"
git push origin main  # auto-deploy Vercel webhook
```

---

## Smoke test post-déploiement (5 min)

```bash
# 4. Vérification HTTP
curl -I https://enertchad-groupe.vercel.app/
# Attendu : HTTP/2 200

# 5. Vérification redirects vercel.json
curl -I https://enertchad-groupe.vercel.app/services
# Attendu : HTTP/2 301 → /solutions/

# 6. Vérification PWA
curl -I https://enertchad-groupe.vercel.app/manifest.webmanifest
curl -I https://enertchad-groupe.vercel.app/sw.js
```

**Tests live :**
- ☐ Ouvrir https://enertchad-groupe.vercel.app/ — homepage rapide (LCP < 2,5s)
- ☐ Tester War Room sur `/engagement/investisseurs.html` (fetch JSON OK)
- ☐ Tester recherche ⌘K cross-pages
- ☐ Mobile responsive : drawer menu + sub-nav 3 pôles
- ☐ Lighthouse audit (DevTools) : viser ≥90 sur les 4 dimensions

---

## Mise à jour War Room hebdomadaire (15 min · 1× par semaine)

```bash
# Éditer le JSON
nano /Users/Bignero/Documents/Claude/Projects/Enertchad/site-v2/assets/data/tour-2026.json

# Champs à mettre à jour :
# - tour.raised        : nouveau total levé
# - tour.last_updated  : maintenant (ISO 8601)
# - seats.confirmed    : nombre closed
# - seats.in_term_sheet : nombre TS signés
# - seats.available    : recalculer = total - confirmed - in_term_sheet
# - funnel[]           : ajuster counts par stage
# - events[]           : ajouter nouvel événement en haut de la liste

# Push
git add assets/data/tour-2026.json
git commit -m "WR · update Tour 2026 tracker $(date +%Y-%m-%d)"
git push
```

**Vercel redéploie automatiquement en ~30s.**

---

## Rollback en cas de problème (urgence)

```bash
# Identifier le dernier commit stable
git log --oneline | head -5

# Rollback à ce commit
git revert HEAD
git push

# OU : redéployer depuis dashboard Vercel un déploiement antérieur
# https://vercel.com/dashboard → Deployments → Redeploy
```

---

## Cycle hebdomadaire opérationnel DG (suggéré)

| Jour | Action | Durée |
|---|---|---|
| **Lundi 9h** | 8 cold emails outreach (Doc 48 séquences) | 2h |
| **Mardi 9h** | Relances J3 LinkedIn + suivi réponses | 1h |
| **Mercredi 14h** | Update `tour-2026.json` War Room | 15 min |
| **Jeudi 9h** | 8 cold emails additionnels | 2h |
| **Vendredi 14h** | Revue funnel DG/COO/CFO · ajustements | 1h |

**Total hebdo Tour 2026** : ~6h DG dédiées au raise.

---

## En cas d'urgence

| Problème | Action |
|---|---|
| Canon broken | `bash scripts/validate-canon.sh` → fix obsolescences détectées |
| Site cassé Vercel | Rollback dernière version stable (cf. ci-dessus) |
| War Room ne charge pas | Vérifier `/assets/data/tour-2026.json` JSON valide (jsonlint) |
| Erreur SSL | Contact Vercel support · DNS check enertchad-groupe.vercel.app |
| Régression footer/nav | Vérifier `enertchad.css` accolades balanced + `enertchad.js` parens balanced |

---

## Contacts urgence techniques

- **DG** : Bignéro Moïalbéi Le Madang · +235 22 52 19 00 · dg@enertchad.td
- **PCA** : Théophile Gag Pinabei
- **DevOps Vercel** : compte master DG
- **GitHub** : https://github.com/bmlemad/Enertchad-groupe

---

*Deployment Checklist · v2.1.7+Z+Y+X+V+W+U+V+Q+Q2+F+G+M+TWR+D2 · 2026-04-28*  
*EnerTchad Groupe SA/CA*
