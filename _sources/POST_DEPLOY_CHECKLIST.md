# Post-Deploy Checklist — EnerTchad v1.2.1

> **À exécuter après la première mise à jour de `enertchad-groupe.pages.dev` via auto-deploy Git.**

## 📊 Statut actions (mis à jour 2026-04-24)

| # | Action | Statut | Responsable |
|---|---|---|---|
| 0 | Déploiement auto-deploy Git CF Pages | ⏳ À faire (dashboard) | Utilisateur |
| 1 | Smoke tests sur live | ⏳ Après deploy | Auto (script) |
| 2 | Custom domain www.enertchad.td | ⏳ DNS OVH | Utilisateur |
| 3 | Révoquer tokens temporaires | ⏳ | Utilisateur |
| 4 | Dépublier 2 Netlify obsolètes | ⏳ | Utilisateur |
| 5a | Templates emails partenaires | ✅ `_sources/email-templates/` | Fait |
| 5b | Envoi effectif aux partenaires | ⏳ Après custom domain live | Utilisateur |
| 6 | Analytics + Search Console | ⏳ Après custom domain | Utilisateur |
| 7 | Parcours visiteurs QA | ⏳ Après deploy | Utilisateur |

---

## 🧪 1. Smoke tests automatiques (2 min)

Depuis ton Mac, lance en une commande :

```bash
bash _sources/tools/smoke-test.sh https://enertchad-groupe.pages.dev
```

Ou manuellement :

```bash
BASE="https://enertchad-groupe.pages.dev"

# Status codes (doit tout être 200 ou 301)
echo "━━━ Pages principales ━━━"
for p in / /groupe /services /investisseurs /durabilite /talents /actualites /contact /maps \
         /operations/amont /operations/intermediaire /operations/aval /operations/services \
         /energies /technologies /newsletter /dashboard; do
  code=$(curl -sI -o /dev/null -w "%{http_code}" "$BASE$p")
  [ "$code" = "200" ] && echo "  ✓ $p → 200" || echo "  ✘ $p → $code"
done

echo ""
echo "━━━ Clean URLs services (doit tout être 301) ━━━"
for p in /services/ep /services/eor /services/pipeline /services/distribution /services/petrochimie \
         /services/digital /services/ics /services/cybersecurite /services/securite /services/solaire /services/esg \
         /services/exploration-production /services/pipeline-midstream; do
  code=$(curl -sI -o /dev/null -w "%{http_code}" "$BASE$p")
  [ "$code" = "301" ] && echo "  ✓ $p → 301" || echo "  ✘ $p → $code"
done

echo ""
echo "━━━ Anti-leak (doit tout être 404) ━━━"
for p in /_sources/ /_sources/tools/sync-services.py /_sources/enerfrica-deck/build.js \
         /DATA_MASTER.yml /dashboard-src/ /scripts/gen_assets.py /AUDIT_TECHNIQUE_2026-04-22.md; do
  code=$(curl -sI -o /dev/null -w "%{http_code}" "$BASE$p")
  [ "$code" = "404" ] && echo "  ✓ $p → 404" || echo "  ✘ $p → $code (LEAK!)"
done

echo ""
echo "━━━ Headers sécurité ━━━"
curl -sI "$BASE/" | grep -iE "strict-transport-security|content-security-policy|x-frame-options"

echo ""
echo "━━━ Checks contenu ━━━"
curl -s "$BASE/services" | grep -Eo 'id="section-[a-z-]+"' | sort -u | head -15
# Attendu : 10 anchors section-ep, section-eor, ..., section-esg
```

---

## 🌐 2. Custom domain `www.enertchad.td` (5 min DNS · 1 h propagation)

### Étape 2.1 — Ajouter le domaine dans CF Pages

1. https://dash.cloudflare.com/234995e885cd784e102c135df48f6ddf/pages/view/enertchad-groupe
2. **Custom domains** → **Set up a custom domain**
3. Entre `www.enertchad.td` → **Continue**
4. CF te donne les valeurs DNS à configurer (CNAME target)

### Étape 2.2 — Modifier la zone DNS chez OVH

Aller sur `https://www.ovh.com/manager/` → **Domaines** → `enertchad.td` → **Zone DNS**.

**Records à créer :**

| Nom | Type | TTL | Cible |
|---|---|---|---|
| `www.enertchad.td.` | **CNAME** | 3600 | `enertchad-groupe.pages.dev.` |
| `enertchad.td.` | **A** | 3600 | `172.66.47.117` |
| `enertchad.td.` | **A** | 3600 | `172.66.44.139` |

**Records à supprimer :** ancienne `A 213.186.33.5` (OVH hosting) sur apex + CNAME legacy.

**Ne pas toucher :** MX (emails), TXT SPF/DKIM/DMARC.

### Étape 2.3 — Propagation + SSL auto

```bash
# Depuis ton Mac, attend 5-15 min puis :
dig +short www.enertchad.td     # doit retourner enertchad-groupe.pages.dev + IPs
dig +short enertchad.td         # doit retourner 172.66.47.117 + 172.66.44.139

# Puis test HTTPS
curl -sI https://www.enertchad.td/ | head -1    # HTTP/2 200
curl -sI https://enertchad.td/ | head -1         # HTTP/2 200 ou 301
```

CF émet automatiquement le certificat SSL (Google-managed, ~1 min après validation DNS).

### Étape 2.4 — Optionnel : redirect apex → www

CF Pages sert par défaut `enertchad.td` ET `www.enertchad.td`. Pour forcer apex → www (SEO) :
- CF Dashboard → **Redirect Rules** → `enertchad.td/*` → `https://www.enertchad.td/$1` (301)

---

## 🔒 3. Révoquer les tokens temporaires

```
GitHub PAT (utilisé pour git push)
  https://github.com/settings/personal-access-tokens
  → "EnerTchad deploy 2026-04-24" → Revoke

Cloudflare token (cfat_qHH... uniquement Account:Read)
  https://dash.cloudflare.com/234995e885cd784e102c135df48f6ddf/profile/api-tokens
  → Delete

Cloudflare token (cfut_v4o... ancien)
  idem — delete si encore actif
```

---

## 🧹 4. Dépublier les 2 Netlify obsolètes

Ces 2 sites diffusent des **données erronées** (RCCM 2019, capital 500M FCFA, téléphone 98 98 37 37 comme primaire) :

```
https://enchanting-dragon-ade819.netlify.app
https://transcendent-profiterole-9e8a07.netlify.app
```

Pour dépublier :
1. https://app.netlify.com/ → Login
2. Pour chaque site : **Site configuration → Site details → Delete this site**
3. Confirmer la suppression

---

## 📱 5. Notifier les partenaires du nouveau numéro

Les partenaires institutionnels et B2B ont possiblement l'ancien numéro `+235 98 98 37 37` depuis les sites Netlify obsolètes. Envoyer un email de mise à jour à :

| Partenaire | Contact connu | Action |
|---|---|---|
| **SHT** (Société des Hydrocarbures du Tchad) | institutionnel | Email corporate |
| **COTCO** (opérateur pipeline Cameroun) | institutionnel | Email + LinkedIn |
| **TOTCO** (opérateur pipeline Tchad) | institutionnel | Email + LinkedIn |
| **CNPCIC** | B2B client | Email commercial |
| **Perenco** | B2B client | Email commercial |
| **TPC** | B2B client | Email commercial |

Template email dans `_sources/email-templates/update-phone.md` (à créer).

---

## 📊 6. Vérifications analytics

### Plausible (si configuré)

```bash
curl -s "https://plausible.io/api/v1/stats/aggregate?site_id=enertchad.td&period=7d&metrics=visitors,pageviews,bounce_rate"
```

### Search Console

1. https://search.google.com/search-console/ → Add property `https://www.enertchad.td`
2. Validation via DNS TXT record
3. Submit sitemap : `https://www.enertchad.td/sitemap.xml`
4. Vérifier les 10 anchors `/services#section-*` sont indexables

---

## 🎯 7. Dernière vérification — parcours visiteurs

### Parcours 1 — Investisseur institutionnel
1. Ouvre https://www.enertchad.td
2. Clique **Investisseurs** (nav)
3. Vérifie les chiffres : 144 kb/j, 20 kb/j raffinerie, 10 M FCFA capital
4. Trouve le bouton **Dashboard exécutif**

### Parcours 2 — Prospect service B2B
1. Ouvre https://www.enertchad.td/services
2. Vérifie les **10 sections** (E&P, EOR, Pipeline, Distribution, Pétrochimie, Digital, ICS, Sécurité Physique, Énergies, ESG)
3. Clique un CTA (ex. "Demander une étude de réservoir")
4. Vérifie que le form `/contact` est **pré-rempli** (type + subject)
5. Vérifie le bouton **WhatsApp Business** dans footer

### Parcours 3 — Candidat recrutement
1. Ouvre `/talents`
2. Vérifie la section **EnerAcademy** (500+ formés/an, 4 programmes)
3. Clique **Candidature spontanée**

### Parcours 4 — Media / Press
1. Ouvre `/actualites`
2. Vérifie la dernière date de publication
3. Clique **Newsroom** → vérifier communiqué

---

## ✅ Sign-off

Une fois toutes les checks passées, marquer la release v1.2.0 comme **PRODUCTION**.

```bash
git tag -a v1.2.0-production -m "Production sign-off after smoke tests passed"
git push origin v1.2.0-production
```

Et annoter le release sur GitHub :
https://github.com/bmlemad/Enertchad-groupe/releases/tag/v1.2.0

---

**Responsable** : bignero@gmail.com (DG) · **Date cible** : 2026-04-24
