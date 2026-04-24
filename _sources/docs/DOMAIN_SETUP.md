# Connecter `www.enertchad.com` à Netlify — guide complet

> ## 🔀 REDIRECTION — Ce guide Netlify est archivé
>
> **Avril 21, 2026** : le quota Netlify est toujours dépassé. Décision prise avec Bignero : pivot vers **Cloudflare Pages** (gratuit, sans quota).
>
> **Voir `CLOUDFLARE_SETUP.md`** pour le guide actif.
>
> Ce fichier reste archivé pour reprise éventuelle quand Netlify sera restauré (mai 2026).
>
> ---
>
> ## ⚠️ BLOCAGE ORIGINAL — Quota Netlify dépassé
>
> **Constat du 21 avril 2026 (en direct via Claude in Chrome)** :
>
> L'équipe Netlify `ENERTCHAD` a dépassé sa limite de crédit mensuelle (plan Free). Message officiel affiché dans l'UI :
>
> > *« This team has exceeded the credit limit. All projects and deploys have been paused to prevent overages. Your projects and deploys will be restored next month or you may upgrade your team to restore immediate access. »*
>
> **Implications** :
> - Les **4 projets sont en état `Paused`** → c'est l'origine des 503 observés depuis la session précédente.
> - **Créer un 5ème projet ne débloque rien** → il sera paused dès la création (limite d'équipe, pas de projet).
> - **Pousser les 14 commits vers GitHub ne déclenchera pas de déploiement Netlify** tant que la pause est active.
> - **Les previews révèlent du contenu réel** dans `enchanting-dragon`, `gregarious-kitsune` (page EnerTchad "Production pétrolière") et `coruscating-griffin` (site protégé par mot de passe). **Ne rien supprimer aveuglément** — vérifier le contenu en détail avant.
>
> **Choix retenu par Bignero** : attendre le reset mensuel.
>
> Le guide ci-dessous reste valide et sera exécuté après la restauration automatique des projets (début mai 2026). La tâche planifiée `enertchad-dns-switchover-watch` détectera également le retour en ligne des projets Netlify.

---

## État actuel (constaté le 21 avril 2026)

| Élément | État |
|---|---|
| `www.enertchad.com` | Pointé sur **OVH** (IP `213.186.33.5`) — page « Site en construction » par défaut |
| `enertchad.com` (apex) | Même IP OVH |
| Projet Netlify connecté à un repo | `transcendent-profiterole-9e8a07` → `bmlemad/enertchad-website` (mauvais repo) |
| Projets Netlify drag-drop orphelins | 3 (coruscating-griffin, gregarious-kitsune, enchanting-dragon) |
| Repo cible avec les 14 commits perf | `bmlemad/Enertchad-groupe` |

Conclusion : **aucun des 4 projets Netlify existants ne peut être utilisé en l'état**. Tous sont à supprimer. On repart proprement.

---

## Étape 1 — Pousser les 14 commits vers GitHub

Prérequis à toute mise en prod. Suivre `PUSH_INSTRUCTIONS.md` dans ce même dossier (Option A = bundle recommandée).

Après push, vérifier sur `https://github.com/bmlemad/Enertchad-groupe/commits/main` que le dernier commit est `74eb28e` (« perf(ci): relax dashboard-executif JS budget »).

---

## Étape 2 — Supprimer les 4 anciens projets Netlify

Le MCP Netlify n'expose pas de `delete-project`. Faire manuellement via l'UI :

Pour chacun des projets ci-dessous, aller sur `https://app.netlify.com/projects/<NOM>` → **Site configuration** → **General** → scroll en bas → **Danger zone** → **Delete this project** → taper le nom pour confirmer :

1. `enchanting-dragon-ade819` — drag-drop manuel, 0 valeur
2. `gregarious-kitsune-98d934` — drag-drop (index + enertchad-v2.html), 0 valeur
3. `transcendent-profiterole-9e8a07` — connecté au mauvais repo (`enertchad-website`)
4. `coruscating-griffin-91be5b` — premier test lors du signup, 0 valeur

URLs admin directs :

- https://app.netlify.com/projects/enchanting-dragon-ade819/configuration/general
- https://app.netlify.com/projects/gregarious-kitsune-98d934/configuration/general
- https://app.netlify.com/projects/transcendent-profiterole-9e8a07/configuration/general
- https://app.netlify.com/projects/coruscating-griffin-91be5b/configuration/general

---

## Étape 3 — Créer le nouveau projet Netlify connecté à `Enertchad-groupe`

1. Aller sur `https://app.netlify.com/start`.
2. Cliquer **Import an existing project** → **Deploy with GitHub**.
3. Autoriser Netlify à accéder à l'organisation `bmlemad` si pas déjà fait.
4. Sélectionner le repo **`bmlemad/Enertchad-groupe`**.
5. Branche de production : **`main`**.
6. Build settings : tout peut rester vide (site statique, aucun build requis). Si l'UI insiste :
   - **Build command** : `npm run build:dashboard` (déclenche le pipeline esbuild + Tailwind compile pour `dashboard-executif`)
   - **Publish directory** : `.`
7. Cliquer **Deploy site**.
8. Premier deploy doit réussir (< 30 secondes, site statique).
9. Une fois déployé, renommer le projet : **Site configuration → General → Site details → Change site name** → saisir `enertchad-groupe` (ou un autre nom disponible si conflit).

Le fichier `netlify.toml` à la racine du repo contient déjà :
- La config `publish = "."`
- Les redirects legacy (`/about` → `/groupe.html`, etc.)
- Les headers CSP/HSTS/X-Frame-Options
- Les règles de cache (1 an immutable pour `/assets/*`, 10 min pour `/*.html`)

Aucune config à refaire dans l'UI Netlify.

---

## Étape 4 — Ajouter `www.enertchad.com` comme domaine custom

Dans le nouveau projet : **Domain management** → **Add a custom domain** → saisir `www.enertchad.com`.

Netlify va ensuite afficher deux options :

### Option A (recommandée) — Utiliser les DNS Netlify (nameservers)

Ne pas choisir cette option ici car tu dois alors transférer le DNS complet d'OVH vers Netlify. Plus complexe. Skip.

### Option B — Garder OVH comme DNS provider et pointer via CNAME / A (à faire)

Netlify va te donner :
- Un **CNAME target** pour `www` (par exemple `enertchad-groupe.netlify.app` ou `apex-loadbalancer.netlify.com`)
- Une **IP A record** pour l'apex : `75.2.60.5` (IP standard Netlify load balancer)

**Note** : les valeurs exactes apparaissent dans l'UI au moment de l'ajout — il faut les récupérer à ce moment-là.

Ajouter aussi `enertchad.com` (apex) comme custom domain pour activer la redirection automatique `enertchad.com` → `www.enertchad.com`.

---

## Étape 5 — Modifier les DNS dans le manager OVH

Aller sur `https://www.ovh.com/manager/` → **Domaines** → `enertchad.com` → onglet **Zone DNS**.

Supprimer ou remplacer les enregistrements existants qui pointent vers `213.186.33.5` (hébergement OVH actuel) :

| Nom | Type | TTL | Cible actuelle (à supprimer) | Nouvelle cible (à créer) |
|---|---|---|---|---|
| `enertchad.com.` | A | 3600 | `213.186.33.5` | `75.2.60.5` (IP Netlify apex load balancer — **à confirmer depuis l'UI Netlify**) |
| `www.enertchad.com.` | CNAME | 3600 | `enertchad.com.` | `<ton-projet>.netlify.app.` (ex : `enertchad-groupe.netlify.app.`) |

**Garder intouchés** :
- Les records **MX** (si tu as des emails `@enertchad.com` chez OVH)
- Les records **TXT SPF / DKIM / DMARC**
- Les records **AAAA** (IPv6) — ou les mettre à jour si Netlify en fournit

Propagation DNS : 5 min à 24 h selon TTL. Tu peux vérifier avec :
```bash
dig +short www.enertchad.com
dig +short enertchad.com
```
Une fois qu'ils retournent les IPs Netlify, le site est live.

---

## Étape 6 — Activer HTTPS (Let's Encrypt)

Une fois la propagation DNS terminée (Netlify détecte automatiquement) :
- **Domain management** → `www.enertchad.com` → **Verify DNS configuration** → **Provision certificate**.
- Let's Encrypt émet le cert en 1-2 min.
- Activer **Force HTTPS redirect**.

---

## Étape 7 — Valider

Une fois tout propagé :

```bash
# Doit retourner 200 OK avec server: Netlify
curl -I https://www.enertchad.com/

# Doit rediriger 301 vers www
curl -I https://enertchad.com/

# Doit retourner 200 avec CSP headers
curl -I https://www.enertchad.com/groupe.html

# Doit rediriger 301 vers /groupe.html
curl -I https://www.enertchad.com/about
```

Vérifier aussi :
- Le workflow Lighthouse CI sur GitHub passe au vert (le commit `74eb28e` a normalisé les budgets pour éviter l'échec dashboard).
- Les 15 commits de perf/a11y/SEO sont servis correctement (voir les nouveaux hashes cache-busting dans `/assets/`).

---

## Annexe A — Emails et sous-domaines

Si tu utilises des emails `contact@enertchad.com`, `bignero@enertchad.com` etc. via OVH : **ne touche pas aux records MX**. Les emails continueront de fonctionner — seuls les records A et CNAME du site web changent.

Si tu as d'autres sous-domaines (`app.enertchad.com`, `api.enertchad.com`, etc.), ils restent sur OVH sauf si tu les redirige explicitement.

---

## Annexe B — Rollback d'urgence

Si quelque chose casse après le switch DNS, revenir en arrière prend 5 min :
- **Zone DNS OVH** → remettre les records A et CNAME vers `213.186.33.5` / cible OVH d'origine.
- Attendre 5 min pour la propagation.

Garde une capture d'écran de la zone DNS **avant** de modifier, pour pouvoir revenir à l'état exact.

---

## Résumé chronologique

1. ✅ 14 commits prêts dans le bundle (fait)
2. ⏳ Push vers GitHub (à faire par toi, voir `PUSH_INSTRUCTIONS.md`)
3. ⏳ Suppression des 4 anciens projets Netlify (UI Netlify)
4. ⏳ Création nouveau projet depuis `Enertchad-groupe` (UI Netlify)
5. ⏳ Ajout domaine custom `www.enertchad.com` + `enertchad.com`
6. ⏳ Modification zone DNS OVH (A et CNAME)
7. ⏳ Attendre propagation (5 min – 24 h)
8. ⏳ Activer HTTPS Let's Encrypt
9. ⏳ Tests `curl` de validation

Tout ce qui nécessite l'UI Netlify et l'accès OVH est côté utilisateur — la session Cowork ne peut pas automatiser ces étapes (le MCP Netlify n'expose ni la gestion de domaine custom ni le linking GitHub).
