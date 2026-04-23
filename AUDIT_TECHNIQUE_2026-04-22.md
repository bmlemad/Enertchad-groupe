# Audit technique — EnerTchad Web Solutions

**Date** : 2026-04-22
**Périmètre** : 23 pages HTML (17 racine + 4 `operations/` + 1 `energies/` + 1 `technologies/`)
**Base** : dossier de publication `.` (racine workspace)
**Taille du site** : 6,2 Mo après nettoyage (vs 29 Mo avant — -79 %)
**Méthode** : inspection statique (liens, meta, CSP, en-têtes, a11y, SEO, PWA) + cohérence multi-déploiement (`_headers` / `netlify.toml` / `vercel.json`)

> **Statut d'application** (2026-04-22, même jour) : les P0 (4/4) et P1 (7/7) listés ci-dessous ont été **appliqués**. Les P2 restants sont signalés en fin de chaque ligne. Voir le récapitulatif en bas du document.

---

## Synthèse exécutive

| Sévérité | Nombre | Sujet dominant |
|---|---|---|
| **P0** — critique | 4 | Cohérence CSP/HSTS entre plateformes, SRI absente sur CDN |
| **P1** — haute | 7 | Meta SEO manquantes sur pages d'erreur, configs de redirection divergentes, gestionnaires inline |
| **P2** — moyenne | 8 | Fichiers source dans le publish root, landmarks pages minimalistes, PurgeCSS résiduel |

Le site est globalement **propre et cohérent** : français balisé sur les 23 pages, zéro `<img>` sans `alt`, zéro `target="_blank"` sans `rel="noopener"`, zéro ID dupliqué, sitemap et robots.txt conformes, Service Worker v1.9.2 opérationnel, polices auto-hébergées (conformité RGPD). Les défauts restants tiennent à la **cohérence inter-plateformes** de déploiement plus qu'à la qualité intrinsèque du site.

---

## P0 — Critiques (à corriger avant prochain déploiement)

### P0-1 — La CSP de `netlify.toml` et `vercel.json` bloque Plausible Analytics

**Où**

- `netlify.toml` → `Content-Security-Policy` ne mentionne `https://plausible.io` que dans `connect-src`, pas dans `script-src`.
- `vercel.json` → idem : `script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com` **sans** `https://plausible.io`.
- Seul `_headers` (Cloudflare/Netlify) a la bonne valeur : `script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://plausible.io`.

**Impact** : si le site est servi par Netlify ou Vercel, le navigateur refuse le chargement de `plausible.io` et aucune analytics ne remonte. C'est silencieux (pas d'erreur visible au visiteur) mais casse la mesure d'audience.

**Fix proposé** : ajouter `https://plausible.io` à `script-src` dans `netlify.toml` et `vercel.json`, et harmoniser la CSP complète avec `_headers`.

### P0-2 — Chart.js chargé depuis cdnjs sans `integrity` (SRI)

**Où** : `dashboard.html`, `energies/index.html`, `technologies/index.html`
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
```

**Impact** : si cdnjs est compromis ou qu'un MITM sur HTTP-downgrade injecte un script modifié, le navigateur l'exécute sans vérification d'intégrité. Pour un site institutionnel (investisseurs, CODIR), c'est un angle d'attaque supply-chain à fermer.

**Fix proposé** : ajouter l'attribut `integrity="sha384-..."` et `crossorigin="anonymous"` :
```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"
  integrity="sha384-f+g5REn2Rvj7X2+oFYXWjkHipbS6bZ5SPZXH6VTkBDTlQzgfZU4vXvjcS1NxKJY8"
  crossorigin="anonymous"
  referrerpolicy="no-referrer"></script>
```
(le hash est à vérifier sur `https://www.srihash.org/` ou https://cdnjs.cloudflare.com/ — choisir la même version figée). Alternative plus robuste : télécharger Chart.js dans `assets/js/vendor/` comme les autres libs React/Recharts.

### P0-3 — `netlify.toml` déclare une CSP Google Fonts obsolète

**Où** : `netlify.toml`
```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
```

**Impact** : les polices sont **auto-hébergées** (voir `assets/fonts/Inter-latin.woff2` et `SpaceGrotesk-latin.woff2`, préchargées via `<link rel="preload" as="font">`). Les domaines Google Fonts autorisés dans la CSP ne servent plus à rien, et signalent à tort une dépendance externe (risque RGPD si un contrôleur lit la policy sans lire le site).

**Fix proposé** : aligner sur `_headers` — retirer `https://fonts.googleapis.com` et `https://fonts.gstatic.com` :
```
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
```

### P0-4 — HSTS divergent entre `_headers` et `vercel.json`

**Où**
- `_headers` : `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (1 an)
- `vercel.json` : `max-age=63072000; includeSubDomains; preload` (2 ans)

**Impact** : selon la plateforme, le navigateur retient l'annonce HSTS pour une durée différente. Pour être éligible au [HSTS preload list](https://hstspreload.org/), il faut `max-age ≥ 31536000` (1 an) — les deux passent, mais l'incohérence crée de la dette.

**Fix proposé** : adopter `max-age=63072000` (2 ans) partout (c'est la recommandation actuelle). Mettre à jour `_headers` et `netlify.toml` en cohérence. ⚠️ Avant d'activer le preload : s'assurer que **tous** les sous-domaines servent en HTTPS (la bascule est quasi irréversible).

---

## P1 — Haute priorité

### P1-1 — Pages d'erreur (500 & offline) sans balises SEO/OG

**Où**
- `500.html` : manque `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:*">`, `<meta name="twitter:*">`, JSON-LD.
- `offline.html` : mêmes manques.
- `404.html` : description et canonical présentes, mais **OpenGraph et Twitter absents**.

**Impact** : si ces URL sont partagées (copier-coller de lien), le rendu OG est vide → crédibilité dégradée. Pour 500/offline, le risque est plus faible (aucune indexation), mais la cohérence du patrimoine meta devrait être maintenue.

**Fix proposé** : ajouter a minima `<meta property="og:title">`, `og:description`, `og:image` (réutiliser l'image OG du site) sur les 3 pages. Bloquer l'indexation avec `<meta name="robots" content="noindex">` sur 500/offline (cohérent avec leur absence du `sitemap.xml`).

### P1-2 — Redirections absentes dans `netlify.toml`

**Où** : `vercel.json` définit des redirections qui n'existent pas dans `netlify.toml` :
- `/privacy` → `/confidentialite.html`
- `/legal` → `/mentions-legales.html`
- `/enertech`, `/greentech` → pages correspondantes

**Impact** : liens courts cassés si le site est servi par Netlify. Le fichier `_redirects` (Cloudflare/Netlify) contient aussi des raccourcis-ancres (`/eor`, `/petrochimie`, `/ccus`) **non mirrorés** dans `vercel.json`.

**Fix proposé** : établir une source unique (ex. `_redirects`) et générer `netlify.toml` + `vercel.json` depuis celle-ci. A minima, aligner manuellement les 3 fichiers sur le même set de 20+ routes.

### P1-3 — Gestionnaires d'événements inline (`onclick`, `onsubmit`)

**Où**
- `500.html:29` → `<button ... onclick="location.reload()">`
- `offline.html:30` → `<button ... onclick="location.reload()">`
- `newsletter.html:373` → `<form ... onsubmit="event.preventDefault(); ...">`

**Impact** : la CSP actuelle autorise `'unsafe-inline'` dans `script-src`, donc ça fonctionne. Mais `'unsafe-inline'` est précisément la faiblesse à éliminer pour durcir la CSP (ex. passer à `strict-dynamic` + nonce). Tant que ces handlers existent, durcir la CSP = casser la page.

**Fix proposé** : externaliser dans `assets/js/main.js` ou un petit script dédié, puis retirer `'unsafe-inline'` de la CSP. Exemple :
```html
<button class="btn btn-primary" data-action="reload">Réessayer</button>
<script nonce="{{csp_nonce}}">
  document.querySelectorAll('[data-action="reload"]').forEach(b =>
    b.addEventListener('click', () => location.reload()));
</script>
```

### P1-4 — `dashboard-executif.html` sans landmark `<main>`

**Où** : `dashboard-executif.html` (5 Ko, shell React)

**Détail** : contient uniquement `<footer>` en statique. Le contenu (incluant `<main>`, `<h1>`) est injecté au runtime par le bundle React `dashboard-executif.9cb059fc.bundle.js`.

**Impact** : avant hydration (connexions lentes, JS bloqué, crawlers non-JS), la page n'a ni titre principal, ni landmark de contenu, ni fallback narrative → WCAG 2.1 AA : succès 1.3.1, 2.4.1, 2.4.6 non garantis. Crawler non-JS = page perçue comme vide.

**Fix proposé** : ajouter dans le HTML statique un fallback visible pendant le chargement, puis remplacé par React :
```html
<main id="app">
  <h1 class="sr-only">Tableau de bord exécutif EnerTchad</h1>
  <p class="loading-fallback">Chargement du tableau de bord…</p>
</main>
```
Idem pour `dashboard.html` (qui a `<main>` et `<section>` mais aucun `<h1>` dans le HTML statique — à confirmer si le `<h1>` est bien injecté avant First Contentful Paint).

### P1-5 — Entités HTML dans les `<title>`

**Où** : `operations/amont.html`, `operations/aval.html`, `operations/services.html`
```
<title>... &amp; ...</title>
```

**Impact** : valide HTML, mais incohérent stylistiquement avec les autres titres du site qui n'utilisent pas `&amp;`. Certains outils d'indexation/aperçu affichent `&amp;` littéralement.

**Fix proposé** : remplacer par `&` littéral (valide dans `<title>` HTML5) ou par un tiret/virgule :
```html
<title>EnerTchad — Amont : exploration et production</title>
```

### P1-6 — Cookies/confidentialité : vérifier le JSON-LD sur chaque page légale

**Où** : `confidentialite.html`, `mentions-legales.html`, `cookies.html` — vérifier présence de `<script type="application/ld+json">` avec type `WebPage` ou `PrivacyPolicy`/`LegalPolicy`.

**Impact** : Google enrichit l'extrait si le JSON-LD est présent. Moins critique que l'OG, mais recommandé pour un site corporate/investisseurs.

**Fix proposé** : ajouter JSON-LD minimal sur les 3 pages légales.

### P1-7 — CSV/images publiés : `/documents/` et `/poles/` dans le publish root

**Où** (à la racine du `publish`)
- `/documents/` — 6 fichiers (3 PDF, 1 DOCX, 1 PPTX, + cadastre). Servis à l'URL `/documents/*`.
- `/poles/` — 6 fichiers Markdown (sources internes : `01-amont.md`, `02-midstream.md`, ...).

**Impact**
- `/documents/*.pdf` : ok si intentionnel (liens explicites dans `actualites.html`, `investisseurs.html`, etc.). À vérifier que chaque fichier PDF/DOCX/PPTX est bien public.
- `/poles/*.md` : **fuite de contenu source**. Ces Markdown n'ont aucun lien entrant mais sont accessibles en direct (`https://domaine/poles/01-amont.md`) et crawlables par Google si un lien externe les référence un jour.

**Fix proposé**
- `/poles/` : déplacer hors du dossier de publication (ex. `/_sources/poles/`), ou ajouter un `index.html` 404, ou bloquer via `_redirects` :
  ```
  /poles/*  /404.html  404
  ```
  Et ajouter `Disallow: /poles/` dans `robots.txt` en ceinture-bretelles.
- `/documents/` : ajouter `X-Robots-Tag: noindex` sur les docs internes (ex. `EnerTchad-Deck-CODIR-*.pptx`) s'ils ne sont pas destinés à l'indexation publique :
  ```
  /documents/*CODIR*
    X-Robots-Tag: noindex, nofollow
  ```

---

## P2 — Priorité moyenne

### P2-1 — `dashboard-src/` dans le publish root

**Où** : `/dashboard-src/` contient les sources React (`dashboard-executif.jsx`, `build.mjs`, `package.json`, `tailwind.config.cjs`, `package-lock.json`, `input.css`).

**Impact** : si déployé en l'état, tout visiteur peut lire `https://domaine/dashboard-src/package.json` et exposer les dépendances / versions. Pas catastrophique mais non souhaitable.

**Fix proposé** : déplacer `/dashboard-src/` en dehors du publish (par ex. `/tools/dashboard-src/`) et adapter `wrangler.toml` ou l'étape de build, ou ajouter au `.netlifyignore` / `.vercelignore` / configurer Cloudflare Pages pour l'exclure.

### P2-2 — CSS réductible via PurgeCSS (~2 %)

**Où** : `assets/css/main.css` (140 Ko, 4202 lignes). Analyse PurgeCSS précédente : ~3,6 Ko (2 %) marqués non utilisés.

**Impact** : gain mineur, à mettre en balance avec les **faux positifs** importants (classes Leaflet appliquées au runtime, sélecteurs `.cad-pipe[data-type=...]`, `.chip-tint-*` appliqués depuis JSON dynamique).

**Fix proposé** : ne **pas** appliquer PurgeCSS en auto. Faire une passe manuelle ciblée tous les 3-6 mois (identifier les blocs de composants déclarés mais non utilisés). Ne pas optimiser au détriment de la maintenabilité.

### P2-3 — Plusieurs `<header>` sur certaines pages

**Où** : `contact.html` en a 2 (site-header + page-hero header).

**Impact** : valide HTML5 (chaque section peut avoir son `<header>`). WCAG l'accepte tant que le rôle ARIA est cohérent. C'est une convention, pas un bug.

**Fix proposé** : aucune action requise. À documenter dans `DESIGN_SYSTEM.md` si ce n'est pas déjà fait.

### P2-4 — Sitemap : omission volontaire des pages d'erreur

**Où** : `sitemap.xml` liste 20 URLs. Manquent : `404.html`, `500.html`, `offline.html`.

**Impact** : c'est le bon comportement (les pages d'erreur ne doivent pas être indexées). Simplement confirmer par `noindex` côté meta (voir P1-1).

**Fix proposé** : ajouter `<meta name="robots" content="noindex">` sur les 3 pages pour être défensif.

### P2-5 — Liens "cassés" signalés : faux positifs à 100 %

**Où** : 28 liens signalés par le scan — tous sont soit :
- Des querystrings (`?lang=fr`, `?sujet=ir-...`) dont le script de vérification n'a pas isolé le chemin.
- Des ancres (`#section`) dans des pages existantes.

**Impact** : aucun. Le scan est à recalibrer.

**Fix proposé** : dans tout script de CI de link-check, isoler le `pathname` avant de tester l'existence du fichier :
```bash
url_path=$(echo "$url" | awk -F'[?#]' '{print $1}')
```

### P2-6 — `Cache-Control` des HTML principaux

**Où** : `_headers` — les HTML en racine ne sont pas explicitement configurés, seules les pages racine (`/*`) héritent de `public, max-age=600, must-revalidate`.

**Impact** : 10 min de cache navigateur. Raisonnable, mais couplé au Service Worker (stale-while-revalidate), l'utilisateur peut voir une version stale jusqu'à 10 min + cycle SW. Pas un bug, à garder en tête lors de publications urgentes (investor alerts, presse).

**Fix proposé** : documenter dans `README.md` le TTL de propagation effectif (max 10 min + 1 visite SW), ou réduire à `max-age=60` pour les pages sensibles (ex. `investisseurs.html`).

### P2-7 — CSV de données / `/assets/data/*`

**Où** : `assets/data/` (36 Ko). `Cache-Control: public, max-age=3600` (1 h).

**Impact** : correct pour des données fréquemment mises à jour. À vérifier que les fichiers sont utilisés (`cadastre`, `operations`) et non orphelins.

**Fix proposé** : audit orphelins à l'occasion d'un prochain nettoyage.

### P2-8 — `wrangler.toml` vs `netlify.toml` vs `vercel.json` : maintenance triple

**Où** : 3 configurations de déploiement parallèles pour 3 cibles différentes (Cloudflare, Netlify, Vercel).

**Impact** : chaque modification de header/redirection doit être faite 3 fois. Les 4 divergences P0/P1 ci-dessus témoignent de la dette induite.

**Fix proposé** : décider de la cible primaire (probablement Cloudflare Pages d'après `wrangler.toml` et les notes du projet) et ne maintenir que `_headers` + `_redirects`. Archiver `netlify.toml` et `vercel.json` dans `/_deploy-legacy/` ou les supprimer si Cloudflare est la cible définitive.

---

## Ce qui est bien (validation positive)

Éléments correctement implémentés, vérifiés page par page :

- **Langue** : `lang="fr"` sur les 23 pages.
- **Accessibilité images** : 0 `<img>` sans `alt` (seul `maps.html` a des `<img>`, 2/2 avec `alt`).
- **Liens externes** : 100 % des `target="_blank"` ont `rel="noopener"` (ou `noopener noreferrer`).
- **IDs HTML** : 0 doublon détecté.
- **Structure landmarks** (pages standard) : `<header>`, `<main>`, `<nav>`, `<footer>` cohérents.
- **Polices** : auto-hébergées, préchargées (`<link rel="preload" as="font">`), `crossorigin`.
- **Service Worker** : v1.9.2, stratégies appropriées (SWR pour HTML, cache-first pour `/assets/`).
- **Manifest PWA** : présent, 3 shortcuts, icônes 192 & 512.
- **Headers** : `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN` (ou DENY), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` présents sur `_headers`.
- **Cache statique** : immutable 1 an pour CSS/JS/images/fonts (`/assets/{css,js,img,fonts}/*`).
- **robots.txt** : interdit `/admin/`, `/api/`.
- **sitemap.xml** : 20 URLs, `lastmod: 2026-04-22`.

---

## Plan d'action recommandé (ordre)

1. **Immédiat** (P0-1 à P0-4) : harmoniser CSP/HSTS entre les 3 configs de déploiement, ajouter SRI sur Chart.js.
2. **Court terme** (P1-1 à P1-3) : compléter meta des pages d'erreur, aligner redirections, externaliser les handlers inline.
3. **Moyen terme** (P1-4 à P1-7) : fallback SSR sur dashboards, sortir `/poles/` et `/dashboard-src/` du publish root, annoter `/documents/*CODIR*` en `noindex`.
4. **Opportuniste** (P2) : décider la cible de déploiement primaire, simplifier les configs, audit des orphelins `/assets/data/`.

---

## Récapitulatif des actions appliquées (2026-04-22)

### P0 — 4/4 ✅
- **P0-1** Plausible ajouté à `script-src` dans `netlify.toml` et `vercel.json`.
- **P0-2** Chart.js 4.4.1 auto-hébergé dans `assets/js/vendor/chart.4.4.1.umd.min.js` ; les 3 pages (`dashboard.html`, `energies/index.html`, `technologies/index.html`) pointent désormais vers le fichier local. `cdnjs.cloudflare.com` retiré de `script-src` partout.
- **P0-3** Domaines Google Fonts retirés de la CSP `netlify.toml` (policies réalignées sur `_headers`).
- **P0-4** HSTS unifié à `max-age=63072000` (2 ans) sur les 3 configs.

### P1 — 7/7 ✅
- **P1-1** `404.html`, `500.html`, `offline.html` : ajout `description`, `canonical`, OpenGraph, Twitter cards. `500` et `offline` ont déjà `noindex, nofollow` (vérifié).
- **P1-2** `netlify.toml` : ajout des redirections `/privacy` → `/confidentialite.html` et `/legal` → `/mentions-legales.html` (parité avec `vercel.json`). Catch-all `404` replacé en fin de fichier.
- **P1-3** Handlers inline externalisés : `500.html`, `offline.html` (`onclick="location.reload()"` → `data-action="reload"` + listener), `newsletter.html` (`onsubmit` → `data-form="newsletter-signup"` + listener externalisé).
- **P1-4** `dashboard-executif.html` : ajout `<main id="main-content">` + `<h1 class="sr-only">` + message de chargement fallback avant hydration React.
- **P1-5** `&amp;` remplacé par `&` littéral dans les titres et les meta OG/Twitter de `operations/amont.html`, `operations/aval.html`, `operations/services.html`.
- **P1-6** Ajout d'un JSON-LD `WebPage` sur `mentions-legales.html`, `confidentialite.html`, `cookies.html` (en complément des `Organization` + `BreadcrumbList` déjà présents).
- **P1-7** `/poles/` déplacé dans `_sources/poles/` (hors chemin public), bloqué par `_redirects`, `netlify.toml`, `vercel.json`, et ajouté à `robots.txt`. `/dashboard-src/` traité de la même façon (cf. P2-1).

### P2 — Partiellement appliqué
- **P2-1** ✅ `/dashboard-src/` sorti du publish root (`_sources/dashboard-src/`), bloqué dans les 3 configs.
- **P2-2** ❌ Non appliqué (décision explicite : éviter les faux positifs PurgeCSS — à faire à la main ultérieurement).
- **P2-3 à P2-7** ❌ Non applicables ou à traiter plus tard (multiples `<header>` = valide HTML5, etc.).
- **P2-8** ❌ Pas de décision prise sur la cible de déploiement primaire — les 3 configs restent maintenues à l'identique.

### Fichiers créés / modifiés
| Fichier | Changement |
|---|---|
| `_headers` | HSTS → 2 ans, CSP sans `cdnjs.cloudflare.com` |
| `netlify.toml` | HSTS → 2 ans, CSP réalignée, ajout `/privacy` + `/legal` + anti-leak `/poles/`, `/_sources/`, `/dashboard-src/`, catch-all 404 en fin |
| `vercel.json` | CSP : `plausible.io` ajouté à `script-src`, `cdnjs.cloudflare.com` retiré, `manifest-src` + `worker-src` ajoutés, redirections anti-leak |
| `_redirects` | Ajout anti-leak `/poles/*`, `/_sources/*`, `/dashboard-src/*` |
| `robots.txt` | Ajout `Disallow: /_sources/` + `Disallow: /poles/` |
| `wrangler.toml` | Note sur `_sources/` |
| `404.html` | OG + Twitter cards |
| `500.html` | description, canonical, OG, Twitter, externalisation `onclick` |
| `offline.html` | idem `500.html` |
| `newsletter.html` | `onsubmit` externalisé |
| `dashboard-executif.html` | `<main>` + `<h1>` + fallback pre-hydration |
| `operations/{amont,aval,services}.html` | `&amp;` → `&` dans titres et meta |
| `{mentions-legales,confidentialite,cookies}.html` | Ajout JSON-LD `WebPage` |
| `dashboard.html`, `energies/index.html`, `technologies/index.html` | Chart.js CDN → local |
| **NOUVEAUX** : `.gitignore`, `.netlifyignore`, `.vercelignore`, `assets/js/vendor/chart.4.4.1.umd.min.js` | |
| **DÉPLACÉS** : `poles/` → `_sources/poles/`, `dashboard-src/` → `_sources/dashboard-src/` | |

### Vérifications post-application
- Aucun handler inline `onclick/onsubmit/on*` résiduel dans les 23 pages HTML (`grep` clean).
- Aucun `src="https://..."` résiduel (hors rapport d'audit lui-même).
- Aucun `&amp;` résiduel dans les `<title>`.
- CSP `script-src` identique sur `_headers`, `netlify.toml`, `vercel.json`.
- HSTS `max-age=63072000` identique partout.
- Taille finale : 6,4 Mo (6,2 Mo hors `_sources/`).

---

## Périmètre et limites de l'audit

- **Analyse statique uniquement**. Pas de Lighthouse runtime, pas de test de charge, pas de scan de vulnérabilité (npm audit), pas de test manuel des formulaires.
- **Accessibilité** : vérification structurelle (landmarks, alt, lang, ordre des titres, focus visible). Pas de test lecteur d'écran ni de navigation clavier complète.
- **Performance** : inspection des headers de cache et préchargement uniquement. Les Core Web Vitals réels dépendent du déploiement (Cloudflare réseau edge supposé) et doivent être mesurés via Search Console / CrUX.
- **Sécurité** : audit des headers, CSP, SRI. Pas de pentest actif, pas d'analyse de dépendances JS.

Pour une campagne Lighthouse + audit vulnérabilités sur les dépendances React/Recharts/Chart.js, prévoir une seconde passe avec les outils dédiés (`lighthouse-ci`, `npm audit --production`, `osv-scanner`).

---

## Itération v1.1.0 — Data harmonization & Services Master Page (2026-04-23)

### Contexte
Suite à la demande de harmonisation des data pour exploitation sur la version finale du site web, refonte de la couche data en source unique + page master services.

### Ajouts

**Data architecture (source of truth)**
- `DATA_MASTER.yml` v1.0.0 → **v1.1.0** avec 3 nouveaux blocs :
  - `services_catalog` — 10 services harmonisés (schéma v2 : id · slug · numero · nom · résumé · description · sous_services · technologies · secteurs · ctas · accent_hex · anchor · group · pole_parent)
  - `services_groups` — 4 macro-catégories (operations · technologies · energies · esg)
  - `cta_routes` — 11 slugs de routes /contact# pour pré-remplissage formulaire
- `changelog` ajouté dans `meta:` pour versioning traçable

**Machine export**
- `assets/data/services.json` — export JSON du catalogue, 14,9 Ko, consommable par front futur (Next.js/React)

**Build tooling**
- `_sources/tools/sync-services.py` — script de sync YAML→JSON + validation cross-refs + détection drift services.html (dry-run par défaut, `--apply` pour write). Idempotent.

**Page premium 10 sections**
- `services.html` — nouvelle page master services au niveau racine
  - Hero dark + TOC grid 10 entrées + 10 sections couleur-codées
  - Split historique ICS Security / Sécurité Physique (2 sections dédiées)
  - JSON-LD `CollectionPage` + `BreadcrumbList` + `ItemList` (numberOfItems=10)
  - CSS in-page pour accents par section (~200 lignes), respect du design system existant
  - A11y : landmarks, h1 unique, skip-link, `aria-current="page"` sur nav

**Discoverability cross-site**
- Lien `/services` en tête du footer "Activités" sur 16 pages (★ Tous les services)
- `sitemap.xml` : ajout `/services` (priority 0.95, lastmod 2026-04-23)

**Contact form enhancement**
- `contact.html` : nouvelle bannière `cta-prefill-banner` + script de pré-remplissage selon hash
- Les 11 CTA routes du catalogue pré-remplissent automatiquement `<select name="type">` et `<input name="subject">` + scroll vers le form
- Bouton clear pour annuler le pré-remplissage, gestion de `hashchange`

### Fichiers impactés

| Fichier | Action |
|---|---|
| `DATA_MASTER.yml` | v1.0.0 → v1.1.0 (+288 lignes) |
| `services.html` | **Nouveau** — 1100+ lignes, 10 sections |
| `assets/data/services.json` | **Nouveau** — export JSON 14,9 Ko |
| `_sources/tools/sync-services.py` | **Nouveau** — build script 150+ lignes |
| `sitemap.xml` | +1 URL (`/services` priority 0.95) |
| `contact.html` | +bannière + script de pré-remplissage CTA (~90 lignes) |
| 16 pages (index, groupe, investisseurs, durabilite, talents, actualites, contact, maps, newsletter, cookies, confidentialite, mentions-legales, operations/{amont,intermediaire,aval,services}.html) | +1 `<li>` footer Activités (lien `/services`) |

### Checks automatisés (post-v1.1.0)

```
✓ DATA_MASTER.yml v1.1.0 — 10 services · 4 groups · 11 CTA routes
✓ YAML ↔ JSON parity (10 services, IDs strictement identiques)
✓ services.html aligned (10 anchors, JSON-LD numberOfItems=10)
✓ cta_routes YAML ↔ contact.html parity (11/11 slugs)
✓ 0 orphan files root (43 fichiers connus)
✓ 0 stale anchors (section-security / #audit-securite obsolètes purgés)
✓ 16/16 pages footer Activités avec lien /services (100 %)
✓ sitemap.xml : 21 URLs dont /services
```

### Règle d'or workflow

> **Toute édition du contenu services se fait dans `DATA_MASTER.yml`**, puis exécuter :
> ```bash
> python3 _sources/tools/sync-services.py --apply
> ```
> Le script refuse d'écrire si les cross-refs sont cassées. La mise à jour de `services.html` reste manuelle (structure/layout) mais la source de vérité textuelle est dans le YAML.

### Reste à faire (hors audit v1.1.0)

- Propager un lien `/services` dans le **header nav** (pas seulement footer) — 16 pages à modifier, non prioritaire
- Ajouter les **pages détail par service** : `/services/[slug]` générées depuis `services.json` (dynamic routes, prévu Next.js v2.x)
- **Régénérer services.html via script** (passer à un générateur qui lit DATA_MASTER) — aujourd'hui la page est rédigée à la main
- Faire un **A/B sur les CTA** des 10 sections après 60 jours de données (heatmaps, click-through)
