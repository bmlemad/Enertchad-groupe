# EnerTchad Web Solutions — Guide de maintenance & workflow

> **Dernière mise à jour** : 2026-04-23 · v1.1.0 (data harmonization)
> **Responsable tech** : bignero@gmail.com

---

## Vue d'ensemble

Site corporate statique EnerTchad Groupe SA/CA — 23 pages HTML + assets + couche data harmonisée. Déployé sur **Cloudflare Pages** (principal), **Netlify** (fallback), **Vercel** (preview).

---

## Arborescence

```
Enertchad Web Solutions/
│
├── [17 pages HTML racine]   index.html, groupe.html, services.html, investisseurs.html,
│                            durabilite.html, talents.html, actualites.html, contact.html,
│                            maps.html, newsletter.html, cookies.html, confidentialite.html,
│                            mentions-legales.html, dashboard.html, dashboard-executif.html,
│                            404.html, 500.html, offline.html
│
├── operations/              amont.html, intermediaire.html, aval.html, services.html
├── energies/                index.html (pôle énergies)
├── technologies/            index.html (pôle technologies)
├── documents/               rapports annuels, ESG, brochures (PDF/HTML)
│
├── assets/
│   ├── css/main.css         Design system central (4236 lignes)
│   ├── css/dashboard.*.css  Bundle React dashboard
│   ├── js/main.js           Nav, mega-menu, reveal animations
│   ├── js/vendor/           chart.4.4.1.umd.min.js (self-hosted)
│   ├── js/dashboards/       Bundles Dashboard exécutif
│   ├── fonts/               Inter-latin, SpaceGrotesk-latin (woff2 preload)
│   ├── img/                 Logo, og-cover, hero backgrounds
│   └── data/                services.json, cadastre-2025.json, eor-tchad.json, petrochimie-tchad.json
│
├── _sources/                ⚠ INTERNE — non déployé
│   ├── poles/               Docs internes par pôle (markdown)
│   ├── dashboard-src/       Source React du dashboard exécutif
│   └── tools/               Scripts de build/sync
│       └── sync-services.py
│
├── [config deploy]          _headers, _redirects, netlify.toml, vercel.json, wrangler.toml
├── [SEO/PWA]                sitemap.xml, robots.txt, manifest.json, sw.js
├── [ignore files]           .gitignore, .netlifyignore, .vercelignore
├── [docs projet]            AUDIT_TECHNIQUE_*.md, CLOUDFLARE_SETUP.md, DATA_MASTER.yml,
│                            DESIGN_SYSTEM.md, DOMAIN_SETUP.md, README.md
└── .git/                    Local git repo (initialisé 2026-04-23, commit 8b58344)
```

---

## Source of truth : `DATA_MASTER.yml`

Toute donnée **canonique** (chiffres production, effectifs, capacités, services, CTA) vit dans `DATA_MASTER.yml`. Les pages HTML consomment ces valeurs mais ne sont **pas** la source.

### Règle d'or

> Toute divergence entre `DATA_MASTER.yml` et un contenu publié doit être corrigée **sur le contenu publié, jamais sur DATA_MASTER** sans validation Direction.

### Bloc `services_catalog` (v1.1.0+)

10 services harmonisés avec schéma uniforme :

| Champ | Type | Exemple |
|---|---|---|
| `id` | slug | `ep`, `eor`, `ics-security` |
| `slug` | url-slug | `exploration-production` |
| `numero` | string | `"01"` |
| `nom` | string | `Exploration & Production (E&P)` |
| `nom_court` | string | `E&P` |
| `pole_parent` | ref | `amont` \| `intermediaire` \| `aval` \| `technologies` \| `energies` \| `null` |
| `group` | ref | `operations` \| `technologies` \| `energies` \| `esg` |
| `anchor` | string | `section-ep` |
| `accent_hex` | hex color | `#1E3A8A` |
| `accent_hex_light` | hex color | `#3B82F6` |
| `resume` | string (1 phrase) | Tagline section |
| `description` | string (1-2 phrases) | Expansion tagline |
| `sous_services` | list[str] | 4-6 items |
| `technologies` | list[str] | 3-6 items |
| `secteurs` | list[str] | 1-4 items |
| `ctas` | list[{label, href, variant}] | 2 CTAs par service |

---

## Workflow d'édition

### Cas 1 — Modifier le contenu d'un service (E&P, EOR, etc.)

```bash
cd "/Users/Bignero/Documents/Claude/Enertchad Web Solutions"

# 1. Éditer DATA_MASTER.yml > services_catalog > [service]
$EDITOR DATA_MASTER.yml

# 2. Régénérer services.json
python3 _sources/tools/sync-services.py --apply

# 3. Mettre à jour services.html à la main (structure identique au catalogue)
#    NB: le HTML reste manuel, seul le JSON est auto-sync

# 4. Commiter
git add DATA_MASTER.yml assets/data/services.json services.html
git commit -m "data(services): update <service-id> <champ>"
```

### Cas 2 — Ajouter un nouveau service (ex. 11e)

1. Éditer `DATA_MASTER.yml` → ajouter dans `services_catalog` (respecter le schéma)
2. Éditer `services_groups` → ajouter l'`id` dans un group
3. Éditer `cta_routes` → ajouter les nouveaux slugs /contact#xxx
4. Exécuter `python3 _sources/tools/sync-services.py --apply`
5. Éditer **services.html** → copier un bloc `<section class="svc-section">` existant, adapter
6. Éditer **contact.html** → ajouter les nouveaux slugs dans le bloc `CTA_ROUTES` JS (section v1.1.0 en fin de fichier)
7. Éditer **tous les footers** si le nouveau service doit apparaître en lien footer
8. Éditer **sitemap.xml** si la section a une URL canonique (ex. `/services#section-<nouveau>`)
9. Commit

### Cas 3 — Corriger une coquille dans une page

```bash
$EDITOR <page>.html
git add <page>.html
git commit -m "fix(<page>): typo / copywriting"
```

### Cas 4 — Modifier la nav ou le footer (cross-site)

Structure identique sur 17-18 pages. Toujours modifier **toutes** les pages en même temps (script Python dans `_sources/tools/` ou Find/Replace massive). Valider ensuite :

```bash
grep -l "<pattern attendu>" *.html operations/*.html | wc -l
# doit retourner 17 ou 18 selon l'élément
```

---

## Déploiement

### Cloudflare Pages (production)

```bash
# Option A : Manuel via Wrangler CLI
cd "/Users/Bignero/Documents/Claude/Enertchad Web Solutions"
npx wrangler login       # une fois
# Copier vers un dossier staging propre (exclure _sources/, *.md, .git*)
rsync -av --exclude='_sources/' --exclude='*.md' --exclude='DATA_MASTER.yml' \
      --exclude='.git*' --exclude='*.bundle' \
      ./ /tmp/deploy-enertchad/
npx wrangler pages deploy /tmp/deploy-enertchad \
  --project-name=enertchad-groupe --branch=main --commit-dirty=true

# Option B : Auto-deploy via GitHub (quand branché)
git push origin main    # Cloudflare Pages redeploy auto
```

### Netlify / Vercel

Drag-and-drop le dossier (les `.netlifyignore` / `.vercelignore` excluent automatiquement `_sources/`, docs, `DATA_MASTER.yml`).

---

## Scripts disponibles

### `_sources/tools/sync-services.py`

```bash
# Dry-run (aucune écriture, affiche les diffs)
python3 _sources/tools/sync-services.py

# Apply (écrit assets/data/services.json)
python3 _sources/tools/sync-services.py --apply
```

Fonctions :
- Valide la cohérence de `DATA_MASTER.yml > services_catalog`
- Détecte les clés manquantes, duplicatas d'ID, références croisées cassées
- **Détection cross-contamination (v1.1.1)** : vérifie que chaque service a sa
  signature canonique dans `sous_services` et qu'aucun marker exclusif d'un
  autre service n'y apparaît (prévient les bugs de swap comme ep↔esg de v1.1.0)
- Génère `assets/data/services.json` à partir du YAML
- Vérifie le drift entre `services.html` (anchors) et le catalogue

### ⚠️ Gotcha — Scripts regex sur DATA_MASTER.yml

**Ne JAMAIS faire :** `re.search(r'- id: "ep"...')` sans ancrer sur `services_catalog:`.

Le fichier a deux zones où `- id: "<slug>"` apparaît :
1. `services_groups[]` — définit les macro-catégories UI (operations, technologies, energies, **esg**)
2. `services_catalog[]` — définit les vrais services (ep, eor, ..., **esg**)

Il y a une **collision intentionnelle sur l'id `esg`**. Un regex naïf matchera le
premier (dans services_groups) et propagera le `(?:.|\n)*?` jusqu'au premier
`sous_services:` trouvé, qui sera celui d'un service adjacent dans
`services_catalog:`. Incident v1.1.0 : ep a hérité des sous_services de esg.

**Pattern correct** : ancrer le regex sur `services_catalog:\n[\s\S]*?- id: "<slug>"`
ou charger le YAML via PyYAML et muter la structure Python avant de dump.

---

## Checks de cohérence (à lancer avant commit)

```bash
# 1. YAML ↔ JSON sync
python3 _sources/tools/sync-services.py

# 2. Pas de handler inline (sécurité CSP)
grep -rn 'onclick\|onsubmit\|onerror' *.html operations/*.html | grep -v "^.*:.*<!--"
# doit retourner: rien

# 3. Nav /services sur toutes les pages principales
grep -l 'data-nav-services' *.html operations/*.html | wc -l
# doit retourner: 17 ou 18

# 4. Footer /services
grep -l "Tous les services" *.html operations/*.html | wc -l
# doit retourner: 16

# 5. JSON-LD services.html cohérent
grep -c '"numberOfItems":10' services.html
# doit retourner: 1

# 6. Sitemap valide
xmllint --noout sitemap.xml
# doit retourner: rien (pas d'erreur)
```

---

## Sécurité & conformité

- **CSP** harmonisée sur `_headers`, `netlify.toml`, `vercel.json` : `script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline'; ...`
- **HSTS** `max-age=63072000; includeSubDomains; preload` partout
- **Supply-chain** : Chart.js **self-hosté** (`/assets/js/vendor/chart.4.4.1.umd.min.js`) — pas de CDN externe
- **PII** : aucune donnée personnelle n'est collectée côté front. Le form `/contact` envoie via POST endpoint (à configurer : Formspree, Getform ou Worker Cloudflare)
- **Cookies** : consent banner RGPD (`cookie-banner`) + politique sur `/cookies.html` + `/confidentialite.html`

---

## Historique des versions

| Version | Date | Highlights |
|---|---|---|
| **v1.0.0** | 2026-04-22 | Audit initial — 4 P0 + 7 P1 + 1 P2 (CSP, HSTS, Chart.js local, _sources/, a11y, JSON-LD pages légales) |
| **v1.1.0** | 2026-04-23 | Harmonisation data (services_catalog 10 services) + page master /services + nav propagation + CTA pre-fill |

---

## Contacts & support

- **DG & code owner** : Bignéro Moïalbéi Le Madang (bignero@gmail.com)
- **Issues techniques** : créer un ticket GitHub quand le dépôt est poussé
- **Audits** : voir `AUDIT_TECHNIQUE_2026-04-22.md` pour le périmètre et les limites

---

**Conçu et maintenu à N'Djamena, Tchad** 🇹🇩
