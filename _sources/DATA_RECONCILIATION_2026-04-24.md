# Data Reconciliation Report — EnerTchad

> **Date** : 2026-04-24
> **Auteur** : Audit automatisé par Claude
> **Sources comparées** :
> - **Site A** — https://enchanting-dragon-ade819.netlify.app
> - **Site B** — https://transcendent-profiterole-9e8a07.netlify.app
> - **Workspace** — `/Users/Bignero/Documents/Claude/Enertchad Web Solutions/` (DATA_MASTER.yml v1.1.0)

**Objectif** : détecter les divergences entre les versions publiques déployées et la source canonique (DATA_MASTER.yml), et préparer une décision sur la version faisant foi.

---

## 🚨 Divergences critiques (à arbitrer rapidement)

| Donnée | Site A (Netlify enchanting-dragon) | Site B (Netlify transcendent-profiterole) | **Workspace DATA_MASTER.yml** | Arbitrage |
|---|---|---|---|---|
| **Téléphone principal** | `+235 98 98 37 37` | `+235 98 98 37 37` | **`+235 99 29 86 96`** | ⚠ **2 numéros en circulation** — lequel est actif ? |
| **Date de création** | Implicite 2026 (brochure) | Implicite 2019 (RCCM TC/NDJ/2019/A/1245) | **2026 (SA/CA)** | ⚠ **Incohérence 2019 vs 2026** |
| **Capital social** | Non spécifié | `500 000 000 FCFA` | **`10 000 000 FCFA`** | ⚠ **50× de différence** |
| **Production Amont** | `126 000 bbl/jour` | `126K bbl/j` | **`144 kb/d`** | Alignement nécessaire |
| **Capacité raffinerie** | `50 000 bbl/j (expansion)` | Non chiffrée | **`20 kb/d (actuel)`** | Site A mélange actuel et cible |
| **Stations-service** | Non précisé (implicite) | `15+` | **`45`** | ⚠ **3× de différence** |
| **Puissance Énergies** | `520 MW` | `520 MW solaire` | **`125 MW installés + 85 MW gas-to-power`** | ⚠ **4× de différence — Site annonce une capacité 4× supérieure à la capacité workspace** |
| **RCCM** | Non affiché | `TC/NDJ/2019/A/1245` | **`à compléter`** | RCCM différent de celui du workspace (N'DJ/RC/2026-A-0001) |

---

## ✅ Données cohérentes entre les 3 sources

| Donnée | Valeur commune |
|---|---|
| **Nom commercial** | EnerTchad |
| **Slogan** | Unité · Innovation · Durabilité — Accès aux Énergies |
| **Email contact** | contact@enertchad.td |
| **Adresse siège** | Radisson Blu, Bureau 23 Bloc D, Sabangali, N'Djamena |
| **Horaires bureaux** | Lun–Ven, 08h00–17h00 (UTC+1) |
| **Contenu local** | ~80 % effectifs tchadiens |
| **Domaines** | Upstream + Midstream + Downstream + Énergies renouvelables |

---

## 📂 Contenu des 2 sites Netlify

### Site A — enchanting-dragon-ade819.netlify.app

**Structure nav** : Accueil / Mission · Activités (Upstream, Midstream, Downstream) · Transition énergétique · Technologies · Engagements (HSE) · Investisseurs · Académie · Contact

**Claims saillants** :
- Production 126 000 bbl/jour
- Énergies renouvelables 520 MW
- Raffinerie Djarmaya, expansion à 50 000 bbl/j
- Clients/partenaires cités : SHT, TPC, CNPCIC, Perenco
- IRVE (Infrastructure de Recharge pour Véhicules Électriques)
- CTA principaux : "Parlons de votre projet", "Candidature spontanée", WhatsApp permanent

**Positionnement** : "Société pétrolière tchadienne intégrée, fondée en 2026, opérant sur toute la chaîne pétrolière (upstream, midstream, downstream) et la transition énergétique. Fondée par d'anciens cadres des majors internationales."

### Site B — transcendent-profiterole-9e8a07.netlify.app

**Structure nav** : Mission · Contexte · Activités · Projets · Témoignages · Équipe · Transition énergétique · Technologie · Import/Export · HSE · Formation · RSE · Investisseurs · Clients · Actualités · Carrières · Contact · FAQ

**Baseline** : "Deux métiers, une vision : produire des hydrocarbures et fournir des services intégrés"

**Services détaillés** :
- Forage & complétion (directional, MWD/LWD, cimentation HPHT)
- ESP, gas lift, SCADA
- Sismique 2D/3D/4D, diagraphies wireline
- Workover (slickline, coiled tubing, fishing, P&A)
- Smart pigging, intégrité pipeline
- Bacs API, cavernes salines
- Fractionnement NGL, déshydratation
- Comptage fiscal + SCADA + cybersécurité OT
- Raffinage CDU/VDU, FCC, reformage catalytique, hydrotraitement
- 15+ stations-service, 8 bornes IRVE
- Négoce & hedging brut + produits raffinés
- Solaire PV + mini-grids + toitures
- Systèmes hybrides solaire-diesel
- BESS LiFePO4
- IRVE 50–350 kW
- Académie EnerTchad (500+ formés/an)

**Partenaires mentionnés** : SHT, COTCO, TOTCO

**Mentions légales** : RCCM TC/NDJ/2019/A/1245, NIF 9012345678, Capital 500 000 000 FCFA

**Tech stack indiqué** : PI System, AVEVA, LoRaWAN/4G, HAZOP, LOTO, PTW, DST

**Langues proposées** : FR · EN · AR (trilingue)

---

## 🎯 Recommandations d'arbitrage

### Scénario 1 — Le workspace actuel fait foi (DATA_MASTER.yml v1.1.0)
Si EnerTchad Groupe SA/CA est bien la **nouvelle entité** officielle créée en 2026, alors :
- Les sites Netlify A et B sont des **versions obsolètes / prototypes** à dépublier
- Migrer les contenus pertinents (Académie, Import/Export, Témoignages, FAQ) vers le site workspace
- Corriger le téléphone (98 98 37 37 → 99 29 86 96) dans toutes les communications sortantes
- Notifier SHT, COTCO, TOTCO et Perenco du nouveau numéro de contact

### Scénario 2 — Les sites Netlify contiennent des données plus à jour
Si EnerTchad existe bien depuis 2019 (RCCM TC/NDJ/2019/A/1245, capital 500M FCFA) et que le workspace récent est la **restructuration SA/CA de 2026**, alors :
- Documenter cette continuité historique dans `DATA_MASTER.yml` (champ `antecedent`)
- Mettre à jour `capacite_actuelle_kbd` 144 → 126 (ou expliquer la réduction)
- Mettre à jour `puissance_installee_mw` 125 → 520 (gap factor 4× suspect — à vérifier si chiffre projet vs installé)
- Re-aligner la section "Historique" de groupe.html pour inclure la phase 2019-2025

### Scénario 3 — Les trois versions coexistent pour audiences différentes
Si A = public grand-consommateur, B = B2B services, workspace = investisseurs institutionnels :
- Ajouter une couche "variante d'audience" dans DATA_MASTER.yml
- Maintenir UNE seule vérité sur les chiffres financiers (capital, RCCM, NIF) sur les 3 sites

---

## 🛠️ Actions techniques à envisager

| Priorité | Action | Fichier impacté |
|---|---|---|
| 🔴 P0 | Arbitrer téléphone canonique | `DATA_MASTER.yml`, 23 pages HTML, 2 sites Netlify, PDF brochure pitch |
| 🔴 P0 | Arbitrer RCCM + capital | `DATA_MASTER.yml`, footer de toutes les pages, mentions légales |
| 🟠 P1 | Décider source of truth | Fixer un seul site "production" et archiver les autres |
| 🟠 P1 | Migrer contenus manquants | Académie, Témoignages, FAQ, Import/Export, RSE → workspace |
| 🟡 P2 | Ajouter langues EN/AR | Le site B est trilingue — prévoir i18n pour le workspace |
| 🟡 P2 | Intégrer tech stack détails | PI System, AVEVA, LoRaWAN → page `technologies/` |
| 🟢 P3 | Décider sort des 2 Netlify | Garder sous sous-domaine interne, ou supprimer |

---

## 📊 Résumé exécutif

**Il existe au moins 3 représentations publiques ou internes d'EnerTchad**, toutes partageant le même nom commercial et le même slogan, mais divergeant fortement sur :
- Téléphone (2 numéros)
- Capacités opérationnelles (Amont ±12 %, Énergies ×4, Stations ×3)
- Statut juridique (dates de création, capital, RCCM)

Ce flou de communication est un **risque réputationnel et financier** majeur :
- Un investisseur croisant 2 sites trouvera des chiffres incohérents
- Un partenaire appelant un numéro différent de celui qui lui a été donné peut perdre la confiance
- L'administration OHADA peut bloquer un dossier si le RCCM ne correspond pas

**Action recommandée** : statuer en COMEX cette semaine sur la version canonique, dépublier les sites divergents, et figer un `DATA_MASTER.yml` v2.0.0 comme single source of truth pour **toutes** les communications externes (y compris brochures PDF, pitch deck, cartes de visite, emails signatures).
