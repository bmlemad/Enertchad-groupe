# Deploy EnerTchad sur Cloudflare Pages

> **22 avril 2026 — Statut : LIVE sur pages.dev, migration DNS enertchad.com en attente**
>
> Version code : `v1.6.0-signatures-eor-petrochimie` (SW `CACHE_VERSION`)
> Révision config : mise à jour `_redirects` + `_headers` + création `wrangler.toml`

---

## Changements de config Cloudflare — 22 avril 2026

Trois correctifs côté config, appliqués dans cette session :

1. **`_redirects` nettoyé** — retrait des 17 règles `/groupe /groupe.html 200` (et variantes) qui réintroduisaient la boucle résolue dans le deploy `72ce274c`. Cloudflare Pages sert `.html` nativement sur les URLs propres, donc ces rewrites sont inutiles et nuisibles sur cette plateforme. Netlify garde les mêmes rewrites via `netlify.toml`, donc zéro régression cross-platform.
2. **`_headers` durci** — ajout cache-control dédié pour `sw.js` (no-cache obligatoire sinon rollout Service Worker bloqué), `manifest.json`, `offline.html`, `404.html`, `robots.txt`, `sitemap.xml`. CSP élargi à `plausible.io` pour le script d'analytics et durci avec `manifest-src`/`worker-src`/`COOP`/`CORP`.
3. **`wrangler.toml` créé** — config Wrangler Pages reproductible (`name = "enertchad-groupe"`, compatibility date 2026-04-22, publish dir `.`). Facilite les futurs `npx wrangler pages deploy`.

Nouvelles redirections courtes ajoutées (cible = ancre v1.6.0) :

| URL courte | Destination | Statut |
|---|---|---|
| `/eor` | `/operations/amont#eor` | 301 |
| `/petrochimie` | `/operations/aval#petrochimie` | 301 |
| `/pole-petrochimie` | `/operations/aval#petrochimie` | 301 |
| `/ccus` | `/operations/amont#eor` | 301 |

---

## État actuel (production)

| Élément | Statut | URL / Détail |
|---|---|---|
| **Projet Cloudflare Pages** | Créé | `enertchad-groupe` (account `234995e885cd`) |
| **Site temporaire** | En ligne | `https://enertchad-groupe.pages.dev` |
| **Dernier déploiement** | Succès (2 itérations) | `72ce274c.enertchad-groupe.pages.dev` (commit `74eb28e` + fix `_redirects`) |
| **Fichiers déployés** | 72 fichiers | HTML + assets + `_headers` + `_redirects` |
| **Custom domains** | Ajoutés, DNS en attente | `www.enertchad.com` + `enertchad.com` |
| **Certificat HTTPS** | Auto (Google CA) | S'émet après validation DNS |
| **Service Worker** | v1.6.0 | Cache bump auto au prochain deploy |

Tests validés (deploy `72ce274c`, avant DNS) :

```
/            200  (homepage 48 KB, v1.6.0 inclut #petrochimie-teaser)
/groupe      200  /investisseurs 200  /durabilite 200  /talents 200
/actualites  200  /contact 200
/operations/amont 200  /operations/intermediaire 200  /operations/aval 200
/operations/services 200  /energies/ 200  /technologies/ 200
/dashboard-executif 200
/about → 301 → /groupe            (legacy OK)
/investors → 301 → /investisseurs (legacy OK)
/upstream → 301 → /operations/amont (legacy OK)
/eor → 301 → /operations/amont#eor        (NEW v1.6.0)
/petrochimie → 301 → /operations/aval#petrochimie  (NEW v1.6.0)
Headers: CSP, HSTS, X-Frame-Options, COOP/CORP actifs
sw.js: Cache-Control: no-cache (correct, rollout SW OK)
```

---

## Redeploy rapide (après modifs v1.6.0)

```bash
cd "/chemin/vers/Enertchad Web Solutions"
npx wrangler pages deploy . \
  --project-name=enertchad-groupe \
  --branch=main \
  --commit-dirty=true
```

**Pré-flight checklist avant redeploy :**

- [ ] `sw.js` — `CACHE_VERSION` incrémenté (`v1.6.0-signatures-eor-petrochimie` ✅)
- [ ] `_redirects` — AUCUNE règle `/<slug> /<slug>.html 200` (elles cassent Cloudflare)
- [ ] `_headers` — `sw.js` a `Cache-Control: no-cache` (sinon SW bloqué)
- [ ] Anchors v1.6.0 présents : `#biodiv #social #kpis #rating #agenda #calendar #mission #histoire #reseaux #une #communiques #blog #events #eor #petrochimie-teaser #petrochimie`
- [ ] Signatures hero + footer sur les 16 pages publiques
- [ ] JSON-LD `slogan` présent dans `index.html`

---

## Post-deploy verification — smoke tests v1.6.0

Une fois le deploy terminé, lancer ces vérifications :

```bash
BASE="https://enertchad-groupe.pages.dev"   # ou https://www.enertchad.com si DNS migré

# 1. HTTP status sur les nouvelles URLs / ancres
for path in / /groupe /investisseurs /operations/amont /operations/aval \
            /eor /petrochimie /ccus; do
  echo -n "$path → "
  curl -sI -o /dev/null -w "%{http_code}\n" "$BASE$path"
done

# 2. Service Worker cache headers (ne DOIT PAS être mis en cache)
curl -sI "$BASE/sw.js" | grep -i cache-control
# Attendu : Cache-Control: no-cache, no-store, must-revalidate

# 3. CSP ne bloque rien (inspecter console navigateur sur /dashboard.html)
curl -sI "$BASE/" | grep -i content-security-policy

# 4. Ancres v1.6.0 résolvent (source HTML contient l'id)
curl -s "$BASE/operations/amont" | grep -Eo 'id="eor"' | head -1
curl -s "$BASE/operations/aval"  | grep -Eo 'id="petrochimie"' | head -1
curl -s "$BASE/durabilite"       | grep -Eo 'id="biodiv"|id="social"' | head -2
curl -s "$BASE/investisseurs"    | grep -Eo 'id="kpis"|id="rating"|id="agenda"' | head -3
curl -s "$BASE/contact"          | grep -Eo 'id="reseaux"' | head -1

# 5. Slogan JSON-LD
curl -s "$BASE/" | grep -Eo '"slogan":"[^"]+"'
# Attendu : "slogan":"Unité · Innovation · Durabilité — Accès aux Énergies"
```

---

## Action requise : modifier la zone DNS chez OVH

Aller sur `https://www.ovh.com/manager/` → **Domaines** → `enertchad.com` → **Zone DNS**.

### Records à supprimer / remplacer

| Nom | Type | Ancienne cible (à enlever) |
|---|---|---|
| `enertchad.com.` | A | `213.186.33.5` (OVH hosting) |
| `www.enertchad.com.` | CNAME ou A | ancienne cible |

### Records à créer (valeurs exactes, anycast Cloudflare)

| Nom | Type | TTL | Cible |
|---|---|---|---|
| `enertchad.com.` | **A** | 3600 | `172.66.47.117` |
| `enertchad.com.` | **A** | 3600 | `172.66.44.139` |
| `www.enertchad.com.` | **CNAME** | 3600 | `enertchad-groupe.pages.dev.` |

### Records à NE PAS toucher

- **MX** (emails `@enertchad.com` si hébergés chez OVH)
- **TXT SPF / DKIM / DMARC**
- Tout sous-domaine qui pointe ailleurs

**Conseil avant toute modif** : capture d'écran de la zone DNS OVH actuelle — facilite un rollback si besoin.

---

## Propagation & validation automatique

Après les changements OVH :

1. Propagation DNS : 5 min à 1 h (TTL 3600 = max 1 h).
2. Vérifier depuis le sandbox :
   ```bash
   dig +short www.enertchad.com          # attendu : enertchad-groupe.pages.dev + IPs
   dig +short enertchad.com              # attendu : 172.66.47.117 et 172.66.44.139
   ```
3. Cloudflare détecte automatiquement le nouveau DNS et :
   - valide les domaines (passe de `pending` → `active`)
   - émet les certificats HTTPS (Google-managed, ~1 min après validation)
4. Tester :
   ```bash
   curl -sI https://www.enertchad.com/ | head -1   # → HTTP/2 200
   curl -sI https://enertchad.com/ | head -1       # → HTTP/2 200 (ou 301 vers www)
   ```

---

## Redirection apex → www (optionnel)

Par défaut, Cloudflare Pages sert le même contenu sur `enertchad.com` ET `www.enertchad.com`. Si tu préfères forcer apex → www (meilleur SEO, évite contenu dupliqué) :

- **Option simple** : dans Cloudflare dashboard → onglet **Redirect Rules** → créer une règle `enertchad.com/* → https://www.enertchad.com/$1` (301).
- **Option avancée** : ajouter `enertchad.com` comme zone Cloudflare complète (transférer DNS à Cloudflare, gratuit), puis configurer un Page Rule. Plus lourd mais débloque d'autres features (analytics, WAF, Turnstile).

---

## Sécurité — API token

Un token API Cloudflare a été créé pour permettre le déploiement via Wrangler CLI depuis le sandbox.

**⚠️ Une fois le site validé et stable (typiquement après 24 h), révoquer le token** :

1. `https://dash.cloudflare.com/profile/api-tokens`
2. Trouver le token nommé **« Edit Cloudflare Workers »** (créé le 21 avril 2026).
3. Cliquer le menu **⋯** → **Delete**.

Les prochains déploiements se feront soit :
- via un nouveau token temporaire,
- soit via Git auto-deploy une fois réparé (étape suivante ci-dessous).

---

## Prochaine étape (non urgente) — Git auto-deploy

Quand la liaison GitHub ↔ Cloudflare Pages sera débloquée :

1. Pousser les commits sur `bmlemad/Enertchad-groupe` (bundle `enertchad-*.bundle` dispo dans le dossier).
2. Cloudflare Pages → projet `enertchad-groupe` → **Settings** → **Builds & deployments** → **Connect to Git**.
3. Scope GitHub App : `Enertchad-groupe` uniquement.
4. Branche `main`, build command vide, publish dir `.`.
5. Chaque push sur `main` → redeploy auto.

Avec `wrangler.toml` en place, Cloudflare lira les settings depuis le fichier (name, compatibility_date, pages_build_output_dir) : zéro configuration manuelle côté dashboard.

---

## Rollback express (si le switch DNS casse quelque chose)

1. Zone DNS OVH → remettre `A 213.186.33.5` sur apex + CNAME `www` vers apex (état pré-Cloudflare).
2. Attendre 5 min (TTL 3600).
3. Le site retombe sur l'hosting OVH par défaut.

Le projet Cloudflare Pages reste dispo à `enertchad-groupe.pages.dev` dans tous les cas — peut être re-branché à tout moment.

---

## Annexe — Historique des déploiements

| Deployment hash | Raison | Statut |
|---|---|---|
| `4cc8533f` | Premier tentative (upload UI Cloudflare) | 0 octet uploadé (bug file_upload MCP) |
| `203293ce` | Wrangler CLI, 83 fichiers (original `_redirects`) | OK mais loop `/groupe.html ↔ /groupe` |
| `72ce274c` | Wrangler CLI, `_redirects` corrigé (sans rewrites `.html`) | **Production actuelle (v1.5.x)** |
| `(prochain)`  | v1.6.0 — signatures + EOR + pétrochimie, `_redirects` propre | À déployer |

La correction clé (historique) : Cloudflare Pages sert automatiquement `.html` aux URLs propres (`/groupe` renvoie `groupe.html` nativement). Les règles `/groupe /groupe.html 200` Netlify-style créaient une boucle. Retirées et **à ne jamais réintroduire dans `_redirects`** (Netlify les garde dans `netlify.toml`, Cloudflare n'en a pas besoin).
