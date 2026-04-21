# EnerTchad Technologies

**Site officiel du pôle Technologies (EnerTech) du groupe EnerTchad SA/CA.**

> *« Le cœur numérique du Groupe. »*

## Aperçu

- **12 840 capteurs IoT** déployés
- **24 jumeaux numériques** actifs (couverture upstream 92 %)
- **86 nœuds edge** répartis sur l'ensemble des sites
- **18 modèles ML en production** · 1,2 M prédictions/jour
- **47 ms** de latence SCADA moyenne
- **99,97 %** d'uptime plateforme · **4,8 TB/jour** traités
- **-65 %** de tâches manuelles grâce au RPA

## Architecture

Site statique monolithique, aucun build step requis :

| Fichier | Description |
|---|---|
| `index.html` | Single-page site premium (~42 KB), styles et JS inlinés |
| `sw.js` | Service Worker v3 · cache-first assets, network-first HTML |
| `manifest.json` | PWA manifest (thème violet `#8B5CF6`) |
| `sitemap.xml` | Sitemap XML (7 URLs) |
| `robots.txt` | Directives robots + lien sitemap |
| `vercel.json` | Config Vercel · cleanUrls + en-têtes sécurité (CSP, HSTS, X-Frame) |
| `netlify.toml` | Config Netlify équivalente |

## Dépendances externes (CDN)

- [Chart.js 4.4.1](https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js) — 3 graphiques métriques
- Google Fonts (Inter, Space Grotesk, JetBrains Mono)

## Design system

Aligné sur le hub `Enertchad-groupe` :

- **Palette** : navy `#080E1A` + gold `#D9A84F` + **accent pôle** violet `#8B5CF6`
- **Typographie** : Space Grotesk (display) + Inter (body) + JetBrains Mono (tech/terminal)
- **Rhythm** : container max 1280 px · gutter clamp(20, 4vw, 48) · radius 12/20 px
- **Signature visuelle** : terminal SCADA live-output en hero, pipeline flow Edge → Data → AI → Action

## Stack cible (référence)

- **Edge** : Raspberry Pi CM4, Advantech UNO, OPC-UA, IEC 61850, Modbus TCP
- **Data** : Kafka, TimescaleDB, Apache Druid, Dagster
- **AI/ML** : PyTorch, MLflow, FastAPI, ONNX Runtime
- **Infra** : Kubernetes (k3s edge, EKS cloud), Terraform, ArgoCD
- **Observabilité** : Prometheus, Grafana, Loki, Tempo
- **Sécurité** : Vault, Trivy, Falco, WireGuard

## Déploiement

### Vercel (par défaut)

```bash
vercel deploy --prod
```

### Netlify (drag-and-drop)

Glisser le dossier racine sur l'interface Netlify.

## Source de vérité

Toutes les valeurs chiffrées proviennent du fichier
`canonical-data.yaml` du repo `Enertchad-groupe` (section `subsidiaries.technologies`).
Ne pas éditer les chiffres ici sans synchroniser le YAML canonique.

## Contact

- **Email** : tech@enertchad.td
- **SOC 24/7** : soc@enertchad.td
- **Téléphone** : +235 99 29 86 96
- **Siège** : Radisson, Block D, Bureau 23, Sabangali · N'Djamena · Tchad

---

© 2026 EnerTchad Technologies — Filiale de EnerTchad Groupe SA/CA
OHADA / AUSCGIE · Membre ITIE Tchad
