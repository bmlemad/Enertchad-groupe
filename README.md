# EnerTchad SA — Site v2.0 (rebuild)

**Date** : 2026-04-28
**Auteur** : DG · Bignéro Moïalbéi Le Madang
**Objectif** : reconstruction propre du site corporate selon la taxonomie Doc 36 (5 univers thématiques), avec architecture clean, CSS unifié et performances optimales.

## Architecture

```
site-v2/
├── index.html                    # Hub principal (premium long-form)
├── pourquoi/                     # Univers 1 — Conviction & Narratif
│   ├── manifeste.html
│   ├── positionnement.html
│   ├── trajectoire.html
│   └── equipe.html
├── solutions/                    # Univers 2 — Catalogue & Solutions
│   └── index.html               # 10 services × 6 pôles
├── operateurs/                   # Univers 3 — 5 opérateurs cibles (services différenciés)
│   ├── index.html
│   ├── cnpcic.html              # Bongor — E&P + EOR + SCADA + HSE
│   ├── perenco.html             # Doba — E&P + EOR + ILI + Maintenance
│   ├── sht.html                 # NOC — ESG + DDT + PSC + Académie
│   ├── cotco-totco.html         # Pipeline — ILI + SCADA + Cyber + Sécurité IA
│   └── srn.html                 # Raffinerie — ICS/OT + Sécurité IA + Blending + Maintenance
├── data/                         # Univers 4 — Preuves & Performance
│   ├── index.html               # Hub data
│   ├── atlas.html
│   ├── observatoire.html
│   ├── oleoduc-3d.html
│   └── dashboard.html
├── engagement/                   # Univers 5 — Conformité & Conversation
│   ├── investisseurs.html       # Tour 8-12 M USD
│   ├── transparence.html        # 8 engagements publics
│   ├── presse.html
│   └── contact.html
├── legal/
│   ├── mentions-legales.html
│   ├── confidentialite.html
│   └── cookies.html
├── assets/
│   ├── css/enertchad.css        # SINGLE source of truth (259 lignes vs 10 fichiers)
│   ├── js/enertchad.js          # Single JS file
│   ├── images/                  # 8 photos webp + jpg fallback
│   └── fonts/                   # (Google Fonts CDN utilisé)
├── 404.html · 500.html · offline.html
├── sitemap.xml                  # 24 URLs
├── robots.txt
├── vercel.json                  # 20 redirects + 4 headers blocs
├── manifest.webmanifest
└── .vercelignore
```

## Données canoniques utilisées

- **Identité** : EnerTchad SA · RCCM N'DJ/RC/2026-A-0001 · Capital 10 000 000 FCFA
- **Slogan** : Unité · Innovation · Durabilité — Accès aux Énergies
- **6 pôles** : Upstream · Midstream · Downstream · GreenTech · EnerTech · Gouvernance (couleurs accent canon)
- **10 services** : S01-S10 répartis sur les pôles
- **5 opérateurs cibles** : CNPCIC · Perenco · SHT · COTCO/TOTCO · SRN — services différenciés selon métier réel
- **Tour 2026** : Seed/Pre-A 8-12 M USD · closing Q2 2026
- **DG** : Bignéro Moïalbéi Le Madang · ex-ExxonMobil Doba project
- **Trajectoire** : 3 phases 2026-2030 (Déploiement → Scale → Référence)
- **Transparence** : 8 engagements (ITIE · OHADA · RGPD · ISO 37001 · LCD 75-90 % · Reporting · HSE · Indépendance Observatoire)

## Comparaison avec ancien site (Enertchad Web Solutions)

| Critère | Ancien | Nouveau v2 |
|---------|--------|-----------|
| Pages HTML | 29 | 23 (consolidées) |
| Fichiers CSS | 10 (env. 340 KB) | 1 (env. 9 KB) |
| Architecture | Plate (pages au même niveau) | 5 univers thématiques |
| Cas opérateurs | Services dupliqués | Services différenciés |
| Doublons dashboard | dashboard + dashboard-executif | 1 seule page |
| Maillage interne | Faible | Footer "Voir aussi" cross-page |
| SEO | meta description longue | meta keywords + OG dédiés |

## Déploiement

```bash
# Vercel CLI
vercel --prod

# Ou via Git push (si repo connecté)
git add . && git commit -m "v2.0.0 site rebuild" && git push origin main
```

## Sources

- Doc 36 (Ultra Analyse Page-par-Page) — taxonomie 5 univers
- Doc 5 (Classification Sujets/Thèmes/Métiers) — 6 pôles canon
- Doc 23 (Ultra Audit Transversal) — KPIs et chiffres canon
- Doc 24 (Inspiration Majors Roadmap) — patterns ExxonMobil/TotalEnergies/Equinor

---

© 2026 EnerTchad SA · RCCM N'DJ/RC/2026-A-0001 · Capital 10 000 000 FCFA
