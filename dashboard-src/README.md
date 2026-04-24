# dashboard-src/

Build pipeline for `/dashboard-executif.html`.

**Problem solved :** la page embarquait avant `@babel/standalone` (~3 MB) pour transpiler du JSX à la volée dans le navigateur. Désormais le JSX est pré-compilé en CI et servi sous forme de bundle minifié avec cache immutable 1 an.

## Architecture

```
dashboard-src/
├── dashboard-executif.jsx    ← source (~38 KB, React + Recharts)
├── build.mjs                 ← esbuild wrapper (JSX → JS, content hash, HTML patch)
├── package.json              ← esbuild only
└── README.md                 ← ce fichier
```

**Output :**

```
assets/js/dashboard-executif.<hash>.bundle.js      ← bundle minifié (~30-40 KB)
assets/js/dashboard-executif.<hash>.bundle.js.map  ← sourcemap
assets/js/dashboard-executif.manifest.json         ← mapping logique → hash
dashboard-executif.html                            ← patché automatiquement
```

React, ReactDOM et Recharts restent chargés en UMD (pour l'instant via unpkg, self-hosting = Phase 2.4). Ils sont **externes** au bundle — pas de duplication ni de double-React.

## Développement local

```bash
cd dashboard-src
npm ci
npm run build
```

Le bundle apparaît dans `../assets/js/` et `../dashboard-executif.html` est patché pour pointer vers lui.

## CI (GitHub Actions)

Le workflow `.github/workflows/build-dashboard.yml` exécute `npm run build` à chaque push sur `main` qui touche `dashboard-src/**` ou `dashboard-executif.html`, puis commite le bundle + le HTML patché.

## Cache strategy

Le bundle a un hash de contenu dans son nom → `public, max-age=31536000, immutable` via `_headers` (règle `/assets/js/*`). À chaque changement de source, nouveau hash, nouveau fichier, nouvelle URL. Pas de cache-busting manuel nécessaire.

## Pourquoi pas de bundle React ?

1. React + ReactDOM UMD self-hosted (Phase 2.4) = ~140 KB, cacheable 1 an, partageable entre pages futures.
2. Bundle app ≈ 30-40 KB, change à chaque commit — séparation bénéfique pour le cache.
3. Recharts (~200 KB) sera lazy-loadé (Phase 2.4) pour ne pas bloquer le first paint.
