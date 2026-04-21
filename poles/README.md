# Documentation des pôles · EnerTchad Groupe

Archive consolidée des READMEs métiers des 5 pôles opérationnels.
Chaque fichier correspond au README du repo GitHub du pôle concerné, mirroré ici pour garantir la disponibilité documentaire même en cas de dépôt archivé ou de migration.

## Index

| Pôle | Fichier | Repo source | Statut GitHub |
|---|---|---|---|
| 01 · Amont (Upstream E&P) | [`01-amont.md`](./01-amont.md) | [`bmlemad/enertchad-amont.vercel.app`](https://github.com/bmlemad/enertchad-amont.vercel.app) | actif |
| 02 · Intermédiaire (Midstream) | [`02-midstream.md`](./02-midstream.md) | [`bmlemad/enertchad-Midstream`](https://github.com/bmlemad/enertchad-Midstream) | actif |
| 03 · Aval (Downstream) | [`03-aval.md`](./03-aval.md) | [`bmlemad/enertchad-aval.vercel.app`](https://github.com/bmlemad/enertchad-aval.vercel.app) | actif |
| 05 · Énergies (Électricité & Transition) | [`05-energies.md`](./05-energies.md) | [`bmlemad/Enertchad-energies`](https://github.com/bmlemad/Enertchad-energies) | **archivé** |
| 06 · Technologies (Digital & IoT) | [`06-technologies.md`](./06-technologies.md) | [`bmlemad/Enertchad-technologies`](https://github.com/bmlemad/Enertchad-technologies) | **archivé** |

> Pôle 04 (Services) est intégré au Pôle 01 (Amont) depuis le recentrage organisationnel de 2026 — pas de repo dédié.

## Repos archivés — politique documentaire

Les repos `Enertchad-energies` et `Enertchad-technologies` sont actuellement marqués **archived** sur GitHub (read-only). Leur contenu opérationnel ne peut plus recevoir de commits tant que le flag n'est pas retiré.

Pendant cette période, toute mise à jour documentaire des pôles 05 et 06 doit se faire :

1. **Ici** — dans `poles/05-energies.md` et `poles/06-technologies.md` (source vivante).
2. **Réconciliée** avec [`DATA_MASTER.yml`](../DATA_MASTER.yml) à la racine du hub (source unique de vérité pour les chiffres).

Lors du désarchivage éventuel de ces repos, un simple `git pull` puis `cp` répercutera les mises à jour vers les `README.md` respectifs.

## Source unique de vérité (SoT)

Tous les chiffres cités dans les fichiers de ce dossier (production, effectifs, stations, MW, etc.) proviennent du fichier [`DATA_MASTER.yml`](../DATA_MASTER.yml). Ne jamais éditer les chiffres ici sans mettre à jour le YAML canonique simultanément.

---

© 2026 EnerTchad Groupe SA/CA · Propriété exclusive.
