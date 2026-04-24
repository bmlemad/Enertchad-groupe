# EnerTchad Groupe — Site monopage premium

> **v1.2.1** · 2026-04-24 · [CHANGELOG](./CHANGELOG.md)
>
> Site corporate EnerTchad Groupe SA/CA · architecture **monopage** 100 % statique avec mega-menu ultra premium, 10 services harmonisés et 0 dépendance runtime.

---

## Architecture

Site **consolidé sur une seule page** (`/`) après la refonte v1.2.1. Tout le contenu business est sur la page d'accueil, avec navigation par ancres scroll-spy et un mega-menu premium pour les 10 services.

```
.
├── index.html                   Monopage landing (9 sections + mega-menu)
├── 404.html · 500.html          Pages d'erreur branded
├── offline.html                 Fallback PWA
├── confidentialite.html         Légale · RGPD / ARCEP
├── cookies.html                 Légale · politique cookies
├── mentions-legales.html        Légale · RCCM + OHADA
├── dashboard.html               React · synthèse publique
├── dashboard-executif.html      React · KPI live direction
├── assets/
│   ├── css/
│   │   ├── main.css             Design system (122 KB) · Inter + Space Grotesk
│   │   ├── monopage.css         5 sections inline (13 KB)
│   │   └── mega-menu.css        Mega-menu v2 + icons (12 KB)
│   ├── js/main.js               Animations · compteurs · map · scroll-spy (47 KB)
│   ├── data/services.json       Machine-export du catalogue (v1.2.0 · 10 services)
│   ├── fonts/                   Inter + Space Grotesk (woff2)
│   └── img/                     Logos, og-cover, hero images
├── DATA_MASTER.yml              Source unique de vérité (YAML v1.2.0)
├── sitemap.xml                  6 URLs (/ + 2 dashboards + 3 légales)
├── robots.txt                   Crawl rules
├── manifest.json                PWA shortcuts
├── sw.js                        Service worker · cache v1.2.0-monopage
├── _redirects                   Cloudflare Pages (67 redirects)
├── netlify.toml                 Netlify (68 redirects + headers)
├── vercel.json                  Vercel (62 redirects + 15 rewrites)
├── .cfignore · .netlifyignore · .vercelignore
├── build-cf.sh                  rsync staging → dist/ (29 exclusions)
├── CHANGELOG.md                 Historique versions
└── _sources/                    Interne · non déployé
    ├── tools/
    │   ├── sync-services.py     YAML → JSON + validation
    │   ├── build-monopage.py    Générateur monopage idempotent
    │   └── smoke-test.sh        Tests post-deploy (71 assertions)
    ├── backups/                 Snapshots pré-refonte
    ├── email-templates/         Notifications partenaires (5 fichiers)
    ├── enerfrica-deck/          Pitch deck + brochure Enerfrica v1.0
    └── POST_DEPLOY_CHECKLIST.md
```

---

## Anatomie du monopage

**Nav principale (9 entrées)** :

```
Logo  Accueil · 6 pôles · [Services ▾ MEGA] · Cartographie
      Durabilité · EnerAcademy · Partenaires · Actualités · Contact
      + CTA "Investir avec nous" → #contact-form
```

**Sections inline** (de haut en bas) :

1. `#hero` — Slogan "Unité · Innovation · Durabilité" + 2 CTAs
2. `#kpis` — 144 kb/j · 1 240 collaborateurs · 5 bassins · 1 070 km pipeline · 45 stations · 53 ITIE
3. `#operations` — 6 pôles intégrés (cartes)
4. `#services-catalogue` — **10 services full render** (sous-services, technologies, secteurs, CTAs)
5. `#carte` — Carte interactive 5 bassins + pipeline Doba–Kribi
6. `#petrochimie-teaser` — Horizon 2030 · 3,2 Mt/an urée
7. `#durabilite-inline` — ITIE · Climat · HSE · Contenu local
8. `#talents-academy` — EnerAcademy (500+/an, 4 programmes)
9. `#partenaires` — SHT · COTCO · TOTCO · CNPCIC · Perenco · TPC
10. `#actualites-preview` — 3 dernières actualités
11. `#contact-form` — Formulaire pré-rempli via hash
12. `#investisseurs-cta` — CTA investisseurs

**Mega-menu v2 ultra premium** (sur "Services") :

- Backdrop blur + panel full-width glassmorphism
- ⌘K / Ctrl+K search bar avec live filter
- **4 sections corporate** (v1.2.3) :
  - **Activités** · E&P · EOR · Pipeline · Distribution · Pétrochimie (5)
  - **Technologies** · Digital · ICS Security · Sécurité physique (3)
  - **Engagements** · ESG, formation, gouvernance (1)
  - **Projets** · Énergies nouvelles · Horizon 2030 (1)
- Icons SVG distinctifs par service
- Quick actions row (Stations · Investisseurs · Carrières · Devis)
- Editorial block · "Publication récente"
- Feature panel · KPIs + CTAs
- Keyboard nav complète · Escape · Tab · ⌘K

---

## Build & développement

Le site ne nécessite **aucun build runtime**. La régénération se fait uniquement quand DATA_MASTER.yml change.

### Régénérer le monopage depuis DATA_MASTER

```bash
# 1. Valider + sync services.json depuis YAML
python3 _sources/tools/sync-services.py --apply

# 2. Régénérer les 5 sections + mega-menu + nav
python3 _sources/tools/build-monopage.py --apply

# 3. Staging pour deploy Cloudflare Pages
bash build-cf.sh
```

Le générateur est **idempotent** — marqueurs `AUTO-GEN BEGIN/END` permettent ré-exécution sans duplication.

### Ouverture locale

```bash
# Pas de serveur requis
open index.html
```

Ou avec un serveur léger pour tester les paths absolus :

```bash
python3 -m http.server 8000
# → http://localhost:8000/
```

### Tests post-deploy

```bash
bash _sources/tools/smoke-test.sh https://enertchad-groupe.pages.dev
# 71 assertions : 200/301/404, headers sécurité, contenu, anchors
```

---

## Déploiement

Site statique — compatible **Cloudflare Pages · Netlify · Vercel**.

### Option recommandée : Cloudflare Pages auto-deploy Git

1. CF Pages dashboard → Connect to Git → repo `bmlemad/Enertchad-groupe`
2. Build command : `bash build-cf.sh`
3. Output directory : `dist`
4. Branch : `main`

Chaque push sur `main` déclenche un deploy automatique.

### Custom domain

- Zone DNS OVH : CNAME `www` + 2 A apex (voir `_sources/POST_DEPLOY_CHECKLIST.md`)
- SSL automatique par CF (Google-managed)

---

## Source unique de vérité

**`DATA_MASTER.yml`** centralise toutes les données :

- Identité juridique (nom, RCCM, capital, siège)
- Gouvernance (DG, PCA, auditeur)
- Coordonnées canoniques (téléphone, email, WhatsApp)
- 6 pôles intégrés
- **10 services harmonisés** (services_catalog v2)
- **4 groupes** (services_groups · 2-3-3-2)
- 11 CTA routes pré-remplies (hash fragments)
- Partenaires opérationnels (SHT/COTCO/TOTCO + CNPCIC/Perenco/TPC)
- EnerAcademy (formation)
- Purger (valeurs legacy à ne plus utiliser)

Modifier `DATA_MASTER.yml` puis régénérer. **Ne jamais éditer les sections monopage à la main** — elles sont auto-générées entre les marqueurs `<!-- ═══ MONOPAGE v1.2.0 AUTO-GEN BEGIN -->`.

---

## Metrics v1.2.1

| | |
|---|---|
| Pages HTML | 9 (monopage + 6 légales/erreur + 2 dashboards) |
| `index.html` | 105 KB · 1 350 lignes |
| `main.css` | 122 KB (−18 KB vs v1.1.x) |
| `main.js` | 47 KB (−28 KB vs v1.1.x) |
| Redirects | 67 CF · 68 Netlify · 62 Vercel |
| Smoke assertions | 71 |
| Score benchmark vs majors | **8.7/10** (au-dessus Shell, BP, Chevron ; proche Aramco) |

---

## Liens utiles

- **Site live** : https://enertchad-groupe.pages.dev (dès auto-deploy activé)
- **Custom domain** : https://www.enertchad.td (après DNS)
- **Repo GitHub** : https://github.com/bmlemad/Enertchad-groupe
- **Direction Générale** : bignero@gmail.com
- **Contact** : contact@enertchad.td · +235 99 29 86 96 · wa.me/23599298696

---

## Licence

© 2026 EnerTchad Groupe SA/CA · Tous droits réservés.
Interne Groupe — code propriétaire · aucune réutilisation sans accord écrit.
