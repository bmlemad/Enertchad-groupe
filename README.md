# EnerTchad Groupe — Site corporate ultra-premium

Prototype HTML/CSS/JS 100 % statique — **12 pages, 0 dépendance build**, prêt pour déploiement drag-drop sur Netlify / Vercel / hébergeur classique.

## Arborescence

```
site/
├── index.html                      Accueil (hub, KPIs, carte, pôles, news)
├── groupe.html                     Histoire, gouvernance, Comex, implantations
├── investisseurs.html              IR ticker, performance, documents, calendrier
├── durabilite.html                 ESG, climat, ITIE, contenu local
├── talents.html                    Culture, KPIs RH, 14 offres, témoignages
├── actualites.html                 Salle de presse (9 articles)
├── contact.html                    Formulaire, 6 équipes, 6 implantations, FAQ
├── 404.html                        Page erreur branded
├── operations/
│   ├── amont.html                  Pôle 01 · Exploration & Production
│   ├── intermediaire.html          Pôle 02 · Pipeline Doba–Kribi
│   ├── aval.html                   Pôle 03 · Raffinage & distribution
│   └── services.html               Pôle 04 · Oilfield services
├── assets/
│   ├── css/main.css                Design system (46 KB)
│   ├── js/main.js                  Animations + carte + compteurs
│   └── img/
│       ├── og-cover.png            1200×630 — Open Graph / social preview
│       ├── apple-touch-icon.png    512×512 — iOS home screen
│       └── favicon-32.png          32×32 — fallback navigateur
├── sitemap.xml                     11 URLs indexables
├── robots.txt                      User-agent rules + sitemap
├── netlify.toml                    Config Netlify (redirects, headers, cache)
├── _headers                        Security + cache headers (fallback)
├── _redirects                      Legacy URL + clean URL rewrites
└── README.md
```

## Ouverture locale

```bash
cd site
python3 -m http.server 8000
# → http://localhost:8000
```

Ou simple double-clic sur `index.html` (certaines fonctionnalités limitées en file://).

## Déploiement

### Netlify — drag-drop
Glissez-déposez le dossier `site/` sur https://app.netlify.com/drop. En ligne en 30 s. `netlify.toml` active automatiquement : redirects legacy, clean URLs, headers sécurité, cache CDN.

### Netlify — CLI
```bash
cd site
netlify deploy --prod --dir=.
```

### Vercel
```bash
cd site && npx vercel --prod
```

### Hébergeur classique (Apache / nginx / OVH / IONOS)
Upload du contenu de `site/` à la racine. `_headers` et `_redirects` ignorés — reproduire les règles équivalentes dans `.htaccess` ou la config nginx si nécessaire.

## SEO & social

- 11 URLs dans `sitemap.xml` avec priorités et changefreq
- `<title>` + `<meta description>` dédiés par page
- Open Graph + Twitter Card complets (image 1200×630, locale fr_FR)
- Canonical URL sur chaque page
- Apple touch icon + favicon SVG inline
- `robots.txt` propre avec référence sitemap

## Sécurité

`netlify.toml` et `_headers` appliquent :

| Header | Valeur |
|---|---|
| `X-Frame-Options` | SAMEORIGIN |
| `X-Content-Type-Options` | nosniff |
| `Referrer-Policy` | strict-origin-when-cross-origin |
| `Permissions-Policy` | geolocation=(), camera=(), microphone=(), payment=() |
| `Strict-Transport-Security` | max-age=31536000; includeSubDomains; preload |
| `Content-Security-Policy` | default-src 'self'; styles + fonts Google autorisés |

Cache long (1 an immutable) sur `/assets/*`, cache court (10 min must-revalidate) sur HTML.

## Palette & typographie

| Usage | Valeur |
|---|---|
| Or accent | `#D9A84F` |
| Or clair / profond | `#E8C36A` / `#B8892E` |
| Marine fond | `#080E1A` · `#0B1424` |
| Crème fond clair | `#F7F6F1` |
| Amont (bleu) | `#2C7AE0` |
| Intermédiaire (vert) | `#10B981` |
| Aval (orange) | `#F59E0B` |
| Services (violet) | `#8B5CF6` |

**Typographie** : Space Grotesk (display) + Inter (corps) via Google Fonts.

## Navigation

```
Accueil · Groupe · Opérations▾ · Investisseurs · Durabilité · Talents · Actualités · Contact
                    ├ Amont
                    ├ Intermédiaire
                    ├ Aval
                    └ Services
```

Dropdown CSS (`:hover` / `:focus-within`) sur desktop, liste plate mobile.

## Fonctionnalités interactives

- Scroll reveal (IntersectionObserver, respect `prefers-reduced-motion`)
- Compteurs animés (cubic ease-out, séparateur français `\u202F`)
- Carte interactive du Tchad (5 bassins cliquables)
- Pipeline SVG animé (dash-offset) sur Doba–Kribi
- Bar charts CSS avec animation à l'apparition
- Formulaire contact avec toast success/failure
- Nav sticky + backdrop-blur
- Responsive mobile-first (560 / 900 / 960 px)
- WCAG AA : contrastes validés, focus visible, tabindex sur éléments interactifs

## Données intégrées

Données issues du staging `enertchad-groupe.vercel.app` + enrichissement IR/ESG :

- Production : 144 000 b/j (Amont) · 139 200 b/j (brut traité, IR)
- CA 2025 : 1 184 Md XAF · EBITDA 612 Md XAF (51.7 % marge)
- D/EBITDA : 0.8× · Dividende : +22 % YoY
- Effectif : 1 240 collaborateurs (85 % tchadiens, 42 % femmes en maîtrise)
- Pipeline Doba–Kribi : 1 070 km · Raffinerie Djarmaya : 20 000 b/j
- Stations-service : 24 dans 14 villes
- Bassins opérés : 5 (Doba, Bongor, Madiago, Doseo, Lac Tchad)
- Contrats ITIE publiés : 53 · Paiements État 2025 : 374.2 Md XAF
- Émissions scope 1&2 : 28.4 → 17.6 tCO₂e/kboe (trajectoire 14.2 en 2030)
- Notation Bloomfield : AA-
- DG : Bignéro Moïalbéi Le Madang

## Prochaines itérations recommandées

1. **Photographie propriétaire** (hero, portraits Comex, sites industriels) à substituer aux dégradés SVG actuels
2. **Version anglaise** (hreflang FR/EN) — sélecteur de langue déjà présent
3. **CMS headless** (Sanity / Contentful) pour la section actualités
4. **Schema.org LD+JSON** : Organization sur home, NewsArticle sur actualités, JobPosting sur talents
5. **Analytics + Tag Manager** : snippet à coller dans `<head>` ou juste avant `</body>`
6. **Formulaire contact** : connecter à Netlify Forms en ajoutant `netlify` + `netlify-honeypot` sur `<form>`
7. **Espace investisseurs** : rapports PDF réels à héberger dans `/assets/docs/`
8. **Photos campus + Centre de formation énergétique** (page Talents)

## Contact technique

`digital@enertchad.td` (boîte à créer)

---

© 2026 EnerTchad Groupe SA/CA · Prototype ultra-premium.
