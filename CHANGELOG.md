# Changelog — EnerTchad Groupe

Suit le format [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.2.0] — 2026-04-24

### Ajouts
- **Page master `/services.html`** — 10 sections harmonisées (E&P, EOR, Pipeline, Distribution, Pétrochimie, Digital, ICS Security, Sécurité Physique, Énergies, ESG) avec JSON-LD CollectionPage + BreadcrumbList + ItemList (numberOfItems=10).
- **Clean URLs `/services/<slug>`** — 21 routes SEO-friendly × 3 plateformes (Cloudflare Pages, Netlify, Vercel) = 63 entrées redirect.
- **Pitch deck Enerfrica v1.0** — 17 slides .pptx (423 Ko) + .pdf (236 Ko) · palette navy #003366 + gold + ice · layout 16:9 wide.
- **Brochure corporate Enerfrica v1.0** — 12 pages A4 portrait PDF (24 Ko vectoriel) · ReportLab.
- **Data canonique v1.2.0** — DATA_MASTER.yml refactorisé avec `services_catalog` (10 services harmonisés), `services_groups` (4 macro-catégories), `cta_routes` (11 routes pré-remplies), `history` (création 2026), `partenaires_operationnels`, `formation` (EnerAcademy 500+/an), `langues` (FR actif · EN/AR placeholder).
- **Footer WhatsApp Business** — lien `wa.me/23599298696` sur 19 pages.
- **Nav header /services link** — sur 17 pages avec badge "NEW" gold.
- **Formulaire contact pré-rempli** — script qui lit `#hash` et auto-fill type + subject selon 11 CTA routes.
- **Build script CF Pages** — `build-cf.sh` qui stage `dist/` via rsync avec 29 règles d'exclusion.
- **Sync tooling** — `_sources/tools/sync-services.py` avec validation cross-contamination + --rebuild-html flag.
- **Smoke test script** — `_sources/tools/smoke-test.sh` · 64 assertions post-deploy.

### Changements
- **Téléphone principal** — +235 99 29 86 96 (canonique) · ancien +235 98 98 37 37 conservé en secondaire avec redirection jusqu'à fin 2026.
- **Images hero premium** — 14 fichiers JPG+WebP (accueil, amont, aval, énergies, intermédiaire, talents, durabilité, EOR ×2) intégrés depuis merge main v1.11.x.
- **Nav premium** — `assets/css/nav-premium.css` + `assets/js/nav-premium.js` (glassmorphism, ⌘K search, breadcrumbs) depuis merge main.
- **Dashboard-src React** — source complète (build.mjs + tailwind) depuis merge main.
- **Protection branche main** — force_push interdit · deletion interdite · conversation_resolution requise.

### Corrigés
- **Bug regex DATA_MASTER.yml** — cross-contamination ep ↔ esg résolue : le service E&P avait hérité des sous-services de ESG à cause d'un regex qui matchait l'id `esg` dans `services_groups` au lieu de `services_catalog`. Le script `sync-services.py` a maintenant un détecteur anti-cross-contamination qui bloque le commit si divergence.
- **Légacy `/services` redirect** — l'ancien redirect `/services → /operations/services 301` dans `_redirects`, `netlify.toml` et `vercel.json` hijackait la nouvelle page master. Retiré sur les 3 plateformes.
- **Doublons stations-service** — 47 puis 24 → valeur canonique 45.

### Supprimés
- **Entrée legacy `/services → /operations/services`** dans les 3 configs de routage.

### Purgé (valeurs erronées à ne plus utiliser)
- RCCM `TC/NDJ/2019/A/1245` → canonique `N'DJ/RC/2026-A-0001`
- Capital `500 000 000 FCFA` → canonique `10 000 000 FCFA`
- `Fondée en 2019` → `Créée en 2026 (SA/CA)`
- `+235 98 98 37 37` (principal) → `+235 99 29 86 96`
- `520 MW` → `125 MW installés + 85 MW gas-to-power`
- `126 kbbl/jour` → `144 kb/d`
- `178 kboe/j` → `144 kb/d`
- `GreenTech` → `Énergies`
- `Digital & SCADA` → `Technologies`
- `7 divisions (OFS)` → `6 pôles intégrés`

### Sécurité
- **Cross-contamination detection** dans `sync-services.py` — bloque les swaps de sous_services entre services.
- **CSP harmonisée** sur les 3 plateformes (script-src avec Plausible, manifest-src, worker-src, frame-ancestors).
- **HSTS max-age=63072000** (2 ans) avec includeSubDomains + preload.
- **Anti-leak `_sources/`** — exclusion dans `.cfignore`, `.netlifyignore`, `.vercelignore` + redirects 404.

### Données
- **10 services catalogued** — schéma v2 complet (id, slug, numero, nom, pole_parent, group, anchor, accent_hex, résumé, description, sous_services[], technologies[], secteurs[], ctas[]).
- **6 pôles intégrés** préservés (amont, intermediaire, aval, services, energies, technologies).
- **11 CTA routes** mappées : etude-reservoir, eor, diagnostic-reservoir, audit-integrite, mobile-station, fiches-produits, devis-petrochimie, demo-scada, audit-cyber, audit-securite-physique, solaire-industriel.

### Documentation
- **AUDIT_TECHNIQUE_2026-04-22.md** — section v1.1.0 ajoutée avec récap complet de l'harmonisation data.
- **_sources/README_WORKFLOW.md** — guide de maintenance avec gotcha regex DATA_MASTER.yml.
- **_sources/DATA_RECONCILIATION_2026-04-24.md** — rapport comparatif avec 2 sites Netlify obsolètes.
- **_sources/POST_DEPLOY_CHECKLIST.md** — 7 sections (smoke tests, custom domain, tokens, Netlify cleanup, notifications, analytics, parcours visiteurs).

---

## [1.1.3] — 2026-04-21 → 2026-04-22 (lignée legacy préservée via tag `legacy/main-v1.11.3`)

### Ajouts
- Nav premium v2 (glassmorphism, ⌘K search, breadcrumbs)
- 14 images hero HD (JPG + WebP)
- Dashboard exécutif React (source + bundle)
- Audit SEO (meta, og:locale, canonical, footer)
- Cleanup dossier `poles/` legacy

---

## [1.0.0] — 2026-04-21

### Ajouts
- **DATA_MASTER.yml** — première source unique de vérité (identité juridique, 6 pôles, certifications, marques, purger rules).
- **23 pages HTML** — structure initiale (index, groupe, investisseurs, durabilité, talents, actualités, contact, maps, newsletter, cookies, confidentialité, mentions-légales, dashboard, dashboard-executif, 404, 500, offline, + 4 operations + 2 pôles).
- **CSS design system** — `assets/css/main.css` (4200+ lignes) · Inter + Space Grotesk · palette navy #080E1A + gold #D9A84F.
- **Audit technique P0+P1+P2** — CSP harmonisée, HSTS 63072000, Chart.js self-hosté, externalisation inline handlers, landmarks a11y.

---

**Tags officiels** :

| Tag | Date | Description |
|---|---|---|
| `v1.2.0` | 2026-04-24 | EnerTchad canonical + Enerfrica materials (release publiée) |
| `legacy/main-v1.11.3` | 2026-04-22 | Snapshot pré-merge (rollback possible) |
