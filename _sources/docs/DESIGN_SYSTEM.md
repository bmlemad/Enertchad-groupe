# EnerTchad · Design System

Référentiel visuel partagé par les 6 sites du Groupe (hub + 5 pôles).
Version 1.0 · Avril 2026.

## Principes

1. **Sobriété premium** — navy profond + or, contrastes maîtrisés, peu d'effets.
2. **Cohérence inter-pôles** — même grille, mêmes tokens, seul l'accent de couleur change.
3. **Performance** — HTML/CSS/JS statique, pas de build, Lighthouse > 95.
4. **Accessibilité WCAG AA** — contrastes validés, focus visible, `prefers-reduced-motion`.

## Palette

### Couleurs de marque (tous sites)

| Token | Hex | Usage |
|---|---|---|
| `--navy-900` | `#080E1A` | Fond principal sombre |
| `--navy-800` | `#0B1424` | Fond sections |
| `--navy-700` | `#11203A` | Cards, surfaces |
| `--cream-50` | `#F7F6F1` | Fond clair |
| `--gold` | `#D9A84F` | Accent marque Groupe |
| `--gold-light` | `#E8C36A` | Highlights, badges |
| `--gold-deep` | `#B8892E` | Hover, focus |
| `--text-primary` | `#F5F2E8` | Texte sur navy |
| `--text-secondary` | `#A8B0BC` | Texte secondaire |

### Accents par pôle

Chaque pôle conserve la palette navy/or du Groupe et ajoute **un seul accent de couleur** comme signature :

| Pôle | Accent | Hex | Usage |
|---|---|---|---|
| 01 · Amont | Bleu | `#2C7AE0` | Cards, graphes, CTA secondaires |
| 02 · Intermédiaire | Vert | `#10B981` | Pipeline, flux, indicateurs debit |
| 03 · Aval | Orange | `#F59E0B` | Distribution, stations, carburants |
| 04 · Services | Violet | `#8B5CF6` | Services intégrés (legacy — fusionné Amont) |
| 05 · Énergies | Teal | `#14B8A6` | Renouvelable, transition, micro-grids, H₂ |
| 06 · Technologies | Violet | `#8B5CF6` | IoT, AI, edge, cyber |

> Le pôle 04 (Services) est fusionné dans l'Amont depuis 2026 ; son violet est librement réutilisé par le pôle 06 Technologies sans conflit visuel.

## Typographie

| Rôle | Police | Poids | Source |
|---|---|---|---|
| Display / titres | **Space Grotesk** | 400/500/600/700 | Google Fonts |
| Corps / UI | **Inter** | 400/500/600 | Google Fonts |
| Technique / terminal | **JetBrains Mono** | 400/500 | Google Fonts (Technologies uniquement) |

Chargement : `<link rel="preconnect" href="https://fonts.googleapis.com">` + une seule requête `fonts.googleapis.com/css2?family=...`.

## Tokens de mise en page

| Token | Valeur |
|---|---|
| Container max | `1280px` |
| Gutter | `clamp(20px, 4vw, 48px)` |
| Radius (cards) | `12px` |
| Radius (large surfaces) | `20px` |
| Border | `1px solid rgba(217,168,79,0.18)` |
| Shadow (elevation 1) | `0 2px 8px rgba(0,0,0,0.25)` |
| Shadow (elevation 2) | `0 8px 32px rgba(0,0,0,0.35)` |
| Transition standard | `200ms cubic-bezier(0.4, 0, 0.2, 1)` |

## Breakpoints

```
mobile     : 0 - 559
tablet     : 560 - 899
desktop    : 900 - 1279
wide       : 1280+
```

Approche **mobile-first**. Navigation en liste plate mobile, dropdown `:hover`/`:focus-within` desktop.

## Animations

- **Scroll reveal** via `IntersectionObserver` — respecter `prefers-reduced-motion: reduce`.
- **Compteurs animés** — easing `cubic-ease-out`, séparateur français `\u202F` (espace fine insécable).
- **Pipeline SVG** — `stroke-dashoffset` animé.
- **Charts** — animation à l'apparition dans le viewport, pas de rejeu au scroll.

## Iconographie

- **Drapeaux / blason** : SVG inline (pas de dépendance externe).
- **Icônes métiers** : SVG 24×24, `stroke-width: 1.5`, couleur accent pôle.
- **Illustrations pipeline / bassins** : SVG vectoriel natif, pas de PNG.

## SEO & social (baseline)

- `<title>` + `<meta description>` dédiés par page.
- Open Graph + Twitter Card complets · image 1200×630.
- Canonical URL sur chaque page.
- Locale `fr_FR` · hreflang prévu pour extension EN.
- `robots.txt` + `sitemap.xml` sur chaque site.

## Sécurité (en-têtes standard)

| Header | Valeur |
|---|---|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | `default-src 'self'; styles + fonts Google autorisés` |

Déclaration dans `netlify.toml` / `vercel.json` / `_headers` selon l'hébergeur.

## Accessibilité (checklist)

- Contrastes AA minimum (4.5:1 texte, 3:1 éléments larges).
- Focus visible (outline doré `--gold` 2 px).
- `tabindex` cohérent, `aria-label` sur icônes non-labellisées.
- Navigation clavier complète (dropdown, modales).
- `prefers-reduced-motion` respecté sur tous les `@keyframes`.

## Source de vérité

Toutes les valeurs chiffrées (production, stations, effectifs, capital…) proviennent du fichier [`DATA_MASTER.yml`](./DATA_MASTER.yml) du hub.

Avant toute édition visuelle, vérifier que les données alignent avec le YAML canonique.

---

© 2026 EnerTchad Groupe SA/CA · Propriété exclusive.
