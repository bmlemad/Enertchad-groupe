# EnerTchad Groupe — Inventaire des clés i18n (QW-06)

**Date :** 2026-04-19
**Scope :** 8 pages publiques du site (home + groupe + 3 opérations + durabilité + talents + contact)
**Statut :** inventaire des clés — **pas** de switcher JS ni de traductions complètes (voir `js/i18n.js` existant pour la mécanique actuelle)

## Convention de nommage

Format : `section.element[.sous-element]`

- **section** : zone logique (nav, footer, home, groupe, ops-amont, ops-midstream, ops-aval, durabilite, talents, contact, legal, common, cookie)
- **element** : identifiant court (title, subtitle, cta, desc, kpi, card.N)
- **sous-element** (optionnel) : index (card.1, card.2) ou sous-clé (cta.primary, cta.secondary)

Règles :
- minuscules, tirets pour mots composés dans un segment (ex. `ops-amont`)
- séparateur de hiérarchie : `.` (point)
- pas d'espaces, pas d'accents
- les chaînes courtes partagées (CTA communs) vivent dans `common.*`
- les chaînes légales vivent dans `legal.*`

## État du parc i18n (pré-audit 2026-04-19)

Page               | Nœuds `data-i18n` | Pattern utilisé
-------------------|-------------------|--------------------------------
index.html         | 482               | `data-i18n` + `data-en="..."` (inline EN)
groupe/index.html  | 349               | idem
operations/amont   | 440               | idem
operations/inter   | 432               | idem
operations/aval    | 510               | idem
durabilite         | 292               | idem
talents            | 331               | idem
contact            | 242               | idem
**Total**          | **3 078**         | La grande majorité des chaînes visibles est déjà instrumentée.

Le switcher `setLang(lang)` dans `js/app.js` (l. 495-528) utilise `data-i18n` comme **flag** (pas comme clé) et lit l'EN depuis `data-en`. Le code i18n alternatif `js/i18n.js` utilise un dictionnaire à clés. La migration vers une clé `data-i18n="section.element"` est **compatible** (le flag fonctionne avec ou sans valeur) ; la stratégie recommandée : ajouter progressivement la clé en valeur sans retirer `data-en` pour préserver le switcher existant.

## Clés communes transversales

```
common.nav.groupe                 "Groupe" / "Group"
common.nav.operations             "Opérations" / "Operations"
common.nav.operations.amont       "Amont" / "Upstream"
common.nav.operations.midstream   "Intermédiaire" / "Midstream"
common.nav.operations.aval        "Aval" / "Downstream"
common.nav.durabilite             "Durabilité" / "Sustainability"
common.nav.talents                "Talents" / "Careers"
common.nav.contact                "Contact"
common.nav.cta.devis              "Demander un devis" / "Request a quote"

common.breadcrumb.home            "Accueil" / "Home"
common.breadcrumb.operations      "Opérations" / "Operations"

common.footer.cta.contact         "Nous contacter" / "Contact us"
common.footer.cta.email           "contact@enertchad.td"
common.footer.address             "Cité du 1er Décembre, Radisson Blu, Bloc D, Bureau 23, N'Djaména, Tchad"
common.footer.hours               "Lundi–Vendredi : 8h00–18h00"
common.footer.legal               "© 2026 EnerTchad Groupe — Tous droits réservés"

common.cta.voir-plus              "En savoir plus" / "Learn more"
common.cta.decouvrir              "Découvrir" / "Discover"
common.cta.telecharger            "Télécharger" / "Download"
common.cta.postuler               "Postuler" / "Apply"
common.cta.demander-devis         "Demander un devis" / "Request a quote"
common.cta.nous-contacter         "Nous contacter" / "Contact us"

common.lang.switcher              "EN" / "FR"
common.skip-link                  "Aller au contenu principal" / "Skip to main content"

common.cookie.title               "Cookies & vie privée" / "Cookies & privacy"
common.cookie.desc                "Ce site utilise Plausible Analytics (sans cookies tiers)…"
common.cookie.accept              "Accepter" / "Accept"
common.cookie.refuse              "Refuser" / "Decline"
common.cookie.settings            "Paramètres" / "Settings"

legal.mentions                    "Mentions légales" / "Legal notice"
legal.confidentialite             "Politique de confidentialité" / "Privacy policy"
legal.cookies                     "Politique cookies" / "Cookie policy"
legal.rgpd                        "Conformité RGPD" / "GDPR compliance"
```

## 1. Home — `/` (index.html)

```
home.meta.title                   "Services Pétroliers & Distribution | EnerTchad Groupe"
home.meta.description             (voir <meta name="description">)
home.hero.eyebrow                 "Groupe pétrolier & gazier intégré — Tchad"
home.hero.title                   "L'énergie du Tchad, par les Tchadiens."
home.hero.subtitle                (paragraphe pitch)
home.hero.cta.primary             "Découvrir nos opérations"
home.hero.cta.secondary           "Contacter la direction"
home.hero.kpi.production.value    "144 K b/j"
home.hero.kpi.production.label    "Production 2024"
home.hero.kpi.reserves.value      "1,5 Gbl"
home.hero.kpi.reserves.label      "Réserves 2P"
home.hero.kpi.target.value        "250 K b/j"
home.hero.kpi.target.label        "Cap 2030"
home.hero.kpi.employees.value     "1 240"
home.hero.kpi.employees.label     "Collaborateurs"

home.filiales.title               "6 filiales intégrées"
home.filiales.subtitle            "De l'amont à l'aval"
home.filiales.card.amont.title    "EnerTchad Amont"
home.filiales.card.amont.desc     "Exploration & Production — 5 bassins, 7 opérateurs"
home.filiales.card.midstream.title "EnerTchad Intermédiaire"
home.filiales.card.midstream.desc  "Pipeline Doba-Kribi 1 070 km"
home.filiales.card.aval.title     "EnerTchad Aval"
home.filiales.card.aval.desc      "24 stations, raffinerie Djarmaya"
home.filiales.card.petro.title    "EnerTchad Pétrochimie"
home.filiales.card.petro.desc     (à venir)
home.filiales.card.tech.title     "EnerTchad Technologies"
home.filiales.card.energy.title   "EnerTchad Énergies"

home.value-chain.title            "La chaîne de valeur"
home.value-chain.amont.*          (étapes exploration → production)
home.value-chain.midstream.*      (transport → stockage)
home.value-chain.aval.*           (distribution → consommateurs)

home.faq.title                    "Questions fréquentes"
home.faq.q1                       "Qui est EnerTchad Groupe ?"
home.faq.a1                       (réponse)
home.faq.q2                       "Quelles sont vos filiales ?"
home.faq.a2                       ...
home.faq.q3                       "Quelle est la production ?"
home.faq.q4                       "Objectif 2030 ?"
home.faq.q5                       "Engagement RSE ?"

home.news.title                   "Actualités"
home.news.card.N.date             ...
home.news.card.N.title            ...

home.cta-band.title               "Prêt à construire l'énergie du Tchad ?"
home.cta-band.cta                 "Prenons contact"

home.team.title                   "Direction"
home.team.member.1.name           "Bignéro Moïalbéi Le Madang"
home.team.member.1.role           "CEO / PDG"
home.team.member.2.name           "Théophile Gag Pinabei"
home.team.member.2.role           "COO"
home.team.member.3.name           "Constant Ngarmadji"
home.team.member.3.role           "CFO"
```

## 2. Groupe — `/groupe` (groupe/index.html)

```
groupe.meta.title                 "Groupe — Notre histoire, mission, gouvernance | EnerTchad"
groupe.hero.eyebrow               "À propos du Groupe"
groupe.hero.title                 "Un groupe pétrolier & gazier souverain au service du Tchad."
groupe.hero.subtitle              ...

groupe.mission.title              "Notre mission"
groupe.mission.pillar.1.*         "Souveraineté / Sovereignty"
groupe.mission.pillar.2.*         "Expertise tchadienne / Chadian expertise"
groupe.mission.pillar.3.*         "Transition durable / Sustainable transition"

groupe.histoire.title             "Notre histoire"
groupe.histoire.timeline.2026     ...
groupe.histoire.timeline.2028     ...
groupe.histoire.timeline.2030     ...

groupe.gouvernance.title          "Gouvernance"
groupe.gouvernance.ceo.*          ...
groupe.gouvernance.coo.*          ...
groupe.gouvernance.cfo.*          ...
groupe.gouvernance.board.*        ...

groupe.chiffres.title             "Chiffres clés 2024"
groupe.chiffres.production        "144 K b/j"
groupe.chiffres.reserves          "1,5 Gbl"
groupe.chiffres.employees         "1 240"
groupe.chiffres.stations          "24"
groupe.chiffres.villes            "14"
groupe.chiffres.pipeline          "1 070 km"
groupe.chiffres.refinery          "20 K b/j"
groupe.chiffres.renewable         "500 MW"

groupe.faq.q1                     "Qu'est-ce qu'EnerTchad Groupe ?"
groupe.faq.q2                     "Quelles sont vos 6 filiales ?"
groupe.faq.q3                     "Quel est le CA ?"
groupe.faq.q4                     "Plan 2030 ?"
```

## 3. Opérations Amont — `/operations/amont`

```
ops-amont.meta.title              "Amont — Exploration & Production | EnerTchad"
ops-amont.hero.eyebrow            "Opérations Amont"
ops-amont.hero.title              "Exploration-Production : l'ADN du Tchad pétrolier."
ops-amont.hero.kpi.production     "144 K b/j"
ops-amont.hero.kpi.reserves       "1,5 Gbl"
ops-amont.hero.kpi.bassins        "5 bassins"
ops-amont.hero.kpi.operators      "7 opérateurs"

ops-amont.bassins.title           "Les 5 bassins pétroliers actifs"
ops-amont.bassins.1.name          "Doba"
ops-amont.bassins.1.desc          ...
ops-amont.bassins.2.name          "Bongor"
ops-amont.bassins.3.name          "Doseo"
ops-amont.bassins.4.name          "Salamat"
ops-amont.bassins.5.name          "Termit"

ops-amont.operators.title         "Les 7 opérateurs majeurs"
ops-amont.operators.1.name        "CNPCIC"
ops-amont.operators.1.prod        "60 K b/j"
ops-amont.operators.2.name        "Perenco"
ops-amont.operators.3.name        "TPC / Savannah"
ops-amont.operators.4.name        "SHT"
ops-amont.operators.5.name        "CGIP"
ops-amont.operators.6.name        "Delonex Energy"
ops-amont.operators.7.name        "ERHC"

ops-amont.exploration.title       "Exploration"
ops-amont.production.title        "Production"
ops-amont.reservoirs.title        "Gestion des réserves"
ops-amont.hse.title               "HSE — Santé, sécurité, environnement"

ops-amont.faq.q1                  "Combien de bassins actifs ?"
ops-amont.faq.q2                  "Qui sont les opérateurs ?"
ops-amont.faq.q3                  "Quelle production ?"
```

## 4. Opérations Intermédiaire — `/operations/intermediaire`

```
ops-midstream.meta.title          "Intermédiaire — Transport | EnerTchad Groupe"
ops-midstream.hero.eyebrow        "Opérations Intermédiaire"
ops-midstream.hero.title          "Le pipeline qui connecte le Tchad au monde."
ops-midstream.hero.kpi.length     "1 070 km"
ops-midstream.hero.kpi.capacity   "250 K b/j"
ops-midstream.hero.kpi.uptime     "98,5 %"

ops-midstream.pipeline.title      "Pipeline Doba-Kribi"
ops-midstream.pipeline.desc       "1 070 km depuis Doba (Tchad) jusqu'au terminal flottant de Kribi (Cameroun)"
ops-midstream.pipeline.komé       "Komé — hub de collecte"
ops-midstream.terminals.title     "Terminaux"
ops-midstream.stockage.title      "Stockage"

ops-midstream.faq.q1              "Quelle est la longueur du pipeline ?"
ops-midstream.faq.q2              "Quelle capacité de transport ?"
ops-midstream.faq.q3              "Quels sont les points d'arrivée ?"
```

## 5. Opérations Aval — `/operations/aval`

```
ops-aval.meta.title               "Aval — Distribution | EnerTchad Groupe"
ops-aval.hero.eyebrow             "Opérations Aval"
ops-aval.hero.title               "Distribuer, ravitailler, servir."
ops-aval.hero.kpi.stations        "24"
ops-aval.hero.kpi.cities          "14"
ops-aval.hero.kpi.refinery        "20 K b/j"

ops-aval.raffinerie.title         "Raffinerie de Djarmaya"
ops-aval.raffinerie.capacity      "20 K b/j"
ops-aval.raffinerie.desc          ...

ops-aval.stations.title           "Réseau stations-service"
ops-aval.stations.ndjamena        "N'Djaména"
ops-aval.stations.moundou         "Moundou"
ops-aval.stations.sarh            "Sarh"
ops-aval.stations.abeche          "Abéché"
(villes : 14)

ops-aval.products.title           "Produits"
ops-aval.products.gpl-12          "Bouteille GPL 12,5 kg"
ops-aval.products.gpl-6           "Bouteille GPL 6 kg"
ops-aval.products.oil             "Huile Moteur SAE 15W-40"
ops-aval.products.diesel-200      "Gasoil — Livraison 200L"
ops-aval.products.kit             "Kit Entretien Auto"
ops-aval.products.battery         "Batterie Auto 70Ah"

ops-aval.services.title           "Services B2B"
ops-aval.services.fleet           "Cartes Flottes"
ops-aval.services.bulk            "Livraison en vrac"
ops-aval.services.contracts       "Contrats cadre"

ops-aval.faq.q1                   "Où sont les stations ?"
ops-aval.faq.q2                   "Comment fonctionne la raffinerie ?"
ops-aval.faq.q3                   "Produits GPL disponibles ?"
```

## 6. Durabilité — `/durabilite`

```
durabilite.meta.title             "Durabilité — ESG, ODD, transition | EnerTchad"
durabilite.hero.eyebrow           "Engagement ESG"
durabilite.hero.title             "La transition énergétique, responsable et tchadienne."
durabilite.hero.kpi.renewable     "500 MW renouvelable (cap 2030)"
durabilite.hero.kpi.odd           "7 ODD adressés"
durabilite.hero.kpi.iso           "3 certifications ISO"

durabilite.axe.climate.title      "Climat"
durabilite.axe.climate.desc       "Objectif net-zero 2050, trajectoire -30% GES d'ici 2030"
durabilite.axe.biodiversity.title "Biodiversité"
durabilite.axe.community.title    "Communautés"
durabilite.axe.governance.title   "Gouvernance"

durabilite.iso.37001              "ISO 37001 — Anti-corruption"
durabilite.iso.26000              "ISO 26000 — Responsabilité sociétale"
durabilite.iso.27001              "ISO 27001 — Sécurité information"

durabilite.odd.title              "ODD prioritaires"
durabilite.odd.7                  "ODD 7 — Énergie propre"
durabilite.odd.8                  "ODD 8 — Travail décent"
durabilite.odd.9                  "ODD 9 — Industrie"
durabilite.odd.13                 "ODD 13 — Climat"
durabilite.odd.15                 "ODD 15 — Vie terrestre"
durabilite.odd.16                 "ODD 16 — Paix, justice"
durabilite.odd.17                 "ODD 17 — Partenariats"

durabilite.reporting.title        "Rapports ESG"
durabilite.reporting.cta.download "Télécharger le rapport 2025"     (A_CLARIFIER : PDF non fourni)
```

## 7. Talents — `/talents`

```
talents.meta.title                "Talents — Carrières, recrutement | EnerTchad"
talents.hero.eyebrow              "Carrières"
talents.hero.title                "Rejoignez la génération qui construit l'énergie du Tchad."
talents.hero.kpi.employees        "1 240 collaborateurs"
talents.hero.kpi.local            "80% local"
talents.hero.kpi.academy          "EnerAcademy"

talents.offers.title              "Offres en cours"
talents.offers.1.title            "Ingénieur Forage"
talents.offers.2.title            "Responsable Distribution"
talents.offers.3.title            "Inspecteur Pipeline"
talents.offers.4.title            "Ingénieur SCADA"
talents.offers.5.title            "Superviseur HSE"
talents.offers.6.title            "Graduate Trainee"
talents.offers.cta.apply          "Postuler" / "Apply"

talents.culture.title             "Culture & valeurs"
talents.academy.title             "EnerAcademy — formation interne"
talents.testimonials.title        "Ils en parlent"
talents.testimonials.1.*          ...
talents.spontanee.title           "Candidature spontanée"
talents.spontanee.cta             "Envoyer mon CV"
talents.spontanee.email           "talents@enertchad.td"

talents.faq.q1                    "Comment postuler ?"
talents.faq.q2                    "Formations disponibles ?"
```

## 8. Contact — `/contact`

```
contact.meta.title                "Contact — Écrivez-nous | EnerTchad Groupe"
contact.hero.eyebrow              "Nous contacter"
contact.hero.title                "Parlons de votre projet énergétique."
contact.hero.subtitle             ...

contact.form.label.name           "Nom complet *"
contact.form.label.email          "Email professionnel *"
contact.form.label.company        "Entreprise"
contact.form.label.subject        "Sujet"
contact.form.label.message        "Message *"
contact.form.placeholder.name     "Ex. Jean Dupont"
contact.form.placeholder.email    "jean.dupont@entreprise.com"
contact.form.help.email           "Format professionnel conseillé."
contact.form.error.email          "Veuillez saisir un email valide."
contact.form.required             "* Champs obligatoires"
contact.form.cta.submit           "Envoyer le message" / "Send message"
contact.form.status.success       "Message envoyé. Nous vous répondons sous 48h."
contact.form.status.error         "Erreur à l'envoi. Veuillez réessayer."
contact.form.rgpd                 "En soumettant ce formulaire, vous acceptez notre politique de confidentialité…"

contact.info.title                "Coordonnées"
contact.info.address              (siège)
contact.info.phone                "+235 99 29 86 96"
contact.info.email.general        "contact@enertchad.td"
contact.info.email.amont          "amont@enertchad.td"
contact.info.email.midstream      "midstream@enertchad.td"
contact.info.email.aval           "aval@enertchad.td"
contact.info.email.ir             "ir@enertchad.td"
contact.info.email.talents        "talents@enertchad.td"
contact.info.email.presse         "presse@enertchad.td"
contact.info.hours.week           "Lundi–Vendredi : 8h00–18h00"
contact.info.hours.weekend        "Samedi : 9h00–13h00"
contact.info.hours.closed         "Dimanche : fermé"

contact.faq.q1                    "Comment contacter EnerTchad Groupe ?"
contact.faq.q2                    "Où se trouve le siège ?"
```

## 9. Plan de route (post-audit 2026-04-19)

1. **Court terme (sprint 1)** — compléter les `data-i18n` manquants sur :
   - Formulaire contact (notice RGPD, help text champs) — ~6 libellés
   - Bannière cookies commune — ~4 libellés
   - Lien "Déposer une candidature spontanée" (talents) — 1 libellé
   - Bouton "Télécharger le rapport 2025" (durabilite) — 1 libellé
   - Breadcrumbs des sous-pages — vérifier complétude sur les 8 pages
2. **Sprint 2** — ajouter la valeur `data-i18n="section.element"` sur tous les nœuds déjà instrumentés (compatibilité arrière : le switcher `app.js` fonctionne avec `data-i18n` en flag ou avec valeur ; l'ajout est additif).
3. **Sprint 3** — extraire les chaînes dans un fichier `i18n/dictionary.fr.json` + `i18n/dictionary.en.json` et migrer `js/app.js` pour lire depuis ce dictionnaire plutôt que depuis `data-en` inline. Cette étape retire ~30 % du poids HTML (les `data-en="..."` inline pèsent lourd sur les pages avec 500+ nœuds i18n).
4. **Sprint 4** — ajouter AR (arabe) comme 3e langue sur chaînes `common.*` et pages prioritaires.

## 10. A_CLARIFIER (QW-06)

- Faut-il conserver **les deux patterns** (data-i18n flag + data-en inline, ET data-i18n="section.key" valeur) durant la migration ? Mon avis : oui, pendant 1 sprint puis retirer `data-en`.
- Les chaînes **RGPD / cookies** doivent-elles passer la revue juridique avant traduction EN ?
- Pour l'arabe, y a-t-il une direction de texte RTL à gérer ? Impact CSS à budgéter.
- Les noms propres (dirigeants, villes, bassins) ne doivent **pas** être traduits ; conserver sans `data-i18n` ou avec `data-i18n="X" data-en="X"` (valeur identique) pour lever l'ambiguïté.

---
_Document généré le 19 avril 2026 dans le cadre de l'application de l'audit live `Audit_Live_enertchad-groupe_vercel_2026.docx`._
