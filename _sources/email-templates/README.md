# Email templates — Notifications partenaires

Templates prêts à envoyer aux 6 partenaires listés dans `DATA_MASTER.yml` après la mise à jour des coordonnées canoniques v1.2.x.

## Inventaire templates

| Fichier | Usage | Destinataires |
|---|---|---|
| `01-update-phone-institutionnel.md` | Notification changement numéro principal (FR formel) | SHT · COTCO · TOTCO |
| `02-update-phone-b2b.md` | Notification B2B commerciale (FR corporate) | CNPCIC · Perenco · TPC |
| `03-launch-monopage.md` | Annonce nouveau site + monopage | Tous (optionnel) |
| `04-invitation-enerfrica.md` | Invitation à découvrir la holding Enerfrica | Tous (optionnel) |

## Variables à personnaliser avant envoi

Remplacer dans chaque template :

- `{{PARTENAIRE_NOM}}` · nom complet du partenaire
- `{{PARTENAIRE_CONTACT}}` · nom du contact côté partenaire (si connu) ou "Direction"
- `{{DATE_ENVOI}}` · date d'envoi réelle
- `{{LIEN_PITCH_DECK}}` · URL du pitch deck Enerfrica (une fois hébergé)

## Canonique v1.2.x à rappeler

- **Téléphone principal** : `+235 99 29 86 96`
- **Email** : `contact@enertchad.td`
- **WhatsApp Business** : `https://wa.me/23599298696`
- **Site** : `https://www.enertchad.td` (dès custom domain activé)
- **Siège** : Radisson, Block D, Bureau 23, Sabangali, N'Djamena
- **RCCM** : N'DJ/RC/2026-A-0001 · **Capital** : 10 000 000 FCFA

## Format d'envoi recommandé

- Envoi depuis `contact@enertchad.td`
- Signature : Direction Générale · Bignéro Moïalbéi Le Madang
- CC : email interne du responsable relation partenaire (si applicable)
- Format : HTML avec signature EnerTchad (logo gold E + bloc coordonnées footer)
