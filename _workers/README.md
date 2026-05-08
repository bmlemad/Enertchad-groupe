# EnerTchad SA · AI Concierge Worker · Deploy Guide

## Architecture

```
Browser (ai-concierge/index.html)
    ↓ POST /api/concierge { messages, context, lang }
Cloudflare Worker (concierge.js)
    ↓ POST https://api.anthropic.com/v1/messages
Anthropic Claude API (claude-sonnet-4-6)
    ↓ { answer }
Browser ← bot message rendered
```

## Setup en 4 étapes (15 min)

### 1. Récupérer une clé API Anthropic
- https://console.anthropic.com → API Keys → Create Key
- Format : `sk-ant-...`

### 2. Installer wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### 3. Configurer le secret
```bash
cd /Users/Bignero/Documents/Claude/Projects/Enertchad/site-v2/_workers/
wrangler secret put ANTHROPIC_API_KEY
# Coller la clé sk-ant-... quand demandé
```

### 4. Déployer
```bash
wrangler deploy
```

Le Worker sera disponible sur `https://enertchad-concierge.<your-subdomain>.workers.dev`.

## Bind to Cloudflare Pages site

Pour router `/api/concierge` du site vers le Worker :
1. Dashboard Cloudflare → Pages project (enertchad-groupe)
2. Settings → Functions → Service bindings
3. Bind `enertchad-concierge` Worker au path `/api/concierge`

## Rate-limiting (optionnel · production)

Pour éviter abuse, ajouter Cloudflare KV namespace :
```toml
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "<kv-namespace-id>"
```

Puis dans concierge.js, ajouter limit 5 req/min/IP.

## Coûts estimés Anthropic API

- claude-sonnet-4-6 : ~$3/M input · $15/M output
- Conversation moyenne : ~500 tokens in + 200 tokens out = ~$0.0045/conversation
- Budget 1000 conversations/mois = ~$5/mois
- Budget 10K conversations/mois = ~$45/mois

## Test local

```bash
wrangler dev
# Worker disponible sur http://localhost:8787
# Browser : remplacer API_ENDPOINT dans ai-concierge/index.html par http://localhost:8787/api/concierge pour tests
```

## Knowledge-base extension future

La fallback KB JS local (dans `ai-concierge/index.html`) couvre 9 sujets canon. Pour étendre :
1. Ajouter clés au dict `KB` dans le bloc `<script>` de la page
2. OU migrer vers RAG : Cloudflare Vectorize + embeddings du dataroom (Phase 2 post-Tour)

## Sécurité

- API key jamais exposée côté browser (uniquement dans Worker secret)
- CORS limité à origin enertchad.td en production (modifier `Access-Control-Allow-Origin`)
- Messages user tronqués à 2000 chars (anti-prompt-injection)
- Conversation context limité à 12 derniers messages (token budget)
- System prompt verrouille les sujets canon (refus hors-scope · escalation DG)

---

*EnerTchad SA AI Concierge · R84 wiring · 2026-05-02*
