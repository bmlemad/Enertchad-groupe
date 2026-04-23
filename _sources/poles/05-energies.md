# EnerTchad Énergies · Électricité & Transition

**Pôle 05** — Production électrique, micro-grids ruraux, mobilité électrique et hydrogène vert.
Site déployé : https://enertchad-energies.vercel.app

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

## Écosystème EnerTchad

| Pôle | Repo | Site |
|---|---|---|
| Hub Groupe | [Enertchad-groupe](https://github.com/bmlemad/Enertchad-groupe) | https://enertchad-groupe.vercel.app |
| 01 · Amont | [enertchad-amont.vercel.app](https://github.com/bmlemad/enertchad-amont.vercel.app) | https://enertchad-amont-vercel-app.vercel.app |
| 02 · Intermédiaire | [enertchad-Midstream](https://github.com/bmlemad/enertchad-Midstream) | https://enertchad-midstream.vercel.app |
| 03 · Aval | [enertchad-aval.vercel.app](https://github.com/bmlemad/enertchad-aval.vercel.app) | https://enertchad-aval-vercel-app.vercel.app |
| 06 · Technologies | [Enertchad-technologies](https://github.com/bmlemad/Enertchad-technologies) | https://enertchad-technologies.vercel.app |

La source unique de vérité pour les données consolidées du Groupe est [`DATA_MASTER.yml`](https://github.com/bmlemad/Enertchad-groupe/blob/main/DATA_MASTER.yml).
Ne pas éditer les chiffres ici sans synchroniser le YAML canonique.

## Contact

- **Pôle Énergies** : energies@enertchad.td
- **Groupe** : contact@enertchad.td · +235 99 29 86 96
- **Direction Générale** : Bignéro Moïalbéi Le Madang
- **Président du Conseil d'Administration** : Théophile Gag Pinabei

**Siège** : Radisson, Block D, Bureau 23, Sabangali, N'Djamena, République du Tchad.

---

© 2026 EnerTchad Groupe SA/CA · Propriété exclusive.
OHADA / AUSCGIE · Membre ITIE Tchad
