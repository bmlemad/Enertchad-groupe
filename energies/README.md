# EnerTchad Énergies

**Site officiel du pôle Énergies du groupe EnerTchad SA/CA.**

> *« De la torchère à l'interrupteur. »*

## Aperçu

- **125 MW installés** (85 MW gaz + 60 MWp solaire)
- **28 micro-grids villageois** actifs
- **45 bornes IRVE** déployées
- **624 GWh livrés** en 2025
- **42 000 t CO₂ évitées** chaque année
- **Pilote hydrogène vert** 5 MW à l'horizon 2028

## Architecture

Site statique monolithique, aucun build step requis :

| Fichier | Description |
|---|---|
| `index.html` | Single-page site premium (~35 KB), styles et JS inlinés |
| `sw.js` | Service Worker v3 · cache-first assets, network-first HTML |
| `manifest.json` | PWA manifest |
| `sitemap.xml` | Sitemap XML (6 URLs) |
| `robots.txt` | Directives robots + lien sitemap |
| `vercel.json` | Config Vercel · cleanUrls + en-têtes sécurité (CSP, HSTS, X-Frame) |
| `netlify.toml` | Config Netlify équivalente |

## Dépendances externes (CDN)

- [Chart.js 4.4.1](https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js) — 3 graphiques d'impact
- Google Fonts (Inter, Space Grotesk)

## Design system

Aligné sur le hub `Enertchad-groupe` :

- **Palette** : navy `#080E1A` + gold `#D9A84F` + **accent pôle** emerald `#10B981`
- **Typographie** : Space Grotesk (display) + Inter (body)
- **Rhythm** : container max 1280 px · gutter clamp(20, 4vw, 48) · radius 12/20 px

## Déploiement

### Vercel (par défaut)

```bash
vercel deploy --prod
```

### Netlify (drag-and-drop)

Glisser le dossier racine sur l'interface Netlify.

## Source de vérité

Toutes les valeurs chiffrées proviennent du fichier
`canonical-data.yaml` du repo `Enertchad-groupe` (section `subsidiaries.energies`).
Ne pas éditer les chiffres ici sans synchroniser le YAML canonique.

## Contact

- **Email** : energies@enertchad.td
- **Téléphone** : +235 99 29 86 96
- **Siège** : Radisson, Block D, Bureau 23, Sabangali · N'Djamena · Tchad

---

© 2026 EnerTchad Énergies — Filiale de EnerTchad Groupe SA/CA
OHADA / AUSCGIE · Membre ITIE Tchad
