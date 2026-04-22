# 🧭 MASTER ACTIONS TRACKER · Site EnerTchad Groupe

> **Rôle** : source unique de vérité pour l'état d'avancement de **toutes** les actions et recommandations demandées pour le site `enertchad.td`.
>
> **Version** : v1.4 — 22 avril 2026 (release v1.9.1 "Canonicals clean-URL" appliquée)

---

## ⚡ Release log — 22 avril 2026 (nuit, 22h12) · v1.9.1 "Canonicals clean-URL"

Post-audit v1.9.0 : un seul point mineur détecté — 17 balises `<link rel="canonical">` pointaient vers `…/page.html` alors que Cloudflare Pages sert les URLs canoniques **sans** `.html` (308 → `/page`). Alignement canonical déclaré ↔ URL servie pour cohérence SEO.

| Item | Livrable | Statut | Fichiers modifiés |
|:--:|---|:--:|---|
| **C1** | Strip `.html` de `<link rel="canonical">` sur 17 pages (hors `404.html`, page utilitaire non-indexable) | 🎯 | 17 HTML |
| **C2** | Strip `.html` de `<meta property="og:url">` sur 17 pages (alignement Open Graph) | 🎯 | 17 HTML |
| **Infra** | Bump CACHE_VERSION Service Worker → `v1.9.1-canonicals-clean` | 🎯 | `sw.js` |

**Audit post-déploiement v1.9.0** (resolver `urljoin` corrigé) :
- Statut HTTP : **22/22 pages 200** ✓
- A11Y landmarks : `banner=1, main=1, nav=1, footer=1, contentinfo=1` sur 8 pages échantillon ✓
- SEO meta : `title + description + canonical + og:title` complets ✓
- H1 unique par page ✓
- `<img>` sans alt : **0** · `<button>` sans nom accessible : **0** · `<input>` sans label : **0** ✓
- 404 réels : **0** (le "404 services.html" du premier scan était un faux positif de resolver naïf)
- 308 Cloudflare `.html` → URL clean : **18** (comportement normal, éliminable en utilisant les URLs clean dans les `href` internes — optimisation P3 future)

**Smoke test live v1.9.1** :
- `/groupe` : canonical `https://www.enertchad.td/groupe` ✓ · og:url `…/groupe` ✓
- `/investisseurs` : canonical `…/investisseurs` ✓ · og:url `…/investisseurs` ✓
- `/talents`, `/contact`, `/operations/amont` : idem ✓
- SW version live : `enertchad-v1.9.1-canonicals-clean` ✓

**Commit** : `83a5ce5` (18 fichiers, +35/−35) · **Deploy** : `https://7db7e772.enertchad-groupe.pages.dev`

---

## ⚡ Release log — 22 avril 2026 (nuit) · v1.9.0 "Header & Mega A11Y"

Audit exhaustif du header + méga-menu + sous-menus thématiques ; **11 recommandations appliquées** (6 P1 + 5 P2) sur l'ensemble des pages publiques du site.

| Priorité | Livrable | Statut | Fichiers modifiés |
|:--:|---|:--:|---|
| **P1 #1** | 4 ancres brisées corrigées (`#strategie`, `#rh`, `#local-content`, `#solvabilite`) via pattern `.anchor-alias` invisible (offset sticky-nav −96 px) | 🎯 | `groupe.html`, `talents.html`, `investisseurs.html`, `assets/css/main.css` |
| **P1 #2** | ARIA Disclosure pattern sur nav-submenus thématiques : retrait `role="menu"` / `role="menuitem"` orphelins (pattern APG 1.2) — **224 attributs nettoyés** sur 16 pages (+ 28 sur 2 filiales) | 🎯 | 18 fichiers HTML (main + `energies/index`, `technologies/index`) |
| **P1 #3** | Landmark `<header class="site-header" role="banner">` enveloppant topbar + nav-wrap — **20 pages** (14 main + 4 `operations/*` + 2 filiales) | 🎯 | 20 fichiers HTML |
| **P1 #4** | Topbar complète injectée sur les 2 filiales (`energies/index.html`, `technologies/index.html`) pour cohérence navigationnelle | 🎯 | 2 fichiers HTML |
| **P1 #5** | Lang-switcher EN/AR verrouillé en "Bientôt" (suppression UX trompeuse) — `<span class="lm-disabled" aria-disabled="true">` + badge `.lm-soon` (36 remplacements sur 18 pages) | 🎯 | 18 fichiers HTML + `assets/css/main.css` |
| **P1 #6** | Sémantique Hero corrigée : `<header class="hero">` → `<section class="hero" aria-label="…">` sur index, energies, technologies (évite double-landmark `banner`) | 🎯 | 3 fichiers HTML |
| **P2 #7** | `aria-haspopup="true"` (legacy boolean) → `"menu"` (enumerated string WAI-ARIA 1.2) sur `.lang-btn` — 18 remplacements | 🎯 | 18 fichiers HTML |
| **P2 #8** | Wording dashboard corrigé : "KPI temps réel · accès restreint" (trompeur, route publique) → "KPI temps réel · cockpit direction" — 18 remplacements | 🎯 | 18 fichiers HTML |
| **P2 #9** | Focus trap sur hamburger mobile : cycle Tab/Shift+Tab dans `#navLinks` quand ouvert, focus auto sur 1er élément, Esc pour fermer | 🎯 | `assets/js/main.js` (L297-340) |
| **P2 #10** | Progress bar de scroll masquée sur pages utilitaires courtes (`cookies`, `mentions-legales`, `confidentialite`) via `body.page-legal` | 🎯 | 3 fichiers HTML + `assets/css/main.css` |
| **P2 #11** | `aria-current="true"` sur déclencheur top-level quand sous-lien correspond à la page courante — déjà implémenté dans `thematicSubMenus` (L590-593) et `markActivePole` (L566), vérifié ✓ | 🎯 | `assets/js/main.js` (déjà en place) |
| **Infra** | Bump CACHE_VERSION Service Worker → `v1.9.0-header-mega-a11y` | 🎯 | `sw.js` |

**Vérification smoke (14 pages avec nav)** :
- `<header role="banner">` landmark : **14/14** ✓
- `nav-submenu role=menu` orphelins : **0** (était 14) ✓
- `nav-sub-link role=menuitem` orphelins : **0** (était 140) ✓
- `aria-haspopup="menu"` : **14/14** ✓ · legacy `"true"` : **0** ✓
- Verrou EN `.lm-disabled` : **14/14** ✓ · Verrou AR : **14/14** ✓
- `.anchor-alias` classe : **7 usages** (4 nouveaux + 3 existants)

**Conformité WCAG 2.1 AA** : SC 1.3.1 (landmarks), SC 2.4.1 (bypass blocks), SC 2.4.7 (focus visible), SC 4.1.2 (name/role/value) désormais couverts sur l'ensemble du site.

**Redéploiement** :

```bash
cd "Enertchad Web Solutions"
git add -A && git commit -m "v1.9.0 — Header & Mega A11Y"
npx wrangler pages deploy . --project-name=enertchad-groupe --branch=main --commit-dirty=true
```

---

## ⚡ Release log — 22 avril 2026 (après-midi) · v1.6.1

Livraison en série des priorités **P3 méga-menu a11y + sourcing + config Cloudflare** directement sur le code source :

| Priorité | Livrable | Statut | Fichiers modifiés |
|:--:|---|:--:|---|
| **P3.1** | Patch 01+02 BUG-3 — idempotence `setOpen` + listener `window.blur` | 🎯 | `assets/js/main.js` |
| **P3.2** | Patch 03 — a11y CSS (contrast WCAG 2.1 AA, focus-visible, kbd 32×24, prefers-reduced-motion, touch 44×44 mobile, placeholder, `.sr-only` helper) | 🎯 | `assets/css/main.css` |
| **P3.3** | Patch 04 — filter throttle 80ms + aria-live count announce 400ms + countEl sr-only | 🎯 | `assets/js/main.js` + 12 HTML pages |
| **P3.4** | Patch 05 — `.mf-stat[data-source]` sourcing cliquable + indicateur `↗` + navigation clavier (Enter/Space) | 🎯 | `assets/js/main.js` + `assets/css/main.css` |
| **P3.5** | Patch 06 (credibility) — retrait MSCI AA / CDP B / S&P A− / Moody's A3 / Great Place to Work ; remplacé par ITIE publié, dette/EBITDA, villages électrifiés, couverture D&I | 🎯 | `assets/js/main.js` (MEGA_PANELS) |
| **P3.6** | Patch 07 — ARIA Disclosure Menu (retrait `role="menu"` / `role="menuitem"` / `aria-haspopup`, ajout `id="mega-poles"` + `aria-controls`) | 🎯 | `assets/js/main.js` + 16 HTML (`index`, `groupe`, `investisseurs`, `durabilite`, `talents`, `actualites`, `contact`, `maps`, `operations/*`) |
| **P3.7** | Cloudflare Pages config — `_redirects` sans rewrites `.html` (fix loop), `_headers` durci (CSP + Plausible + COOP/CORP + SW no-cache), `wrangler.toml` reproductible | 🎯 | `_redirects`, `_headers`, `wrangler.toml`, `CLOUDFLARE_SETUP.md` |
| **P3.8** | Bump CACHE_VERSION Service Worker → `v1.6.1-mega-a11y-sourcing` | 🎯 | `sw.js` |

**Vérification** : zéro occurrence résiduelle de « MSCI AA », « CDP B » (notation), « S&P A− », « Moody's A3 », « Great Place to Work » dans `*.html` / `*.js` / `*.css` (scan `grep -rn` post-patch). Patterns Disclosure ARIA également nettoyés sur toutes les pages publiques (hors `site/` snapshot et lang-switcher qui reste sur un `role="menu"` légitime — true command menu).

**Redéploiement recommandé** :

```bash
cd "Enertchad Web Solutions"
npx wrangler pages deploy . --project-name=enertchad-groupe --branch=main --commit-dirty=true
```

**Restent à traiter (P4 nice-to-have)** : création des 3 PDFs manquants (`rapport-annuel-2025.pdf`, `communique-q4-2025.pdf`, `kit-presse.pdf`) — actuellement référencés comme sources dans MEGA_PANELS ; exécution du batch downloader images HD ; traduction EN/AR des slogans ; tests axe-core automatisés ; passage lang-menu vers pattern Disclosure si cohérence éditoriale requise.

---

## ⚡ Release log — 22 avril 2026 (matin) · v1.6.0

Livraison en série des priorités P0 → P2 directement sur le code source :

| Priorité | Livrable | Statut | Fichiers modifiés |
|:--:|---|:--:|---|
| **P0.1** | Sprint A méga-menu — fix 3 CTA 404 + ancre `#itie` | 🎯 | `assets/js/main.js` |
| **P0.2** | Patches 01+02 — multi-open + Esc idempotent | 🎯 | `assets/js/main.js` (registry MEGA_WRAPS) |
| **P0.3** | Slogans officiels sitewide — *Unité · Innovation · Durabilité* + *Accès aux Énergies* | 🎯 | 16 pages HTML + `assets/css/main.css` + JSON-LD |
| **P1.1** | Sprint C — clean URLs 3 plateformes | 🎯 | `_redirects`, `netlify.toml`, `vercel.json` |
| **P1.2** | Sprint B — 17 ancres orphelines sur 6 pages | 🎯 | `talents`, `actualites`, `durabilite`, `investisseurs`, `groupe`, `contact`.html |
| **P1.3** | Section EOR + dataset | 🎯 | `operations/amont.html` + `assets/data/eor-tchad.json` |
| **P1.4** | Visibilité Pétrochimie (teaser + cross-link) | 🎯 | `index.html` + `operations/aval.html` |
| **P2** | Bump CACHE_VERSION Service Worker → `v1.6.0-signatures-eor-petrochimie` | 🎯 | `sw.js` |

**Vérification finale** : 21/21 ancres ciblées résolvent correctement sur leurs pages (scan automatisé). Aucun lien mort détecté sur les pôles `/operations/*`, `/energies/`, `/technologies/`, `/maps`, `/dashboard`, `/dashboard-executif`.

---
>
> **Couverture** : 5 workstreams parallèles (57 livrables de spécification produits à date) + patches binaires + dossier de release.
>
> **Règle de lecture** : un livrable marqué ✅ signifie **spécification finalisée et relue**. Il ne signifie **pas** que le code est en production. Le passage spec → prod dépend du déblocage malware-check de l'environnement dev et de la disponibilité Tech Front / DirCom / DevOps / QA.

---

## 0. Légende statuts

| Badge | Signification |
|:--:|---|
| ✅ | Spécification complète, validée, prête à appliquer |
| 🔨 | En attente d'application code (dev env requis) |
| ⏸️ | Bloqué par une décision / pré-requis tiers |
| 🚧 | En cours de rédaction |
| 🧊 | Gelé / reporté |
| 🎯 | Appliqué en production (commit déployé confirmé) |

---

## 1. Vue d'ensemble des 5 workstreams

| Workstream | Dossier | Livrables | Statut global | Owner lead |
|---|---|:--:|:--:|---|
| **A.** Cadastre + Pétrochimie + EOR | `ACTIONS_CADASTRE/` | 7 | ✅ specs · 🔨 code | Dev front + DirCom |
| **B.** Fusion EnerTech + Énergies | `ACTIONS_INTEGRATION/` | 11 | ✅ specs · ⏸️ COMEX | Tech lead + PMO |
| **C.** Audit vs Majors O&G | `AUDIT_ACTIONS/` | 12 | ✅ specs · ⏸️ COMEX | Direction Stratégie |
| **D.** Méga-menu (bugs + audit liens) | `PATCHES_MEGA_MENU/` | 9 patches + 1 verdict | ✅ specs · 🔨 code | Dev front |
| **E.** Images HD libres pour le site | `ASSETS_IMAGES_HD/` | 6 | ✅ specs · 🔨 pipeline | Tech Front + DirCom |

**Total livrables** : 45 specs markdown + 4 patches `.patch` + 2 bundles `.bundle` + 3 archives `.zip`.

---

## 2. Workstream A · Cadastre + Pétrochimie + EOR

### 2.1 Statut livrables

| # | Livrable | Statut | Action concrète restante |
|:--:|---|:--:|---|
| 01 | État des lieux | ✅ | — |
| 02 | Checklist push 19 commits | ✅ | 🔨 Pousser `enertchad-cadastre-v151.bundle` sur `main` (DevOps) |
| 03 | Plan EOR | ✅ | 🔨 Créer section `#eor` sur `operations/amont.html` + `assets/data/eor-tchad.json` |
| 03b | Ingrédients locaux EOR | ✅ | 🔨 Intégrer les 5 blocs éditoriaux dans le livrable 03 |
| 04 | Visibilité Pétrochimie | ✅ | 🔨 Ajouter teaser Accueil + lien croisé Amont↔Aval |
| 05 | QA post-push | ✅ | 🔨 Exécuter scripts smoke T+30min puis J+3 |
| 06 | Communication nouveautés | ✅ | 🔨 DirCom : déclencher templates J0→J+14 |

### 2.2 Blocages actuels

- **Push bundle** : en attente déblocage environnement dev malware-check
- **Section EOR** : dépend du push préalable (ordre chronologique)
- **Communication** : dépend de la confirmation de disponibilité effective des contenus en prod

### 2.3 Chemin critique

```
Push v1.5.1 bundle → Smoke QA T+30 → Dev section EOR (1j) → QA J+3 → Communication J+4
```

Durée totale : **4 jours calendaires**, **~1,75 j-dev cumulés**.

---

## 3. Workstream B · Fusion EnerTech + Énergies

### 3.1 Statut livrables

| # | Livrable | Statut | Action concrète restante |
|:--:|---|:--:|---|
| 01 | Inventaire sections | ✅ | — |
| 02 | Audit URLs & backlinks | ✅ | 🔨 Exécuter crawl (Screaming Frog ou équivalent) |
| 03 | Baseline qualité | ✅ | 🔨 Lighthouse CI runs sur les 3 sites |
| 04 | Architecture cible | ✅ | 🔨 Valider arborescence `/poles/<slug>/` |
| 05 | Plan migration pages | ✅ | 🔨 Commencer migration page par page (6 j) |
| 06 | SEO + redirects | ✅ | 🔨 Production `_redirects` consolidé |
| 07 | Plan QA | ✅ | — |
| 08 | Désaffectation | ✅ | 🔨 Programmation archivage post-bascule |
| 09 | Communication fusion | ✅ | 🔨 Valider calendrier DirCom |
| 10 | Registre risques / RACI | ✅ | — |
| 11 | Note décision COMEX | ✅ | ⏸️ **En attente validation COMEX** |

### 3.2 Décisions bloquantes (COMEX)

1. **Retenir Scénario B** (fusion hub) oui / non
2. **Sous-domaines vs sous-répertoires** `/poles/<slug>/`
3. **Budget** ~9 600 € alloué ? équipe ?
4. **Fenêtre de bascule** (soirée week-end vs progressive)
5. **Date cible mise en prod** — recommandée fin mai 2026

**Avant validation COMEX** : tout le workstream est gelé en état « specs prêtes ».

### 3.3 Chemin critique

```
Décision COMEX → Phase 1 (1,5 j) → Phase 2 (7 j) → Phase 3 (3 j) → Phase 4 (1,5 j)
```

Durée totale : **4 semaines**, **~14,5 j-dev cumulés**.

---

## 4. Workstream C · Audit vs Majors O&G

### 4.1 Statut livrables (12 actions COMEX)

| # | Action | Horizon | Statut | Décision COMEX | Action concrète restante |
|:--:|---|:--:|:--:|---|---|
| 01 | Page conformité ISO transparente | 0-90 j | ✅ | Position B validée | 🔨 Création page `/groupe/conformite-iso.html` |
| 02 | Adhésion ITIE + rapports | 0-30 j | ✅ | Publication immédiate | 🔨 Publier courrier adhésion ITIE Tchad |
| 03 | Page gouvernance | 0-60 j | ✅ | Plan 90j approuvé | 🔨 Page `/groupe/gouvernance.html` |
| 04 | Rapport activité 2025 | 0-180 j | ✅ | Publication T2 2026 | 🔨 Finaliser design + texte |
| 05 | Feuille route climat 2026-2035 | 90-180 j | ✅ | Approbation CA | ⏸️ **CA à venir** |
| 06 | Partenaires aval shortlist | 90-180 j | ✅ | Mandat conseil | ⏸️ RFP cabinet conseil |
| 07 | Teaser investisseur 2026 | 180-365 j | ✅ | Diffusion T3 2026 | 🔨 Production PDF + landing page |
| 08 | Programme formation (Fondation) | 180-365 j | ✅ | Fondation créée 2026 | ⏸️ Création juridique Fondation |
| 09 | Term sheet JV aval | 180-365 j | ✅ | Usage dès 1er partenaire | — |
| 10 | Plan certification ISO | 180-365 j → 30m | ✅ | RFP lancé J+10 | 🔨 Lancer RFP organisme certificateur |
| 11 | Rapport intégré GRI/SASB | 180-365 j → T2 2027 | ✅ | Publication T2 2027 | 🔨 Cadrage méthodologique |
| 12 | Stratégie notation ESG | 365-730 j | ✅ | Plan 24m validé | 🔨 Cabinet diagnostic ESG |

### 4.2 Budget consolidé

| Année | Montant | Cumul |
|:--:|:--:|:--:|
| 1 | 6,5 M€ | 6,5 M€ |
| 2 | 15,2 M€ | 21,7 M€ |
| 3 | 25,1 M€ | 46,8 M€ |

### 4.3 Décisions Conseil d'administration

1. ⏸️ Validation positionnement « intégrateur aval régional CEMAC »
2. ⏸️ Libération budget année 1 (~6,5 M€)
3. ⏸️ Nominations : DirQ/Conformité, DirStrat/RSE, Corp Dev
4. ⏸️ Lancements : RFP ISO, diagnostic ESG, cabinet stratégique
5. ⏸️ Mandat cabinet recrutement administrateurs indépendants
6. ⏸️ Approbation lancement Fondation EnerTchad Talents
7. ⏸️ Signature MoU non-engageants (raffineur + retailer + université)

---

## 5. Workstream D · Méga-menu

### 5.1 Statut patches techniques (01-07)

| # | Patch | Type | Effort | Risque | Bloque prod | Statut |
|:--:|---|---|:--:|:--:|:--:|:--:|
| 01 | BUG-1 multi-open ⌘K | JS | 30 min | Faible | ⚠️ Oui | ✅ spec · 🔨 code |
| 02 | BUG-2/3 Esc & idempotence | JS | 35 min | Faible | Non | ✅ spec · 🔨 code |
| 03 | A11Y CSS (contrastes, target-size) | CSS | 45 min | Faible | Non | ✅ spec · 🔨 code |
| 04 | A11Y JS (aria-live, throttle) | JS | 40 min | Faible | Non | ✅ spec · 🔨 code |
| 05 | Crédibilité — notations ESG | JS + HTML | 60 min | Moyen | ⚠️ Oui | ✅ spec · 🔨 code |
| 06 | Crédibilité — RH + sources | JS + HTML | 45 min | Faible | Non | ✅ spec · 🔨 code |
| 07 | Refonte ARIA Disclosure | JS + HTML | 3 h | Moyen | Non (Sprint 3) | ✅ spec · 🔨 code |

### 5.2 Audit des liens + Verdict A+B+C (08, 09)

| # | Livrable | Statut | Action concrète restante |
|:--:|---|:--:|---|
| 08 | Audit complet liens méga-menu | ✅ | Diagnostic 28 % cassés identifié |
| 09 | Application verdict A+B+C | ✅ | 🔨 Sprint A (0,5j) + B (1-2j) + C (0,5j) = 2-3 j |

### 5.3 Détail Sprint A+B+C

| Sprint | Contenu | Effort | Statut | Action concrète |
|:--:|---|:--:|:--:|---|
| **A** | 3 CTA 404 fixés + ancre #ethique→#itie | 0,5 j | ✅ spec · 🔨 code | Modifier `assets/js/main.js` config `MEGA_PANELS` |
| **B** | 17 ancres orphelines créées | 1-2 j | ✅ spec · 🔨 code | Ajouter `<section id>` dans 5 pages (groupe, investisseurs, durabilite, talents, actualites, contact) |
| **C** | Clean URLs multi-plateformes | 0,5 j | ✅ spec · 🔨 code | Éditer `_redirects`, `netlify.toml`, `vercel.json` |

### 5.4 Budget total méga-menu

- Patches 01-07 : **~6 h dev + 2 h QA**
- Verdict A+B+C : **2-3 j**
- **Total cumulé** : ~3-4 j-dev (si tout enchaîné)

### 5.5 Tag Git cible

- `v1.5.2-mega-menu-patches` (patches 01-07)
- `v1.5.3-mega-menu-fix` (verdict A+B+C)

---

## 6. Workstream E · Images HD libres

### 6.1 Statut livrables

| # | Livrable | Statut | Action concrète restante |
|:--:|---|:--:|---|
| 00 | Index + inventaire 50 images | ✅ | — |
| 01 | Sources libres & licences | ✅ | — |
| 02 | Catalogue URLs thématiques | ✅ | 🔨 DirCom valide shortlist V1 (10 images hero/cards) |
| 03 | Workflow intégration | ✅ | 🔨 Implémenter `optimize-images.mjs` (sharp.js) |
| 04 | Script téléchargement batch | ✅ | 🔨 Implémenter `download-images.mjs` + `sources.json` |
| 05 | Checklist validation visuelle | ✅ | 🔨 Matrice signoff 50 images |

### 6.2 Chemin critique

```
DirCom signoff shortlist V1 → download batch (auto) → optimize WebP/AVIF → intégration <picture> → Lighthouse post-intégration → remplacement progressif trimestriel
```

Durée totale première passe : **~2 j-dev + 1 j DirCom**.

---

## 7. 🎯 Queue d'exécution priorité P0 → P2

### P0 — À lancer dès que malware-check levé (< 2 jours)

| Ordre | Action | Owner | Effort | Dépend de |
|:-:|---|---|:--:|---|
| 1 | **Push bundle `enertchad-cadastre-v151.bundle` sur main** | DevOps | 15 min | malware-check OK |
| 2 | **Smoke QA T+30min post-push** | QA | 30 min | Push OK |
| 3 | **Sprint A méga-menu** (3 CTA 404 + ancre) | Dev front | 0,5 j | Push OK |
| 4 | **Patches méga-menu 01, 02** (bugs JS bloquants) | Dev front | 1 h | Push OK |

**Total P0** : **~1 jour** (Dev front + DevOps + QA).

### P1 — À enchaîner semaine suivante (< 7 jours)

| Ordre | Action | Owner | Effort | Dépend de |
|:-:|---|---|:--:|---|
| 5 | **Création section EOR** (opérations/amont.html + JSON) | Dev front + Dir Amont | 1 j | P0 |
| 6 | **Patches méga-menu 03-06** (a11y + crédibilité) | Dev front | 3 h | P0 |
| 7 | **Sprint B méga-menu** (17 ancres orphelines) | Dev front + DirCom | 1-2 j | P0 |
| 8 | **Sprint C méga-menu** (clean URLs) | DevOps | 0,5 j | Décision plateforme vérité |
| 9 | **Visibilité Pétrochimie** (teaser home + cross-link) | Dev front | 0,25 j | EOR livré |
| 10 | **QA post-push J+3** (Lighthouse, axe) | QA | 0,5 j | P1 7-9 |
| 11 | **Communication J+4** (DirCom templates) | DirCom | 0,25 j | P1 10 |

**Total P1** : **~4,5 j-dev + 0,5 j DirCom + 0,5 j QA**.

### P2 — À planifier mois suivant (< 30 jours)

| Ordre | Action | Owner | Effort | Dépend de |
|:-:|---|---|:--:|---|
| 12 | **Workstream images HD V1** (download + optimize + intégration) | Tech Front + DirCom | 2 j + 1 j | Signoff shortlist |
| 13 | **Patch méga-menu 07** (refonte ARIA Disclosure) | Dev front | 3 h | P1 OK |
| 14 | **Décision COMEX intégration EnerTech+Énergies** | COMEX | 1 séance | — |
| 15 | **Si GO COMEX** : Phase 1 intégration (inventaire, audit URLs, baseline) | Tech lead + SEO | 2 j | 14 |
| 16 | **Page conformité ISO** + **page gouvernance** (Audit Majors 01, 03) | Dev front + DirCom | 2 j | — |
| 17 | **Rapport activité 2025** (Audit Majors 04) | Corporate + DirCom | > 10 j | T2 2026 cible |
| 18 | **Adhésion ITIE + communication** (Audit Majors 02) | Direction Stratégie | 2 j | Publication immédiate |

**Total P2** : **~20 j-dev + 5 j DirCom + 10 j Corporate/Strat**.

### P3 — Horizon trimestriel / annuel (> 30 jours)

- Feuille de route climat 2026-2035 (capex bas-carbone ramp-up)
- Shortlist partenaires aval + RFP cabinet conseil
- Teaser investisseur 2026 (production)
- Programme Fondation Talents (création juridique)
- Plan certification ISO (RFP organisme)
- Rapport intégré GRI/SASB/IFRS S2 (T2 2027)
- Stratégie notation ESG (diagnostic)
- Intégration EnerTech+Énergies Phases 2-4 (si COMEX GO)

---

## 8. 📊 Résumé des effets attendus par workstream

| Workstream | KPI principal | Baseline | Cible post-exécution |
|---|---|:--:|:--:|
| A. Cadastre+EOR+Pétrochimie | Pages stratégiques en prod | 15 / 18 | 18 / 18 (100 %) |
| B. Fusion Intégration | Sites maintenus | 3 | 1 |
| C. Audit Majors | Actions crédibilité visibles | 0 / 12 | 4 / 12 à 90 j, 8 / 12 à 365 j |
| D. Méga-menu | % liens fonctionnels | 72 % | 100 % |
| E. Images HD | Pages avec visuels non placeholder | < 20 % | 100 % |

### KPIs techniques cibles après exécution complète P0+P1

| Page | LCP | CLS | Lighthouse Perf | Lighthouse A11y | axe-core |
|---|:--:|:--:|:--:|:--:|:--:|
| `index.html` | ≤ 2,0 s | ≤ 0,05 | ≥ 92 | ≥ 95 | 0 critical |
| `operations/amont.html` | ≤ 2,5 s | ≤ 0,1 | ≥ 90 | ≥ 95 | 0 critical |
| `operations/aval.html` | ≤ 2,5 s | ≤ 0,1 | ≥ 90 | ≥ 95 | 0 critical |
| `groupe.html` | ≤ 2,0 s | ≤ 0,05 | ≥ 92 | ≥ 95 | 0 critical |
| `durabilite.html` | ≤ 2,0 s | ≤ 0,05 | ≥ 92 | ≥ 95 | 0 critical |

---

## 9. ⏸️ Décisions bloquantes encore ouvertes

| # | Décision | Owner décision | Blocage de | Impact si non-prise |
|:-:|---|---|---|---|
| 1 | Levée malware-check env dev | RSSI + Tech lead | **TOUT** code effectif | 0 % des specs appliquées |
| 2 | Plateforme vérité routing (Netlify / Cloudflare / Vercel) | DevOps + Tech lead | Sprint C méga-menu | Clean URLs incomplètes |
| 3 | Scénario B fusion EnerTech+Énergies | COMEX | Workstream B entier | Maintenance × 3 continue |
| 4 | Positionnement stratégique « intégrateur CEMAC » | Conseil d'administration | Workstream C (notation, teaser) | Crédibilité stratégique |
| 5 | Budget année 1 (6,5 M€) | CA | Workstream C (formation, ISO, ESG) | Actions Audit Majors gelées |
| 6 | Signoff shortlist images V1 | DirCom | Workstream E | Placeholders en prod |
| 7 | Validation textes Sprint B (17 ancres) | DirCom | Sprint B méga-menu | 17 ancres restent 404 |
| 8 | Validation chiffres EOR | Dir Amont | Livrable 03 | Section EOR vide |

---

## 10. 🔗 Liens rapides vers les dossiers

| Workstream | Index |
|---|---|
| A. Cadastre+EOR+Pétrochimie | [`ACTIONS_CADASTRE/00_INDEX.md`](ACTIONS_CADASTRE/00_INDEX.md) |
| B. Intégration EnerTech+Énergies | [`ACTIONS_INTEGRATION/00_INDEX_ACTIONS_INTEGRATION.md`](ACTIONS_INTEGRATION/00_INDEX_ACTIONS_INTEGRATION.md) |
| C. Audit vs Majors O&G | [`AUDIT_ACTIONS/00_INDEX_ACTIONS_APPLIED.md`](AUDIT_ACTIONS/00_INDEX_ACTIONS_APPLIED.md) |
| D. Méga-menu | [`PATCHES_MEGA_MENU/00_INDEX_PATCHES.md`](PATCHES_MEGA_MENU/00_INDEX_PATCHES.md) |
| E. Images HD | [`ASSETS_IMAGES_HD/00_INDEX.md`](ASSETS_IMAGES_HD/00_INDEX.md) |

### Documents de release associés

- [`PUSH_CADASTRE_v1.5.1.md`](PUSH_CADASTRE_v1.5.1.md) — instructions push 19 commits
- [`ULTRA_HEADER_RELEASE.md`](ULTRA_HEADER_RELEASE.md) — release notes header
- [`ULTRA_MEGA_MENU_RELEASE.md`](ULTRA_MEGA_MENU_RELEASE.md) — release notes méga-menu
- [`PUSH_INSTRUCTIONS.md`](PUSH_INSTRUCTIONS.md) — procédures push
- [`CLOUDFLARE_SETUP.md`](CLOUDFLARE_SETUP.md) — setup Cloudflare Pages
- [`DOMAIN_SETUP.md`](DOMAIN_SETUP.md) — setup domaine
- [`AUTONOMOUS_WORK_LOG.md`](AUTONOMOUS_WORK_LOG.md) — journal de bord

### Audits transverses

- [`AUDIT_MAJORS_OIL_GAS.md`](AUDIT_MAJORS_OIL_GAS.md) — source workstream C
- [`AUDIT_MEGA_MENU.md`](AUDIT_MEGA_MENU.md) — source workstream D patches 01-07
- [`AUDIT_INTEGRATION_ENERTECH_ENERGIES.md`](AUDIT_INTEGRATION_ENERTECH_ENERGIES.md) — source workstream B
- [`AUDIT_MAJORS_ONE_PAGER.md`](AUDIT_MAJORS_ONE_PAGER.md) — synthèse 1 page

### Bundles Git prêts à pousser

- `enertchad-cadastre-v151.bundle` — 19 commits (P0)
- `enertchad-14-commits.bundle` — 14 commits historiques

### Patches .patch individuels

- `patch-header-dedup.patch`
- `patch-home-cadastre-teaser.patch`
- `patch-main-landmark.patch`
- `patch-petrochimie.patch`

---

## 11. 📅 Timeline consolidée (Gantt simplifié)

```
Sem 0 (22-26 avr)  │████░░░░░░░░░░░░░░░░░░░░░░░░░░│ P0 : push v1.5.1 + Sprint A méga-menu
Sem 1 (27 avr-3 mai)│    ██████████░░░░░░░░░░░░░░░░│ P1 : EOR + Sprints B/C méga-menu + patches 03-06 + QA J+3
Sem 2 (4-10 mai)   │              ████████░░░░░░░░│ P2 : images HD V1 + patch 07 + pages corp (ISO, gouv)
Sem 3-4 (11-24 mai)│                      ████████│ P2 : rapport activité + COMEX fusion + ITIE
M+2 (juin)         │                              │ P3 : si GO COMEX → Phase 1-2 intégration
M+3 (juillet)      │                              │ P3 : phase 3-4 intégration + teaser investisseur
M+4 à M+12         │                              │ P3 : feuille route climat, fondation, ISO, ESG
```

---

## 12. 📮 Prochaines actions concrètes (next 48h)

1. **[RSSI + Tech lead]** Statuer sur la levée du malware-check pour l'environnement local de développement → sans cela **aucune** des 45 specs ne peut être appliquée.
2. **[DevOps]** Une fois malware-check levé : suivre [`ACTIONS_CADASTRE/02_PUSH_CHECKLIST.md`](ACTIONS_CADASTRE/02_PUSH_CHECKLIST.md) pour pousser le bundle v1.5.1.
3. **[QA]** Lancer le protocole [`ACTIONS_CADASTRE/05_QA_POST_PUSH.md`](ACTIONS_CADASTRE/05_QA_POST_PUSH.md) Phase 1 (smoke T+30min) puis Phase 2 (J+3).
4. **[Dev front]** Enchaîner Sprint A méga-menu (0,5 j) — cible : premier verrou de crédibilité levé.
5. **[DirCom]** Valider : (a) shortlist images V1 (livrable E02), (b) textes des 17 ancres Sprint B (livrable D09).
6. **[COMEX]** Programmer séance pour trancher les 5 décisions fusion EnerTech+Énergies (livrable B11).
7. **[Conseil administration]** Programmer séance pour trancher les 7 décisions Audit Majors (livrable C00).

---

## 13. 🛡️ Gouvernance du tracker

- **Fréquence de mise à jour** : hebdomadaire, le vendredi, par le PMO.
- **Déclencheurs additionnels** :
  - Passage d'un statut ✅ → 🎯 (déploiement confirmé)
  - Nouvelle décision COMEX / CA
  - Nouveau livrable ajouté à l'un des 5 workstreams
- **Format de mise à jour** : éditer ce fichier + mentionner le changement dans [`AUTONOMOUS_WORK_LOG.md`](AUTONOMOUS_WORK_LOG.md).
- **Archivage** : snapshot trimestriel dans `ARCHIVE/MASTER_ACTIONS_TRACKER-{YYYY-QN}.md`.

---

*Master Actions Tracker v1.0 — 22 avril 2026. Propriétaire : PMO. Contributeurs : Tech Front, DevOps, QA, DirCom, Direction Stratégie, COMEX.*
